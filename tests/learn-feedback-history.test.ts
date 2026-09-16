import { describe, expect, it } from "vitest";
import { DEFAULT_PRACTICE_PROGRESS, GUIDED_PRACTICE_SCENARIOS, normalizePracticeProgress, recordPracticeAnswer } from "@/shared/guided-practice";

describe("Learn feedback history", () => {
  it("records confidence deltas and keeps a bounded history", () => {
    let progress = DEFAULT_PRACTICE_PROGRESS;
    const scenario = GUIDED_PRACTICE_SCENARIOS[0];
    for (let index = 0; index < 15; index += 1) progress = recordPracticeAnswer(progress, scenario.id, index % 2 === 0);
    expect(progress.history).toHaveLength(12);
    expect(progress.history?.at(-1)?.confidenceAfter).toBeGreaterThanOrEqual(0);
    expect(progress.history?.at(-1)?.confidenceDelta).toBeDefined();
  });

  it("normalizes malformed history without crashing", () => {
    const progress = normalizePracticeProgress({ attempts: 3, correct: 2, history: [{ objective: "invalid", confidenceDelta: 4 }, null, "bad"] });
    expect(progress.history).toHaveLength(1);
    expect(progress.history?.[0].objective).toBe("shape");
    expect(progress.history?.[0].confidenceDelta).toBe(1);
  });

  it("includes focused score-pressure and riichi-defense Challenge scenarios", () => {
    expect(GUIDED_PRACTICE_SCENARIOS.find((scenario) => scenario.id === "value-score-pressure-recovery")?.difficulty).toBe(3);
    expect(GUIDED_PRACTICE_SCENARIOS.find((scenario) => scenario.id === "defense-riichi-threat-line")?.difficulty).toBe(3);
  });
});
