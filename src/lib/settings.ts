import "server-only";
import { eq } from "drizzle-orm";
import { getDb, schema } from "./db";

export type SettingKey =
  | "group_code"
  | "bonus_deadline" // ms
  | "last_sync" // ms
  | "last_sync_attempt" // ms
  | "last_sync_error"
  | "last_odds_sync" // ms
  | "champion_team_id"
  | "top_scorers"; // JSON array של שמות (כמה מלכי שערים במקרה של שוויון)

export async function getSetting(key: SettingKey): Promise<string | null> {
  const db = await getDb();
  const row = await db.query.settings.findFirst({ where: eq(schema.settings.key, key) });
  return row?.value ?? null;
}

export async function getSettings(): Promise<Partial<Record<SettingKey, string>>> {
  const db = await getDb();
  const rows = await db.select().from(schema.settings);
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}

export async function setSetting(key: SettingKey, value: string | null): Promise<void> {
  const db = await getDb();
  if (value === null) {
    await db.delete(schema.settings).where(eq(schema.settings.key, key));
    return;
  }
  await db
    .insert(schema.settings)
    .values({ key, value })
    .onConflictDoUpdate({ target: schema.settings.key, set: { value } });
}

/** קוד ההצטרפות לקבוצה: מהגדרות המנהל, ואם אין — ממשתנה הסביבה. */
export async function getGroupCode(): Promise<string | null> {
  return (await getSetting("group_code")) ?? process.env.GROUP_CODE ?? null;
}

/**
 * הדדליין לניחושי הבונוס. ברירת מחדל: שריקת הפתיחה של המשחק הראשון בשלב הנוקאאוט.
 */
export async function getBonusDeadline(): Promise<number | null> {
  const v = await getSetting("bonus_deadline");
  if (v) return Number(v);
  const db = await getDb();
  const rows = await db
    .select({ utcDate: schema.matches.utcDate, stage: schema.matches.stage })
    .from(schema.matches);
  const knockout = rows.filter((r) => r.stage !== "LEAGUE_STAGE").map((r) => r.utcDate);
  return knockout.length ? Math.min(...knockout) : null;
}
