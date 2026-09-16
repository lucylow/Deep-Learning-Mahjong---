import { invokeLLM } from "./_core/llm";
import type { ActionEnvelope, DecisionAlternative, DecisionAnalysis, GameState, PlayerSeat, TileCode } from "@/shared/mahjong-types";
import type { AIEvaluationReport, AIEvaluationResult, AIEvaluationScenario, AIPolicyBenchmark, AIContribution, AIOpponentDecision } from "@/shared/mahjong-backend";
import type { CoachingMode } from "@/shared/coaching-mode";
import { createGame, estimateUkeire, handShanten, legalActions } from "@/lib/mahjong-engine";
import { countTileCodes, isHonor, isSimple, isTerminal, tileNumber, tileSuit } from "@/lib/mahjong-tiles";

export type AIPolicy = "aggressive" | "balanced" | "defensive" | "human-like";

export interface DecisionFeatureVector {
  shantenAfter: number;
  ukeire: number;
  tileDanger: number;
  valuePotential: number;
  shapeFlexibility: number;
  scorePressure: number;
}

const POLICY_WEIGHTS: Record<AIPolicy, Record<keyof DecisionFeatureVector, number>> = {
  aggressive: { shantenAfter: -1.9, ukeire: 1.5, tileDanger: -0.2, valuePotential: 0.8, shapeFlexibility: 0.8, scorePressure: 0.3 },
  balanced: { shantenAfter: -2.0, ukeire: 1.2, tileDanger: -0.8, valuePotential: 0.7, shapeFlexibility: 1.0, scorePressure: 0.5 },
  defensive: { shantenAfter: -1.3, ukeire: 0.7, tileDanger: -1.8, valuePotential: 0.4, shapeFlexibility: 0.5, scorePressure: 0.8 },
  "human-like": { shantenAfter: -1.7, ukeire: 0.95, tileDanger: -0.95, valuePotential: 0.65, shapeFlexibility: 0.85, scorePressure: 0.65 },
};

function round(value: number) {
  return Number(value.toFixed(3));
}

function visibleTileCounts(state: GameState): Map<TileCode, number> {
  const visible = [...state.deadWall, ...state.dora.indicators];
  for (const player of state.players) visible.push(...player.discards.map((discard) => discard.tile), ...player.melds.flatMap((meld) => meld.tiles));
  return countTileCodes(visible);
}

function tileDangerScore(state: GameState, seat: PlayerSeat, code: TileCode): number {
  const visible = visibleTileCounts(state);
  const sameSuitDiscards = state.players.filter((player) => player.seat !== seat).flatMap((player) => player.discards).filter((discard) => tileSuit(discard.tile.code) === tileSuit(code)).length;
  const isGenbutsu = state.players.some((player) => player.seat !== seat && player.riichi && player.discards.some((discard) => discard.tile.code === code));
  const base = isHonor(code) ? 0.45 : isTerminal(code) ? 0.35 : 0.58;
  const visibilityRelief = Math.min(0.45, (visible.get(code) ?? 0) * 0.12 + sameSuitDiscards * 0.04);
  return round(Math.max(0, Math.min(1, base - visibilityRelief - (isGenbutsu ? 0.5 : 0))));
}

function valuePotential(tiles: ReturnType<typeof countTileCodes>, code: TileCode): number {
  const count = tiles.get(code) ?? 0;
  if (isHonor(code)) return count >= 2 ? 0.95 : 0.25;
  if (isTerminal(code)) return count >= 2 ? 0.7 : 0.35;
  return isSimple(code) ? 0.55 : 0.45;
}

function shapeFlexibility(tiles: ReturnType<typeof countTileCodes>, code: TileCode): number {
  if (isHonor(code)) return 0.15;
  const suit = tileSuit(code);
  const number = tileNumber(code);
  const neighbors = [number - 2, number - 1, number + 1, number + 2].filter((candidate) => candidate >= 1 && candidate <= 9).reduce((sum, candidate) => sum + (tiles.get(`${suit}${candidate}` as TileCode) ?? 0), 0);
  return round(Math.min(1, neighbors / 4));
}

function scoreFeatures(features: DecisionFeatureVector, policy: AIPolicy, coachingMode: CoachingMode = "balanced"): number {
  const base = POLICY_WEIGHTS[policy];
  const weights = coachingMode === "defensive"
    ? { ...base, tileDanger: base.tileDanger + 0.24, scorePressure: base.scorePressure - 0.08 }
    : coachingMode === "exploratory"
      ? { ...base, valuePotential: base.valuePotential + 0.16, shapeFlexibility: base.shapeFlexibility + 0.1, tileDanger: base.tileDanger - 0.1 }
      : base;
  return round((Object.keys(weights) as Array<keyof DecisionFeatureVector>).reduce((score, key) => score + features[key] * weights[key], 0));
}

function candidateDiscards(state: GameState, seat: PlayerSeat, policy: AIPolicy, coachingMode: CoachingMode = "balanced"): DecisionAlternative[] {
  const player = state.players[seat];
  const currentShanten = handShanten(player.hand);
  const counts = countTileCodes(player.hand);
  const scorePressure = player.score < 20_000 ? 0.8 : player.score > 30_000 ? 0.25 : 0.5;
  return player.hand.map((tile) => {
    const remaining = player.hand.filter((candidate) => candidate.id !== tile.id);
    const features: DecisionFeatureVector = {
      shantenAfter: handShanten(remaining),
      ukeire: estimateUkeire(remaining) / 23,
      tileDanger: tileDangerScore(state, seat, tile.code),
      valuePotential: valuePotential(counts, tile.code),
      shapeFlexibility: shapeFlexibility(counts, tile.code),
      scorePressure,
    };
    const objective: DecisionAlternative["objective"] = policy === "aggressive" ? "speed" : policy === "defensive" ? "defense" : features.valuePotential > 0.7 ? "value" : "speed";
    const score = scoreFeatures({ ...features, shantenAfter: features.shantenAfter - currentShanten }, policy, coachingMode);
    const confidence = Math.max(0.28, Math.min(0.94, 0.52 + Math.abs(score) / 8));
    return {
      action: { type: "discard" as const, seat, tileIds: [tile.id], tileCodes: [tile.code] },
      objective,
      confidence: round(confidence),
      rationale: objective === "defense"
        ? `Defense line: ${features.tileDanger < 0.3 ? "the discard is relatively safe from visible evidence" : "the safety cost is elevated"}; it preserves a fold path at ${features.shantenAfter} shanten with approximately ${Math.round(features.ukeire * 23)} useful draws.`
        : objective === "value"
          ? `Value line: the hand keeps ${Math.round(features.valuePotential * 100)}% value potential while accepting a speed trade-off at ${features.shantenAfter} shanten and ${Math.round(features.ukeire * 23)} useful draws.`
          : `Speed line: it reaches ${features.shantenAfter} shanten with approximately ${Math.round(features.ukeire * 23)} useful draws and ${Math.round(features.shapeFlexibility * 100)}% shape flexibility; review the danger estimate before committing.`,
      shantenAfter: features.shantenAfter,
      ukeire: Math.round(features.ukeire * 23),
      featureVector: features,
      score,
    } as DecisionAlternative & { featureVector: DecisionFeatureVector; score: number };
  }).sort((a, b) => (b as DecisionAlternative & { score: number }).score - (a as DecisionAlternative & { score: number }).score).slice(0, 4);
}

export function heuristicAnalysis(state: GameState, seat: PlayerSeat, policy: AIPolicy = "balanced", coachingMode: CoachingMode = "balanced"): DecisionAnalysis {
  const player = state.players[seat];
  const alternatives = candidateDiscards(state, seat, policy, coachingMode);
  const riichiOpponents = state.players.filter((candidate) => candidate.seat !== seat && candidate.riichi).length;
  const [top, runnerUp] = alternatives;
  const topFeatures = top as (DecisionAlternative & { featureVector?: DecisionFeatureVector; score?: number }) | undefined;
  const runnerUpFeatures = runnerUp as (DecisionAlternative & { score?: number }) | undefined;
  const topTile = top?.action.tileCodes?.[0];
  const runnerUpTile = runnerUp?.action.tileCodes?.[0];
  const confidenceGap = round(Math.max(0, (top?.confidence ?? 0) - (runnerUp?.confidence ?? 0)));
  const ukeireDelta = (top?.ukeire ?? 0) - (runnerUp?.ukeire ?? 0);
  const evidenceQuality = round(Math.min(1, 0.42 + Math.min(0.22, state.wall.length / 300) + Math.min(0.18, player.discards.length * 0.04) + Math.min(0.18, riichiOpponents * 0.09)));
  const confidenceBand: NonNullable<DecisionAnalysis["recommendationSummary"]>["confidenceBand"] = confidenceGap >= 0.12 && (top?.confidence ?? 0) >= 0.76 ? "decisive" : confidenceGap <= 0.05 || evidenceQuality < 0.52 ? "uncertain" : "close";
  const confidenceBasis = confidenceBand === "decisive"
    ? "The leading line has a meaningful separation from the runner-up and is supported by the visible state."
    : confidenceBand === "close"
      ? "The leading line is slightly ahead, but the runner-up remains a credible table choice."
      : "The visible evidence is incomplete or the top two lines are close; treat this as a study prompt, not a command.";
  const utilityDelta = round((topFeatures?.score ?? 0) - (runnerUpFeatures?.score ?? 0));
  const counterfactualLesson = top?.objective === "defense"
    ? "The counterfactual line may gain speed, but it spends more of the visible safety budget."
    : top?.objective === "value"
      ? "The counterfactual line reaches faster, but gives up part of the hand’s scoring ceiling."
      : "The counterfactual line is playable, but gives up useful-draw flexibility for a narrower benefit.";
  const riskNote = riichiOpponents > 0
    ? "Active riichi makes the risk estimate more fragile; confirm a visible safe tile before pushing."
    : player.score < 20_000
      ? "The score deficit creates a reason to accept measured risk, not to ignore danger signals."
      : "No immediate riichi threat is visible, so the main risk is committing too early to a narrow shape.";
  const keyTradeoff = top?.objective === "defense"
    ? "The recommendation prioritizes visible safety signals over maximum speed."
    : top?.objective === "value"
      ? "The recommendation preserves value potential while accepting a measured speed trade-off."
      : top?.objective === "score"
        ? "The recommendation responds to score pressure while preserving a playable hand shape."
        : "The recommendation prioritizes useful draws and flexible shape for faster development.";
  return {
    recommendationId: `heuristic-${state.id}-${state.turn}-${seat}-${policy}-${coachingMode}`,
    policyName: policy,
    observedFacts: [
      `Current player has ${player.hand.length} tiles in hand and ${player.score.toLocaleString()} points.`,
      `Current estimated shanten is ${handShanten(player.hand)} using a lightweight shape estimator; the leading line is ${topTile ?? "not available"}.`,
      `${riichiOpponents} visible opponents have declared riichi.`,
      `${state.wall.length} tiles remain in the live wall, so useful-draw estimates should be treated as directional rather than exact.`,
    ],
    inferredSignals: [
      { label: "Hand-shape flexibility", confidence: round(Math.min(0.92, 0.46 + (topFeatures?.featureVector?.shapeFlexibility ?? 0) * 0.45)) },
      { label: "Opponent danger estimate", confidence: round(riichiOpponents ? Math.min(0.86, 0.57 + riichiOpponents * 0.12) : 0.36) },
      { label: "Score pressure", confidence: round(player.score < 20_000 || player.score > 30_000 ? 0.63 : 0.42) },
    ],
    uncertainty: riichiOpponents > 1 ? "high" : "medium",
    alternatives,
    recommendationSummary: {
      recommendedTile: topTile,
      runnerUpTile,
      confidenceGap,
      ukeireDelta,
      keyTradeoff,
      confidenceBand,
      evidenceQuality,
      confidenceBasis,
      learningFocus: top?.objective ?? "speed",
      counterfactualLesson,
      riskNote,
      utilityDelta: Number.isFinite(utilityDelta) ? utilityDelta : 0,
    },
    disclaimer: "This is an estimate from visible state and a lightweight policy. It is not a guaranteed winning move and does not reveal concealed tiles.",
  };
}

export async function comparePolicies(state: GameState, seat: PlayerSeat, policies: AIPolicy[] = ["aggressive", "balanced", "defensive", "human-like"]): Promise<DecisionAnalysis[]> {
  return policies.map((policy) => heuristicAnalysis(state, seat, policy));
}

export function compareCoachingModes(state: GameState, seat: PlayerSeat): DecisionAnalysis[] {
  return (["defensive", "balanced", "exploratory"] as const).map((coachingMode) => heuristicAnalysis(state, seat, "balanced", coachingMode));
}

function isSafeExplanation(value: unknown): value is { explanation: string; uncertainty: DecisionAnalysis["uncertainty"] } {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  return typeof candidate.explanation === "string" && candidate.explanation.length >= 20 && candidate.explanation.length <= 700 && ["low", "medium", "high"].includes(String(candidate.uncertainty));
}

export async function explainAnalysisWithLLM(analysis: DecisionAnalysis): Promise<DecisionAnalysis> {
  try {
    const response = await invokeLLM({
      messages: [
        { role: "system", content: "You explain Mahjong AI recommendations. Never claim hidden tiles are known. Keep observed facts separate from inferences. Mention alternatives when useful. Return only the requested JSON." },
        { role: "user", content: JSON.stringify({ analysis }) },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "mahjong_explanation",
          strict: true,
          schema: {
            type: "object",
            properties: { explanation: { type: "string" }, uncertainty: { type: "string", enum: ["low", "medium", "high"] } },
            required: ["explanation", "uncertainty"],
            additionalProperties: false,
          },
        },
      },
    });
    const content = response.choices?.[0]?.message?.content;
    const parsed = typeof content === "string" ? JSON.parse(content) : null;
    if (!isSafeExplanation(parsed)) return analysis;
    return { ...analysis, disclaimer: `${parsed.explanation} ${analysis.disclaimer}`, uncertainty: parsed.uncertainty };
  } catch {
    return analysis;
  }
}

export async function getDecisionAnalysis(state: GameState, seat: PlayerSeat, policy: AIPolicy, useLLM = false, coachingMode: CoachingMode = "balanced"): Promise<DecisionAnalysis> {
  const base = heuristicAnalysis(state, seat, policy, coachingMode);
  return useLLM ? explainAnalysisWithLLM(base) : base;
}

export function validateAIAction(analysis: DecisionAnalysis, requested: ActionEnvelope): boolean {
  return analysis.alternatives.some((alternative) => alternative.action.type === requested.type && alternative.action.tileIds?.[0] === requested.tileIds?.[0]);
}

export function getFeatureContributions(state: GameState, seat: PlayerSeat, policy: AIPolicy): AIContribution[] {
  const analysis = heuristicAnalysis(state, seat, policy);
  const top = analysis.alternatives[0] as DecisionAlternative & { featureVector?: DecisionFeatureVector; score?: number } | undefined;
  if (!top?.featureVector) return [];
  const weights = POLICY_WEIGHTS[policy];
  const featureLabels: Record<keyof DecisionFeatureVector, AIContribution["feature"]> = {
    shantenAfter: "shanten",
    ukeire: "ukeire",
    tileDanger: "danger",
    valuePotential: "value",
    shapeFlexibility: "shape",
    scorePressure: "scorePressure",
  };
  return (Object.keys(weights) as Array<keyof DecisionFeatureVector>).map((key) => ({
    feature: featureLabels[key],
    rawValue: round(top.featureVector?.[key] ?? 0),
    weight: round(weights[key]),
    contribution: round((top.featureVector?.[key] ?? 0) * weights[key]),
    explanation: key === "tileDanger" ? "Estimated from visible discards and riichi information." : key === "shantenAfter" ? "Distance estimate after this discard." : key === "ukeire" ? "Approximate useful-draw flexibility." : key === "valuePotential" ? "Potential to preserve valuable tile patterns." : key === "shapeFlexibility" ? "Nearby tiles that preserve sequence options." : "Score situation pressure adjustment.",
  }));
}

export function evaluatePolicyScenarios(scenarios: AIEvaluationScenario[]): AIEvaluationResult[] {
  return scenarios.map((scenario) => {
    const first = heuristicAnalysis(createGameForScenario(scenario.seed), 0, scenario.policy as AIPolicy);
    const second = heuristicAnalysis(createGameForScenario(scenario.seed), 0, scenario.policy as AIPolicy);
    const top = first.alternatives[0];
    return {
      scenarioId: scenario.id,
      policy: scenario.policy,
      topActionId: top?.action.tileIds?.[0],
      topObjective: top?.objective,
      stableAcrossRuns: top?.action.tileIds?.[0] === second.alternatives[0]?.action.tileIds?.[0],
      agreementWithExpectedObjective: top?.objective === scenario.expectedTopObjective,
      contributions: getFeatureContributions(createGameForScenario(scenario.seed), 0, scenario.policy as AIPolicy),
      topConfidence: top?.confidence ?? 0,
    };
  });
}

export function benchmarkPolicies(seeds: number[], policies: AIPolicy[] = ["aggressive", "balanced", "defensive", "human-like"]): AIPolicyBenchmark {
  const byPolicy: AIPolicyBenchmark["byPolicy"] = {};
  for (const policy of policies) {
    const scenarios = seeds.map((seed, index) => ({ id: `${policy}-${seed}-${index}`, seed, policy, expectedTopObjective: policy === "defensive" ? "defense" : policy === "aggressive" ? "speed" : policy === "human-like" ? "value" : "score" } as AIEvaluationScenario));
    const results = evaluatePolicyScenarios(scenarios);
    byPolicy[policy] = {
      scenarios: results.length,
      stable: results.filter((result) => result.stableAcrossRuns).length,
      objectiveAgreement: results.filter((result) => result.agreementWithExpectedObjective).length,
      averageConfidence: results.length ? results.reduce((sum, result) => sum + (result.topConfidence ?? 0), 0) / results.length : 0,
    };
  }
  return { seeds, byPolicy };
}

export function chooseAIOpponentAction(state: GameState, seat: PlayerSeat, policy: AIPolicy = "balanced"): AIOpponentDecision {
  const legal = legalActions(state, seat).filter((action) => action.enabled);
  const analysis = heuristicAnalysis(state, seat, policy);
  const preferred = analysis.alternatives.find((alternative) => legal.some((action) => action.type === alternative.action.type && action.tileIds?.[0] === alternative.action.tileIds?.[0]));
  const fallback = legal[0];
  if (!preferred && !fallback) throw new Error("AI_NO_LEGAL_ACTION");
  const action = preferred?.action ?? { type: fallback.type, seat, tileIds: fallback.tileIds };
  return {
    policy,
    seat,
    action,
    rationale: preferred?.rationale ?? "The policy selected the first legal action because no ranked discard matched the current action set.",
    objective: preferred?.objective ?? "speed",
    confidence: preferred?.confidence ?? 0.25,
    contributions: getFeatureContributions(state, seat, policy),
    createdAt: new Date().toISOString(),
  };
}

export function aggregateEvaluationReport(results: AIEvaluationResult[]): AIEvaluationReport {
  const byPolicy: AIEvaluationReport["byPolicy"] = {};
  for (const result of results) {
    const entry = byPolicy[result.policy] ?? { scenarios: 0, stable: 0, agreement: 0 };
    entry.scenarios += 1;
    if (result.stableAcrossRuns) entry.stable += 1;
    if (result.agreementWithExpectedObjective) entry.agreement += 1;
    byPolicy[result.policy] = entry;
  }
  const totalScenarios = results.length;
  return {
    totalScenarios,
    stableScenarios: results.filter((result) => result.stableAcrossRuns).length,
    objectiveAgreement: totalScenarios ? results.filter((result) => result.agreementWithExpectedObjective).length / totalScenarios : 0,
    byPolicy,
  };
}

function createGameForScenario(seed: number): GameState {
  return requireGame(seed);
}

function requireGame(seed: number): GameState {
  // Kept behind a tiny helper so evaluation fixtures use the same deterministic constructor as gameplay.
  return createGame(seed);
}
