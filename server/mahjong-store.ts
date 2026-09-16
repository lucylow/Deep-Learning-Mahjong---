import type { ActionEnvelope, DecisionAnalysis, GameState, PlayerSeat } from "@/shared/mahjong-types";
import type { CoachingMode } from "@/shared/coaching-mode";
import type { AIAnalysisRecord, AIMatchReport, AIOpponentDecision, MatchAuditBundle, MatchEvent, PolicyComparison, ReplayAnalytics, ReplaySnapshot, ReviewMomentRecord } from "@/shared/mahjong-backend";
import { applyAction, createGame, legalActions } from "@/lib/mahjong-engine";
import { resolveHandEnd } from "@/lib/mahjong-match";
import { advanceAfterHand } from "@/lib/mahjong-round";
import { chooseAIOpponentAction, getDecisionAnalysis, type AIPolicy } from "./mahjong-ai";
import { persistMahjongAIDecision, persistMahjongAnalysis, persistMahjongEvent, persistMahjongMatch, persistMahjongReviewMoment } from "./db";
import { devLog } from "../lib/_core/dev-log";

const matches = new Map<string, GameState>();
const audits = new Map<string, MatchAuditBundle>();
const matchOwners = new Map<string, number | undefined>();

function stableHash(value: unknown): string {
  const text = JSON.stringify(value);
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

function now() {
  return new Date().toISOString();
}

function snapshot(state: GameState, sequence: number): ReplaySnapshot {
  return { matchId: state.id, sequence, turn: state.turn, state: structuredClone(state), stateHash: stableHash(state) };
}

function appendEvent(state: GameState, event: Omit<MatchEvent, "id" | "matchId" | "sequence" | "stateHash" | "createdAt">) {
  const audit = audits.get(state.id);
  if (!audit) throw new Error("AUDIT_NOT_FOUND");
  const sequence = audit.events.length + 1;
  const record = { ...event, id: `${state.id}-event-${sequence}`, matchId: state.id, sequence, stateHash: stableHash(state), createdAt: now() };
  audit.events.push(record);
  audit.snapshots.push(snapshot(state, sequence));
  void persistMahjongEvent({ id: record.id, ownerUserId: matchOwners.get(state.id), matchId: record.matchId, sequence: record.sequence, eventType: record.type, actorSeat: record.actorSeat, stateJson: state, actionJson: record.action, stateHash: record.stateHash }).catch((error) => {
    void error;
    devLog("[MahjongStore] Event persistence unavailable; using local audit fallback");
  });
}

export function createMatch(seed?: number, ownerUserId?: number): GameState {
  const state = createGame(seed);
  matches.set(state.id, state);
  matchOwners.set(state.id, ownerUserId);
  audits.set(state.id, { matchId: state.id, events: [], snapshots: [snapshot(state, 0)], analyses: [], aiDecisions: [], reviewMoments: [] });
  void persistMahjongMatch({ id: state.id, ownerUserId, seed: state.seed, phase: state.phase });
  appendEvent(state, { type: "match_created" });
  return state;
}

export function assertMatchAccess(id: string, ownerUserId?: number): void {
  if (!matches.has(id)) throw new Error("MATCH_NOT_FOUND");
  const matchOwner = matchOwners.get(id);
  if (matchOwner !== undefined && matchOwner !== ownerUserId) throw new Error("MATCH_NOT_FOUND");
}

export function getMatch(id: string): GameState {
  const state = matches.get(id);
  if (!state) throw new Error("MATCH_NOT_FOUND");
  return state;
}

export function submitAction(id: string, action: ActionEnvelope): GameState {
  const previous = getMatch(id);
  const applied = applyAction(previous, action);
  const resolved = resolveHandEnd(previous, applied, action);
  const next = resolved.state;
  matches.set(id, next);
  appendEvent(next, { type: "action_submitted", actorSeat: action.seat, action });
  if (next.phase === "hand_complete") appendEvent(next, { type: "hand_completed", actorSeat: action.seat });
  return next;
}

export function listLegalActions(id: string, seat: PlayerSeat) {
  return legalActions(getMatch(id), seat);
}

export async function analyzeMatch(id: string, seat: PlayerSeat, policy: AIPolicy, useLLM: boolean, coachingMode: CoachingMode = "balanced") {
  const state = getMatch(id);
  const analysis = await getDecisionAnalysis(state, seat, policy, useLLM, coachingMode);
  const audit = audits.get(id);
  if (!audit) throw new Error("AUDIT_NOT_FOUND");
  const record: AIAnalysisRecord = { id: `${id}-analysis-${audit.analyses.length + 1}`, matchId: id, turn: state.turn, seat, policy, analysis, createdAt: now() };
  audit.analyses.push(record);
  void persistMahjongAnalysis({ id: record.id, ownerUserId: matchOwners.get(id), matchId: id, turn: record.turn, seat, policy, analysisJson: analysis });
  appendEvent(state, { type: "analysis_requested", actorSeat: seat });
  return analysis;
}

export function saveReviewMoment(id: string, moment: Omit<ReviewMomentRecord, "matchId" | "stateHash" | "createdAt">): ReviewMomentRecord {
  const state = getMatch(id);
  const audit = audits.get(id);
  if (!audit) throw new Error("AUDIT_NOT_FOUND");
  const record: ReviewMomentRecord = { ...moment, matchId: id, stateHash: stableHash(state), createdAt: now() };
  audit.reviewMoments.push(record);
  void persistMahjongReviewMoment({ id: record.id, ownerUserId: matchOwners.get(id), matchId: id, turn: record.turn, category: record.category, title: record.title, originalActionJson: record.originalAction, analysisJson: record.analysis, stateHash: record.stateHash });
  return record;
}

export function recordAIOpponentDecision(id: string, decision: AIOpponentDecision): AIOpponentDecision {
  const state = getMatch(id);
  const audit = audits.get(id);
  if (!audit) throw new Error("AUDIT_NOT_FOUND");
  audit.aiDecisions.push(decision);
  void persistMahjongAIDecision({ id: `${id}-ai-${audit.aiDecisions.length}`, ownerUserId: matchOwners.get(id), matchId: id, turn: state.turn, seat: decision.seat, policy: decision.policy, actionJson: decision.action, rationale: decision.rationale, objective: decision.objective, confidence: decision.confidence, contributionsJson: decision.contributions });
  appendEvent(state, { type: "ai_decision", actorSeat: decision.seat as PlayerSeat, action: decision.action });
  return decision;
}

export function runAIMatchSteps(id: string, policies: Partial<Record<PlayerSeat, AIPolicy>>, maxSteps = 4) {
  const decisions: AIOpponentDecision[] = [];
  for (let step = 0; step < Math.min(maxSteps, 32); step += 1) {
    const state = getMatch(id);
    const seat = state.currentSeat;
    const policy = policies[seat];
    if (!policy || state.phase !== "playing") break;
    const decision = chooseAIOpponentAction(state, seat, policy);
    submitAction(id, decision.action);
    const recorded = recordAIOpponentDecision(id, decision);
    decisions.push(recorded);
  }
  return { state: getMatch(id), decisions };
}

export function advanceMatchRound(id: string) {
  const current = getMatch(id);
  const transition = advanceAfterHand(current);
  matches.set(id, transition.state);
  appendEvent(transition.state, { type: transition.matchComplete ? "hand_completed" : "state_snapshot" });
  return transition;
}

export function runAIMatchToCompletion(id: string, policies: Partial<Record<PlayerSeat, AIPolicy>>, maxSteps = 64) {
  const decisions: AIOpponentDecision[] = [];
  let stopReason: "hand_complete" | "match_complete" | "policy_missing" | "step_limit" = "step_limit";
  for (let step = 0; step < Math.min(maxSteps, 128); step += 1) {
    const state = getMatch(id);
    if (state.phase === "match_complete") { stopReason = "match_complete"; break; }
    if (state.phase === "hand_complete") { stopReason = "hand_complete"; break; }
    const policy = policies[state.currentSeat];
    if (!policy) { stopReason = "policy_missing"; break; }
    const decision = chooseAIOpponentAction(state, state.currentSeat, policy);
    submitAction(id, decision.action);
    decisions.push(recordAIOpponentDecision(id, decision));
  }
  return { state: getMatch(id), decisions, stopReason };
}

export function getReplayAnalytics(id: string): ReplayAnalytics {
  const state = getMatch(id);
  const audit = audits.get(id);
  if (!audit) throw new Error("AUDIT_NOT_FOUND");
  const bySeat: ReplayAnalytics["bySeat"] = {};
  const byObjective: Record<string, number> = {};
  let confidenceTotal = 0;
  for (const decision of audit.aiDecisions) {
    const key = String(decision.seat);
    const entry = bySeat[key] ?? { decisions: 0, averageConfidence: 0, objectives: {} };
    entry.decisions += 1;
    entry.averageConfidence += decision.confidence;
    entry.objectives[decision.objective] = (entry.objectives[decision.objective] ?? 0) + 1;
    bySeat[key] = entry;
    byObjective[decision.objective] = (byObjective[decision.objective] ?? 0) + 1;
    confidenceTotal += decision.confidence;
  }
  for (const entry of Object.values(bySeat)) entry.averageConfidence = entry.decisions ? entry.averageConfidence / entry.decisions : 0;
  return { matchId: id, decisionCount: audit.aiDecisions.length, averageConfidence: audit.aiDecisions.length ? confidenceTotal / audit.aiDecisions.length : 0, bySeat, byObjective, scoreContext: { phase: state.phase, roundWind: state.roundWind, handNumber: state.handNumber, dealer: state.dealer, scores: Object.fromEntries(state.players.map((player) => [String(player.seat), player.score])) } };
}

export function getAIMatchReport(id: string): AIMatchReport {
  const state = getMatch(id);
  const audit = audits.get(id);
  if (!audit) throw new Error("AUDIT_NOT_FOUND");
  const bySeat: AIMatchReport["bySeat"] = {};
  for (const decision of audit.aiDecisions) {
    const key = String(decision.seat);
    const entry = bySeat[key] ?? { policy: decision.policy, decisions: 0, averageConfidence: 0, objectives: {} };
    entry.decisions += 1;
    entry.averageConfidence += decision.confidence;
    entry.objectives[decision.objective] = (entry.objectives[decision.objective] ?? 0) + 1;
    entry.policy = decision.policy;
    bySeat[key] = entry;
  }
  for (const entry of Object.values(bySeat)) entry.averageConfidence = entry.decisions ? entry.averageConfidence / entry.decisions : 0;
  return { matchId: id, phase: state.phase, decisions: audit.aiDecisions.length, bySeat, scores: Object.fromEntries(state.players.map((player) => [String(player.seat), player.score])) };
}

export function getAuditBundle(id: string): MatchAuditBundle {
  const bundle = audits.get(id);
  if (!bundle) throw new Error("MATCH_NOT_FOUND");
  return structuredClone(bundle);
}

export function getAnalysisHistory(id: string): AIAnalysisRecord[] {
  return structuredClone(getAuditBundle(id).analyses);
}

export function savePolicyComparison(id: string, comparison: PolicyComparison): PolicyComparison {
  const audit = audits.get(id);
  if (!audit) throw new Error("AUDIT_NOT_FOUND");
  const record = { ...comparison, matchId: id };
  const best = comparison.analyses[0];
  if (best) audit.analyses.push({ id: `${id}-comparison-${audit.analyses.length + 1}`, matchId: id, turn: comparison.turn, seat: comparison.seat, policy: "comparison", analysis: best, createdAt: now() });
  return record;
}

export function clearMatches() {
  matches.clear();
  audits.clear();
}
