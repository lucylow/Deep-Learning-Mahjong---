import { describe, expect, it } from "vitest";
import { recommendedScenarioForObjective, DEFAULT_PRACTICE_PROGRESS } from "@/shared/guided-practice";

describe("profile-driven Sensei drills", () => {
  it("maps each observed objective to a compatible scenario", () => {
    expect(recommendedScenarioForObjective(DEFAULT_PRACTICE_PROGRESS, "defense").objective).toBe("defense");
    expect(recommendedScenarioForObjective(DEFAULT_PRACTICE_PROGRESS, "value").objective).toBe("value");
    expect(recommendedScenarioForObjective(DEFAULT_PRACTICE_PROGRESS, "shape").objective).toBe("shape");
  });
});
