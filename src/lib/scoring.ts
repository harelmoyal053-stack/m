// חוקי הניקוד של המשחק. כל המספרים כאן — שינוי פה משנה את הניקוד בכל האפליקציה.

export type Stage =
  | "LEAGUE_STAGE"
  | "PLAYOFFS"
  | "LAST_16"
  | "QUARTER_FINALS"
  | "SEMI_FINALS"
  | "FINAL";

export type Side = "HOME" | "AWAY";
export type Outcome = Side | "DRAW";

export interface StageRule {
  label: string;
  exact: number; // תוצאה מדויקת
  direction: number; // כיוון נכון (מנצחת / תיקו)
  underdog: number; // בונוס על ניחוש נכון של ניצחון האנדרדוג
}

export const STAGE_RULES: Record<Stage, StageRule> = {
  LEAGUE_STAGE: { label: "שלב הליגה", exact: 3, direction: 1, underdog: 1 },
  PLAYOFFS: { label: "פלייאוף", exact: 4, direction: 2, underdog: 2 },
  LAST_16: { label: "שמינית גמר", exact: 4, direction: 2, underdog: 2 },
  QUARTER_FINALS: { label: "רבע גמר", exact: 5, direction: 2, underdog: 2 },
  SEMI_FINALS: { label: "חצי גמר", exact: 6, direction: 3, underdog: 2 },
  FINAL: { label: "גמר", exact: 8, direction: 4, underdog: 2 },
};

export const STAGE_ORDER: Stage[] = [
  "LEAGUE_STAGE",
  "PLAYOFFS",
  "LAST_16",
  "QUARTER_FINALS",
  "SEMI_FINALS",
  "FINAL",
];

export const BONUS_POINTS = {
  champion: 10,
  topScorer: 7,
};

export function ruleFor(stage: string): StageRule {
  return STAGE_RULES[stage as Stage] ?? STAGE_RULES.LEAGUE_STAGE;
}

export function isKnockout(stage: string): boolean {
  return stage !== "LEAGUE_STAGE";
}

export function outcomeOf(home: number, away: number): Outcome {
  if (home > away) return "HOME";
  if (away > home) return "AWAY";
  return "DRAW";
}

export interface PointsBreakdown {
  total: number;
  base: number;
  kind: "exact" | "direction" | "miss";
  underdogBonus: number;
}

/**
 * ניקוד ניחוש אחד. התוצאה היא תוצאת 90 הדקות.
 * בונוס האנדרדוג ניתן רק למי שניחש ניצחון של הקבוצה עם הסיכוי הנמוך יותר — והיא אכן ניצחה.
 */
export function scorePrediction(
  stage: string,
  prediction: { home: number; away: number },
  result: { home: number; away: number },
  underdog: Side | null,
): PointsBreakdown {
  const rule = ruleFor(stage);
  const predicted = outcomeOf(prediction.home, prediction.away);
  const actual = outcomeOf(result.home, result.away);

  if (predicted !== actual) {
    return { total: 0, base: 0, kind: "miss", underdogBonus: 0 };
  }

  const exact = prediction.home === result.home && prediction.away === result.away;
  const base = exact ? rule.exact : rule.direction;
  const underdogBonus = underdog && actual === underdog ? rule.underdog : 0;

  return {
    total: base + underdogBonus,
    base,
    kind: exact ? "exact" : "direction",
    underdogBonus,
  };
}

/**
 * קובע מי האנדרדוג לפי יחסי ההימורים (יחס גבוה יותר = סיכוי נמוך יותר).
 * עקיפה ידנית של המנהל קודמת לכל.
 */
export function resolveUnderdog(
  homeOdds: number | null,
  awayOdds: number | null,
  override: string | null,
): Side | null {
  if (override === "HOME" || override === "AWAY") return override;
  if (override === "NONE") return null;
  if (!homeOdds || !awayOdds || homeOdds === awayOdds) return null;
  return homeOdds > awayOdds ? "HOME" : "AWAY";
}
