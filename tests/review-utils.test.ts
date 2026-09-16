import { describe, expect, it } from "vitest";
import { presentDecision } from "@/shared/review-utils";
import type { AIOpponentDecision } from "@/shared/mahjong-backend";

const decision: AIOpponentDecision = {
  policy: "balanced",
  seat: 2,
  action: { type: "discard", seat: 2, tileCodes: ["m9"] },
  rationale: "Preserves a flexible shape.",
  objective: "speed" as const,
  confidence: 0.74,
  contributions: [],
  createdAt: "2026-08-15T01:00:00.000Z",
};

describe("review decision presenter", () => {
  it("maps live decisions to readable timeline metadata", () => {
    const presented = presentDecision(decision, 3);
    expect(presented.key).toContain(decision.createdAt);
    expect(presented.label).toBe("Moment 4 · seat 2");
    expect(presented.title).toBe("speed");
    expect(presented.policy).toBe("balanced");
    expect(presented.confidence).toBe("74%");
    expect(presented.action).toBe("discard");
    expect(presented.detail).toContain("flexible shape");
  });

  it("uses safe explanatory copy when rationale is empty", () => {
    const presented = presentDecision({ ...decision, rationale: "" }, 0);
    expect(presented.detail).toContain("visible state");
  });
});

  it("limits the expandable breakdown to the most useful contributions", () => {
    const presented = presentDecision({ ...decision, contributions: [
      { feature: "shanten", rawValue: 1, weight: 1, contribution: 0.8, explanation: "Improves distance." },
      { feature: "ukeire", rawValue: 4, weight: 1, contribution: 0.5, explanation: "Adds acceptance." },
      { feature: "danger", rawValue: 0.2, weight: 1, contribution: -0.2, explanation: "Adds risk." },
      { feature: "value", rawValue: 2, weight: 1, contribution: 0.1, explanation: "Adds value." },
    ] }, 0);
    expect(presented.contributions).toHaveLength(3);
    expect(presented.contributions[0].feature).toBe("shanten");
  });
