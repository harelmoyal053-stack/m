import { unstable_cache } from "next/cache";
import { Lock } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { getBonusAnswers, getBonusPicks, getTeamsMap, getUsers } from "@/lib/queries";
import { getBonusDeadline } from "@/lib/settings";
import { bonusPointsFor } from "@/lib/game";
import { BONUS_POINTS } from "@/lib/scoring";
import { formatDateTime, requestTime } from "@/lib/format";
import { teamName } from "@/lib/team-names";
import { fetchTopScorers } from "@/lib/providers/football-data";
import { syncInBackground } from "@/lib/sync";
import { BonusForm } from "@/components/BonusForm";

const getScorerSuggestions = unstable_cache(
  async () => {
    if (!process.env.FOOTBALL_DATA_API_KEY) return [];
    try {
      return (await fetchTopScorers()).map((s) => s.player.name);
    } catch {
      return [];
    }
  },
  ["scorer-suggestions"],
  { revalidate: 6 * 3600 },
);

export default async function BonusPage() {
  const user = await requireUser();
  syncInBackground();
  const [deadline, teams, picks, users, answers, scorers] = await Promise.all([
    getBonusDeadline(),
    getTeamsMap(),
    getBonusPicks(),
    getUsers(),
    getBonusAnswers(),
    getScorerSuggestions(),
  ]);
  const locked = deadline !== null && requestTime() >= deadline;
  const mine = picks.find((p) => p.userId === user.id);
  const teamList = [...teams.values()]
    .map((t) => ({ id: t.id, name: teamName(t) }))
    .sort((a, b) => a.name.localeCompare(b.name, "he"));
  const names = new Map(users.map((u) => [u.id, u.displayName]));
  const champion = answers.championTeamId ? teams.get(answers.championTeamId) : undefined;

  return (
    <div className="flex flex-col gap-4 pt-2">
      <h1 className="text-2xl font-black">ניחושי בונוס</h1>

      <div className="grid grid-cols-2 gap-3 text-center">
        <div className="card p-3">
          <div className="text-3xl font-black text-gold">{BONUS_POINTS.champion}</div>
          <div className="text-xs text-muted">נק׳ על האלופה</div>
        </div>
        <div className="card p-3">
          <div className="text-3xl font-black text-gold">{BONUS_POINTS.topScorer}</div>
          <div className="text-xs text-muted">נק׳ על מלך השערים</div>
        </div>
      </div>

      <p className="text-sm text-muted">
        {locked ? (
          <span className="inline-flex items-center gap-1">
            <Lock size={14} /> הניחושים ננעלו
          </span>
        ) : deadline ? (
          <>אפשר לשנות עד <b className="text-ink">{formatDateTime(deadline)}</b> (שעון ישראל)</>
        ) : (
          <>אפשר לשנות עד תחילת שלב הנוקאאוט.</>
        )}
      </p>

      {!locked ? (
        <BonusForm
          teams={teamList}
          scorers={scorers}
          initial={{ championTeamId: mine?.championTeamId ?? null, topScorer: mine?.topScorer ?? null }}
        />
      ) : (
        <>
          {(champion || answers.topScorers.length > 0) && (
            <div className="card border-gold/50 p-4 text-sm">
              {champion && <div>🏆 האלופה: <b>{teamName(champion)}</b></div>}
              {answers.topScorers.length > 0 && (
                <div>⚽ מלך השערים: <b dir="ltr">{answers.topScorers.join(", ")}</b></div>
              )}
            </div>
          )}
          <section className="card p-4">
            <h2 className="mb-2 font-bold">הניחושים של כולם</h2>
            <ul className="divide-y divide-line text-sm">
              {picks.map((p) => {
                const pts = bonusPointsFor(p, answers.championTeamId, answers.topScorers);
                const team = p.championTeamId ? teams.get(p.championTeamId) : undefined;
                return (
                  <li key={p.userId} className="flex flex-col gap-0.5 py-2.5">
                    <span className={`font-bold ${p.userId === user.id ? "text-cyan" : ""}`}>
                      {names.get(p.userId) ?? "?"}
                      {pts.champion + pts.topScorer > 0 && (
                        <span className="ms-2 text-gold"><bdi dir="ltr">+{pts.champion + pts.topScorer}</bdi></span>
                      )}
                    </span>
                    <span className="text-muted">
                      🏆 {team ? teamName(team) : "—"} · ⚽ <span dir="ltr">{p.topScorer ?? "—"}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>
        </>
      )}
    </div>
  );
}
