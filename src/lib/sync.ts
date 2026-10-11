import "server-only";
import { after } from "next/server";
import { and, eq, gt, inArray } from "drizzle-orm";
import { getDb, schema } from "./db";
import { getSetting, setSetting } from "./settings";
import {
  fetchChampionsLeagueMatches,
  fetchTopScorers,
  displayScore,
  regularTimeScore,
  FINISHED_STATUSES,
  LIVE_STATUSES,
  type FdTeam,
} from "./providers/football-data";
import { fetchOdds, pairOddsWithMatches } from "./providers/odds";

const MIN = 60_000;
const ODDS_INTERVAL = 6 * 60 * MIN;

export interface SyncReport {
  matches: number;
  odds: number | "skipped";
  champion?: string;
  topScorers?: string[];
}

export async function syncAll({ forceOdds = false } = {}): Promise<SyncReport> {
  await setSetting("last_sync_attempt", String(Date.now()));
  try {
    const report = await syncMatches();
    const odds = await syncOdds(forceOdds);
    const bonus = await resolveBonusAnswers();
    await setSetting("last_sync", String(Date.now()));
    await setSetting("last_sync_error", null);
    return { ...report, odds, ...bonus };
  } catch (err) {
    await setSetting("last_sync_error", err instanceof Error ? err.message : String(err));
    throw err;
  }
}

function teamRow(t: FdTeam) {
  if (!t.id) return null;
  return {
    id: t.id,
    name: t.name ?? "?",
    shortName: t.shortName ?? t.name ?? "?",
    tla: t.tla,
    crest: t.crest,
  };
}

async function syncMatches(): Promise<{ matches: number }> {
  if (!process.env.FOOTBALL_DATA_API_KEY) return { matches: 0 };
  const db = await getDb();
  const apiMatches = await fetchChampionsLeagueMatches();
  const now = Date.now();

  const teamMap = new Map<number, NonNullable<ReturnType<typeof teamRow>>>();
  for (const m of apiMatches) {
    for (const t of [teamRow(m.homeTeam), teamRow(m.awayTeam)]) if (t) teamMap.set(t.id, t);
  }
  for (const t of teamMap.values()) {
    await db
      .insert(schema.teams)
      .values(t)
      .onConflictDoUpdate({
        target: schema.teams.id,
        set: { name: t.name, shortName: t.shortName, tla: t.tla, crest: t.crest },
      });
  }

  const manual = new Set(
    (
      await db
        .select({ id: schema.matches.id })
        .from(schema.matches)
        .where(eq(schema.matches.manualResult, true))
    ).map((r) => r.id),
  );

  for (const m of apiMatches) {
    const finishedOrLive = FINISHED_STATUSES.has(m.status) || LIVE_STATUSES.has(m.status);
    const reg = finishedOrLive ? regularTimeScore(m.score) : { home: null, away: null };
    const full = finishedOrLive ? displayScore(m.score) : { home: null, away: null };
    const winner =
      FINISHED_STATUSES.has(m.status) && m.score.winner
        ? m.score.winner === "HOME_TEAM"
          ? "HOME"
          : m.score.winner === "AWAY_TEAM"
            ? "AWAY"
            : "DRAW"
        : null;

    const base = {
      utcDate: Date.parse(m.utcDate),
      stage: m.stage,
      matchday: m.matchday,
      homeTeamId: m.homeTeam.id,
      awayTeamId: m.awayTeam.id,
      updatedAt: now,
    };
    const result = {
      status: m.status,
      homeScore: reg.home,
      awayScore: reg.away,
      homeScoreFull: full.home,
      awayScoreFull: full.away,
      winner,
    };

    await db
      .insert(schema.matches)
      .values({ id: m.id, ...base, ...result })
      .onConflictDoUpdate({
        target: schema.matches.id,
        // משחק שהמנהל הזין לו תוצאה ידנית — לא דורסים את התוצאה
        set: manual.has(m.id) ? base : { ...base, ...result },
      });
  }
  return { matches: apiMatches.length };
}

async function syncOdds(force: boolean): Promise<number | "skipped"> {
  if (!process.env.ODDS_API_KEY) return "skipped";
  const last = Number((await getSetting("last_odds_sync")) ?? 0);
  if (!force && Date.now() - last < ODDS_INTERVAL) return "skipped";

  const db = await getDb();
  const now = Date.now();
  const upcoming = await db
    .select()
    .from(schema.matches)
    .where(
      and(gt(schema.matches.utcDate, now), inArray(schema.matches.status, ["TIMED", "SCHEDULED"])),
    );
  const soon = upcoming.filter((m) => m.utcDate - now < 10 * 24 * 60 * MIN);
  await setSetting("last_odds_sync", String(now));
  if (!soon.length) return 0;

  const teamIds = [...new Set(soon.flatMap((m) => [m.homeTeamId, m.awayTeamId]))].filter(
    (x): x is number => x !== null,
  );
  const teamRows = teamIds.length
    ? await db.select().from(schema.teams).where(inArray(schema.teams.id, teamIds))
    : [];
  const names = new Map(teamRows.map((t) => [t.id, [t.name, t.shortName]]));

  const odds = await fetchOdds();
  const paired = pairOddsWithMatches(
    soon.map((m) => ({
      id: m.id,
      utcDate: m.utcDate,
      homeNames: names.get(m.homeTeamId ?? -1) ?? [],
      awayNames: names.get(m.awayTeamId ?? -1) ?? [],
    })),
    odds,
  );
  for (const [id, o] of paired) {
    await db
      .update(schema.matches)
      .set({ homeOdds: o.home, drawOdds: o.draw, awayOdds: o.away })
      .where(eq(schema.matches.id, id));
  }
  return paired.size;
}

/** אחרי הגמר: קובע אוטומטית מי האלופה ומי מלך השערים. */
async function resolveBonusAnswers(): Promise<{ champion?: string; topScorers?: string[] }> {
  const db = await getDb();
  const final = await db.query.matches.findFirst({ where: eq(schema.matches.stage, "FINAL") });
  if (!final || !FINISHED_STATUSES.has(final.status) || !final.winner || final.winner === "DRAW") {
    return {};
  }
  const out: { champion?: string; topScorers?: string[] } = {};

  if (!(await getSetting("champion_team_id"))) {
    const id = final.winner === "HOME" ? final.homeTeamId : final.awayTeamId;
    if (id) {
      await setSetting("champion_team_id", String(id));
      out.champion = String(id);
    }
  }
  if (!(await getSetting("top_scorers")) && process.env.FOOTBALL_DATA_API_KEY) {
    const scorers = await fetchTopScorers();
    const max = Math.max(0, ...scorers.map((s) => s.goals ?? 0));
    if (max > 0) {
      const top = scorers.filter((s) => s.goals === max).map((s) => s.player.name);
      await setSetting("top_scorers", JSON.stringify(top));
      out.topScorers = top;
    }
  }
  return out;
}

/**
 * סנכרון "עצל": נקרא ברקע בכל טעינת עמוד ורץ רק אם עבר מספיק זמן.
 * בזמן משחקים — כל דקה; בשאר הזמן — כל 20 דקות.
 */
export async function maybeSync(): Promise<void> {
  if (!process.env.FOOTBALL_DATA_API_KEY) return;
  const lastAttempt = Number((await getSetting("last_sync_attempt")) ?? 0);
  const now = Date.now();
  const db = await getDb();
  const window = await db
    .select({ id: schema.matches.id, utcDate: schema.matches.utcDate, status: schema.matches.status })
    .from(schema.matches)
    .where(gt(schema.matches.utcDate, now - 4 * 60 * MIN));
  const active = window.some(
    (m) =>
      LIVE_STATUSES.has(m.status) ||
      (m.utcDate <= now && !FINISHED_STATUSES.has(m.status)) ||
      Math.abs(m.utcDate - now) < 15 * MIN,
  );
  const interval = active ? MIN : 20 * MIN;
  if (now - lastAttempt < interval) return;
  try {
    await syncAll();
  } catch (err) {
    console.error("sync failed", err);
  }
}

/** מושך תוצאות ויחסים חדשים ברקע אחרי שהעמוד נשלח, בלי לעכב את הטעינה. */
export function syncInBackground(): void {
  after(maybeSync);
}
