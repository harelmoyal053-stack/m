import { describe, expect, it } from "vitest";
import { resolveUnderdog, scorePrediction } from "@/lib/scoring";

describe("scorePrediction", () => {
  it("gives exact-score points in the league stage", () => {
    expect(scorePrediction("LEAGUE_STAGE", { home: 2, away: 1 }, { home: 2, away: 1 }, null)).toMatchObject({
      total: 3,
      kind: "exact",
    });
  });

  it("gives direction points for the right winner", () => {
    expect(scorePrediction("LEAGUE_STAGE", { home: 2, away: 1 }, { home: 3, away: 0 }, null)).toMatchObject({
      total: 1,
      kind: "direction",
    });
  });

  it("treats a predicted draw with a different score as direction", () => {
    expect(scorePrediction("LEAGUE_STAGE", { home: 0, away: 0 }, { home: 2, away: 2 }, null).total).toBe(1);
  });

  it("gives nothing for a wrong outcome", () => {
    expect(scorePrediction("LEAGUE_STAGE", { home: 1, away: 0 }, { home: 1, away: 1 }, "AWAY")).toMatchObject({
      total: 0,
      kind: "miss",
      underdogBonus: 0,
    });
  });

  it("adds the underdog bonus only when the underdog wins and was predicted to", () => {
    // league: +1
    expect(scorePrediction("LEAGUE_STAGE", { home: 0, away: 1 }, { home: 0, away: 2 }, "AWAY").total).toBe(2);
    // knockout: +2 on top of exact
    expect(scorePrediction("LAST_16", { home: 1, away: 2 }, { home: 1, away: 2 }, "AWAY").total).toBe(6);
    // favourite wins: no bonus
    expect(scorePrediction("LAST_16", { home: 2, away: 0 }, { home: 2, away: 0 }, "AWAY").total).toBe(4);
    // draw is not an underdog win
    expect(scorePrediction("LAST_16", { home: 1, away: 1 }, { home: 1, away: 1 }, "AWAY").underdogBonus).toBe(0);
  });

  it("boosts points in later knockout rounds", () => {
    const exact = (stage: string) => scorePrediction(stage, { home: 1, away: 0 }, { home: 1, away: 0 }, null).total;
    expect(exact("LEAGUE_STAGE")).toBeLessThan(exact("LAST_16"));
    expect(exact("LAST_16")).toBeLessThan(exact("QUARTER_FINALS"));
    expect(exact("QUARTER_FINALS")).toBeLessThan(exact("SEMI_FINALS"));
    expect(exact("SEMI_FINALS")).toBeLessThan(exact("FINAL"));
  });
});

describe("resolveUnderdog", () => {
  it("picks the side with the higher odds", () => {
    expect(resolveUnderdog(1.5, 6.0, null)).toBe("AWAY");
    expect(resolveUnderdog(4.2, 1.8, null)).toBe("HOME");
  });
  it("returns null without odds or on equal odds", () => {
    expect(resolveUnderdog(null, 2, null)).toBeNull();
    expect(resolveUnderdog(2.5, 2.5, null)).toBeNull();
  });
  it("respects the admin override", () => {
    expect(resolveUnderdog(1.5, 6.0, "HOME")).toBe("HOME");
    expect(resolveUnderdog(1.5, 6.0, "NONE")).toBeNull();
  });
});
