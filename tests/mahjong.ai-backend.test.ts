import { beforeEach, describe, expect, it } from "vitest";
import { createGame } from "@/lib/mahjong-engine";
import { comparePolicies, heuristicAnalysis } from "@/server/mahjong-ai";
import { analyzeMatch, createMatch, getAnalysisHistory, getAuditBundle, submitAction, clearMatches } from "@/server/mahjong-store";

describe("Mahjong AI backend", () => {
  beforeEach(() => clearMatches());

  it("exposes multiple strategic policies for the same state", async () => {
    const state = createGame(222);
    const analyses = await comparePolicies(state, 0);
    expect(analyses).toHaveLength(4);
    expect(new Set(analyses.map((analysis) => analysis.policyName)).size).toBe(4);
    expect(analyses.every((analysis) => analysis.alternatives.length > 0)).toBe(true);
  });

  it("includes uncertainty and observed facts in every recommendation", () => {
    const analysis = heuristicAnalysis(createGame(223), 0, "defensive");
    expect(["low", "medium", "high"]).toContain(analysis.uncertainty);
    expect(analysis.observedFacts.length).toBeGreaterThanOrEqual(3);
    expect(analysis.inferredSignals.every((signal) => signal.confidence >= 0 && signal.confidence <= 1)).toBe(true);
  });

  it("explains why the top line leads over the runner-up", () => {
    const analysis = heuristicAnalysis(createGame(226), 0, "balanced");
    expect(analysis.recommendationSummary).toBeDefined();
    expect(analysis.recommendationSummary?.recommendedTile).toBe(analysis.alternatives[0].action.tileCodes?.[0]);
    expect(analysis.recommendationSummary?.confidenceGap).toBeGreaterThanOrEqual(0);
    expect(Number.isInteger(analysis.recommendationSummary?.ukeireDelta)).toBe(true);
    expect(analysis.recommendationSummary?.keyTradeoff.length).toBeGreaterThan(20);
  });

  it("calibrates confidence against evidence quality and exposes a practice focus", () => {
    const analysis = heuristicAnalysis(createGame(227), 0, "balanced");
    expect(["decisive", "close", "uncertain"]).toContain(analysis.recommendationSummary?.confidenceBand);
    expect(analysis.recommendationSummary?.evidenceQuality).toBeGreaterThanOrEqual(0);
    expect(analysis.recommendationSummary?.evidenceQuality).toBeLessThanOrEqual(1);
    expect(analysis.recommendationSummary?.confidenceBasis?.length).toBeGreaterThan(30);
    expect(["speed", "value", "defense", "score"]).toContain(analysis.recommendationSummary?.learningFocus);
  });

  it("gives each ranked alternative concrete, visible-state reasoning", () => {
    const analysis = heuristicAnalysis(createGame(229), 0, "balanced");
    expect(analysis.alternatives.every((alternative) => alternative.rationale.length > 40)).toBe(true);
    expect(analysis.alternatives.some((alternative) => alternative.rationale.includes("useful draws"))).toBe(true);
    expect(analysis.observedFacts.some((fact) => fact.includes("directional rather than exact"))).toBe(true);
  });

  it("turns the runner-up line into an actionable counterfactual lesson", () => {
    const analysis = heuristicAnalysis(createGame(228), 0, "defensive");
    expect(analysis.recommendationSummary?.counterfactualLesson?.length).toBeGreaterThan(35);
    expect(analysis.recommendationSummary?.riskNote?.length).toBeGreaterThan(35);
    expect(typeof analysis.recommendationSummary?.utilityDelta).toBe("number");
  });

  it("records match events and immutable replay snapshots", () => {
    const match = createMatch(224);
    const tile = match.players[0].hand[0];
    const next = submitAction(match.id, { type: "discard", seat: 0, tileIds: [tile.id] });
    const audit = getAuditBundle(match.id);
    expect(next.turn).toBe(1);
    expect(audit.events.map((event) => event.sequence)).toEqual([1, 2]);
    expect(audit.snapshots).toHaveLength(3);
    expect(audit.snapshots[0].state.turn).toBe(0);
    expect(audit.snapshots[2].state.turn).toBe(1);
    expect(audit.snapshots[0].stateHash).not.toBe(audit.snapshots[2].stateHash);
  });

  it("stores analysis history without exposing internal mutable state", async () => {
    const match = createMatch(225);
    await analyzeMatch(match.id, 0, "balanced", false);
    const history = getAnalysisHistory(match.id);
    expect(history).toHaveLength(1);
    history[0].analysis.observedFacts.push("mutated outside store");
    expect(getAnalysisHistory(match.id)[0].analysis.observedFacts).not.toContain("mutated outside store");
  });
});
