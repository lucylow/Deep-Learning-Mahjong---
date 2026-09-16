import { describe, expect, it } from "vitest";
import { decomposeHand, isWinningHand } from "@/lib/mahjong-decomposition";
import type { TileInstance } from "@/shared/mahjong-types";

const tile = (code: TileInstance["code"], id: string): TileInstance => ({ id, code, copy: 0, red: false });
const hand = (codes: TileInstance["code"][]) => codes.map((code, index) => tile(code, `${code}-${index}`));

describe("hand decomposition", () => {
  it("recognizes a standard four-meld hand", () => {
    const result = decomposeHand(hand(["m1", "m2", "m3", "m4", "m5", "m6", "p2", "p3", "p4", "s7", "s8", "s9", "z1", "z1"]));
    expect(result?.shape).toBe("standard");
    expect(result?.melds).toHaveLength(4);
    expect(isWinningHand(hand(["m1", "m2", "m3", "m4", "m5", "m6", "p2", "p3", "p4", "s7", "s8", "s9", "z1", "z1"]))).toBe(true);
  });

  it("recognizes seven pairs", () => {
    const result = decomposeHand(hand(["m1", "m1", "m2", "m2", "p3", "p3", "p4", "p4", "s5", "s5", "z1", "z1", "z7", "z7"]));
    expect(result?.shape).toBe("seven_pairs");
  });
});
