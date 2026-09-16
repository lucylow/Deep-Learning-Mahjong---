import type { AIOpponentDecision } from "./mahjong-backend";
import type { DecisionAnalysis } from "./mahjong-types";

export type PolicyComparisonSummary = {
  policy: string;
  decisions: number;
  averageConfidence: number;
  objectives: string[];
  topAction?: string;
  dominantObjective?: string;
  confidenceBand?: "decisive" | "close" | "uncertain";
  tradeoff?: string;
  rationale?: string;
};

function round(value: number): number {
  return Number(value.toFixed(3));
}

export function summarizePolicies(decisions: AIOpponentDecision[]): PolicyComparisonSummary[] {
  const grouped = new Map<string, { count: number; confidence: number; objectives: Set<string>; top?: AIOpponentDecision }>();
  for (const decision of decisions) {
    const current = grouped.get(decision.policy) ?? { count: 0, confidence: 0, objectives: new Set<string>() };
    current.count += 1;
    current.confidence += decision.confidence;
    current.objectives.add(decision.objective);
    if (!current.top || decision.confidence > current.top.confidence) current.top = decision;
    grouped.set(decision.policy, current);
  }
  return [...grouped.entries()].sort(([left], [right]) => left.localeCompare(right)).map(([policy, value]) => ({
    policy,
    decisions: value.count,
    averageConfidence: value.count ? round(value.confidence / value.count) : 0,
    objectives: [...value.objectives].sort(),
  }));
}

export function buildPolicyComparisonSummaries(analyses: DecisionAnalysis[]): PolicyComparisonSummary[] {
  return analyses.map((analysis) => {
    const top = analysis.alternatives[0];
    return {
      policy: analysis.policyName,
      decisions: analysis.alternatives.length,
      averageConfidence: round(analysis.alternatives.reduce((sum, alternative) => sum + alternative.confidence, 0) / Math.max(1, analysis.alternatives.length)),
      objectives: [...new Set(analysis.alternatives.map((alternative) => alternative.objective))],
      topAction: top?.action.tileCodes?.[0],
      dominantObjective: top?.objective,
      confidenceBand: analysis.recommendationSummary?.confidenceBand,
      tradeoff: analysis.recommendationSummary?.keyTradeoff,
      rationale: top?.rationale,
    };
  });
}

export function buildPolicyNextStep(summaries: PolicyComparisonSummary[], agreement: number) {
  const lead = summaries[0];
  if (!lead) return { title: "Run a policy comparison", action: "Compare at least two lines before deciding which objective matters most.", evidence: "Sensei needs a current state and visible alternatives before it can personalize the next step." };
  if (agreement < 0.5) return { title: "Resolve the trade-off", action: `Compare ${lead.topAction ?? "the preferred discard"} against one defensive counterfactual before committing.`, evidence: `The policies agree on the top action only ${Math.round(agreement * 100)}% of the time, so the visible trade-off matters more than a single recommendation.` };
  return { title: "Calibrate the preferred line", action: `Keep ${lead.topAction ?? "the preferred discard"} as the baseline, then name the visible fact that would make you switch policies.`, evidence: `${Math.round(agreement * 100)}% of compared lines agree on the top action, but the remaining difference is still useful for learning ${lead.dominantObjective ?? "the current objective"}.` };
}

export function policyAgreement(analyses: DecisionAnalysis[]): number {
  if (!analyses.length) return 0;
  const actions = analyses.map((analysis) => analysis.alternatives[0]?.action.tileCodes?.[0]).filter(Boolean);
  if (!actions.length) return 0;
  const counts = new Map<string, number>();
  actions.forEach((action) => counts.set(action as string, (counts.get(action as string) ?? 0) + 1));
  return round(Math.max(...counts.values()) / analyses.length);
}
