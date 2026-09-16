import type { AIOpponentDecision } from "./mahjong-backend";
import type { ConfidenceCalibration } from "./confidence-calibration";

export type ReplayCoachingSignal = {
  title: string;
  action: string;
  evidence: string;
  tone: "verify" | "trust" | "observe";
};

export function buildReplayCoachingSignal(decision: AIOpponentDecision, calibration: ConfidenceCalibration, outcome: 0 | 1 | null): ReplayCoachingSignal {
  const objectiveLabel = decision.objective === "speed" ? "shape" : decision.objective;
  const objective = calibration.byObjective.find((item) => item.objective === decision.objective);
  if (outcome === null) return { title: "Next decision check", action: `Name one visible ${objectiveLabel} fact before committing to the same line.`, evidence: `This decision carried ${Math.round(decision.confidence * 100)}% confidence, but its outcome is not observable yet.`, tone: "observe" };
  if (objective?.direction === "overconfident" && outcome === 0) return { title: "Verify before trusting", action: `For the next ${objectiveLabel} decision, state the danger or trade-off that could disprove the preferred line.`, evidence: `The line was ${Math.round(decision.confidence * 100)}% confident but did not produce the observed result; this objective is running overconfident across the current sample.`, tone: "verify" };
  if (objective?.direction === "underconfident" && outcome === 1) return { title: "Trust the supporting evidence", action: `When the same ${objectiveLabel} signals appear, keep the preferred line unless a new visible danger overrides them.`, evidence: `The line succeeded at ${Math.round(decision.confidence * 100)}% confidence while this objective is currently underconfident.`, tone: "trust" };
  return { title: "Calibrated replay", action: `Repeat the ${objectiveLabel} checklist and compare the preferred line with one counterfactual before acting.`, evidence: `The observed result matched the decision record closely enough to keep this reasoning pattern in rotation.`, tone: "observe" };
}
