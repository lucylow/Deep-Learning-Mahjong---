import type { PracticeProgress } from "@/shared/guided-practice";
import type { MatchHistoryEntry } from "@/shared/match-history";
import type { AIEvaluationReport, AIAnalysisRecord, AIMatchReport, AIOpponentDecision, AIPolicyBenchmark, ReplayAnalytics, ReplaySnapshot } from "@/shared/mahjong-backend";
import type { ActionEnvelope, DecisionAnalysis, GameState, PlayerSeat, TileCode, TileInstance, Wind } from "@/shared/mahjong-types";

/**
 * Demo mode is intentionally deterministic and read-only. It gives preview users
 * meaningful screens before they have created a real match, without pretending
 * that the fixtures are server-backed user data.
 */
export const DEMO_MODE = process.env.EXPO_PUBLIC_DEMO_MODE === "true";

export type DemoBenchmarkRun = AIPolicyBenchmark & {
  id: string;
  createdAt: string;
};

export const DEMO_REVIEW_MATCH_ID = "demo-match-04";

export const DEMO_MATCH_HISTORY: MatchHistoryEntry[] = [
  { id: "demo-match-04", createdAt: "2026-08-15T18:42:00.000Z", seed: 4421, label: "Balanced table · East 1" },
];

const policyMetrics = (confidence: number, agreement: number, stable: number) => ({
  scenarios: 12,
  stable,
  objectiveAgreement: agreement,
  averageConfidence: confidence,
});

export const DEMO_BENCHMARK_HISTORY: DemoBenchmarkRun[] = [
  {
    id: "demo-benchmark-06",
    createdAt: "2026-08-15T18:50:00.000Z",
    seeds: [4421, 3817, 2754],
    byPolicy: {
      aggressive: policyMetrics(0.76, 0.83, 11),
      balanced: policyMetrics(0.84, 0.92, 12),
      defensive: policyMetrics(0.79, 0.88, 12),
      "human-like": policyMetrics(0.81, 0.86, 11),
    },
  },
];

const demoDiscard = (seat: 0 | 1 | 2 | 3, tile: TileCode): ActionEnvelope => ({ type: "discard", seat, tileCodes: [tile], tsumogiri: false });

const demoContributions = (shape: number, ukeire: number, danger: number, value: number, explanation: string) => [
  { feature: "shape" as const, rawValue: shape, weight: 0.35, contribution: shape * 0.35, explanation },
  { feature: "ukeire" as const, rawValue: ukeire, weight: 0.3, contribution: ukeire * 0.3, explanation: "The flexible line keeps more useful draws available." },
  { feature: "danger" as const, rawValue: danger, weight: 0.2, contribution: danger * 0.2, explanation: "Visible discards reduce, but do not eliminate, threat uncertainty." },
  { feature: "value" as const, rawValue: value, weight: 0.15, contribution: value * 0.15, explanation: "The scoring route remains plausible without overcommitting." },
];

const demoAnalysis = (turn: number, policyName: string, recommendedTile: TileCode, runnerUpTile: TileCode, objective: "speed" | "value" | "defense" | "score", rationale: string): DecisionAnalysis => ({
  recommendationId: `demo-analysis-${turn}-${policyName}`,
  policyName,
  observedFacts: ["No opponent riichi declaration is visible in this snapshot.", "The hand retains one connected two-sided shape.", "The discard preserves a safe fallback tile."],
  inferredSignals: [{ label: "Flexible shape", confidence: 0.88 }, { label: "Moderate value ceiling", confidence: 0.72 }],
  uncertainty: objective === "defense" ? "medium" : "low",
  alternatives: [
    { action: demoDiscard(0, recommendedTile), objective, confidence: 0.86, rationale, shantenAfter: 1, ukeire: 8 },
    { action: demoDiscard(0, runnerUpTile), objective: objective === "speed" ? "value" : "speed", confidence: 0.69, rationale: "This line is playable, but gives up a little flexibility for a narrower upside.", shantenAfter: 1, ukeire: 6 },
  ],
  recommendationSummary: { recommendedTile, runnerUpTile, confidenceGap: 0.17, ukeireDelta: 2, keyTradeoff: rationale },
  disclaimer: "Demo explanation based on visible sample facts only; hidden tiles are not inferred.",
});

export const DEMO_DECISIONS: AIOpponentDecision[] = [
  { policy: "balanced", seat: 0, action: demoDiscard(0, "m9"), rationale: "Release the isolated terminal while keeping the 23 and 45 shape connected.", objective: "speed", confidence: 0.86, contributions: demoContributions(0.9, 0.85, 0.2, 0.55, "The isolated terminal is the least costly way to preserve flexible draws."), createdAt: "2026-08-15T18:42:12.000Z" },
  { policy: "balanced", seat: 0, action: demoDiscard(0, "p1"), rationale: "The one-pin is redundant with the safer central shape and does not improve the current value route.", objective: "speed", confidence: 0.82, contributions: demoContributions(0.82, 0.8, 0.22, 0.5, "A central shape remains available after removing the redundant edge tile."), createdAt: "2026-08-15T18:42:30.000Z" },
  { policy: "value", seat: 0, action: demoDiscard(0, "s9"), rationale: "Keep the pair potential and preserve a possible dora-aware upgrade before committing to speed.", objective: "value", confidence: 0.74, contributions: demoContributions(0.68, 0.63, 0.3, 0.92, "The value policy accepts a small draw-count cost for a higher scoring ceiling."), createdAt: "2026-08-15T18:42:48.000Z" },
  { policy: "defense", seat: 0, action: demoDiscard(0, "z6"), rationale: "Honor the visible safety cue and keep the connected suit tiles available while threats develop.", objective: "defense", confidence: 0.79, contributions: demoContributions(0.66, 0.58, 0.94, 0.42, "The safety signal is stronger than the small speed loss in this sample state."), createdAt: "2026-08-15T18:43:06.000Z" },
  { policy: "human-like", seat: 0, action: demoDiscard(0, "m9"), rationale: "A practical table player would preserve options and avoid paying a large price for a speculative upgrade.", objective: "score", confidence: 0.77, contributions: demoContributions(0.8, 0.76, 0.45, 0.68, "This compromise line keeps the hand readable and avoids an irreversible commitment."), createdAt: "2026-08-15T18:43:24.000Z" },
  { policy: "balanced", seat: 0, action: demoDiscard(0, "p9"), rationale: "The final edge discard reaches the cleanest wait while retaining a safe follow-up option.", objective: "speed", confidence: 0.9, contributions: demoContributions(0.94, 0.91, 0.25, 0.6, "The hand now reaches a broad wait with the fewest visible compromises."), createdAt: "2026-08-15T18:43:42.000Z" },
];

export const DEMO_ANALYSIS_HISTORY: AIAnalysisRecord[] = DEMO_DECISIONS.map((decision, index) => ({
  id: `demo-analysis-record-${index + 1}`,
  matchId: DEMO_REVIEW_MATCH_ID,
  turn: index + 4,
  seat: 0,
  policy: decision.policy,
  analysis: demoAnalysis(index + 4, decision.policy, decision.action.tileCodes?.[0] ?? "m9", index % 2 ? "m9" : "p1", decision.objective, decision.rationale),
  createdAt: decision.createdAt,
}));

const demoTile = (code: TileCode, copy: number): TileInstance => ({ id: `demo-${code}-${copy}`, code, copy, red: false });

const demoPlayer = (seat: PlayerSeat, score: number, handCodes: TileCode[]): GameState["players"][number] => ({
  seat,
  displayName: seat === 0 ? "You" : `Demo seat ${seat + 1}`,
  wind: (["east", "south", "west", "north"] as Wind[])[seat],
  score,
  hand: handCodes.map((code, index) => demoTile(code, index + 1)),
  melds: [],
  discards: [],
  riichi: false,
  connected: true,
});

const demoState = (sequence: number, turn: number, scores: [number, number, number, number], wallCount: number): GameState => ({
  id: DEMO_REVIEW_MATCH_ID,
  ruleSet: "riichi",
  phase: "playing",
  roundWind: "east",
  handNumber: 1,
  honba: 0,
  riichiSticks: 0,
  dealer: 0,
  currentSeat: 0,
  wall: Array.from({ length: wallCount }, (_, index) => demoTile("m1", index + 1)),
  deadWall: Array.from({ length: 14 }, (_, index) => demoTile("z1", index + 1)),
  dora: { indicators: [demoTile("p5", 1)], revealed: [demoTile("p6", 1)] },
  players: [
    demoPlayer(0, scores[0], ["m2", "m3", "m4", "m5", "m6", "p2", "p3", "p4", "s4", "s5", "s6", "z1", "z1"]),
    demoPlayer(1, scores[1], ["m1", "m1", "m7", "m8", "p4", "p5", "p6", "s2", "s3", "s4", "z2", "z3", "z4"]),
    demoPlayer(2, scores[2], ["m2", "m3", "m4", "p1", "p2", "p3", "p7", "p8", "p9", "s5", "s6", "s7", "z5"]),
    demoPlayer(3, scores[3], ["m5", "m6", "m7", "p2", "p3", "p4", "s1", "s2", "s3", "s7", "s8", "s9", "z6"]),
  ],
  turn,
  seed: 4421,
});

export const DEMO_REPLAY_SNAPSHOTS: ReplaySnapshot[] = [
  { matchId: DEMO_REVIEW_MATCH_ID, sequence: 1, turn: 4, state: demoState(1, 4, [25000, 25000, 25000, 25000], 64), stateHash: "demo-a1f4" },
  { matchId: DEMO_REVIEW_MATCH_ID, sequence: 2, turn: 7, state: demoState(2, 7, [25000, 25000, 25000, 25000], 61), stateHash: "demo-b7c2" },
  { matchId: DEMO_REVIEW_MATCH_ID, sequence: 3, turn: 10, state: demoState(3, 10, [24300, 25700, 25000, 25000], 58), stateHash: "demo-c9e1" },
  { matchId: DEMO_REVIEW_MATCH_ID, sequence: 4, turn: 12, state: demoState(4, 12, [25100, 24900, 25000, 25000], 56), stateHash: "demo-d4aa" },
];

export const DEMO_REPLAY_ANALYTICS: ReplayAnalytics = {
  matchId: DEMO_REVIEW_MATCH_ID,
  decisionCount: DEMO_DECISIONS.length,
  averageConfidence: 0.813,
  bySeat: { "0": { decisions: 6, averageConfidence: 0.813, objectives: { speed: 3, value: 1, defense: 1, score: 1 } } },
  byObjective: { speed: 3, value: 1, defense: 1, score: 1 },
  scoreContext: { phase: "East 1 · turn 12", roundWind: "east", handNumber: 1, dealer: 0, scores: { "0": 25000, "1": 25000, "2": 25000, "3": 25000 } },
};

export const DEMO_MATCH_REPORT: AIMatchReport = {
  matchId: DEMO_REVIEW_MATCH_ID,
  phase: "hand_complete",
  stopReason: "Demo replay sample",
  decisions: DEMO_DECISIONS.length,
  bySeat: { "0": { policy: "balanced", decisions: 6, averageConfidence: 0.813, objectives: { speed: 3, value: 1, defense: 1, score: 1 } } },
  scores: { "0": 25000, "1": 25000, "2": 25000, "3": 25000 },
};

export const DEMO_EVALUATION_REPORT: AIEvaluationReport = {
  totalScenarios: 12,
  stableScenarios: 11,
  objectiveAgreement: 0.92,
  byPolicy: { balanced: { scenarios: 12, stable: 12, agreement: 0.92 }, aggressive: { scenarios: 12, stable: 10, agreement: 0.83 }, defensive: { scenarios: 12, stable: 12, agreement: 0.88 }, "human-like": { scenarios: 12, stable: 11, agreement: 0.86 } },
};

export function demoBenchmarkCount(): number {
  return DEMO_MODE ? DEMO_BENCHMARK_HISTORY.length : 0;
}

export function demoHistoryEntries(): MatchHistoryEntry[] {
  return DEMO_MODE ? DEMO_MATCH_HISTORY.map((entry) => ({ ...entry })) : [];
}

