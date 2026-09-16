import { describe, expect, it } from "vitest";
import { buildProfileDrillRecommendation, DEFAULT_LEARNING_PROFILE, recordLearningProfileMatch, profileEntryFromDecisions } from "@/shared/learning-profile";
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

describe("Sensei profile drill recommendation", () => {
  it("explains why a low-confidence objective is recommended", () => {
    const profile = recordLearningProfileMatch(DEFAULT_LEARNING_PROFILE, profileEntryFromDecisions("match-1", [decision("defense", 0.54), decision("speed", 0.88)]));
    const recommendation = buildProfileDrillRecommendation(profile);
    expect(recommendation.objective).toBe("defense");
    expect(recommendation.rationale).toContain("54%");
    expect(recommendation.challengeReady).toBe(false);
  });

  it("only recommends Challenge after enough recent evidence", () => {
    let profile = DEFAULT_LEARNING_PROFILE;
    profile = recordLearningProfileMatch(profile, profileEntryFromDecisions("match-1", [decision("value", 0.8)]));
    profile = recordLearningProfileMatch(profile, profileEntryFromDecisions("match-2", [decision("value", 0.82)]));
    const recommendation = buildProfileDrillRecommendation(profile);
    expect(recommendation.challengeReady).toBe(true);
    expect(recommendation.challengeTitle).toContain("Challenge");
  });
});
