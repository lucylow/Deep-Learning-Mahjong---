export type StoredAccessibilityPreferences = { highContrast?: unknown; largeTiles?: unknown; reducedMotion?: unknown; hapticsEnabled?: unknown; confirmBeforeDiscard?: unknown };

export function normalizeAccessibilityPreferences(value: unknown) {
  const parsed = value && typeof value === "object" ? value as StoredAccessibilityPreferences : {};
  return { highContrast: parsed.highContrast === true, largeTiles: parsed.largeTiles === true, reducedMotion: parsed.reducedMotion === true, hapticsEnabled: parsed.hapticsEnabled !== false, confirmBeforeDiscard: parsed.confirmBeforeDiscard === true };
}
