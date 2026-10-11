import { sqliteTable, text, integer, real, primaryKey } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  displayName: text("display_name").notNull(),
  passwordHash: text("password_hash").notNull(),
  isAdmin: integer("is_admin", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at").notNull(),
});

export const sessions = sqliteTable("sessions", {
  tokenHash: text("token_hash").primaryKey(),
  userId: integer("user_id").notNull(),
  expiresAt: integer("expires_at").notNull(),
});

export const teams = sqliteTable("teams", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  shortName: text("short_name").notNull(),
  tla: text("tla"),
  crest: text("crest"),
});

export const matches = sqliteTable("matches", {
  id: integer("id").primaryKey(),
  utcDate: integer("utc_date").notNull(), // ms
  status: text("status").notNull(),
  stage: text("stage").notNull(),
  matchday: integer("matchday"),
  homeTeamId: integer("home_team_id"),
  awayTeamId: integer("away_team_id"),
  // תוצאת 90 דקות (לניקוד)
  homeScore: integer("home_score"),
  awayScore: integer("away_score"),
  // תוצאה סופית להצגה (כולל הארכה) + מי עלה
  homeScoreFull: integer("home_score_full"),
  awayScoreFull: integer("away_score_full"),
  winner: text("winner"),
  homeOdds: real("home_odds"),
  drawOdds: real("draw_odds"),
  awayOdds: real("away_odds"),
  underdogOverride: text("underdog_override"), // HOME | AWAY | NONE | null
  manualResult: integer("manual_result", { mode: "boolean" }).notNull().default(false),
  updatedAt: integer("updated_at").notNull(),
});

export const predictions = sqliteTable(
  "predictions",
  {
    userId: integer("user_id").notNull(),
    matchId: integer("match_id").notNull(),
    home: integer("home").notNull(),
    away: integer("away").notNull(),
    updatedAt: integer("updated_at").notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.matchId] })],
);

export const bonusPicks = sqliteTable("bonus_picks", {
  userId: integer("user_id").primaryKey(),
  championTeamId: integer("champion_team_id"),
  topScorer: text("top_scorer"),
  updatedAt: integer("updated_at").notNull(),
});

export const settings = sqliteTable("settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
});

export const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  is_admin INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS teams (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  tla TEXT,
  crest TEXT
);
CREATE TABLE IF NOT EXISTS matches (
  id INTEGER PRIMARY KEY,
  utc_date INTEGER NOT NULL,
  status TEXT NOT NULL,
  stage TEXT NOT NULL,
  matchday INTEGER,
  home_team_id INTEGER,
  away_team_id INTEGER,
  home_score INTEGER,
  away_score INTEGER,
  home_score_full INTEGER,
  away_score_full INTEGER,
  winner TEXT,
  home_odds REAL,
  draw_odds REAL,
  away_odds REAL,
  underdog_override TEXT,
  manual_result INTEGER NOT NULL DEFAULT 0,
  updated_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS matches_date_idx ON matches (utc_date);
CREATE TABLE IF NOT EXISTS predictions (
  user_id INTEGER NOT NULL,
  match_id INTEGER NOT NULL,
  home INTEGER NOT NULL,
  away INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (user_id, match_id)
);
CREATE TABLE IF NOT EXISTS bonus_picks (
  user_id INTEGER PRIMARY KEY,
  champion_team_id INTEGER,
  top_scorer TEXT,
  updated_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
`;
