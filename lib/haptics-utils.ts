export function canUseHaptics(platform: string, enabled = true): boolean {
  return enabled && platform !== "web";
}

export function shouldHapticTabPress(platform: string): boolean {
  return platform === "ios";
}
