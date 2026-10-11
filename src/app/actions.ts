"use server";

import bcrypt from "bcryptjs";
import { randomBytes } from "node:crypto";
import { count, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getDb, schema } from "@/lib/db";
import { createSession, destroySession, getCurrentUser, requireAdmin, requireUser } from "@/lib/auth";
import { getBonusDeadline, getGroupCode, setSetting } from "@/lib/settings";
import { syncAll } from "@/lib/sync";

export type FormState = { error?: string; ok?: string } | undefined;

const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();

// ---------- הרשמה / התחברות ----------

export async function register(_: FormState, fd: FormData): Promise<FormState> {
  const username = str(fd, "username").toLowerCase();
  const displayName = str(fd, "displayName");
  const password = String(fd.get("password") ?? "");
  const code = str(fd, "groupCode");

  if (!/^[a-z0-9_.-]{3,20}$/.test(username)) {
    return { error: "שם משתמש: 3–20 תווים באנגלית, מספרים או _ . -" };
  }
  if (displayName.length < 2 || displayName.length > 20) return { error: "כינוי: 2–20 תווים" };
  if (password.length < 6) return { error: "סיסמה: לפחות 6 תווים" };

  const db = await getDb();
  const [{ n }] = await db.select({ n: count() }).from(schema.users);
  const isFirst = n === 0;
  const groupCode = await getGroupCode();

  if (!isFirst) {
    if (!groupCode) return { error: "ההרשמה סגורה — בקשו מהמנהל להגדיר קוד קבוצה" };
    if (code !== groupCode) return { error: "קוד הקבוצה שגוי" };
  } else if (groupCode && code !== groupCode) {
    return { error: "קוד הקבוצה שגוי" };
  }

  const exists = await db.query.users.findFirst({ where: eq(schema.users.username, username) });
  if (exists) return { error: "שם המשתמש תפוס" };

  const [user] = await db
    .insert(schema.users)
    .values({
      username,
      displayName,
      passwordHash: await bcrypt.hash(password, 10),
      isAdmin: isFirst,
      createdAt: Date.now(),
    })
    .returning({ id: schema.users.id });

  await createSession(user.id);
  redirect(isFirst ? "/admin" : "/");
}

export async function login(_: FormState, fd: FormData): Promise<FormState> {
  const username = str(fd, "username").toLowerCase();
  const password = String(fd.get("password") ?? "");
  const db = await getDb();
  const user = await db.query.users.findFirst({ where: eq(schema.users.username, username) });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return { error: "שם משתמש או סיסמה שגויים" };
  }
  await createSession(user.id);
  redirect("/");
}

export async function logout(): Promise<void> {
  await destroySession();
  redirect("/login");
}

export async function changePassword(_: FormState, fd: FormData): Promise<FormState> {
  const user = await requireUser();
  const current = String(fd.get("current") ?? "");
  const next = String(fd.get("next") ?? "");
  if (next.length < 6) return { error: "סיסמה חדשה: לפחות 6 תווים" };
  const db = await getDb();
  const row = await db.query.users.findFirst({ where: eq(schema.users.id, user.id) });
  if (!row || !(await bcrypt.compare(current, row.passwordHash))) {
    return { error: "הסיסמה הנוכחית שגויה" };
  }
  await db
    .update(schema.users)
    .set({ passwordHash: await bcrypt.hash(next, 10) })
    .where(eq(schema.users.id, user.id));
  return { ok: "הסיסמה עודכנה" };
}

// ---------- ניחושים ----------

const OPEN_STATUSES = new Set(["SCHEDULED", "TIMED"]);

export async function savePrediction(
  matchId: number,
  home: number,
  away: number,
): Promise<{ error?: string }> {
  const user = await getCurrentUser();
  if (!user) return { error: "צריך להתחבר מחדש" };
  const valid = (x: number) => Number.isInteger(x) && x >= 0 && x <= 20;
  if (!valid(home) || !valid(away)) return { error: "תוצאה לא תקינה" };

  const db = await getDb();
  const match = await db.query.matches.findFirst({ where: eq(schema.matches.id, matchId) });
  if (!match) return { error: "המשחק לא נמצא" };
  if (match.utcDate <= Date.now() || !OPEN_STATUSES.has(match.status)) {
    return { error: "המשחק כבר התחיל — הניחוש נעול" };
  }
  if (!match.homeTeamId || !match.awayTeamId) return { error: "הקבוצות עוד לא נקבעו" };

  await db
    .insert(schema.predictions)
    .values({ userId: user.id, matchId, home, away, updatedAt: Date.now() })
    .onConflictDoUpdate({
      target: [schema.predictions.userId, schema.predictions.matchId],
      set: { home, away, updatedAt: Date.now() },
    });
  revalidatePath("/");
  return {};
}

export async function saveBonus(_: FormState, fd: FormData): Promise<FormState> {
  const user = await requireUser();
  const deadline = await getBonusDeadline();
  if (deadline !== null && Date.now() >= deadline) return { error: "ניחושי הבונוס כבר נעולים" };

  const championRaw = str(fd, "championTeamId");
  const championTeamId = championRaw ? Number(championRaw) : null;
  const topScorer = str(fd, "topScorer").slice(0, 60) || null;

  const db = await getDb();
  if (championTeamId !== null) {
    const team = await db.query.teams.findFirst({ where: eq(schema.teams.id, championTeamId) });
    if (!team) return { error: "קבוצה לא קיימת" };
  }
  await db
    .insert(schema.bonusPicks)
    .values({ userId: user.id, championTeamId, topScorer, updatedAt: Date.now() })
    .onConflictDoUpdate({
      target: schema.bonusPicks.userId,
      set: { championTeamId, topScorer, updatedAt: Date.now() },
    });
  revalidatePath("/bonus");
  return { ok: "נשמר!" };
}

// ---------- ניהול ----------

export async function adminSetGroupCode(_: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const code = str(fd, "groupCode");
  if (code.length < 4) return { error: "קוד: לפחות 4 תווים" };
  await setSetting("group_code", code);
  revalidatePath("/admin");
  return { ok: "קוד הקבוצה עודכן" };
}

export async function adminSetBonusDeadline(isoOrEmpty: string): Promise<{ error?: string }> {
  await requireAdmin();
  if (!isoOrEmpty) {
    await setSetting("bonus_deadline", null);
  } else {
    const t = Date.parse(isoOrEmpty);
    if (Number.isNaN(t)) return { error: "תאריך לא תקין" };
    await setSetting("bonus_deadline", String(t));
  }
  revalidatePath("/admin");
  revalidatePath("/bonus");
  return {};
}

export async function adminSync(): Promise<{ error?: string; ok?: string }> {
  await requireAdmin();
  try {
    const r = await syncAll({ forceOdds: true });
    revalidatePath("/", "layout");
    return {
      ok: `סונכרנו ${r.matches} משחקים · יחסים: ${r.odds === "skipped" ? "לא הוגדר מפתח" : `${r.odds} משחקים`}`,
    };
  } catch (err) {
    return { error: err instanceof Error ? err.message : String(err) };
  }
}

export async function adminSetUnderdog(matchId: number, value: string): Promise<void> {
  await requireAdmin();
  const v = value === "HOME" || value === "AWAY" || value === "NONE" ? value : null;
  const db = await getDb();
  await db.update(schema.matches).set({ underdogOverride: v }).where(eq(schema.matches.id, matchId));
  revalidatePath("/", "layout");
}

export async function adminSetResult(
  matchId: number,
  result: { home: number; away: number } | null,
): Promise<{ error?: string }> {
  await requireAdmin();
  const db = await getDb();
  if (result === null) {
    // ביטול תוצאה ידנית — הסנכרון הבא יחזיר את התוצאה מה-API
    await db.update(schema.matches).set({ manualResult: false }).where(eq(schema.matches.id, matchId));
  } else {
    const valid = (x: number) => Number.isInteger(x) && x >= 0 && x <= 30;
    if (!valid(result.home) || !valid(result.away)) return { error: "תוצאה לא תקינה" };
    await db
      .update(schema.matches)
      .set({
        manualResult: true,
        status: "FINISHED",
        homeScore: result.home,
        awayScore: result.away,
        homeScoreFull: result.home,
        awayScoreFull: result.away,
      })
      .where(eq(schema.matches.id, matchId));
  }
  revalidatePath("/", "layout");
  return {};
}

export async function adminSetBonusAnswers(_: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const champion = str(fd, "championTeamId");
  const scorers = str(fd, "topScorers")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  await setSetting("champion_team_id", champion || null);
  await setSetting("top_scorers", scorers.length ? JSON.stringify(scorers) : null);
  revalidatePath("/", "layout");
  return { ok: "התשובות עודכנו" };
}

export async function adminResetPassword(userId: number): Promise<{ password?: string }> {
  await requireAdmin();
  const password = randomBytes(4).toString("hex");
  const db = await getDb();
  await db
    .update(schema.users)
    .set({ passwordHash: await bcrypt.hash(password, 10) })
    .where(eq(schema.users.id, userId));
  await db.delete(schema.sessions).where(eq(schema.sessions.userId, userId));
  return { password };
}

export async function adminDeleteUser(userId: number): Promise<{ error?: string }> {
  const me = await requireAdmin();
  if (me.id === userId) return { error: "אי אפשר למחוק את עצמך" };
  const db = await getDb();
  await db.delete(schema.predictions).where(eq(schema.predictions.userId, userId));
  await db.delete(schema.bonusPicks).where(eq(schema.bonusPicks.userId, userId));
  await db.delete(schema.sessions).where(eq(schema.sessions.userId, userId));
  await db.delete(schema.users).where(eq(schema.users.id, userId));
  revalidatePath("/", "layout");
  return {};
}

export async function adminToggleAdmin(userId: number): Promise<{ error?: string }> {
  const me = await requireAdmin();
  if (me.id === userId) return { error: "אי אפשר לשנות את ההרשאות של עצמך" };
  const db = await getDb();
  const u = await db.query.users.findFirst({ where: eq(schema.users.id, userId) });
  if (!u) return { error: "משתמש לא נמצא" };
  await db.update(schema.users).set({ isAdmin: !u.isAdmin }).where(eq(schema.users.id, userId));
  revalidatePath("/admin");
  return {};
}
