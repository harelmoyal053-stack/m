import { describe, expect, it } from "vitest";
import { displayScore, regularTimeScore } from "@/lib/providers/football-data";
import { nameSimilarity, pairOddsWithMatches } from "@/lib/providers/odds";

describe("football-data score extraction", () => {
  it("uses fullTime for regular matches", () => {
    const score = { winner: "HOME_TEAM" as const, duration: "REGULAR" as const, fullTime: { home: 2, away: 0 } };
    expect(regularTimeScore(score)).toEqual({ home: 2, away: 0 });
  });

  it("uses the 90-minute score when a match went to penalties", () => {
    const score = {
      winner: "AWAY_TEAM" as const,
      duration: "PENALTY_SHOOTOUT" as const,
      fullTime: { home: 5, away: 6 },
      regularTime: { home: 1, away: 1 },
      extraTime: { home: 0, away: 0 },
      penalties: { home: 4, away: 5 },
    };
    expect(regularTimeScore(score)).toEqual({ home: 1, away: 1 });
    expect(displayScore(score)).toEqual({ home: 1, away: 1 });
  });

  it("derives the 90-minute score from extra time when regularTime is missing", () => {
    const score = {
      winner: "HOME_TEAM" as const,
      duration: "EXTRA_TIME" as const,
      fullTime: { home: 3, away: 2 },
      extraTime: { home: 1, away: 0 },
    };
    expect(regularTimeScore(score)).toEqual({ home: 2, away: 2 });
  });
});

describe("team name matching", () => {
  it.each([
    ["FC Bayern München", "Bayern Munich"],
    ["Paris Saint-Germain FC", "Paris Saint Germain"],
    ["FC Internazionale Milano", "Inter Milan"],
    ["Club Atlético de Madrid", "Atletico Madrid"],
    ["Manchester City FC", "Manchester City"],
    ["Sporting Clube de Portugal", "Sporting Lisbon"],
    ["Tottenham Hotspur FC", "Tottenham"],
  ])("%s ≈ %s", (a, b) => {
    expect(nameSimilarity(a, b)).toBeGreaterThanOrEqual(0.5);
  });

  it("keeps different clubs apart", () => {
    expect(nameSimilarity("Manchester City FC", "Manchester United")).toBeLessThan(0.75);
    expect(nameSimilarity("Real Madrid CF", "FC Barcelona")).toBe(0);
  });

  it("pairs odds with matches by time and names, including swapped sides", () => {
    const t = Date.parse("2026-10-21T19:00:00Z");
    const paired = pairOddsWithMatches(
      [
        { id: 1, utcDate: t, homeNames: ["Real Madrid CF", "Real Madrid"], awayNames: ["Juventus FC", "Juventus"] },
        { id: 2, utcDate: t, homeNames: ["Manchester City FC", "Man City"], awayNames: ["FC Barcelona", "Barça"] },
      ],
      [
        { commenceTime: t, homeTeam: "Barcelona", awayTeam: "Manchester City", home: 3.1, draw: 3.6, away: 2.2 },
        { commenceTime: t, homeTeam: "Real Madrid", awayTeam: "Juventus", home: 1.7, draw: 3.9, away: 4.8 },
      ],
    );
    expect(paired.get(1)).toEqual({ home: 1.7, draw: 3.9, away: 4.8 });
    expect(paired.get(2)).toEqual({ home: 2.2, draw: 3.6, away: 3.1 });
  });
});
