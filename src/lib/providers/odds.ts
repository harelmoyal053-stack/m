// יחסי הימורים מ-The Odds API — משמשים רק כדי לקבוע מי האנדרדוג בכל משחק.

const URL_BASE = "https://api.the-odds-api.com/v4/sports/soccer_uefa_champs_league/odds";

export interface OddsEvent {
  commence_time: string;
  home_team: string;
  away_team: string;
  bookmakers: {
    markets: { key: string; outcomes: { name: string; price: number }[] }[];
  }[];
}

export interface AveragedOdds {
  commenceTime: number;
  homeTeam: string;
  awayTeam: string;
  home: number;
  draw: number | null;
  away: number;
}

export async function fetchOdds(): Promise<AveragedOdds[]> {
  const key = process.env.ODDS_API_KEY;
  if (!key) return [];
  const url = `${URL_BASE}?apiKey=${encodeURIComponent(key)}&regions=eu&markets=h2h&oddsFormat=decimal`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`odds-api ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const events = (await res.json()) as OddsEvent[];
  return events.map(averageEvent).filter((e): e is AveragedOdds => e !== null);
}

/** ממוצע היחסים בין כל סוכנויות ההימורים. */
export function averageEvent(e: OddsEvent): AveragedOdds | null {
  const sums = { home: [] as number[], draw: [] as number[], away: [] as number[] };
  for (const b of e.bookmakers) {
    const m = b.markets.find((x) => x.key === "h2h");
    if (!m) continue;
    for (const o of m.outcomes) {
      if (o.name === e.home_team) sums.home.push(o.price);
      else if (o.name === e.away_team) sums.away.push(o.price);
      else if (o.name.toLowerCase() === "draw") sums.draw.push(o.price);
    }
  }
  const avg = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null);
  const home = avg(sums.home);
  const away = avg(sums.away);
  if (home === null || away === null) return null;
  return {
    commenceTime: Date.parse(e.commence_time),
    homeTeam: e.home_team,
    awayTeam: e.away_team,
    home,
    draw: avg(sums.draw),
    away,
  };
}

// --- התאמת שמות קבוצות בין שני ספקי הנתונים ---

const STOP_WORDS = new Set([
  "fc", "cf", "sc", "ac", "afc", "ssc", "as", "club", "de", "del", "da", "do", "the",
  "sv", "sk", "fk", "nk", "bv", "vfb", "vfl", "tsg", "rcd", "ca", "cd", "us", "and", "1",
  "e", "calcio", "football", "futbol", "fussball", "clube", "sport", "sporting", "royal",
]);

const ALIASES: Record<string, string> = {
  munchen: "munich",
  munchner: "munich",
  internazionale: "inter",
  milano: "milan",
  lisboa: "lisbon",
  koln: "cologne",
  sankt: "st",
  saint: "st",
  psg: "paris st germain",
  praha: "prague",
  wien: "vienna",
  bruxelles: "brussels",
  brugge: "bruges",
  crvena: "red",
  zvezda: "star",
  beograd: "belgrade",
  kobenhavn: "copenhagen",
  portugal: "lisbon",
  cp: "lisbon",
  hotspur: "tottenham",
  spurs: "tottenham",
  utd: "united",
  man: "manchester",
  wolverhampton: "wolves",
  wanderers: "wolves",
};

export function nameTokens(name: string): Set<string> {
  const plain = name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/ø/g, "o")
    .replace(/æ/g, "ae")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9 ]/g, " ");
  const tokens = new Set<string>();
  for (const raw of plain.split(/\s+/)) {
    if (!raw || STOP_WORDS.has(raw)) continue;
    for (const t of (ALIASES[raw] ?? raw).split(" ")) tokens.add(t);
  }
  return tokens;
}

/** דמיון בין שני שמות קבוצה: 0 עד 1. */
export function nameSimilarity(a: string, b: string): number {
  const ta = nameTokens(a);
  const tb = nameTokens(b);
  if (!ta.size || !tb.size) return 0;
  let shared = 0;
  for (const t of ta) {
    if (tb.has(t)) shared++;
    else if (t.length >= 4 && [...tb].some((u) => u.length >= 4 && (u.startsWith(t) || t.startsWith(u)))) shared += 0.8;
  }
  return shared / Math.min(ta.size, tb.size);
}

export interface MatchForOdds {
  id: number;
  utcDate: number;
  homeNames: string[];
  awayNames: string[];
}

/**
 * משייך כל אירוע יחסים למשחק: אותה שעת פתיחה (±3 שעות) ושמות דומים מספיק.
 * מחזיר מפה matchId -> יחסים (כבר מסודרים לפי בית/חוץ של המשחק אצלנו).
 */
export function pairOddsWithMatches(
  matchesList: MatchForOdds[],
  odds: AveragedOdds[],
): Map<number, { home: number; draw: number | null; away: number }> {
  const out = new Map<number, { home: number; draw: number | null; away: number }>();
  const best = (names: string[], target: string) =>
    Math.max(0, ...names.filter(Boolean).map((n) => nameSimilarity(n, target)));

  for (const m of matchesList) {
    let chosen: { score: number; odds: AveragedOdds; swapped: boolean } | null = null;
    for (const o of odds) {
      if (Math.abs(o.commenceTime - m.utcDate) > 3 * 3600_000) continue;
      const straight = Math.min(best(m.homeNames, o.homeTeam), best(m.awayNames, o.awayTeam));
      const swapped = Math.min(best(m.homeNames, o.awayTeam), best(m.awayNames, o.homeTeam));
      const score = Math.max(straight, swapped);
      if (score >= 0.5 && (!chosen || score > chosen.score)) {
        chosen = { score, odds: o, swapped: swapped > straight };
      }
    }
    if (chosen) {
      const o = chosen.odds;
      out.set(
        m.id,
        chosen.swapped
          ? { home: o.away, draw: o.draw, away: o.home }
          : { home: o.home, draw: o.draw, away: o.away },
      );
    }
  }
  return out;
}
