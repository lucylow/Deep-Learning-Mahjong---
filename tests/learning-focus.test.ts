import { describe, expect, it } from "vitest";
import { buildCoachingPlan, buildLearningFocus, detectMistakePatterns } from "@/shared/learning-focus";
import type { AIOpponentDecision } from "@/shared/mahjong-backend";

const decision = (objective: AIOpponentDecision["objective"], confidence: number): AIOpponentDecision => ({
  policy: "balanced",
  seat: 0,
  action: { type: "discard", seat: 0, tileCodes: ["m5"] },
  rationale: "Visible-state test decision",
  objective,
  confidence,
  contributions: [],
  createdAt: "2026-08-15T00:00:00.000Z",
});

describe("personalized learning focus", () => {
  it("ranks the lowest-confidence objective as the highest-priority pattern", () => {
    const decisions = [
      decision("speed", 0.88),
      decision("defense", 0.52),
      decision("defense", 0.61),
      decision("value", 0.79),
    ];
    const patterns = detectMistakePatterns(decisions);
    expect(patterns[0].objective).toBe("defense");
    expect(patterns[0].severity).toBe("priority");
    expect(patterns[0].replayDecisionIndex).toBe(1);
  });

  it("creates a replayable coaching plan with a concrete drill", () => {
    const plan = buildCoachingPlan([decision("value", 0.64)]);
    expect(plan?.priority.drillTitle).toBe("Value detour calibration");
    expect(plan?.priority.recommendation.length).toBeGreaterThan(30);
    expect(plan?.summary).toContain("value building");
  });
  it("returns no focus when there are no decisions", () => {
    expect(buildLearningFocus([])).toBeNull();
  });

  it("selects the objective with the lowest average confidence", () => {
    const focus = buildLearningFocus([
      decision("speed", 0.82),
      decision("defense", 0.48),
      decision("defense", 0.56),
      decision("value", 0.72),
    ]);
    expect(focus).toMatchObject({
      objective: "defense",
      label: "Defensive reading",
      sampleSize: 2,
      confidence: 0.52,
    });
    expect(focus?.reason).toContain("52% average confidence");
    expect(focus?.nextDrill).toContain("safest visible tile");
    expect(focus?.replayDecisionIndex).toBe(1);
    expect(focus?.replayAction).toBe("discard · m5");
  });

  it("uses sample size as a deterministic tie-breaker", () => {
    const focus = buildLearningFocus([
      decision("speed", 0.5),
      decision("value", 0.5),
      decision("value", 0.5),
    ]);
    expect(focus?.objective).toBe("speed");
  });
});
