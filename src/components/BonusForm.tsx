"use client";

import { useActionState } from "react";
import { saveBonus, type FormState } from "@/app/actions";

export function BonusForm({
  teams,
  scorers,
  initial,
}: {
  teams: { id: number; name: string }[];
  scorers: string[];
  initial: { championTeamId: number | null; topScorer: string | null };
}) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveBonus, undefined);

  return (
    <form action={action} className="card flex flex-col gap-4 p-4">
      <label className="flex flex-col gap-1.5 text-sm font-bold">
        🏆 מי תזכה בליגת האלופות?
        <select name="championTeamId" defaultValue={initial.championTeamId ?? ""} className="field font-normal">
          <option value="">— בחירה —</option>
          {teams.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1.5 text-sm font-bold">
        ⚽ מי יהיה מלך השערים?
        <input
          name="topScorer"
          list="scorers"
          dir="ltr"
          defaultValue={initial.topScorer ?? ""}
          placeholder="Kylian Mbappé"
          maxLength={60}
          className="field text-left font-normal"
        />
        <datalist id="scorers">
          {scorers.map((s) => (
            <option key={s} value={s} />
          ))}
        </datalist>
        <span className="text-xs font-normal text-muted">
          כתבו את השם באנגלית (מופיעות הצעות מרשימת הכובשים הנוכחית).
        </span>
      </label>

      {state?.error && <p className="rounded-lg bg-lose/15 p-2 text-sm text-lose">{state.error}</p>}
      {state?.ok && <p className="rounded-lg bg-win/15 p-2 text-sm text-win">{state.ok}</p>}

      <button className="btn" disabled={pending}>
        {pending ? "שומר…" : "שמירת ניחושי בונוס"}
      </button>
    </form>
  );
}
