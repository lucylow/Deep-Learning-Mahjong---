import { describe, expect, it } from "vitest";
import { buildReplayCoachingSignal } from "@/shared/replay-coaching";
import type { AIOpponentDecision } from "@/shared/mahjong-backend";
import type { ConfidenceCalibration } from "@/shared/confidence-calibration";

const decision: AIOpponentDecision = { policy: "balanced", seat: 0, action: { type: "discard", seat: 0, tileCodes: ["m1"], tsumogiri: false }, rationale: "Test line", objective: "defense", confidence: 0.86, contributions: [], createdAt: "2026-08-17T00:00:00.000Z" };
const calibration = { status: "observed", totalDecisions: 4, observedDecisions: 4, overallSuccessRate: 0.5, averageConfidence: 0.75, calibrationGap: 0.25, coaching: "Verify", buckets: [], byObjective: [{ objective: "defense", decisions: 2, observedDecisions: 2, averageConfidence: 0.86, observedSuccessRate: 0.5, calibrationGap: 0.36, direction: "overconfident", coaching: "Verify" }, { objective: "speed", decisions: 0, observedDecisions: 0, averageConfidence: 0, observedSuccessRate: 0, calibrationGap: 0, direction: "pending", coaching: "Collect" }, { objective: "value", decisions: 0, observedDecisions: 0, averageConfidence: 0, observedSuccessRate: 0, calibrationGap: 0, direction: "pending", coaching: "Collect" }, { objective: "score", decisions: 0, observedDecisions: 0, averageConfidence: 0, observedSuccessRate: 0, calibrationGap: 0, direction: "pending", coaching: "Collect" }] } as ConfidenceCalibration;

describe("outcome-aware replay coaching", () => {
  it("asks for verification after an overconfident miss", () => {
    expect(buildReplayCoachingSignal(decision, calibration, 0)).toMatchObject({ tone: "verify", title: "Verify before trusting" });
  });
  it("asks the player to collect evidence when the result is pending", () => {
    expect(buildReplayCoachingSignal(decision, calibration, null).tone).toBe("observe");
  });
});
