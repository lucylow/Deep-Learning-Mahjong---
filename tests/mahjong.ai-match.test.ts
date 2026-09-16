import { describe, expect, it } from "vitest";
import { createMatch, getAuditBundle, runAIMatchSteps } from "@/server/mahjong-store";

describe("multi-seat AI match orchestration", () => {
  it("runs bounded legal AI steps and preserves replay order", () => {
    const state = createMatch(551);
    const result = runAIMatchSteps(state.id, { 0: "balanced", 1: "aggressive", 2: "defensive", 3: "human-like" }, 4);
    expect(result.decisions.length).toBeGreaterThan(0);
    expect(result.decisions.length).toBeLessThanOrEqual(4);
    expect(result.decisions.every((decision) => decision.action.seat >= 0 && decision.action.seat <= 3)).toBe(true);
    const audit = getAuditBundle(state.id);
    expect(audit.aiDecisions).toHaveLength(result.decisions.length);
    expect(audit.events.filter((event) => event.type === "ai_decision")).toHaveLength(result.decisions.length);
    expect(audit.events.map((event) => event.sequence)).toEqual([...audit.events.map((event) => event.sequence)].sort((a, b) => a - b));
  });

  it("stops when the active seat has no configured policy", () => {
    const state = createMatch(552);
    const result = runAIMatchSteps(state.id, { 0: "balanced" }, 8);
    expect(result.decisions.length).toBeLessThanOrEqual(1);
  });
});
