import "server-only";
import { asc, eq } from "drizzle-orm";
import { getDb, schema } from "./db";
import { getSetting } from "./settings";
import { buildLeaderboard } from "./game";

export type Team = typeof schema.teams.$inferSelect;
export type Match = typeof schema.matches.$inferSelect;

export async function getTeamsMap(): Promise<Map<number, Team>> {
  const db = await getDb();
  const rows = await db.select().from(schema.teams);
  return new Map(rows.map((t) => [t.id, t]));
}

export async function getAllMatches(): Promise<Match[]> {
  const db = await getDb();
  return db.select().from(schema.matches).orderBy(asc(schema.matches.utcDate));
}

export async function getMatch(id: number): Promise<Match | undefined> {
  const db = await getDb();
  return db.query.matches.findFirst({ where: eq(schema.matches.id, id) });
}

export async function getUserPredictions(userId: number) {
  const db = await getDb();
  const rows = await db
    .select()
    .from(schema.predictions)
    .where(eq(schema.predictions.userId, userId));
  return new Map(rows.map((p) => [p.matchId, p]));
}

export async function getMatchPredictions(matchId: number) {
  const db = await getDb();
  return db
    .select({
      userId: schema.predictions.userId,
      home: schema.predictions.home,
      away: schema.predictions.away,
      displayName: schema.users.displayName,
    })
    .from(schema.predictions)
    .innerJoin(schema.users, eq(schema.users.id, schema.predictions.userId))
    .where(eq(schema.predictions.matchId, matchId));
}

export async function getUsers() {
  const db = await getDb();
  return db
    .select({
      id: schema.users.id,
      username: schema.users.username,
      displayName: schema.users.displayName,
      isAdmin: schema.users.isAdmin,
      createdAt: schema.users.createdAt,
    })
    .from(schema.users)
    .orderBy(asc(schema.users.createdAt));
}

export async function getBonusAnswers(): Promise<{
  championTeamId: number | null;
  topScorers: string[];
}> {
  const champion = await getSetting("champion_team_id");
  const scorers = await getSetting("top_scorers");
  let topScorers: string[] = [];
  try {
    topScorers = scorers ? (JSON.parse(scorers) as string[]) : [];
  } catch {
    topScorers = [];
  }
  return { championTeamId: champion ? Number(champion) : null, topScorers };
}

export async function getBonusPicks() {
  const db = await getDb();
  return db.select().from(schema.bonusPicks);
}

export async function getLeaderboard() {
  const db = await getDb();
  const [users, matchRows, preds, picks, answers] = await Promise.all([
    getUsers(),
    getAllMatches(),
    db.select().from(schema.predictions),
    getBonusPicks(),
    getBonusAnswers(),
  ]);
  const rows = buildLeaderboard(
    users.map((u) => u.id),
    matchRows,
    preds,
    picks,
    answers.championTeamId,
    answers.topScorers,
  );
  const names = new Map(users.map((u) => [u.id, u.displayName]));
  return rows.map((r) => ({ ...r, displayName: names.get(r.userId) ?? "?" }));
}
