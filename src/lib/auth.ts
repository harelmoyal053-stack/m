import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHash, randomBytes } from "node:crypto";
import { eq, lt } from "drizzle-orm";
import { getDb, schema } from "./db";

const COOKIE = "ucl_session";
const SESSION_DAYS = 90;

const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

export async function createSession(userId: number): Promise<void> {
  const db = await getDb();
  const token = randomBytes(32).toString("base64url");
  const expiresAt = Date.now() + SESSION_DAYS * 24 * 3600_000;
  await db.delete(schema.sessions).where(lt(schema.sessions.expiresAt, Date.now()));
  await db.insert(schema.sessions).values({ tokenHash: hashToken(token), userId, expiresAt });
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(expiresAt),
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (token) {
    const db = await getDb();
    await db.delete(schema.sessions).where(eq(schema.sessions.tokenHash, hashToken(token)));
  }
  store.delete(COOKIE);
}

export type CurrentUser = {
  id: number;
  username: string;
  displayName: string;
  isAdmin: boolean;
};

export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  const db = await getDb();
  const session = await db.query.sessions.findFirst({
    where: eq(schema.sessions.tokenHash, hashToken(token)),
  });
  if (!session || session.expiresAt < Date.now()) return null;
  const user = await db.query.users.findFirst({ where: eq(schema.users.id, session.userId) });
  if (!user) return null;
  return {
    id: user.id,
    username: user.username,
    displayName: user.displayName,
    isAdmin: user.isAdmin,
  };
});

export async function requireUser(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireAdmin(): Promise<CurrentUser> {
  const user = await requireUser();
  if (!user.isAdmin) redirect("/");
  return user;
}
