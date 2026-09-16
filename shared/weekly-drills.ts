import { GUIDED_PRACTICE_SCENARIOS, type PracticeObjective } from "./guided-practice";
import type { ProfileObjectiveTrend } from "./learning-profile";
import type { CoachingMode } from "./coaching-mode";

export type WeeklySenseiDrill = {
  weekKey: string;
  sequence: number;
  scenarioId: string;
  title: string;
  objective: PracticeObjective;
  reason: string;
  target: string;
};

export type WeeklySenseiProgress = {
  weekKey: string;
  completedScenarioIds: string[];
  updatedAt?: string;
};

function practiceObjective(objective: ProfileObjectiveTrend["objective"]): PracticeObjective {
  return objective === "speed" ? "shape" : objective === "defense" ? "defense" : "value";
}

function weekKey(date = new Date()): string {
  const start = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const day = Math.floor((date.getTime() - start.getTime()) / 86_400_000);
  return `${date.getUTCFullYear()}-W${String(Math.ceil((day + start.getUTCDay() + 1) / 7)).padStart(2, "0")}`;
}

export function normalizeWeeklySenseiProgress(value: unknown, date = new Date()): WeeklySenseiProgress {
  const currentWeek = weekKey(date);
  if (!value || typeof value !== "object") return { weekKey: currentWeek, completedScenarioIds: [] };
  const raw = value as Record<string, unknown>;
  return { weekKey: typeof raw.weekKey === "string" && raw.weekKey === currentWeek ? currentWeek : currentWeek, completedScenarioIds: raw.weekKey === currentWeek && Array.isArray(raw.completedScenarioIds) ? raw.completedScenarioIds.filter((id): id is string => typeof id === "string").slice(-3) : [], updatedAt: typeof raw.updatedAt === "string" ? raw.updatedAt : undefined };
}

export function recordWeeklyDrillCompletion(progress: WeeklySenseiProgress, scenarioId: string, completedAt = new Date().toISOString()): WeeklySenseiProgress {
  if (progress.completedScenarioIds.includes(scenarioId)) return progress;
  return { ...progress, completedScenarioIds: [...progress.completedScenarioIds, scenarioId].slice(-3), updatedAt: completedAt };
}

export function prioritizeWeeklySenseiPlan(plan: WeeklySenseiDrill[], progress: WeeklySenseiProgress, trends: ProfileObjectiveTrend[]): WeeklySenseiDrill[] {
  const priority = new Map(trends.map((trend, index) => [practiceObjective(trend.objective), index]));
  return [...plan].sort((left, right) => {
    const leftDone = progress.completedScenarioIds.includes(left.scenarioId) ? 1 : 0;
    const rightDone = progress.completedScenarioIds.includes(right.scenarioId) ? 1 : 0;
    return leftDone - rightDone || (priority.get(left.objective) ?? 99) - (priority.get(right.objective) ?? 99) || left.sequence - right.sequence;
  }).map((item, index) => ({ ...item, sequence: index + 1 }));
}

export function buildWeeklySenseiPlan(trends: ProfileObjectiveTrend[], date = new Date(), coachingMode: CoachingMode = "balanced"): WeeklySenseiDrill[] {
  const selectedObjectives: ProfileObjectiveTrend[] = [];
  const modePriority = (trend: ProfileObjectiveTrend) => coachingMode === "defensive" ? trend.objective === "defense" ? -2 : 0 : coachingMode === "exploratory" ? trend.objective === "value" ? -2 : trend.objective === "speed" ? -1 : 0 : 0;
  for (const trend of [...trends].sort((left, right) => modePriority(left) - modePriority(right) || (left.direction === "persistent" ? -1 : 0) - (right.direction === "persistent" ? -1 : 0) || left.recentConfidence - right.recentConfidence)) {
    if (selectedObjectives.some((item) => practiceObjective(item.objective) === practiceObjective(trend.objective))) continue;
    selectedObjectives.push(trend);
    if (selectedObjectives.length === 3) break;
  }
  return selectedObjectives.map((trend, index) => {
    const objective = practiceObjective(trend.objective);
    const scenario = GUIDED_PRACTICE_SCENARIOS.find((item) => item.objective === objective) ?? GUIDED_PRACTICE_SCENARIOS[index % GUIDED_PRACTICE_SCENARIOS.length];
    const reason = trend.direction === "persistent" ? `${trend.label} is persistent across recent replays.` : trend.direction === "improving" ? `${trend.label} is improving; keep the checklist active.` : `${trend.label} needs another observed decision for a stable baseline.`;
    const target = coachingMode === "defensive" && objective === "defense" ? "Name one safe tile and one danger signal before pushing." : coachingMode === "exploratory" && objective === "value" ? "Name the value gain and the risk budget before experimenting." : trend.direction === "persistent" ? "Name one visible fact before choosing a line." : trend.direction === "improving" ? "Repeat the same reasoning with one controlled variation." : "Collect one clean decision and explain the trade-off.";
    return { weekKey: weekKey(date), sequence: index + 1, scenarioId: scenario.id, title: scenario.title, objective, reason, target };
  });
}
