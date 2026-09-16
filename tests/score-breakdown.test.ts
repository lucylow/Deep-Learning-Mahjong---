import { describe, expect, it } from "vitest";
import { buildScoreBreakdown } from "@/shared/score-breakdown";
import type { HandResult } from "@/shared/mahjong-types";

const result: HandResult = {
  winner: 0,
  method: "ron",
  points: 2000,
  han: 2,
  fu: 30,
  yaku: ["Riichi", "Tanyao"],
  scoreDeltas: { 0: 2000, 1: -2000, 2: 0, 3: 0 },
};

describe("score breakdown", () => {
  it("maps each yaku and preserves bonus han in the transparent breakdown", () => {
    const breakdown = buildScoreBreakdown({ ...result, han: 3 }, 0, 1);
    expect(breakdown.lines).toEqual([
      { label: "Riichi", han: 1, detail: "1 han" },
      { label: "Tanyao", han: 1, detail: "1 han" },
      { label: "Dora / bonus han", han: 1, detail: "1 han" },
    ]);
    expect(breakdown.basePoints).toBe(960);
    expect(breakdown.paymentLabel).toContain("Ron payment");
  });

  it("explains limit hands instead of exposing an opaque formula", () => {
    const breakdown = buildScoreBreakdown({ ...result, han: 8, fu: 40 }, 0, 0);
    expect(breakdown.basePoints).toBe(4000);
    expect(breakdown.formula).toContain("limit applied");
    expect(breakdown.formula).toContain("dealer");
  });
});
