import { describe, expect, it } from "vitest";
import { createGame } from "@/lib/mahjong-engine";
import { availableActionSummary, describeActionIntent, describeRoundTransition, describeTurnStatus, explainGameplayError } from "@/shared/gameplay-feedback";

describe("gameplay feedback", () => {
  it("describes the player turn and waiting states", () => {
    const state = createGame(42);
    expect(describeTurnStatus(state, 0).label).toBe("Your turn");
    expect(describeTurnStatus(state, 0).detail).toContain("tiles remain");
    state.currentSeat = 1;
    expect(describeTurnStatus(state, 0).label).toBe("Mika's turn");
  });

  it("summarizes available actions without hiding empty state guidance", () => {
    expect(availableActionSummary([])).toContain("No special calls");
    expect(availableActionSummary([{ type: "pass", seat: 0, label: "Pass", enabled: true }])).toBe("Pass.");
  });

  it("describes accepted actions and round continuity", () => {
    expect(describeActionIntent({ type: "discard", seat: 0 })).toContain("Discard submitted");
    expect(describeActionIntent({ type: "discard", seat: 0, tileCodes: ["m5"] })).toContain("Discard (m5) submitted");
    expect(describeActionIntent({ type: "pon", seat: 0, tileIds: ["a", "b"] })).toContain("PON submitted");
    expect(describeRoundTransition("dealer_continues")).toContain("dealer continues");
    expect(describeRoundTransition("dealer_rotates")).toContain("dealer rotates");
    expect(describeRoundTransition("south_round_complete")).toContain("South round is complete");
  });

  it("turns backend error codes into recovery guidance", () => {
    expect(explainGameplayError("NOT_YOUR_TURN")).toContain("table moved");
    expect(explainGameplayError("CLAIM_TILE_COUNT_INVALID")).toContain("exact visible tiles");
    expect(explainGameplayError("unexpected")).toBe("unexpected");
  });
});
