import { describe, expect, it } from "vitest";
import { evaluatePolicyScenarios, getFeatureContributions } from "@/server/mahjong-ai";
import { createGame } from "@/lib/mahjong-engine";

describe("AI telemetry and evaluation", () => {
  it("returns feature contributions for the top recommendation", () => {
    const contributions = getFeatureContributions(createGame(440), 0, "balanced");
    expect(contributions.length).toBeGreaterThanOrEqual(5);
    expect(contributions.some((item) => item.feature === "danger")).toBe(true);
    expect(contributions.every((item) => Number.isFinite(item.contribution))).toBe(true);
    expect(contributions.every((item) => item.explanation.length > 10)).toBe(true);
  });

  it("keeps policy evaluation stable for deterministic seeds", () => {
    const scenarios = [
      { id: "speed-1", seed: 441, policy: "aggressive", expectedTopObjective: "speed" as const },
      { id: "defense-1", seed: 442, policy: "defensive", expectedTopObjective: "defense" as const },
    ];
    const first = evaluatePolicyScenarios(scenarios);
    const second = evaluatePolicyScenarios(scenarios);
    expect(first).toEqual(second);
    expect(first.every((result) => result.stableAcrossRuns)).toBe(true);
  });
});
