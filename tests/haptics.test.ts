import { describe, expect, it } from "vitest";
import { canUseHaptics, shouldHapticTabPress } from "@/lib/haptics-utils";

describe("haptic platform guards", () => {
  it("disables haptics on web regardless of preference", () => {
    expect(canUseHaptics("web", true)).toBe(false);
  });

  it("respects a disabled haptic preference on native", () => {
    expect(canUseHaptics("ios", false)).toBe(false);
    expect(canUseHaptics("android", false)).toBe(false);
  });

  it("allows enabled native haptics", () => {
    expect(canUseHaptics("ios", true)).toBe(true);
    expect(canUseHaptics("android", true)).toBe(true);
  });

  it("uses runtime iOS detection for tab haptics", () => {
    expect(shouldHapticTabPress("ios")).toBe(true);
    expect(shouldHapticTabPress("android")).toBe(false);
    expect(shouldHapticTabPress("web")).toBe(false);
    expect(shouldHapticTabPress("unknown")).toBe(false);
  });
});
