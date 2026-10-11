// לקוח ל-football-data.org (v4) — תוצאות, לוח משחקים ומלך השערים של ליגת האלופות.

const BASE = "https://api.football-data.org/v4";

export interface FdTeam {
  id: number | null;
  name: string | null;
  shortName: string | null;
  tla: string | null;
  crest: string | null;
}

interface FdScorePair {
  home: number | null;
  away: number | null;
}

export interface FdMatch {
  id: number;
  utcDate: string;
  status: string;
  stage: string;
  matchday: number | null;
  homeTeam: FdTeam;
  awayTeam: FdTeam;
  score: {
    winner: "HOME_TEAM" | "AWAY_TEAM" | "DRAW" | null;
    duration: "REGULAR" | "EXTRA_TIME" | "PENALTY_SHOOTOUT";
    fullTime: FdScorePair;
    regularTime?: FdScorePair;
    extraTime?: FdScorePair;
    penalties?: FdScorePair;
  };
}

export interface FdScorer {
  player: { id: number; name: string };
  team: { id: number; name: string };
  goals: number | null;
}

async function fdFetch<T>(path: string): Promise<T> {
  const token = process.env.FOOTBALL_DATA_API_KEY;
  if (!token) throw new Error("חסר FOOTBALL_DATA_API_KEY");
  const res = await fetch(`${BASE}${path}`, {
    headers: { "X-Auth-Token": token },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`football-data ${res.status}: ${(await res.text()).slice(0, 200)}`);
  }
  return res.json() as Promise<T>;
}

export async function fetchChampionsLeagueMatches(): Promise<FdMatch[]> {
  const data = await fdFetch<{ matches: FdMatch[] }>("/competitions/CL/matches");
  return data.matches;
}

export async function fetchTopScorers(): Promise<FdScorer[]> {
  const data = await fdFetch<{ scorers: FdScorer[] }>("/competitions/CL/scorers?limit=50");
  return data.scorers;
}

export const FINISHED_STATUSES = new Set(["FINISHED", "AWARDED"]);
export const LIVE_STATUSES = new Set(["IN_PLAY", "PAUSED", "LIVE"]);

/**
 * תוצאת 90 הדקות — זו התוצאה שעליה מחשבים את הניקוד.
 * אם המשחק הלך להארכה/פנדלים, fullTime כולל את ההארכה, ולכן לוקחים את regularTime.
 */
export function regularTimeScore(score: FdMatch["score"]): FdScorePair {
  if (score.duration === "REGULAR" || !score.duration) return score.fullTime;
  if (score.regularTime && score.regularTime.home !== null) return score.regularTime;
  const sub = (a: number | null, ...b: (number | null | undefined)[]) =>
    a === null ? null : b.reduce<number>((acc, x) => acc - (x ?? 0), a);
  return {
    home: sub(score.fullTime.home, score.extraTime?.home, score.penalties?.home),
    away: sub(score.fullTime.away, score.extraTime?.away, score.penalties?.away),
  };
}

/** תוצאה להצגה: כולל הארכה, בלי פנדלים. */
export function displayScore(score: FdMatch["score"]): FdScorePair {
  if (score.duration === "REGULAR" || !score.duration) return score.fullTime;
  const reg = score.regularTime;
  if (reg && reg.home !== null && reg.away !== null) {
    return {
      home: reg.home + (score.extraTime?.home ?? 0),
      away: reg.away + (score.extraTime?.away ?? 0),
    };
  }
  const minus = (a: number | null, b: number | null | undefined) =>
    a === null ? null : a - (b ?? 0);
  return {
    home: minus(score.fullTime.home, score.penalties?.home),
    away: minus(score.fullTime.away, score.penalties?.away),
  };
}
