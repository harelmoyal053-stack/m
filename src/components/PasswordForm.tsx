"use client";

import { useActionState } from "react";
import { changePassword, type FormState } from "@/app/actions";

export function PasswordForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(changePassword, undefined);
  return (
    <form action={action} className="card flex flex-col gap-3 p-4">
      <h2 className="font-bold">שינוי סיסמה</h2>
      <input name="current" type="password" placeholder="סיסמה נוכחית" required dir="ltr" className="field text-left" autoComplete="current-password" />
      <input name="next" type="password" placeholder="סיסמה חדשה" required dir="ltr" className="field text-left" autoComplete="new-password" />
      {state?.error && <p className="text-sm text-lose">{state.error}</p>}
      {state?.ok && <p className="text-sm text-win">{state.ok}</p>}
      <button className="btn btn-ghost" disabled={pending}>עדכון סיסמה</button>
    </form>
  );
}
