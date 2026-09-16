import { describe, expect, it } from "vitest";
import { compareSnapshots } from "@/shared/snapshot-diff";
import type { ReplaySnapshot } from "@/shared/mahjong-backend";
import type { TileCode } from "@/shared/mahjong-types";

const tile = (id: string, code: TileCode) => ({ id, code, copy: 1, red: false });

const snapshot = (sequence: number, score: number, wallLength: number, hand: string[]): ReplaySnapshot => ({
  matchId: "m", sequence, turn: sequence, stateHash: `hash-${sequence}`,
  state: {
    id: `state-${sequence}`, ruleSet: "riichi", phase: "playing", roundWind: "east", handNumber: 1, dealer: 0, currentSeat: 0, honba: 0, riichiSticks: 0,
    wall: Array.from({ length: wallLength }, (_, index) => tile(`wall-${index}`, "m1")), deadWall: [], dora: { indicators: [], revealed: [] },
    players: [
      { seat: 0, displayName: "You", wind: "east", score, hand: hand.map((code, index) => tile(`${code}-${index}`, code as TileCode)), melds: [], discards: [], riichi: false, connected: true },
      { seat: 1, displayName: "Mika", wind: "south", score: 25000, hand: [], melds: [], discards: [], riichi: false, connected: true },
      { seat: 2, displayName: "Ren", wind: "west", score: 25000, hand: [], melds: [], discards: [], riichi: false, connected: true },
      { seat: 3, displayName: "Sora", wind: "north", score: 25000, hand: [], melds: [], discards: [], riichi: false, connected: true },
    ],
    turn: sequence, seed: 1,
  },
});

describe("snapshot diff presentation", () => {
  it("reports score, wall, and visible hand changes", () => {
    expect(compareSnapshots(snapshot(2, 25100, 68, ["m2", "m3"]), snapshot(1, 25000, 69, ["m1", "m3"]))).toMatchObject({ scoreDelta: 100, wallDelta: -1, addedTiles: ["m2"], removedTiles: ["m1"] });
  });
});
