import { describe, expect, it } from "vitest";
import { DEFAULT_PRACTICE_PROGRESS, GUIDED_PRACTICE_SCENARIOS, recordPracticeAnswer, recommendedPracticeScenario } from "@/shared/guided-practice";
import { DEFAULT_LEARNING_PROFILE, recordLearningProfilePractice } from "@/shared/learning-profile";

describe("Sensei practice feedback loop", () => {
  it("tracks mistakes and revisits the missed scenario first", () => {
    const scenario = GUIDED_PRACTICE_SCENARIOS.find((item) => item.id === "shape-challenge-keep-flexibility")!;
    const progress = recordPracticeAnswer(DEFAULT_PRACTICE_PROGRESS, scenario.id, false);
    expect(progress.mistakeCounts?.[scenario.id]).toBe(1);
    expect(recommendedPracticeScenario(progress).id).toBe(scenario.id);
  });

  it("feeds practice outcomes into the mapped learning profile objective", () => {
    const profile = recordLearningProfilePractice(DEFAULT_LEARNING_PROFILE, "shape", false, "shape-challenge-keep-flexibility", "2026-08-15T00:00:00.000Z");
    expect(profile.byObjective.speed.decisions).toBe(1);
    expect(profile.byObjective.speed.recentConfidence).toBe(0.45);
    expect(profile.matches[0].matchId).toContain("practice:");
  });

  it("ships dedicated Challenge scenarios for shape and defense", () => {
    expect(GUIDED_PRACTICE_SCENARIOS.find((item) => item.id === "shape-challenge-keep-flexibility")?.difficulty).toBe(3);
    expect(GUIDED_PRACTICE_SCENARIOS.find((item) => item.id === "defense-challenge-count-safe")?.difficulty).toBe(3);
  });
});
