import { describe, expect, it } from "vitest";
import { coachingModeDescription, coachingModeLabel, modeAwarePolicyAction, nextCoachingMode, normalizeCoachingMode } from "@/shared/coaching-mode";

describe("Sensei coaching modes", () => {
  it("normalizes and cycles the persisted preference safely", () => {
    expect(normalizeCoachingMode("defensive")).toBe("defensive");
    expect(normalizeCoachingMode("unknown")).toBe("balanced");
    expect(nextCoachingMode("balanced")).toBe("exploratory");
    expect(nextCoachingMode("exploratory")).toBe("defensive");
  });
  it("provides distinct mode-aware actions", () => {
    expect(coachingModeLabel("defensive")).toBe("Defensive");
    expect(coachingModeDescription("exploratory")).toContain("value");
    expect(modeAwarePolicyAction("defensive", "m9").title).toBe("Protect the downside");
    expect(modeAwarePolicyAction("exploratory", "m9").action).toContain("m9");
  });
});
