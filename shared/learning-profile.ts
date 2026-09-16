import type { AIOpponentDecision } from "./mahjong-backend";
import type { LearningObjective } from "./learning-focus";

export type ProfileObjectiveSummary = {
  decisions: number;
  confidence: number;
  recentConfidence: number;
};

export type LearningProfileMatch = {
  matchId: string;
  completedAt: string;
  decisionCount: number;
  averageConfidence: number;
  byObjective: Partial<Record<LearningObjective, number>>;
};

export type LearningProfile = {
  version: 1;
  matches: LearningProfileMatch[];
  byObjective: Record<LearningObjective, ProfileObjectiveSummary>;
  updatedAt?: string;
};

export type ProfileDrillRecommendation = {
  objective: LearningObjective;
  label: string;
  rationale: string;
  challengeReady: boolean;
  challengeTitle: string;
  nextStep: string;
  confidenceTarget: number;
};

export type ProfileObjectiveTrend = {
  objective: LearningObjective;
  label: string;
  matchCount: number;
  averageConfidence: number;
  recentConfidence: number;
  delta: number;
  direction: "improving" | "persistent" | "watching" | "insufficient-data";
  coaching: string;
  nextAction: string;
};

export const DEFAULT_LEARNING_PROFILE: LearningProfile = {
  version: 1,
  matches: [],
  byObjective: {
    speed: { decisions: 0, confidence: 0, recentConfidence: 0 },
    value: { decisions: 0, confidence: 0, recentConfidence: 0 },
    defense: { decisions: 0, confidence: 0, recentConfidence: 0 },
    score: { decisions: 0, confidence: 0, recentConfidence: 0 },
  },
};

const OBJECTIVES: LearningObjective[] = ["speed", "value", "defense", "score"];

function round(value: number): number {
  return Number(value.toFixed(3));
}

function emptySummary(): Record<LearningObjective, ProfileObjectiveSummary> {
  return {
    speed: { decisions: 0, confidence: 0, recentConfidence: 0 },
    value: { decisions: 0, confidence: 0, recentConfidence: 0 },
    defense: { decisions: 0, confidence: 0, recentConfidence: 0 },
    score: { decisions: 0, confidence: 0, recentConfidence: 0 },
  };
}

export function normalizeLearningProfile(value: unknown): LearningProfile {
  if (!value || typeof value !== "object") return DEFAULT_LEARNING_PROFILE;
  const raw = value as Record<string, unknown>;
  const rawMatches = Array.isArray(raw.matches) ? raw.matches : [];
  const matches = rawMatches.filter((item): item is Record<string, unknown> => Boolean(item && typeof item === "object")).map((item) => ({
    matchId: typeof item.matchId === "string" ? item.matchId : "unknown-match",
    completedAt: typeof item.completedAt === "string" ? item.completedAt : new Date(0).toISOString(),
    decisionCount: typeof item.decisionCount === "number" && Number.isFinite(item.decisionCount) ? Math.max(0, Math.min(999, Math.floor(item.decisionCount))) : 0,
    averageConfidence: typeof item.averageConfidence === "number" && Number.isFinite(item.averageConfidence) ? Math.max(0, Math.min(1, item.averageConfidence)) : 0,
    byObjective: item.byObjective && typeof item.byObjective === "object" ? item.byObjective as Partial<Record<LearningObjective, number>> : {},
  })).slice(-20);
  const byObjective = emptySummary();
  for (const objective of OBJECTIVES) {
    const item = raw.byObjective && typeof raw.byObjective === "object" ? (raw.byObjective as Record<string, unknown>)[objective] : undefined;
    const candidate = item && typeof item === "object" ? item as Record<string, unknown> : {};
    const decisions = typeof candidate.decisions === "number" && Number.isFinite(candidate.decisions) ? Math.max(0, Math.min(9999, Math.floor(candidate.decisions))) : 0;
    const confidence = typeof candidate.confidence === "number" && Number.isFinite(candidate.confidence) ? Math.max(0, Math.min(1, candidate.confidence)) : 0;
    const recentConfidence = typeof candidate.recentConfidence === "number" && Number.isFinite(candidate.recentConfidence) ? Math.max(0, Math.min(1, candidate.recentConfidence)) : confidence;
    byObjective[objective] = { decisions, confidence: round(confidence), recentConfidence: round(recentConfidence) };
  }
  return { version: 1, matches, byObjective, updatedAt: typeof raw.updatedAt === "string" ? raw.updatedAt : undefined };
}

export function profileEntryFromDecisions(matchId: string, decisions: AIOpponentDecision[], completedAt = new Date().toISOString()): LearningProfileMatch {
  const byObjective: Partial<Record<LearningObjective, number>> = {};
  for (const objective of OBJECTIVES) {
    const items = decisions.filter((decision) => decision.objective === objective);
    if (items.length) byObjective[objective] = round(items.reduce((sum, item) => sum + item.confidence, 0) / items.length);
  }
  return { matchId, completedAt, decisionCount: decisions.length, averageConfidence: round(decisions.length ? decisions.reduce((sum, item) => sum + item.confidence, 0) / decisions.length : 0), byObjective };
}

export function recordLearningProfilePractice(profile: LearningProfile, objective: "shape" | "defense" | "value", correct: boolean, scenarioId: string, completedAt = new Date().toISOString()): LearningProfile {
  const mappedObjective: LearningObjective = objective === "shape" ? "speed" : objective;
  const confidence = correct ? 0.9 : 0.45;
  return recordLearningProfileMatch(profile, { matchId: `practice:${scenarioId}:${completedAt}`, completedAt, decisionCount: 1, averageConfidence: confidence, byObjective: { [mappedObjective]: confidence } });
}

export function recordLearningProfileMatch(profile: LearningProfile, entry: LearningProfileMatch): LearningProfile {
  const matches = [...profile.matches.filter((item) => item.matchId !== entry.matchId), entry].slice(-20);
  const byObjective = emptySummary();
  for (const match of matches) {
    for (const objective of OBJECTIVES) {
      const confidence = match.byObjective[objective];
      if (typeof confidence !== "number") continue;
      const current = byObjective[objective];
      current.decisions += 1;
      current.confidence += confidence;
    }
  }
  for (const objective of OBJECTIVES) {
    const values = matches.map((match) => match.byObjective[objective]).filter((value): value is number => typeof value === "number");
    const current = byObjective[objective];
    current.confidence = current.decisions ? round(current.confidence / current.decisions) : 0;
    current.recentConfidence = values.length ? round(values.slice(-3).reduce((sum, value) => sum + value, 0) / Math.min(3, values.length)) : 0;
  }
  return { version: 1, matches, byObjective, updatedAt: entry.completedAt };
}

export function weakestProfileObjective(profile: LearningProfile): LearningObjective {
  const observed = OBJECTIVES.filter((objective) => profile.byObjective[objective].decisions > 0);
  const candidates = observed.length ? observed : OBJECTIVES;
  return [...candidates].sort((left, right) => profile.byObjective[left].recentConfidence - profile.byObjective[right].recentConfidence || profile.byObjective[left].decisions - profile.byObjective[right].decisions || left.localeCompare(right))[0];
}

export function buildProfileObjectiveTrends(profile: LearningProfile): ProfileObjectiveTrend[] {
  const labels: Record<LearningObjective, string> = { speed: "Shape and speed", value: "Value building", defense: "Defensive reading", score: "Score-aware play" };
  return OBJECTIVES.map((objective) => {
    const values = profile.matches.map((match) => match.byObjective[objective]).filter((value): value is number => typeof value === "number");
    const recentValues = values.slice(-3);
    const recentConfidence = recentValues.length ? round(recentValues.reduce((sum, value) => sum + value, 0) / recentValues.length) : 0;
    const earlierValues = values.slice(0, Math.max(0, values.length - recentValues.length));
    const earlierConfidence = earlierValues.length ? earlierValues.reduce((sum, value) => sum + value, 0) / earlierValues.length : recentConfidence;
    const delta = round(recentConfidence - earlierConfidence);
    const direction: ProfileObjectiveTrend["direction"] = values.length < 2 ? "insufficient-data" : delta >= 0.06 ? "improving" : delta <= -0.06 ? "persistent" : "watching";
    const coaching = direction === "persistent" ? `${labels[objective]} remains below its earlier profile level. Repeat the same visible-facts drill before increasing risk.` : direction === "improving" ? `${labels[objective]} is improving across recent matches. Keep the same checklist for one more replay.` : direction === "insufficient-data" ? "Collect one more completed replay before treating this as a stable pattern." : "The recent signal is stable; compare this objective against the table context before changing strategy.";
    const nextAction = direction === "persistent" ? `Replay two ${labels[objective].toLowerCase()} decisions and name the missing visible fact.` : direction === "improving" ? `Test one controlled ${labels[objective].toLowerCase()} challenge.` : `Collect ${Math.max(1, 2 - values.length)} more ${labels[objective].toLowerCase()} replay${Math.max(1, 2 - values.length) === 1 ? "" : "s"}.`;
    return { objective, label: labels[objective], matchCount: values.length, averageConfidence: profile.byObjective[objective].confidence, recentConfidence, delta, direction, coaching, nextAction };
  }).sort((left, right) => left.recentConfidence - right.recentConfidence || left.matchCount - right.matchCount);
}

export function buildProfileDrillRecommendation(profile: LearningProfile): ProfileDrillRecommendation {
  const objective = weakestProfileObjective(profile);
  const summary = profile.byObjective[objective];
  const labels: Record<LearningObjective, string> = { speed: "Shape and speed", value: "Value building", defense: "Defensive reading", score: "Score-aware play" };
  const label = labels[objective];
  const rationale = summary.decisions
    ? `${label} is the lowest observed profile signal at ${Math.round(summary.recentConfidence * 100)}% recent confidence across ${summary.decisions} replay${summary.decisions === 1 ? "" : "s"}. Start with visible facts before adding risk.`
    : `Sensei has not observed enough ${label.toLowerCase()} decisions yet. Use a Foundations drill to establish a reliable baseline.`;
  const confidenceTarget = summary.decisions < 2 ? 0.65 : summary.recentConfidence < 0.6 ? 0.72 : 0.8;
  const challengeReady = summary.decisions >= 2 && summary.recentConfidence >= 0.78;
  const nextStep = challengeReady
    ? `Try one controlled-risk challenge, then compare your line with the ${label.toLowerCase()} policy.`
    : `Complete ${Math.max(1, 3 - summary.decisions)} more ${label.toLowerCase()} decision${Math.max(1, 3 - summary.decisions) === 1 ? "" : "s"} and aim for ${Math.round(confidenceTarget * 100)}% confidence.`;
  return { objective, label, rationale, challengeReady, challengeTitle: challengeReady ? `Challenge ${label.toLowerCase()}` : `Build ${label.toLowerCase()} confidence`, nextStep, confidenceTarget };
}
