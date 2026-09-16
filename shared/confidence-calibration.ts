import type { AIOpponentDecision } from "./mahjong-backend";
import type { GameState, PlayerSeat } from "./mahjong-types";
import type { LearningObjective } from "./learning-focus";

export type CalibrationBucket = {
  label: "low" | "medium" | "high";
  minimumConfidence: number;
  maximumConfidence: number;
  decisions: number;
  observedSuccessRate: number;
  averageConfidence: number;
  gap: number;
};

export type ObjectiveCalibration = {
  objective: LearningObjective;
  decisions: number;
  observedDecisions: number;
  averageConfidence: number;
  observedSuccessRate: number;
  calibrationGap: number;
  direction: "overconfident" | "underconfident" | "aligned" | "pending";
  coaching: string;
};

export type CalibrationHistoryEntry = {
  matchId: string;
  completedAt: string;
  averageConfidence: number;
  observedSuccessRate: number;
  calibrationGap: number;
  byObjective: ObjectiveCalibration[];
};

export type ConfidenceCalibration = {
  status: "pending" | "observed";
  totalDecisions: number;
  observedDecisions: number;
  overallSuccessRate: number;
  averageConfidence: number;
  calibrationGap: number;
  coaching: string;
  buckets: CalibrationBucket[];
  byObjective: ObjectiveCalibration[];
};

const BUCKETS = [
  { label: "low" as const, minimumConfidence: 0, maximumConfidence: 0.59 },
  { label: "medium" as const, minimumConfidence: 0.6, maximumConfidence: 0.79 },
  { label: "high" as const, minimumConfidence: 0.8, maximumConfidence: 1 },
];

function round(value: number): number {
  return Number(value.toFixed(3));
}

export function normalizeCalibrationHistory(value: unknown): CalibrationHistoryEntry[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is CalibrationHistoryEntry => Boolean(item && typeof item === "object" && typeof (item as Record<string, unknown>).matchId === "string" && typeof (item as Record<string, unknown>).completedAt === "string" && typeof (item as Record<string, unknown>).calibrationGap === "number")).slice(-12);
}

export function appendCalibrationHistory(history: CalibrationHistoryEntry[], entry: CalibrationHistoryEntry, limit = 12): CalibrationHistoryEntry[] {
  const next = [...history.filter((item) => item.matchId !== entry.matchId), entry];
  return next.slice(-Math.max(1, limit));
}

export function buildCalibrationSparkline(history: CalibrationHistoryEntry[], limit = 8): number[] {
  return history.slice(-Math.max(1, limit)).map((entry) => Math.max(-1, Math.min(1, entry.calibrationGap)));
}

export function buildCalibrationHistorySummary(history: CalibrationHistoryEntry[]) {
  if (!history.length) return { direction: "pending" as const, delta: 0, detail: "Complete another reviewed hand to establish a calibration trend." };
  if (history.length < 2) return { direction: "baseline" as const, delta: 0, detail: "This is Sensei’s first calibration point. The next completed review will show whether the gap is persistent." };
  const first = history[0];
  const latest = history[history.length - 1];
  const delta = round(latest.calibrationGap - first.calibrationGap);
  return { direction: delta <= -0.06 ? "improving" as const : delta >= 0.06 ? "worsening" as const : "stable" as const, delta, detail: delta <= -0.06 ? "The confidence gap is narrowing across reviews." : delta >= 0.06 ? "The confidence gap is widening; use more visible-fact checks." : "The confidence gap is stable across recent reviews." };
}

export function deriveObservedOutcome(decision: AIOpponentDecision, finalState?: GameState): 0 | 1 | null {
  if (!finalState?.result || finalState.winner === undefined) return null;
  return finalState.winner === (decision.seat as PlayerSeat) ? 1 : 0;
}

export function buildConfidenceCalibration(decisions: AIOpponentDecision[], finalState?: GameState): ConfidenceCalibration {
  const observations = decisions.map((decision) => ({ decision, outcome: deriveObservedOutcome(decision, finalState) })).filter((entry): entry is { decision: AIOpponentDecision; outcome: 0 | 1 } => entry.outcome !== null);
  const averageConfidence = decisions.length ? round(decisions.reduce((sum, decision) => sum + decision.confidence, 0) / decisions.length) : 0;
  const overallSuccessRate = observations.length ? round(observations.reduce((sum, entry) => sum + entry.outcome, 0) / observations.length) : 0;
  const calibrationGap = observations.length ? round(averageConfidence - overallSuccessRate) : 0;
  const buckets = BUCKETS.map((bucket) => {
    const entries = observations.filter(({ decision }) => decision.confidence >= bucket.minimumConfidence && decision.confidence <= bucket.maximumConfidence);
    const bucketConfidence = entries.length ? round(entries.reduce((sum, entry) => sum + entry.decision.confidence, 0) / entries.length) : 0;
    const successRate = entries.length ? round(entries.reduce((sum, entry) => sum + entry.outcome, 0) / entries.length) : 0;
    return { ...bucket, decisions: entries.length, observedSuccessRate: successRate, averageConfidence: bucketConfidence, gap: entries.length ? round(bucketConfidence - successRate) : 0 };
  });
  const byObjective = (["speed", "value", "defense", "score"] as LearningObjective[]).map((objective) => {
    const objectiveDecisions = decisions.filter((decision) => decision.objective === objective);
    const objectiveObservations = observations.filter(({ decision }) => decision.objective === objective);
    const objectiveConfidence = objectiveDecisions.length ? round(objectiveDecisions.reduce((sum, decision) => sum + decision.confidence, 0) / objectiveDecisions.length) : 0;
    const objectiveSuccess = objectiveObservations.length ? round(objectiveObservations.reduce((sum, entry) => sum + entry.outcome, 0) / objectiveObservations.length) : 0;
    const objectiveGap = objectiveObservations.length ? round(objectiveConfidence - objectiveSuccess) : 0;
    const direction: ObjectiveCalibration["direction"] = !objectiveObservations.length ? "pending" : Math.abs(objectiveGap) < 0.12 ? "aligned" : objectiveGap > 0 ? "overconfident" : "underconfident";
    const coaching = direction === "overconfident" ? "Use one extra visible-fact check before trusting this objective." : direction === "underconfident" ? "Review the strongest supporting fact; this objective may be performing better than Sensei expects." : direction === "aligned" ? "Confidence and observed results are tracking together." : "Collect a completed result for this objective before changing the drill plan.";
    return { objective, decisions: objectiveDecisions.length, observedDecisions: objectiveObservations.length, averageConfidence: objectiveConfidence, observedSuccessRate: objectiveSuccess, calibrationGap: objectiveGap, direction, coaching };
  });
  const coaching = !observations.length
    ? "Sensei will calibrate confidence after the hand produces an observable result."
    : Math.abs(calibrationGap) < 0.12
      ? "Confidence is tracking the observed result rate. Keep using the explanation and visible evidence together."
      : calibrationGap > 0
        ? `Sensei is running ${Math.round(calibrationGap * 100)} points more confident than the observed result rate. Treat decisive language as a study prompt and verify the counterfactual.`
        : `Sensei is running ${Math.round(Math.abs(calibrationGap) * 100)} points less confident than the observed result rate. Review which visible signals were stronger than the model expected.`;
  return { status: observations.length ? "observed" : "pending", totalDecisions: decisions.length, observedDecisions: observations.length, overallSuccessRate, averageConfidence, calibrationGap, coaching, buckets, byObjective };
}
