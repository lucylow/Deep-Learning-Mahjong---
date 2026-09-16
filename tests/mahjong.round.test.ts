import { describe, expect, it } from "vitest";
import { advanceAfterHand } from "@/lib/mahjong-round";
import { createGame } from "@/lib/mahjong-engine";

describe("round transitions", () => {
  it("preserves scores and increments honba when the dealer wins", () => {
    const state = { ...createGame(770), phase: "hand_complete" as const, winner: 0 as const, dealer: 0 as const, honba: 2 };
    const result = advanceAfterHand(state);
    expect(result.reason).toBe("dealer_continues");
    expect(result.state.dealer).toBe(0);
    expect(result.state.honba).toBe(3);
    expect(result.state.players[0].score).toBe(state.players[0].score);
  });

  it("rotates dealer and resets honba after a non-dealer win", () => {
    const state = { ...createGame(771), phase: "hand_complete" as const, winner: 2 as const, dealer: 0 as const, honba: 2 };
    const result = advanceAfterHand(state);
    expect(result.reason).toBe("dealer_rotates");
    expect(result.state.dealer).toBe(1);
    expect(result.state.honba).toBe(0);
  });

  it("ends after the south round boundary", () => {
    const state = { ...createGame(772), phase: "hand_complete" as const, roundWind: "south" as const, handNumber: 3, winner: 1 as const };
    const result = advanceAfterHand(state);
    expect(result.matchComplete).toBe(true);
    expect(result.state.phase).toBe("match_complete");
  });
});
