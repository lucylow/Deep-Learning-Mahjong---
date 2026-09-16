import { describe, expect, it } from "vitest";
import { DEMO_BENCHMARK_HISTORY, DEMO_MATCH_HISTORY, DEMO_REPLAY_SNAPSHOTS } from "@/shared/demo-data";

describe("demo data catalog", () => {
  it("provides bounded, searchable match history with an archived sample", () => {
    expect(DEMO_MATCH_HISTORY).toHaveLength(1);
    expect(DEMO_MATCH_HISTORY.every((entry) => entry.id.startsWith("demo-match-"))).toBe(true);
    expect(DEMO_MATCH_HISTORY.some((entry) => entry.archived)).toBe(false);
  });

  it("provides multiple benchmark snapshots with all four policies", () => {
    expect(DEMO_BENCHMARK_HISTORY).toHaveLength(1);
    expect(Object.keys(DEMO_BENCHMARK_HISTORY[0].byPolicy)).toEqual(["aggressive", "balanced", "defensive", "human-like"]);
    expect(DEMO_BENCHMARK_HISTORY[0].byPolicy.balanced.averageConfidence).toBeGreaterThan(0.8);
  });

  it("provides ordered replay snapshots with score and wall progression", () => {
    expect(DEMO_REPLAY_SNAPSHOTS).toHaveLength(4);
    expect(DEMO_REPLAY_SNAPSHOTS.map((snapshot) => snapshot.sequence)).toEqual([1, 2, 3, 4]);
    expect(DEMO_REPLAY_SNAPSHOTS[0].state.wall).toHaveLength(64);
    expect(DEMO_REPLAY_SNAPSHOTS[2].state.players[0].score).toBe(24300);
    expect(DEMO_REPLAY_SNAPSHOTS[3].state.players[0].score).toBe(25100);
    expect(DEMO_REPLAY_SNAPSHOTS[3].state.players[0].hand.length).toBe(13);
  });

  it("keeps preview data bounded and does not pre-populate personal chat or drill history", () => {
    expect(DEMO_MATCH_HISTORY).toHaveLength(1);
    expect(DEMO_BENCHMARK_HISTORY).toHaveLength(1);
    expect(DEMO_REPLAY_SNAPSHOTS).toHaveLength(4);
  });
});
