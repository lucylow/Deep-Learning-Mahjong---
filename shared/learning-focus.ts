import type { AIOpponentDecision } from "./mahjong-backend";

export type LearningObjective = "speed" | "value" | "defense" | "score";

export type MistakePattern = {
  id: string;
  objective: LearningObjective;
  label: string;
  severity: "watch" | "practice" | "priority";
  sampleSize: number;
  averageConfidence: number;
  lowestConfidence: number;
  replayDecisionIndex: number;
  recommendation: string;
  drillTitle: string;
  signature: "over-pushing" | "narrowing-too-early" | "under-valuing" | "score-blindness" | "uncertainty";
  evidence: string;
};

export type CoachingPlan = {
  priority: MistakePattern;
  supportingPatterns: MistakePattern[];
  summary: string;
};

export type LearningFocus = {
  objective: LearningObjective;
  label: string;
  confidence: number;
  sampleSize: number;
  reason: string;
  nextDrill: string;
  replayDecisionIndex: number;
  replayAction: string;
};

const OBJECTIVE_LABELS: Record<LearningObjective, string> = {
  speed: "Speed and shape",
  value: "Value building",
  defense: "Defensive reading",
  score: "Score-aware decisions",
};

const DRILL_COPY: Record<LearningObjective, string> = {
  speed: "Practice choosing the discard that preserves the most useful draws without forcing a narrow route.",
  value: "Compare a fast tenpai line with a higher-value shape before committing to a discard.",
  defense: "Review one riichi position and identify the safest visible tile before chasing speed.",
  score: "Replay a decision while checking the score gap, dealer status, and whether the risk is justified.",
};

function round(value: number): number {
  return Number(value.toFixed(3));
}

export function buildLearningFocus(decisions: AIOpponentDecision[]): LearningFocus | null {
  if (!decisions.length) return null;
  const grouped = new Map<LearningObjective, { confidence: number; count: number }>();
  for (const decision of decisions) {
    if (!(decision.objective in OBJECTIVE_LABELS)) continue;
    const objective = decision.objective as LearningObjective;
    const current = grouped.get(objective) ?? { confidence: 0, count: 0 };
    current.confidence += decision.confidence;
    current.count += 1;
    grouped.set(objective, current);
  }
  if (!grouped.size) return null;
  const [objective, summary] = [...grouped.entries()].sort(([, left], [, right]) => {
    const confidenceDelta = left.confidence / left.count - right.confidence / right.count;
    return confidenceDelta || left.count - right.count;
  })[0];
  const confidence = round(summary.confidence / summary.count);
  const focusDecision = decisions.filter((decision) => decision.objective === objective).sort((left, right) => left.confidence - right.confidence)[0];
  const replayDecisionIndex = focusDecision ? decisions.indexOf(focusDecision) : -1;
  const replayAction = focusDecision ? `${focusDecision.action.type} · ${focusDecision.action.tileCodes?.[0] ?? "visible line"}` : "Review the lowest-confidence line";
  return {
    objective,
    label: OBJECTIVE_LABELS[objective],
    confidence,
    sampleSize: summary.count,
    reason: `Your recent Sensei decisions show the most uncertainty around ${OBJECTIVE_LABELS[objective].toLowerCase()} (${Math.round(confidence * 100)}% average confidence across ${summary.count} decision${summary.count === 1 ? "" : "s"}).`,
    nextDrill: DRILL_COPY[objective],
    replayDecisionIndex,
    replayAction,
  };
}

function classifySignature(decision: AIOpponentDecision): { signature: MistakePattern["signature"]; evidence: string; recommendation: string; drillTitle: string } {
  const danger = decision.contributions.find((item) => item.feature === "danger")?.rawValue ?? 0;
  const shape = decision.contributions.find((item) => item.feature === "shape")?.rawValue ?? 0;
  const value = decision.contributions.find((item) => item.feature === "value")?.rawValue ?? 0;
  const scorePressure = decision.contributions.find((item) => item.feature === "scorePressure")?.rawValue ?? 0;
  if (decision.objective === "defense" && danger >= 0.65) return { signature: "over-pushing", evidence: `The line still carries ${Math.round(danger * 100)}% visible danger while Sensei is evaluating a defensive objective.`, recommendation: "When a threat is active, compare the safest visible tile before preserving speed.", drillTitle: "Threat-first defense reset" };
  if (decision.objective === "speed" && shape < 0.35) return { signature: "narrowing-too-early", evidence: `The speed line leaves only ${Math.round(shape * 100)}% shape flexibility, which can strand the hand after one draw.`, recommendation: "Before choosing speed, reject lines that reduce the hand to one narrow route.", drillTitle: "Flexible shape reset" };
  if (decision.objective === "speed" && value >= 0.75) return { signature: "under-valuing", evidence: `The speed line discards a tile with ${Math.round(value * 100)}% value potential.`, recommendation: "Pause on high-value shapes and compare the scoring ceiling against the speed gain.", drillTitle: "Value detour calibration" };
  if (decision.objective === "score" && scorePressure < 0.35) return { signature: "score-blindness", evidence: "The selected score-aware line has weak score-pressure evidence for the current decision.", recommendation: "State the score gap and dealer context before accepting additional risk.", drillTitle: "Score-pressure checkpoint" };
  return { signature: "uncertainty", evidence: `Confidence is ${Math.round(decision.confidence * 100)}%; review the visible facts before committing.`, recommendation: DRILL_COPY[decision.objective], drillTitle: decision.objective === "speed" ? "Flexible shape reset" : decision.objective === "value" ? "Value detour calibration" : decision.objective === "defense" ? "Safe-tile threat reading" : "Score-pressure checkpoint" };
}

export function detectMistakePatterns(decisions: AIOpponentDecision[]): MistakePattern[] {
  const grouped = new Map<string, { objective: LearningObjective; confidence: number; count: number; lowest: number; index: number; sample: AIOpponentDecision }>();
  decisions.forEach((decision, index) => {
    if (!(decision.objective in OBJECTIVE_LABELS)) return;
    const objective = decision.objective as LearningObjective;
    const classification = classifySignature(decision);
    const key = `${objective}:${classification.signature}`;
    const current = grouped.get(key) ?? { objective, confidence: 0, count: 0, lowest: 1, index, sample: decision };
    current.confidence += decision.confidence;
    current.count += 1;
    if (decision.confidence < current.lowest) { current.lowest = decision.confidence; current.index = index; current.sample = decision; }
    grouped.set(key, current);
  });
  return [...grouped.entries()].map(([key, summary]) => {
    const classification = classifySignature(summary.sample);
    const objective = summary.objective;
    const averageConfidence = round(summary.confidence / summary.count);
    const severity: MistakePattern["severity"] = averageConfidence < 0.68 || summary.lowest < 0.55 ? "priority" : averageConfidence < 0.78 ? "practice" : "watch";
    return {
      id: `pattern-${key}`,
      objective,
      label: OBJECTIVE_LABELS[objective],
      severity,
      sampleSize: summary.count,
      averageConfidence,
      lowestConfidence: round(summary.lowest),
      replayDecisionIndex: summary.index,
      recommendation: classification.recommendation,
      drillTitle: classification.drillTitle,
      signature: classification.signature,
      evidence: classification.evidence,
    };
  }).sort((left, right) => left.averageConfidence - right.averageConfidence || right.sampleSize - left.sampleSize);
}

export function buildCoachingPlan(decisions: AIOpponentDecision[]): CoachingPlan | null {
  const patterns = detectMistakePatterns(decisions);
  const priority = patterns[0];
  if (!priority) return null;
  const summary = priority.severity === "priority"
    ? `Sensei found a repeatable ${priority.signature === "uncertainty" ? "uncertainty" : priority.signature.replaceAll("-", " ")} pattern in ${priority.label.toLowerCase()}. Start with ${priority.drillTitle.toLowerCase()} before changing your overall strategy.`
    : `Sensei is monitoring ${priority.label.toLowerCase()}. One focused drill can make the trade-off easier to recognize at the table.`;
  return { priority, supportingPatterns: patterns.slice(1, 3), summary };
}

export function learningFocusFromReplay(decisions: AIOpponentDecision[]): LearningFocus | null {
  return buildLearningFocus(decisions);
}

export { OBJECTIVE_LABELS };
