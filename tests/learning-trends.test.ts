import { describe, expect, it } from "vitest";
import { buildLearningTrends, summarizePolicyDifferences } from "@/shared/learning-trends";
import type { AIOpponentDecision } from "@/shared/mahjong-backend";

const decision = (policy: string, objective: AIOpponentDecision["objective"], confidence: number): AIOpponentDecision => ({
  policy,
  seat: 0,
  action: { type: "discard", seat: 0, tileCodes: ["m5"] },
  rationale: "Visible-state test decision",
  objective,
  confidence,
  contributions: [],
  createdAt: "2026-08-15T00:00:00.000Z",
});

describe("Sensei longitudinal learning trends", () => {
  it("detects improvement between earlier and later decisions", () => {
    const trends = buildLearningTrends([
      decision("balanced", "defense", 0.52),
      decision("balanced", "defense", 0.61),
      decision("balanced", "defense", 0.82),
      decision("balanced", "defense", 0.88),
    ]);
    expect(trends[0]).toMatchObject({ objective: "defense", direction: "improving", delta: 0.285, sampleSize: 4 });
  });

  it("explains adjacent policy differences without declaring an absolute winner", () => {
    const insights = summarizePolicyDifferences([
      decision("aggressive", "speed", 0.82),
      decision("balanced", "value", 0.74),
    ]);
    expect(insights).toHaveLength(1);
    expect(insights[0].note).toContain("optimizing different objectives");
    expect(insights[0].leftPolicy).toBe("aggressive");
  });
});
