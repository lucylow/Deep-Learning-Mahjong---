import { describe, expect, it } from "vitest";
import { buildWeeklySenseiPlan, normalizeWeeklySenseiProgress, recordWeeklyDrillCompletion } from "@/shared/weekly-drills";
import { appendCalibrationHistory, buildCalibrationHistorySummary } from "@/shared/confidence-calibration";
import type { ProfileObjectiveTrend } from "@/shared/learning-profile";

const trend = (objective: ProfileObjectiveTrend["objective"], direction: ProfileObjectiveTrend["direction"], recentConfidence: number): ProfileObjectiveTrend => ({ objective, label: objective, matchCount: 4, averageConfidence: recentConfidence, recentConfidence, delta: direction === "persistent" ? -0.1 : 0.1, direction, coaching: "Test coaching", nextAction: "Test next action" });

describe("Sensei weekly drill plan", () => {
  it("resets stale week progress and records each scenario once", () => {
    const current = normalizeWeeklySenseiProgress({ weekKey: "2025-W01", completedScenarioIds: ["old"] }, new Date("2026-08-17T00:00:00.000Z"));
    expect(current.completedScenarioIds).toEqual([]);
    const completed = recordWeeklyDrillCompletion(current, "defense-1", "2026-08-17T00:00:00.000Z");
    expect(recordWeeklyDrillCompletion(completed, "defense-1").completedScenarioIds).toEqual(["defense-1"]);
  });

  it("prioritizes persistent objectives and returns three deterministic drills", () => {
    const plan = buildWeeklySenseiPlan([
      trend("speed", "improving", 0.7),
      trend("defense", "persistent", 0.62),
      trend("value", "watching", 0.65),
      trend("score", "insufficient-data", 0.4),
    ], new Date("2026-08-17T00:00:00.000Z"));
    expect(plan).toHaveLength(3);
    expect(plan[0]).toMatchObject({ sequence: 1, objective: "defense", weekKey: "2026-W34" });
    expect(plan.map((item) => item.sequence)).toEqual([1, 2, 3]);
    expect(new Set(plan.map((item) => item.scenarioId)).size).toBe(3);
  });

  it("summarizes historical calibration direction", () => {
    const first = { matchId: "m1", completedAt: "2026-08-01", averageConfidence: 0.82, observedSuccessRate: 0.55, calibrationGap: 0.27, byObjective: [] };
    const second = { ...first, matchId: "m2", completedAt: "2026-08-08", calibrationGap: 0.1 };
    const history = appendCalibrationHistory(appendCalibrationHistory([], first), second);
    expect(buildCalibrationHistorySummary(history)).toMatchObject({ direction: "improving", delta: -0.17 });
  });
});
