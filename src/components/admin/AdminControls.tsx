"use client";

import { useActionState, useState, useTransition } from "react";
import { RefreshCw } from "lucide-react";
import {
  adminDeleteUser,
  adminResetPassword,
  adminSetBonusAnswers,
  adminSetBonusDeadline,
  adminSetGroupCode,
  adminSetResult,
  adminSetUnderdog,
  adminSync,
  adminToggleAdmin,
  type FormState,
} from "@/app/actions";

function Msg({ state }: { state: FormState }) {
  if (state?.error) return <p className="text-sm text-lose">{state.error}</p>;
  if (state?.ok) return <p className="text-sm text-win">{state.ok}</p>;
  return null;
}

export function SyncButton() {
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<FormState>(undefined);
  return (
    <div className="flex flex-col gap-2">
      <button
        className="btn"
        disabled={pending}
        onClick={() => start(async () => setMsg(await adminSync()))}
      >
        <RefreshCw size={16} className={pending ? "animate-spin" : ""} />
        {pending ? "מסנכרן…" : "סנכרון עכשיו"}
      </button>
      <Msg state={msg} />
    </div>
  );
}

export function GroupCodeForm({ current }: { current: string | null }) {
  const [state, action, pending] = useActionState<FormState, FormData>(adminSetGroupCode, undefined);
  return (
    <form action={action} className="flex flex-col gap-2">
      <div className="flex gap-2">
        <input name="groupCode" defaultValue={current ?? ""} dir="ltr" className="field text-left" placeholder="למשל chelsea2027" />
        <button className="btn shrink-0" disabled={pending}>שמירה</button>
      </div>
      <Msg state={state} />
    </form>
  );
}

/** הופך ms ל-"YYYY-MM-DDTHH:mm" בשעון המקומי של הדפדפן */
function toLocalInput(ms: number | null): string {
  if (!ms) return "";
  const d = new Date(ms);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function DeadlineForm({ current, isCustom }: { current: number | null; isCustom: boolean }) {
  const [value, setValue] = useState(toLocalInput(current));
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<FormState>(undefined);
  const save = (v: string) =>
    start(async () => {
      const res = await adminSetBonusDeadline(v ? new Date(v).toISOString() : "");
      setMsg(res.error ? res : { ok: "נשמר" });
    });
  return (
    <div className="flex flex-col gap-2">
      <input type="datetime-local" value={value} onChange={(e) => setValue(e.target.value)} className="field" dir="ltr" />
      <div className="flex gap-2">
        <button className="btn flex-1" disabled={pending} onClick={() => save(value)}>שמירה</button>
        {isCustom && (
          <button className="btn btn-ghost flex-1" disabled={pending} onClick={() => save("")}>
            חזרה לברירת מחדל
          </button>
        )}
      </div>
      <Msg state={msg} />
    </div>
  );
}

export function BonusAnswersForm({
  teams,
  championTeamId,
  topScorers,
}: {
  teams: { id: number; name: string }[];
  championTeamId: number | null;
  topScorers: string[];
}) {
  const [state, action, pending] = useActionState<FormState, FormData>(adminSetBonusAnswers, undefined);
  return (
    <form action={action} className="flex flex-col gap-2">
      <select name="championTeamId" defaultValue={championTeamId ?? ""} className="field">
        <option value="">האלופה — טרם נקבעה</option>
        {teams.map((t) => (
          <option key={t.id} value={t.id}>{t.name}</option>
        ))}
      </select>
      <input
        name="topScorers"
        defaultValue={topScorers.join(", ")}
        dir="ltr"
        placeholder="Top scorer(s), comma separated"
        className="field text-left"
      />
      <button className="btn" disabled={pending}>עדכון תשובות</button>
      <Msg state={state} />
    </form>
  );
}

export function UserRow({
  user,
  isMe,
}: {
  user: { id: number; username: string; displayName: string; isAdmin: boolean };
  isMe: boolean;
}) {
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);
  return (
    <li className="flex flex-col gap-2 py-3">
      <div className="flex items-center justify-between">
        <span>
          <b>{user.displayName}</b> <span className="text-xs text-muted" dir="ltr">@{user.username}</span>
          {user.isAdmin && <span className="ms-2 rounded bg-gold/15 px-1.5 text-xs text-gold">מנהל</span>}
        </span>
      </div>
      {!isMe && (
        <div className="flex flex-wrap gap-2 text-xs">
          <button
            disabled={pending}
            className="rounded-lg bg-deep px-2.5 py-1.5"
            onClick={() =>
              start(async () => {
                const r = await adminResetPassword(user.id);
                setMsg(r.password ? `סיסמה חדשה: ${r.password}` : null);
              })
            }
          >
            איפוס סיסמה
          </button>
          <button
            disabled={pending}
            className="rounded-lg bg-deep px-2.5 py-1.5"
            onClick={() => start(async () => setMsg((await adminToggleAdmin(user.id)).error ?? null))}
          >
            {user.isAdmin ? "הסרת ניהול" : "הפיכה למנהל"}
          </button>
          <button
            disabled={pending}
            className="rounded-lg bg-lose/15 px-2.5 py-1.5 text-lose"
            onClick={() => {
              if (confirm(`למחוק את ${user.displayName} וכל הניחושים שלו?`)) {
                start(async () => setMsg((await adminDeleteUser(user.id)).error ?? null));
              }
            }}
          >
            מחיקה
          </button>
        </div>
      )}
      {msg && <p className="text-sm text-gold" dir="auto">{msg}</p>}
    </li>
  );
}

export function MatchAdminRow({
  match,
}: {
  match: {
    id: number;
    label: string;
    when: string;
    homeName: string;
    awayName: string;
    odds: string | null;
    underdogOverride: string | null;
    manualResult: boolean;
    score: { home: number; away: number } | null;
  };
}) {
  const [pending, start] = useTransition();
  const [home, setHome] = useState(match.score?.home?.toString() ?? "");
  const [away, setAway] = useState(match.score?.away?.toString() ?? "");
  const [err, setErr] = useState<string | null>(null);

  return (
    <li className="flex flex-col gap-2 py-3 text-sm">
      <div className="flex justify-between">
        <b>{match.homeName} – {match.awayName}</b>
        <span className="text-xs text-muted">{match.when}</span>
      </div>
      <div className="text-xs text-muted">
        {match.label}
        {match.odds && <span dir="ltr" className="ms-2">odds {match.odds}</span>}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <label className="flex items-center gap-1 text-xs">
          אנדרדוג:
          <select
            disabled={pending}
            defaultValue={match.underdogOverride ?? ""}
            onChange={(e) => start(() => adminSetUnderdog(match.id, e.target.value))}
            className="rounded-lg bg-deep px-2 py-1"
          >
            <option value="">אוטומטי</option>
            <option value="HOME">{match.homeName}</option>
            <option value="AWAY">{match.awayName}</option>
            <option value="NONE">בלי</option>
          </select>
        </label>
        <span className="flex items-center gap-1 text-xs">
          תוצאה:
          <input value={home} onChange={(e) => setHome(e.target.value)} inputMode="numeric" className="w-10 rounded-lg bg-deep px-2 py-1 text-center" aria-label="בית" />
          :
          <input value={away} onChange={(e) => setAway(e.target.value)} inputMode="numeric" className="w-10 rounded-lg bg-deep px-2 py-1 text-center" aria-label="חוץ" />
          <button
            disabled={pending || home === "" || away === ""}
            className="rounded-lg bg-cyan/20 px-2 py-1 text-cyan"
            onClick={() =>
              start(async () => {
                const r = await adminSetResult(match.id, { home: Number(home), away: Number(away) });
                setErr(r.error ?? null);
              })
            }
          >
            קבע
          </button>
          {match.manualResult && (
            <button
              disabled={pending}
              className="rounded-lg bg-deep px-2 py-1"
              onClick={() => start(async () => void (await adminSetResult(match.id, null)))}
            >
              חזרה ל-API
            </button>
          )}
        </span>
      </div>
      {err && <p className="text-xs text-lose">{err}</p>}
    </li>
  );
}
