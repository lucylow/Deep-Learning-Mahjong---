import { describe, expect, it } from "vitest";
import { createGame } from "@/lib/mahjong-engine";
import { buildConfidenceCalibration, deriveObservedOutcome } from "@/shared/confidence-calibration";
import type { AIOpponentDecision } from "@/shared/mahjong-backend";
import type { PlayerSeat } from "@/shared/mahjong-types";

const decision = (confidence: number, seat: PlayerSeat = 0): AIOpponentDecision => ({
  policy: "balanced",
  seat,
  action: { type: "discard", seat, tileCodes: ["m5"] },
  rationale: "Visible-state calibration test",
  objective: "speed",
  confidence,
  contributions: [],
  createdAt: "2026-08-17T00:00:00.000Z",
});

describe("Sensei confidence calibration", () => {
  it("stays pending until a completed result is available", () => {
    const calibration = buildConfidenceCalibration([decision(0.82)]);
    expect(calibration.status).toBe("pending");
    expect(calibration.observedDecisions).toBe(0);
    expect(calibration.coaching).toContain("observable result");
  });

  it("compares decision confidence with the completed hand winner", () => {
    const state = createGame(42);
    const completed = { ...state, phase: "hand_complete" as const, winner: 0 as const, result: { winner: 0 as const, method: "tsumo" as const, points: 2000, han: 1, fu: 30, yaku: ["Menzen Tsumo"], scoreDeltas: { 0: 6000, 1: -2000, 2: -2000, 3: -2000 } } };
    expect(deriveObservedOutcome(decision(0.9), completed)).toBe(1);
    expect(deriveObservedOutcome(decision(0.9, 1), completed)).toBe(0);
    const calibration = buildConfidenceCalibration([decision(0.9), decision(0.85, 1)], completed);
    expect(calibration.status).toBe("observed");
    expect(calibration.observedDecisions).toBe(2);
    expect(calibration.overallSuccessRate).toBe(0.5);
    expect(calibration.calibrationGap).toBeGreaterThan(0);
    expect(calibration.coaching).toContain("more confident");
  });
});
