import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getAllMatches, getTeamsMap, getUserPredictions, type Match } from "@/lib/queries";
import { syncInBackground } from "@/lib/sync";
import { toMatchView, matchState } from "@/lib/views";
import { dayKey, formatDay } from "@/lib/format";
import { MatchCard } from "@/components/MatchCard";

type View = "upcoming" | "results";

function groupByDay(list: Match[]) {
  const groups: { key: string; label: string; items: Match[] }[] = [];
  for (const m of list) {
    const key = dayKey(m.utcDate);
    const last = groups.at(-1);
    if (last?.key === key) last.items.push(m);
    else groups.push({ key, label: formatDay(m.utcDate), items: [m] });
  }
  return groups;
}

export default async function MatchesPage({ searchParams }: PageProps<"/">) {
  const user = await requireUser();
  syncInBackground();
  const view: View = (await searchParams).view === "results" ? "results" : "upcoming";

  const [all, teams, preds] = await Promise.all([
    getAllMatches(),
    getTeamsMap(),
    getUserPredictions(user.id),
  ]);

  const finished = all.filter((m) => matchState(m) === "finished").reverse();
  const upcoming = all.filter((m) => matchState(m) !== "finished");
  const list = view === "results" ? finished : upcoming;
  const openCount = upcoming.filter((m) => matchState(m) === "open" && !preds.has(m.id) && m.homeTeamId && m.awayTeamId).length;

  return (
    <div className="flex flex-col gap-4 pt-2">
      <div className="grid grid-cols-2 rounded-xl bg-deep p-1 text-sm font-bold">
        {(
          [
            ["upcoming", "משחקים קרובים"],
            ["results", "תוצאות"],
          ] as const
        ).map(([v, label]) => (
          <Link
            key={v}
            href={v === "upcoming" ? "/" : "/?view=results"}
            className={`rounded-lg py-2 text-center ${view === v ? "bg-card2 text-ink" : "text-muted"}`}
          >
            {label}
          </Link>
        ))}
      </div>

      {view === "upcoming" && openCount > 0 && (
        <p className="rounded-xl bg-gold/10 p-3 text-sm text-gold">
          יש {openCount} משחקים פתוחים שעוד לא ניחשת. הניחוש ננעל בשריקת הפתיחה.
        </p>
      )}

      {list.length === 0 && (
        <div className="card p-6 text-center text-muted">
          {all.length === 0
            ? "עוד אין משחקים. המנהל צריך להגדיר מפתח API ולסנכרן."
            : view === "results"
              ? "עוד אין תוצאות."
              : "אין משחקים קרובים כרגע."}
        </div>
      )}

      {groupByDay(list).map((g) => (
        <section key={g.key} className="flex flex-col gap-3">
          <h2 className="sticky top-14 z-[5] -mx-4 bg-night/85 px-4 py-1.5 text-sm font-bold text-muted backdrop-blur">
            {g.label}
          </h2>
          {g.items.map((m) => (
            <MatchCard key={m.id} match={toMatchView(m, teams, preds.get(m.id))} />
          ))}
        </section>
      ))}
    </div>
  );
}
