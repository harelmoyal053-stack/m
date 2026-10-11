import { describe, expect, it } from "vitest";
import { buildLeaderboard, playerMatches, ranks, type ScoredMatch } from "@/lib/game";

const match = (id: number, stage: string, home: number | null, away: number | null, odds?: [number, number]): ScoredMatch => ({
  id,
  stage,
  status: home === null ? "TIMED" : "FINISHED",
  homeScore: home,
  awayScore: away,
  homeOdds: odds?.[0] ?? null,
  awayOdds: odds?.[1] ?? null,
  underdogOverride: null,
});

describe("buildLeaderboard", () => {
  const matches = [
    match(1, "LEAGUE_STAGE", 2, 1),
    match(2, "LAST_16", 0, 1, [1.4, 7]),
    match(3, "LEAGUE_STAGE", null, null),
  ];
  const preds = [
    { userId: 1, matchId: 1, home: 2, away: 1 }, // 3
    { userId: 1, matchId: 2, home: 1, away: 0 }, // 0
    { userId: 2, matchId: 1, home: 1, away: 0 }, // 1
    { userId: 2, matchId: 2, home: 0, away: 1 }, // 4 + 2 underdog
    { userId: 2, matchId: 3, home: 3, away: 3 }, // not played yet
  ];

  it("sums match points and bonus picks", () => {
    const rows = buildLeaderboard(
      [1, 2, 3],
      matches,
      preds,
      [{ userId: 1, championTeamId: 86, topScorer: "Mbappe" }],
      86,
      ["Kylian Mbappé"],
    );
    expect(rows.map((r) => [r.userId, r.total])).toEqual([
      [1, 3 + 10 + 7],
      [2, 7],
      [3, 0],
    ]);
    expect(rows[1]).toMatchObject({ exact: 1, direction: 1, underdogPoints: 2, predicted: 2 });
  });

  it("ranks ties together", () => {
    expect(
      ranks([
        { total: 9, exact: 2, direction: 1 },
        { total: 5, exact: 1, direction: 0 },
        { total: 5, exact: 1, direction: 0 },
        { total: 2, exact: 0, direction: 2 },
      ]),
    ).toEqual([1, 2, 2, 4]);
  });
});

describe("playerMatches", () => {
  it("matches surname-only and accent-free picks", () => {
    expect(playerMatches("mbappe", "Kylian Mbappé")).toBe(true);
    expect(playerMatches("Erling Haaland", "Erling Haaland")).toBe(true);
    expect(playerMatches("Kane", "Harry Kane")).toBe(true);
  });
  it("rejects different players", () => {
    expect(playerMatches("Haaland", "Kylian Mbappé")).toBe(false);
    expect(playerMatches("", "Harry Kane")).toBe(false);
  });
});
