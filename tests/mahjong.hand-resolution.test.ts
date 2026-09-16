import { describe, expect, it } from "vitest";
import { createGame } from "@/lib/mahjong-engine";
import { resolveHandEnd } from "@/lib/mahjong-match";

describe("hand resolution", () => {
  it("stops with exhaustive draw when the wall is empty", () => {
    const previous = createGame(660);
    const next = { ...previous, wall: [] };
    const result = resolveHandEnd(previous, next, { type: "discard", seat: previous.currentSeat, tileIds: [previous.players[previous.currentSeat].hand[0].id] });
    expect(result.reason).toBe("exhaustive_draw");
    expect(result.state.phase).toBe("hand_complete");
  });

  it("does not resolve an ordinary discard as a win", () => {
    const previous = createGame(661);
    const next = { ...previous, wall: previous.wall.slice(1) };
    const result = resolveHandEnd(previous, next, { type: "discard", seat: previous.currentSeat, tileIds: [previous.players[previous.currentSeat].hand[0].id] });
    expect(result.reason).toBeNull();
    expect(result.state.phase).not.toBe("hand_complete");
  });
});
