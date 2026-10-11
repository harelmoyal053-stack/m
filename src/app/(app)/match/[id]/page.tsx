import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, EyeOff } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { getMatch, getMatchPredictions, getTeamsMap } from "@/lib/queries";
import { toMatchView } from "@/lib/views";
import { pointsFor } from "@/lib/game";
import { syncInBackground } from "@/lib/sync";
import { MatchCard } from "@/components/MatchCard";
import { ScorePair } from "@/components/ScorePair";

export default async function MatchPage({ params }: PageProps<"/match/[id]">) {
  const user = await requireUser();
  syncInBackground();
  const id = Number((await params).id);
  const match = Number.isInteger(id) ? await getMatch(id) : undefined;
  if (!match) notFound();

  const [teams, preds] = await Promise.all([getTeamsMap(), getMatchPredictions(id)]);
  const mine = preds.find((p) => p.userId === user.id);
  const view = toMatchView(match, teams, mine, { withDate: true });
  const revealed = view.state !== "open";

  const rows = preds
    .map((p) => ({ ...p, pts: pointsFor(match, p) }))
    .sort((a, b) => (b.pts?.total ?? 0) - (a.pts?.total ?? 0) || a.displayName.localeCompare(b.displayName, "he"));

  return (
    <div className="flex flex-col gap-4 pt-2">
      <Link href="/" className="flex items-center gap-1 text-sm text-muted">
        <ChevronRight size={16} /> חזרה למשחקים
      </Link>

      <MatchCard match={view} />

      <section className="card p-4">
        <h2 className="mb-3 font-bold">הניחושים של כולם ({preds.length})</h2>
        {!revealed ? (
          <p className="flex items-center gap-2 text-sm text-muted">
            <EyeOff size={16} /> הניחושים של כולם ייחשפו בשריקת הפתיחה — כדי שאף אחד לא יעתיק 😉
          </p>
        ) : rows.length === 0 ? (
          <p className="text-sm text-muted">אף אחד לא ניחש את המשחק הזה.</p>
        ) : (
          <ul className="divide-y divide-line">
            {rows.map((r) => (
              <li key={r.userId} className="flex items-center justify-between py-2.5">
                <span className={`font-bold ${r.userId === user.id ? "text-cyan" : ""}`}>{r.displayName}</span>
                <span className="flex items-center gap-3">
                  <ScorePair home={r.home} away={r.away} className="text-lg font-black" />
                  {r.pts && (
                    <span
                      className={`w-14 rounded-full py-0.5 text-center text-sm font-black ${
                        r.pts.kind === "exact"
                          ? "bg-win text-night"
                          : r.pts.kind === "direction"
                            ? "bg-cyan/20 text-cyan"
                            : "bg-deep text-muted"
                      }`}
                    >
                      <bdi dir="ltr">+{r.pts.total}</bdi>
                      {r.pts.underdogBonus > 0 && "✨"}
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
