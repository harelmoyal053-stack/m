import "server-only";
import type { MatchView } from "@/components/MatchCard";
import { FINISHED_STATUSES, LIVE_STATUSES } from "./providers/football-data";
import { pointsFor } from "./game";
import { resolveUnderdog, ruleFor } from "./scoring";
import { formatDateTime, formatTime } from "./format";
import { teamName } from "./team-names";
import type { Match, Team } from "./queries";

export function matchState(m: Match, now = Date.now()): MatchView["state"] {
  if (FINISHED_STATUSES.has(m.status)) return "finished";
  if (LIVE_STATUSES.has(m.status)) return "live";
  if (m.utcDate <= now || !["SCHEDULED", "TIMED"].includes(m.status)) return "locked";
  return "open";
}

export function toMatchView(
  m: Match,
  teams: Map<number, Team>,
  prediction: { home: number; away: number } | undefined,
  { withDate = false } = {},
): MatchView {
  const home = m.homeTeamId ? teams.get(m.homeTeamId) : undefined;
  const away = m.awayTeamId ? teams.get(m.awayTeamId) : undefined;
  const state = matchState(m);
  const hasScore = m.homeScore !== null && m.awayScore !== null;
  const fullDiffers =
    m.homeScoreFull !== null &&
    m.awayScoreFull !== null &&
    (m.homeScoreFull !== m.homeScore || m.awayScoreFull !== m.awayScore);
  const pts = prediction ? pointsFor(m, prediction) : null;

  return {
    id: m.id,
    kickoff: withDate ? formatDateTime(m.utcDate) : formatTime(m.utcDate),
    stageLabel:
      ruleFor(m.stage).label + (m.stage === "LEAGUE_STAGE" && m.matchday ? ` · מחזור ${m.matchday}` : ""),
    state,
    home: { name: teamName(home), crest: home?.crest ?? null },
    away: { name: teamName(away), crest: away?.crest ?? null },
    score: hasScore ? { home: m.homeScore!, away: m.awayScore! } : null,
    fullScore: fullDiffers ? { home: m.homeScoreFull!, away: m.awayScoreFull! } : null,
    advanced:
      // רק בגמר: במשחקי בית-חוץ המנצחת במשחק לא בהכרח עלתה
      m.stage === "FINAL" && state === "finished" && (m.winner === "HOME" || m.winner === "AWAY")
        ? m.winner
        : null,
    underdog: resolveUnderdog(m.homeOdds, m.awayOdds, m.underdogOverride),
    underdogBonus: ruleFor(m.stage).underdog,
    prediction: prediction ? { home: prediction.home, away: prediction.away } : null,
    points: pts ? { total: pts.total, kind: pts.kind, underdogBonus: pts.underdogBonus } : null,
    teamsKnown: Boolean(home && away),
  };
}
