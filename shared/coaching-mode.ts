export type CoachingMode = "defensive" | "balanced" | "exploratory";

export const COACHING_MODES: CoachingMode[] = ["defensive", "balanced", "exploratory"];

export function normalizeCoachingMode(value: unknown): CoachingMode {
  return value === "defensive" || value === "exploratory" ? value : "balanced";
}

export function coachingModeLabel(mode: CoachingMode): string {
  return mode === "defensive" ? "Defensive" : mode === "exploratory" ? "Exploratory" : "Balanced";
}

export function nextCoachingMode(mode: CoachingMode): CoachingMode {
  return COACHING_MODES[(COACHING_MODES.indexOf(mode) + 1) % COACHING_MODES.length];
}

export function coachingModeDescription(mode: CoachingMode): string {
  return mode === "defensive" ? "Prefer safer waits, visible danger checks, and controlled score protection." : mode === "exploratory" ? "Allow more value and shape experiments when the risk budget is visible." : "Balance speed, value, and defense using the current table context.";
}

export function modeAwarePolicyAction(mode: CoachingMode, topAction?: string): { title: string; action: string } {
  const action = topAction ?? "the preferred line";
  if (mode === "defensive") return { title: "Protect the downside", action: `Use ${action} only after checking the safest visible alternative and the current danger signals.` };
  if (mode === "exploratory") return { title: "Spend risk deliberately", action: `Use ${action} as an experiment when the extra value or shape gain is visible and the risk budget is acceptable.` };
  return { title: "Keep the line balanced", action: `Use ${action} as the baseline, then compare one speed, value, and defense fact before committing.` };
}
