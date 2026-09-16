import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const homeSource = readFileSync(join(process.cwd(), "app/(tabs)/index.tsx"), "utf8");

describe("Home data-honesty recommendations", () => {
  it("does not ship generic prior-decision or next-lesson claims", () => {
    expect(homeSource).not.toContain("One decision changed the hand");
    expect(homeSource).not.toContain('eyebrow="Next lesson"');
    expect(homeSource).toContain("No saved study data");
  });

  it("gates the personalized learning card on completed saved activity", () => {
    expect(homeSource).toContain("onboardingSteps.some((step) => step.complete)");
    expect(homeSource).toContain("Continue learning");
    expect(homeSource).toContain("Create an experiment to unlock learning");
  });
});

