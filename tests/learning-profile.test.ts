import { describe, expect, it } from "vitest";
import { buildProfileDrillRecommendation, buildProfileObjectiveTrends, DEFAULT_LEARNING_PROFILE, normalizeLearningProfile, profileEntryFromDecisions, recordLearningProfileMatch, weakestProfileObjective } from "@/shared/learning-profile";
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

describe("Sensei multi-match learning profile", () => {
  it("aggregates objective confidence across matches and selects the weakest recent objective", () => {
    const first = profileEntryFromDecisions("match-1", [decision("speed", 0.9), decision("defense", 0.55)]);
    const second = profileEntryFromDecisions("match-2", [decision("speed", 0.8), decision("defense", 0.62)]);
    const profile = recordLearningProfileMatch(recordLearningProfileMatch(DEFAULT_LEARNING_PROFILE, first), second);
    expect(profile.matches).toHaveLength(2);
    expect(profile.byObjective.speed.confidence).toBe(0.85);
    expect(profile.byObjective.defense.recentConfidence).toBe(0.585);
    expect(weakestProfileObjective(profile)).toBe("defense");
  });

  it("gives adaptive drills a measurable next step and confidence target", () => {
    const profile = recordLearningProfileMatch(DEFAULT_LEARNING_PROFILE, profileEntryFromDecisions("match-defense", [decision("defense", 0.52)]));
    const recommendation = buildProfileDrillRecommendation(profile);
    expect(recommendation.objective).toBe("defense");
    expect(recommendation.nextStep).toContain("decision");
    expect(recommendation.confidenceTarget).toBeGreaterThan(0.5);
  });

  it("distinguishes persistent weaknesses from improving objectives across replays", () => {
    let profile = DEFAULT_LEARNING_PROFILE;
    profile = recordLearningProfileMatch(profile, { matchId: "m1", completedAt: "2026-08-01T00:00:00.000Z", decisionCount: 2, averageConfidence: 0.7, byObjective: { defense: 0.78, speed: 0.5 } });
    profile = recordLearningProfileMatch(profile, { matchId: "m2", completedAt: "2026-08-02T00:00:00.000Z", decisionCount: 2, averageConfidence: 0.7, byObjective: { defense: 0.78, speed: 0.5 } });
    profile = recordLearningProfileMatch(profile, { matchId: "m3", completedAt: "2026-08-03T00:00:00.000Z", decisionCount: 2, averageConfidence: 0.65, byObjective: { defense: 0.62, speed: 0.68 } });
    profile = recordLearningProfileMatch(profile, { matchId: "m4", completedAt: "2026-08-04T00:00:00.000Z", decisionCount: 2, averageConfidence: 0.65, byObjective: { defense: 0.62, speed: 0.68 } });
    const trends = buildProfileObjectiveTrends(profile);
    expect(trends.find((trend) => trend.objective === "defense")).toMatchObject({ direction: "persistent", delta: -0.107, nextAction: expect.stringContaining("Replay two") });
    expect(trends.find((trend) => trend.objective === "speed")).toMatchObject({ direction: "improving", delta: 0.12 });
    expect(trends.find((trend) => trend.objective === "value")?.direction).toBe("insufficient-data");
  });

  it("normalizes malformed or oversized stored profiles safely", () => {
    const profile = normalizeLearningProfile({ matches: Array.from({ length: 30 }, (_, index) => ({ matchId: `m-${index}` })) });
    expect(profile.version).toBe(1);
    expect(profile.matches).toHaveLength(20);
    expect(profile.byObjective.score).toEqual({ decisions: 0, confidence: 0, recentConfidence: 0 });
  });
});
