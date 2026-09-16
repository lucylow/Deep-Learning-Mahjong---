import { describe, expect, it } from "vitest";
import { buildPolicyComparisonSummaries, buildPolicyNextStep, policyAgreement } from "@/shared/policy-comparison";
import { buildCoachingPlan, detectMistakePatterns } from "@/shared/learning-focus";
import type { AIOpponentDecision } from "@/shared/mahjong-backend";
import type { DecisionAnalysis, TileCode } from "@/shared/mahjong-types";
import { createGame } from "@/lib/mahjong-engine";
import { compareCoachingModes } from "@/server/mahjong-ai";

const decision = (objective: AIOpponentDecision["objective"], confidence: number, contributions: AIOpponentDecision["contributions"]): AIOpponentDecision => ({
  policy: "balanced",
  seat: 0,
  action: { type: "discard", seat: 0, tileCodes: ["m5"] },
  rationale: "Visible-state test decision",
  objective,
  confidence,
  contributions,
  createdAt: "2026-08-17T00:00:00.000Z",
});

const analysis = (policyName: string, tile: TileCode, objective: DecisionAnalysis["alternatives"][number]["objective"], band: "decisive" | "close" | "uncertain"): DecisionAnalysis => ({
  recommendationId: policyName,
  policyName,
  observedFacts: [],
  inferredSignals: [],
  uncertainty: band === "uncertain" ? "high" : "medium",
  alternatives: [{ action: { type: "discard", seat: 0, tileCodes: [tile] }, objective, confidence: 0.8, rationale: `${policyName} rationale`, shantenAfter: 1, ukeire: 8 }],
  recommendationSummary: { confidenceGap: 0.1, ukeireDelta: 1, keyTradeoff: `${policyName} trade-off`, confidenceBand: band },
  disclaimer: "Visible state only",
});

describe("Sensei comparison and recurring errors", () => {
  it("detects repeated over-pushing on a defensive objective", () => {
    const plan = buildCoachingPlan([
      decision("defense", 0.62, [{ feature: "danger", rawValue: 0.8, weight: -1, contribution: -0.8, explanation: "visible danger" }]),
      decision("defense", 0.64, [{ feature: "danger", rawValue: 0.76, weight: -1, contribution: -0.76, explanation: "visible danger" }]),
    ]);
    expect(plan?.priority.signature).toBe("over-pushing");
    expect(plan?.priority.sampleSize).toBe(2);
    expect(plan?.priority.evidence).toContain("visible danger");
    expect(plan?.summary).toContain("over pushing");
  });

  it("keeps distinct recurring signatures separate", () => {
    const patterns = detectMistakePatterns([
      decision("speed", 0.7, [{ feature: "shape", rawValue: 0.2, weight: 1, contribution: 0.2, explanation: "narrow shape" }]),
      decision("speed", 0.71, [{ feature: "shape", rawValue: 0.5, weight: 1, contribution: 0.5, explanation: "flexible shape" }, { feature: "value", rawValue: 0.86, weight: 1, contribution: 0.86, explanation: "value potential" }]),
    ]);
    expect(patterns.map((pattern) => pattern.signature)).toEqual(["narrowing-too-early", "under-valuing"]);
  });

  it("turns low policy agreement into a counterfactual coaching step", () => {
    expect(buildPolicyNextStep([{ policy: "balanced", decisions: 3, averageConfidence: 0.7, objectives: ["defense"], topAction: "m9", dominantObjective: "defense" }], 0.25)).toMatchObject({ title: "Resolve the trade-off" });
  });

  it("compares defensive, balanced, and exploratory live recommendations", () => {
    const analyses = compareCoachingModes(createGame(17), 0);
    expect(analyses.map((item) => item.recommendationId.split("-").at(-1))).toEqual(["defensive", "balanced", "exploratory"]);
    expect(analyses.every((item) => item.alternatives.length > 0)).toBe(true);
  });

  it("builds compact side-by-side policy summaries and agreement", () => {
    const analyses = [analysis("aggressive", "m5", "speed", "close"), analysis("balanced", "p5", "speed", "decisive"), analysis("defensive", "p5", "defense", "uncertain")];
    const summaries = buildPolicyComparisonSummaries(analyses);
    expect(summaries[0]).toMatchObject({ policy: "aggressive", topAction: "m5", dominantObjective: "speed", tradeoff: "aggressive trade-off" });
    expect(summaries[1]).toMatchObject({ policy: "balanced", topAction: "p5", confidenceBand: "decisive" });
    expect(policyAgreement(analyses)).toBeCloseTo(2 / 3, 3);
  });
});
