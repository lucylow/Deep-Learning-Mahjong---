import type { ActionEnvelope, DecisionAnalysis, GameState, PlayerSeat, ReviewMoment } from "./mahjong-types";

export interface MatchEvent {
  id: string;
  matchId: string;
  sequence: number;
  type: "match_created" | "action_submitted" | "state_snapshot" | "analysis_requested" | "ai_decision" | "hand_completed";
  actorSeat?: PlayerSeat;
  action?: ActionEnvelope;
  stateHash: string;
  createdAt: string;
}

export interface ReplaySnapshot {
  matchId: string;
  sequence: number;
  turn: number;
  state: GameState;
  stateHash: string;
}

export interface AIAnalysisRecord {
  id: string;
  matchId: string;
  turn: number;
  seat: PlayerSeat;
  policy: string;
  analysis: DecisionAnalysis;
  createdAt: string;
}

export interface ReviewMomentRecord extends ReviewMoment {
  matchId: string;
  stateHash: string;
  createdAt: string;
}

export interface PolicyComparison {
  matchId: string;
  turn: number;
  seat: PlayerSeat;
  analyses: DecisionAnalysis[];
  recommendationAgreement: number;
  note: string;
}

export interface MatchAuditBundle {
  matchId: string;
  events: MatchEvent[];
  snapshots: ReplaySnapshot[];
  analyses: AIAnalysisRecord[];
  aiDecisions: AIOpponentDecision[];
  reviewMoments: ReviewMomentRecord[];
}

export interface AIContribution {
  feature: "shanten" | "ukeire" | "danger" | "value" | "shape" | "scorePressure";
  rawValue: number;
  weight: number;
  contribution: number;
  explanation: string;
}

export interface AIExplanation {
  summary: string;
  visibleFacts: string[];
  inferredSignals: string[];
  alternatives: string[];
  uncertainty: "low" | "medium" | "high";
  disclaimer: string;
}

export interface AIEvaluationScenario {
  id: string;
  seed: number;
  policy: string;
  expectedTopObjective: "speed" | "value" | "defense" | "score";
}

export interface AIEvaluationResult {
  scenarioId: string;
  policy: string;
  topActionId?: string;
  topObjective?: string;
  stableAcrossRuns: boolean;
  agreementWithExpectedObjective: boolean;
  contributions: AIContribution[];
  topConfidence?: number;
}

export interface AIOpponentDecision {
  policy: string;
  seat: number;
  action: import("./mahjong-types").ActionEnvelope;
  rationale: string;
  objective: "speed" | "value" | "defense" | "score";
  confidence: number;
  contributions: AIContribution[];
  createdAt: string;
}

export interface AIEvaluationReport {
  totalScenarios: number;
  stableScenarios: number;
  objectiveAgreement: number;
  byPolicy: Record<string, { scenarios: number; stable: number; agreement: number }>;
}

export interface AIMatchReport {
  matchId: string;
  phase: string;
  stopReason?: string;
  decisions: number;
  bySeat: Record<string, { policy: string; decisions: number; averageConfidence: number; objectives: Record<string, number> }>;
  scores: Record<string, number>;
}

export interface AIPolicyBenchmark {
  seeds: number[];
  byPolicy: Record<string, { scenarios: number; stable: number; objectiveAgreement: number; averageConfidence: number }>;
}

export interface ReplayAnalytics {
  matchId: string;
  decisionCount: number;
  averageConfidence: number;
  bySeat: Record<string, { decisions: number; averageConfidence: number; objectives: Record<string, number> }>;
  byObjective: Record<string, number>;
  scoreContext: { phase: string; roundWind: string; handNumber: number; dealer: number; scores: Record<string, number> };
}

export interface StrategyChatMessage {
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

export interface StrategyChatResponse {
  answer: string;
  suggestions: string[];
  disclaimer: string;
  usedFallback: boolean;
}
