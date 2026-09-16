import { describe, expect, it } from "vitest";
import { DEFAULT_PRACTICE_PROGRESS, difficultyLabel, evaluatePracticeAnswer, GUIDED_PRACTICE_SCENARIOS, masteryCoaching, masteryLabel, nextPracticeScenario, normalizePracticeProgress, practiceDifficulty, practiceMastery, recordPracticeAnswer, recommendedPracticeScenario } from "@/shared/guided-practice";

describe("guided Sensei practice", () => {
  it("evaluates the best visible line with coaching feedback", () => {
    const scenario = GUIDED_PRACTICE_SCENARIOS[0];
    const feedback = evaluatePracticeAnswer(scenario, scenario.bestOptionId);
    expect(feedback.correct).toBe(true);
    expect(feedback.title).toBe("Good read");
    expect(feedback.detail).toContain("flexible sequences");
  });

  it("explains why a weaker line is risky instead of only marking it wrong", () => {
    const scenario = GUIDED_PRACTICE_SCENARIOS[1];
    const weakerOption = scenario.options.find((option) => option.id !== scenario.bestOptionId);
    const feedback = evaluatePracticeAnswer(scenario, weakerOption?.id ?? "");
    expect(feedback.correct).toBe(false);
    expect(feedback.detail).toContain("Sensei would prefer");
    expect(feedback.detail).toContain("visible safe tile");
  });

  it("cycles deterministically through the practice scenarios", () => {
    const first = GUIDED_PRACTICE_SCENARIOS[0];
    const second = nextPracticeScenario(first.id);
    const wrapped = nextPracticeScenario(GUIDED_PRACTICE_SCENARIOS.at(-1)?.id ?? "");
    expect(second.id).toBe(GUIDED_PRACTICE_SCENARIOS[1].id);
    expect(wrapped.id).toBe(first.id);
  });

  it("normalizes unsafe persisted progress and recommends unseen drills first", () => {
    const progress = normalizePracticeProgress({ completedScenarioIds: [GUIDED_PRACTICE_SCENARIOS[0].id], attempts: 3.8, correct: 9, streak: -2, lastScenarioId: "missing" });
    expect(progress.attempts).toBe(3);
    expect(progress.correct).toBe(3);
    expect(progress.streak).toBe(0);
    expect(recommendedPracticeScenario(progress).id).toBe(GUIDED_PRACTICE_SCENARIOS[1].id);
  });

  it("records bounded answer progress and resets the streak after a miss", () => {
    const first = recordPracticeAnswer(DEFAULT_PRACTICE_PROGRESS, GUIDED_PRACTICE_SCENARIOS[0].id, true);
    const second = recordPracticeAnswer(first, GUIDED_PRACTICE_SCENARIOS[1].id, false);
    expect(first).toMatchObject({ attempts: 1, correct: 1, streak: 1 });
    expect(second).toMatchObject({ attempts: 2, correct: 1, streak: 0, lastScenarioId: GUIDED_PRACTICE_SCENARIOS[1].id });
    expect(second.completedScenarioIds).toHaveLength(2);
  });

  it("derives mastery and difficulty coaching from real progress signals", () => {
    const warming = DEFAULT_PRACTICE_PROGRESS;
    const developing = { completedScenarioIds: GUIDED_PRACTICE_SCENARIOS.slice(0, 2).map((scenario) => scenario.id), attempts: 4, correct: 3, streak: 1, objectiveStats: { shape: { attempts: 2, correct: 2 }, defense: { attempts: 2, correct: 1 }, value: { attempts: 0, correct: 0 } }, lastScenarioId: GUIDED_PRACTICE_SCENARIOS[1].id };
    const mastering = { completedScenarioIds: GUIDED_PRACTICE_SCENARIOS.slice(0, 3).map((scenario) => scenario.id), attempts: 6, correct: 6, streak: 3, objectiveStats: { shape: { attempts: 2, correct: 2 }, defense: { attempts: 2, correct: 2 }, value: { attempts: 2, correct: 2 } }, lastScenarioId: GUIDED_PRACTICE_SCENARIOS[2].id };
    expect(practiceMastery(warming)).toBe("warming-up");
    expect(practiceMastery(developing)).toBe("developing");
    expect(practiceMastery(mastering)).toBe("mastering");
    expect(masteryLabel("mastering")).toBe("Mastering");
    expect(masteryCoaching("warming-up")).toContain("calibrate");
    expect(practiceDifficulty(mastering)).toBe(3);
    expect(difficultyLabel(3)).toBe("Challenge");
  });
});
