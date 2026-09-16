import { describe, expect, it } from "vitest";
import { filterMatchHistory, type MatchHistoryEntry } from "@/shared/match-history";
import { summarizePolicies } from "@/shared/policy-comparison";

const entries: MatchHistoryEntry[] = [
  { id: "a", createdAt: "2026-08-15T01:00:00.000Z", label: "Balanced policy" },
  { id: "b", createdAt: "2026-08-15T02:00:00.000Z", label: "Defensive drill" },
];

describe("alternative review and history helpers", () => {
  it("filters recent history case-insensitively and preserves order", () => {
    expect(filterMatchHistory(entries, "DEFENSIVE").map((entry) => entry.id)).toEqual(["b"]);
    expect(filterMatchHistory(entries, "")).toEqual(entries);
  });

  it("keeps policy summaries ordered for a stable comparison layout", () => {
    const summaries = summarizePolicies([]);
    expect(summaries).toEqual([]);
  });
});
