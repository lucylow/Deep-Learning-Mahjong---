import { describe, expect, it } from "vitest";
import { addMatchHistoryEntry, formatMatchHistoryLabel } from "@/shared/match-history";
import { summarizePolicies } from "@/shared/policy-comparison";
import type { AIOpponentDecision } from "@/shared/mahjong-backend";

const baseDecision = (policy: string, confidence: number, objective: "speed" | "value" = "speed"): AIOpponentDecision => ({
  policy,
  seat: 0,
  action: { type: "discard" as const, seat: 0, tileCodes: ["m9"] },
  rationale: "Visible-state rationale",
  objective,
  confidence,
  contributions: [],
  createdAt: "2026-08-15T01:00:00.000Z",
});

describe("match history and policy comparison", () => {
  it("deduplicates recent matches and keeps the newest entries bounded", () => {
    const first = { id: "a", createdAt: "2026-08-15T01:00:00.000Z", label: "Experiment" };
    const second = { id: "b", createdAt: "2026-08-15T02:00:00.000Z", label: "Experiment" };
    const result = addMatchHistoryEntry([first], second, 2);
    expect(addMatchHistoryEntry(result, first, 2).map((entry) => entry.id)).toEqual(["a", "b"]);
    expect(formatMatchHistoryLabel(second)).toContain("Experiment");
  });

  it("summarizes confidence and objectives by policy", () => {
    const summaries = summarizePolicies([baseDecision("balanced", 0.8), baseDecision("balanced", 0.6, "value"), baseDecision("defensive", 0.9)]);
    expect(summaries).toEqual([
      { policy: "balanced", decisions: 2, averageConfidence: 0.7, objectives: ["speed", "value"] },
      { policy: "defensive", decisions: 1, averageConfidence: 0.9, objectives: ["speed"] },
    ]);
  });
});
