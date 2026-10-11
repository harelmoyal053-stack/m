"use client";

import Link from "next/link";
import { useActionState } from "react";
import { login, register, type FormState } from "@/app/actions";

export function AuthForm({ mode, needsCode }: { mode: "login" | "register"; needsCode: boolean }) {
  const [state, action, pending] = useActionState<FormState, FormData>(
    mode === "login" ? login : register,
    undefined,
  );

  return (
    <form action={action} className="card flex flex-col gap-3 p-5">
      {mode === "register" && (
        <label className="flex flex-col gap-1 text-sm">
          כינוי (יופיע בטבלה)
          <input name="displayName" required maxLength={20} className="field" autoComplete="nickname" />
        </label>
      )}
      <label className="flex flex-col gap-1 text-sm">
        שם משתמש
        <input
          name="username"
          required
          dir="ltr"
          autoCapitalize="none"
          autoComplete="username"
          className="field text-left"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        סיסמה
        <input
          name="password"
          type="password"
          required
          dir="ltr"
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          className="field text-left"
        />
      </label>
      {mode === "register" && needsCode && (
        <label className="flex flex-col gap-1 text-sm">
          קוד הקבוצה (קיבלתם מהמנהל)
          <input name="groupCode" required dir="ltr" autoCapitalize="none" className="field text-left" />
        </label>
      )}

      {state?.error && <p className="rounded-lg bg-lose/15 p-2 text-sm text-lose">{state.error}</p>}

      <button className="btn mt-1" disabled={pending}>
        {pending ? "רגע…" : mode === "login" ? "כניסה" : "הצטרפות"}
      </button>

      <p className="text-center text-sm text-muted">
        {mode === "login" ? (
          <>
            עוד אין לך משתמש? <Link href="/register" className="text-cyan">הצטרפות לקבוצה</Link>
          </>
        ) : (
          <>
            כבר רשום? <Link href="/login" className="text-cyan">כניסה</Link>
          </>
        )}
      </p>
    </form>
  );
}
