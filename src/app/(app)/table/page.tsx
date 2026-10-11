import { requireUser } from "@/lib/auth";
import { getLeaderboard } from "@/lib/queries";
import { ranks } from "@/lib/game";
import { syncInBackground } from "@/lib/sync";

const MEDALS = ["🥇", "🥈", "🥉"];

export default async function TablePage() {
  const user = await requireUser();
  syncInBackground();
  const rows = await getLeaderboard();
  const rk = ranks(rows);

  return (
    <div className="flex flex-col gap-4 pt-2">
      <h1 className="text-2xl font-black">טבלת הליגה</h1>

      <div className="card overflow-hidden">
        <div className="grid grid-cols-[2.5rem_1fr_2.5rem_2.5rem_2.5rem_3.5rem] items-center gap-1 border-b border-line px-3 py-2 text-[11px] font-bold text-muted">
          <span>#</span>
          <span>שם</span>
          <span className="text-center" title="תוצאה מדויקת">בול</span>
          <span className="text-center" title="כיוון נכון">כיוון</span>
          <span className="text-center" title="נקודות בונוס (אנדרדוג + ניחושי בונוס)">✨</span>
          <span className="text-center">נק׳</span>
        </div>
        <ul>
          {rows.map((r, i) => (
            <li
              key={r.userId}
              className={`grid grid-cols-[2.5rem_1fr_2.5rem_2.5rem_2.5rem_3.5rem] items-center gap-1 px-3 py-3 ${
                r.userId === user.id ? "bg-cyan/10" : i % 2 ? "bg-deep/40" : ""
              }`}
            >
              <span className="text-lg font-black">{rk[i] <= 3 ? MEDALS[rk[i] - 1] : rk[i]}</span>
              <span className="truncate font-bold">{r.displayName}</span>
              <span className="text-center tabular-nums text-win">{r.exact}</span>
              <span className="text-center tabular-nums text-cyan">{r.direction}</span>
              <span className="text-center tabular-nums text-gold">{r.underdogPoints + r.bonusPoints}</span>
              <span className="text-center text-xl font-black tabular-nums">{r.total}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="text-center text-xs text-muted">
        בשוויון נקודות — קובע מי שיש לו יותר תוצאות מדויקות, ואחר כך יותר כיוונים נכונים.
      </p>
    </div>
  );
}
