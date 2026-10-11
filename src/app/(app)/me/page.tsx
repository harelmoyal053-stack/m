import { LogOut } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { getLeaderboard } from "@/lib/queries";
import { ranks } from "@/lib/game";
import { logout } from "@/app/actions";
import { PasswordForm } from "@/components/PasswordForm";

export default async function MePage() {
  const user = await requireUser();
  const rows = await getLeaderboard();
  const rk = ranks(rows);
  const i = rows.findIndex((r) => r.userId === user.id);
  const me = rows[i];

  return (
    <div className="flex flex-col gap-4 pt-2">
      <div className="card p-5 text-center">
        <div className="text-2xl font-black">{user.displayName}</div>
        <div className="text-sm text-muted" dir="ltr">@{user.username}</div>
        {me && (
          <div className="mt-4 grid grid-cols-4 gap-2">
            {[
              ["מקום", rk[i]],
              ["נקודות", me.total],
              ["בול", me.exact],
              ["כיוון", me.direction],
            ].map(([label, v]) => (
              <div key={label} className="rounded-xl bg-deep p-2">
                <div className="text-xl font-black">{v}</div>
                <div className="text-[11px] text-muted">{label}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <PasswordForm />

      <form action={logout}>
        <button className="btn btn-ghost w-full text-lose">
          <LogOut size={18} /> התנתקות
        </button>
      </form>
    </div>
  );
}
