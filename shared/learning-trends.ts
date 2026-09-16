import type { AIOpponentDecision } from "./mahjong-backend";
import type { LearningObjective } from "./learning-focus";

export type LearningTrend = {
  objective: LearningObjective;
  label: string;
  currentConfidence: number;
  previousConfidence: number;
  delta: number;
  direction: "improving" | "steady" | "needs-attention";
  sampleSize: number;
};

export type PolicyDifferenceInsight = {
  leftPolicy: string;
  rightPolicy: string;
  confidenceDelta: number;
  sharedObjectives: string[];
  note: string;
};

const LABELS: Record<LearningObjective, string> = {
  speed: "Speed and shape",
  value: "Value building",
  defense: "Defensive reading",
  score: "Score-aware decisions",
};

function round(value: number): number {
  return Number(value.toFixed(3));
}

function average(values: number[]): number {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

export function buildLearningTrends(decisions: AIOpponentDecision[]): LearningTrend[] {
  const grouped = new Map<LearningObjective, AIOpponentDecision[]>();
  for (const decision of decisions) {
    const objective = decision.objective as LearningObjective;
    const current = grouped.get(objective) ?? [];
    current.push(decision);
    grouped.set(objective, current);
  }
  return [...grouped.entries()].map(([objective, items]) => {
    const split = Math.max(1, Math.floor(items.length / 2));
    const previous = items.slice(0, split).map((item) => item.confidence);
    const current = items.slice(split).map((item) => item.confidence);
    const previousConfidence = round(average(previous));
    const currentConfidence = round(average(current.length ? current : previous));
    const delta = round(currentConfidence - previousConfidence);
    const direction: LearningTrend["direction"] = delta >= 0.06 ? "improving" : delta <= -0.06 ? "needs-attention" : "steady";
    return { objective, label: LABELS[objective], currentConfidence, previousConfidence, delta, direction, sampleSize: items.length };
  }).sort((left, right) => left.currentConfidence - right.currentConfidence || left.objective.localeCompare(right.objective));
}

export function summarizePolicyDifferences(decisions: AIOpponentDecision[]): PolicyDifferenceInsight[] {
  const grouped = new Map<string, AIOpponentDecision[]>();
  for (const decision of decisions) grouped.set(decision.policy, [...(grouped.get(decision.policy) ?? []), decision]);
  const policies = [...grouped.keys()].sort();
  const insights: PolicyDifferenceInsight[] = [];
  for (let index = 0; index < policies.length - 1; index += 1) {
    const leftPolicy = policies[index];
    const rightPolicy = policies[index + 1];
    const left = grouped.get(leftPolicy) ?? [];
    const right = grouped.get(rightPolicy) ?? [];
    const leftObjectives = new Set(left.map((item) => item.objective));
    const rightObjectives = new Set(right.map((item) => item.objective));
    const sharedObjectives = [...leftObjectives].filter((objective) => rightObjectives.has(objective)).sort();
    const confidenceDelta = round(average(left.map((item) => item.confidence)) - average(right.map((item) => item.confidence)));
    const note = Math.abs(confidenceDelta) < 0.05
      ? `${leftPolicy} and ${rightPolicy} are close in confidence; choose based on the table objective.`
      : `${confidenceDelta > 0 ? leftPolicy : rightPolicy} is more confident in this sample, but the policies may be optimizing different objectives.`;
    insights.push({ leftPolicy, rightPolicy, confidenceDelta, sharedObjectives, note });
  }
  return insights;
}
