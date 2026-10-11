// חישובי טבלה — פונקציות טהורות, בלי גישה למסד הנתונים (קל לבדוק).
import { BONUS_POINTS, resolveUnderdog, scorePrediction, type PointsBreakdown } from "./scoring";

export interface ScoredMatch {
  id: number;
  stage: string;
  status: string;
  homeScore: number | null;
  awayScore: number | null;
  homeOdds: number | null;
  awayOdds: number | null;
  underdogOverride: string | null;
}

export interface PredictionRow {
  userId: number;
  matchId: number;
  home: number;
  away: number;
}

export interface BonusPickRow {
  userId: number;
  championTeamId: number | null;
  topScorer: string | null;
}

export interface LeaderboardRow {
  userId: number;
  total: number;
  matchPoints: number;
  exact: number;
  direction: number;
  underdogPoints: number;
  bonusPoints: number;
  predicted: number;
}

export function isScored(m: ScoredMatch): boolean {
  return (
    (m.status === "FINISHED" || m.status === "AWARDED") &&
    m.homeScore !== null &&
    m.awayScore !== null
  );
}

export function pointsFor(m: ScoredMatch, p: { home: number; away: number }): PointsBreakdown | null {
  if (!isScored(m)) return null;
  return scorePrediction(
    m.stage,
    p,
    { home: m.homeScore!, away: m.awayScore! },
    resolveUnderdog(m.homeOdds, m.awayOdds, m.underdogOverride),
  );
}

export function normalizePlayer(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9֐-׿ ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** "Mbappe" תואם ל-"Kylian Mbappé"; "Kylian Mbappé" תואם ל-"K. Mbappé". */
export function playerMatches(pick: string, actual: string): boolean {
  const a = normalizePlayer(pick);
  const b = normalizePlayer(actual);
  if (!a || !b) return false;
  if (a === b) return true;
  const ta = a.split(" ").filter((t) => t.length > 1);
  const tb = b.split(" ").filter((t) => t.length > 1);
  if (!ta.length || !tb.length) return false;
  const [short, long] = ta.length <= tb.length ? [ta, tb] : [tb, ta];
  return short.every((t) => long.includes(t));
}

export function bonusPointsFor(
  pick: BonusPickRow | undefined,
  championTeamId: number | null,
  topScorers: string[],
): { champion: number; topScorer: number } {
  if (!pick) return { champion: 0, topScorer: 0 };
  return {
    champion:
      championTeamId !== null && pick.championTeamId === championTeamId ? BONUS_POINTS.champion : 0,
    topScorer:
      pick.topScorer && topScorers.some((s) => playerMatches(pick.topScorer!, s))
        ? BONUS_POINTS.topScorer
        : 0,
  };
}

export function buildLeaderboard(
  userIds: number[],
  matches: ScoredMatch[],
  predictions: PredictionRow[],
  bonusPicks: BonusPickRow[],
  championTeamId: number | null,
  topScorers: string[],
): LeaderboardRow[] {
  const byId = new Map(matches.map((m) => [m.id, m]));
  const rows = new Map<number, LeaderboardRow>(
    userIds.map((id) => [
      id,
      { userId: id, total: 0, matchPoints: 0, exact: 0, direction: 0, underdogPoints: 0, bonusPoints: 0, predicted: 0 },
    ]),
  );

  for (const p of predictions) {
    const row = rows.get(p.userId);
    const m = byId.get(p.matchId);
    if (!row || !m) continue;
    const pts = pointsFor(m, p);
    if (!pts) continue;
    row.predicted++;
    row.matchPoints += pts.total;
    row.underdogPoints += pts.underdogBonus;
    if (pts.kind === "exact") row.exact++;
    else if (pts.kind === "direction") row.direction++;
  }

  const picks = new Map(bonusPicks.map((b) => [b.userId, b]));
  for (const row of rows.values()) {
    const b = bonusPointsFor(picks.get(row.userId), championTeamId, topScorers);
    row.bonusPoints = b.champion + b.topScorer;
    row.total = row.matchPoints + row.bonusPoints;
  }

  return [...rows.values()].sort(
    (a, b) => b.total - a.total || b.exact - a.exact || b.direction - a.direction,
  );
}

/** דירוג עם שוויונות: 1, 2, 2, 4 */
export function ranks(rows: { total: number; exact: number; direction: number }[]): number[] {
  const same = (a: (typeof rows)[number], b: (typeof rows)[number]) =>
    a.total === b.total && a.exact === b.exact && a.direction === b.direction;
  return rows.map((r, i) => {
    let j = i;
    while (j > 0 && same(rows[j - 1], r)) j--;
    return j + 1;
  });
}
