// ממלא מסד נתונים מקומי בנתוני דמו (קבוצות, משחקים, משתמשים וניחושים) — לבדיקת הממשק בלי מפתח API.
// הרצה: DATABASE_URL=file:demo.db npm run seed:demo
import { createClient } from "@libsql/client";
import bcrypt from "bcryptjs";
import { SCHEMA_SQL } from "../src/lib/db/schema";

const url = process.env.DATABASE_URL ?? "file:local.db";
const db = createClient({ url, authToken: process.env.DATABASE_AUTH_TOKEN });

const TEAMS: [number, string, string][] = [
  [86, "Real Madrid CF", "Real Madrid"],
  [81, "FC Barcelona", "Barça"],
  [5, "FC Bayern München", "Bayern"],
  [65, "Manchester City FC", "Man City"],
  [64, "Liverpool FC", "Liverpool"],
  [57, "Arsenal FC", "Arsenal"],
  [524, "Paris Saint-Germain FC", "PSG"],
  [108, "FC Internazionale Milano", "Inter"],
  [1903, "Sport Lisboa e Benfica", "Benfica"],
  [4, "Borussia Dortmund", "Dortmund"],
  [109, "Juventus FC", "Juventus"],
  [674, "PSV", "PSV"],
];

const H = 3600_000;
const now = Date.now();

async function main() {
  await db.executeMultiple(SCHEMA_SQL);
  for (const t of ["predictions", "bonus_picks", "matches", "teams", "sessions", "users", "settings"]) {
    await db.execute(`DELETE FROM ${t}`);
  }

  for (const [id, name, short] of TEAMS) {
    await db.execute({ sql: "INSERT INTO teams (id, name, short_name) VALUES (?, ?, ?)", args: [id, name, short] });
  }

  // [id, offsetHours, stage, matchday, home, away, status, score90?, odds?]
  type Row = [number, number, string, number | null, number, number, string, [number, number] | null, [number, number, number] | null];
  const rows: Row[] = [
    [1, -72, "LEAGUE_STAGE", 2, 86, 674, "FINISHED", [3, 1], [1.3, 5.5, 9.0]],
    [2, -72, "LEAGUE_STAGE", 2, 1903, 65, "FINISHED", [2, 1], [4.6, 3.9, 1.7]],
    [3, -71, "LEAGUE_STAGE", 2, 57, 5, "FINISHED", [1, 1], [2.4, 3.4, 2.9]],
    [4, -1, "LEAGUE_STAGE", 3, 108, 64, "IN_PLAY", [0, 1], [2.6, 3.3, 2.7]],
    [5, 50, "LEAGUE_STAGE", 3, 81, 4, "TIMED", null, [1.5, 4.6, 5.8]],
    [6, 50, "LEAGUE_STAGE", 3, 109, 524, "TIMED", null, [3.4, 3.4, 2.1]],
    [7, 74, "LEAGUE_STAGE", 3, 65, 86, "TIMED", null, [2.0, 3.8, 3.4]],
    [8, 74, "LEAGUE_STAGE", 3, 674, 57, "TIMED", null, [4.1, 3.8, 1.8]],
  ];
  for (const [id, off, stage, md, home, away, status, score, odds] of rows) {
    await db.execute({
      sql: `INSERT INTO matches (id, utc_date, status, stage, matchday, home_team_id, away_team_id,
              home_score, away_score, home_score_full, away_score_full, home_odds, draw_odds, away_odds, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [id, now + off * H, status, stage, md, home, away, score?.[0] ?? null, score?.[1] ?? null,
        score?.[0] ?? null, score?.[1] ?? null, odds?.[0] ?? null, odds?.[1] ?? null, odds?.[2] ?? null, now],
    });
  }

  const hash = await bcrypt.hash("demo1234", 10);
  const users = [
    ["admin", "הראל", 1],
    ["dani", "דני", 0],
    ["yossi", "יוסי", 0],
    ["noa", "נועה", 0],
  ] as const;
  for (const [i, [u, d, a]] of users.entries()) {
    await db.execute({
      sql: "INSERT INTO users (id, username, display_name, password_hash, is_admin, created_at) VALUES (?, ?, ?, ?, ?, ?)",
      args: [i + 1, u, d, hash, a, now - (10 - i) * H],
    });
  }

  const preds: [number, number, number, number][] = [
    [1, 1, 3, 1], [1, 2, 1, 2], [1, 3, 1, 1], [1, 4, 1, 1], [1, 5, 2, 0],
    [2, 1, 2, 0], [2, 2, 2, 1], [2, 3, 2, 1], [2, 4, 0, 2],
    [3, 1, 1, 1], [3, 2, 1, 0], [3, 3, 0, 0], [3, 4, 1, 2], [3, 6, 1, 2],
    [4, 1, 3, 1], [4, 2, 0, 2], [4, 3, 2, 2], [4, 4, 2, 0],
  ];
  for (const [u, m, h, a] of preds) {
    await db.execute({
      sql: "INSERT INTO predictions (user_id, match_id, home, away, updated_at) VALUES (?, ?, ?, ?, ?)",
      args: [u, m, h, a, now],
    });
  }
  await db.execute({
    sql: "INSERT INTO bonus_picks (user_id, champion_team_id, top_scorer, updated_at) VALUES (1, 86, 'Kylian Mbappé', ?), (2, 65, 'Erling Haaland', ?)",
    args: [now, now],
  });
  await db.execute({ sql: "INSERT INTO settings (key, value) VALUES ('group_code', 'demo')", args: [] });

  console.log(`Seeded demo data into ${url}. Log in as admin / demo1234`);
}

main().then(() => process.exit(0), (e) => {
  console.error(e);
  process.exit(1);
});
