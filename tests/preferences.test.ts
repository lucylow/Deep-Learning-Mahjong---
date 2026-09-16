import { describe, expect, it } from "vitest";
import { normalizeAccessibilityPreferences } from "@/shared/preference-utils";

describe("accessibility preference normalization", () => {
  it("recovers safely from malformed or partial local values", () => {
    expect(normalizeAccessibilityPreferences({ highContrast: true, hapticsEnabled: false, confirmBeforeDiscard: true })).toEqual({ highContrast: true, largeTiles: false, reducedMotion: false, hapticsEnabled: false, confirmBeforeDiscard: true });
    expect(normalizeAccessibilityPreferences(null)).toEqual({ highContrast: false, largeTiles: false, reducedMotion: false, hapticsEnabled: true, confirmBeforeDiscard: false });
    expect(normalizeAccessibilityPreferences({ hapticsEnabled: "off" })).toEqual({ highContrast: false, largeTiles: false, reducedMotion: false, hapticsEnabled: true, confirmBeforeDiscard: false });
  });
});
