import { describe, expect, it } from "vitest";
import { assertMatchAccess, createMatch, getReplayAnalytics } from "@/server/mahjong-store";
import { listBenchmarkRuns, runAndStoreBenchmark } from "@/server/mahjong-benchmark-store";

describe("backend analytics", () => {
  it("returns an empty but score-aware replay analytics report for a new match", () => {
    const match = createMatch(9090);
    const report = getReplayAnalytics(match.id);
    expect(report.decisionCount).toBe(0);
    expect(report.averageConfidence).toBe(0);
    expect(report.scoreContext.scores["0"]).toBe(25000);
  });

  it("rejects cross-owner access to match replay data", () => {
    const ownerOneMatch = createMatch(9191, 101);
    expect(() => assertMatchAccess(ownerOneMatch.id, 202)).toThrow("MATCH_NOT_FOUND");
    expect(() => assertMatchAccess(ownerOneMatch.id, 101)).not.toThrow();
  });

  it("keeps benchmark history scoped to the authenticated owner", async () => {
    const ownerOneRun = runAndStoreBenchmark([41, 42], 101);
    const ownerTwoRun = runAndStoreBenchmark([43], 202);
    const ownerOneHistory = await listBenchmarkRuns(101);
    const ownerTwoHistory = await listBenchmarkRuns(202);
    expect(ownerOneHistory.some((entry) => entry.id === ownerOneRun.id)).toBe(true);
    expect(ownerOneHistory.some((entry) => entry.id === ownerTwoRun.id)).toBe(false);
    expect(ownerTwoHistory.some((entry) => entry.id === ownerTwoRun.id)).toBe(true);
    expect(ownerOneRun.byPolicy.balanced.scenarios).toBe(2);
  });
});
