import { describe, expect, it } from "vitest";
import { createGame } from "@/lib/mahjong-engine";
import { buildDiscardRiver, claimWindowLabel, claimWindowState, seatAccent } from "@/shared/discard-river";

describe("discard river", () => {
  it("orders discards by turn and seat and bounds the visible river", () => {
    const state = createGame(42);
    state.players[0].discards = [{ tile: state.players[0].hand[0], seat: 0, tsumogiri: false, turn: 2 }];
    state.players[1].discards = [{ tile: state.players[1].hand[0], seat: 1, tsumogiri: true, turn: 1 }];
    state.players[2].discards = [{ tile: state.players[2].hand[0], seat: 2, tsumogiri: false, turn: 2 }];
    const river = buildDiscardRiver(state, 2);
    expect(river).toHaveLength(2);
    expect(river.map((entry) => entry.turn)).toEqual([2, 2]);
    expect(river.map((entry) => entry.seat)).toEqual([0, 2]);
  });

  it("classifies claim windows as idle, open, or closed", () => {
    const state = createGame(42);
    const discard = { tile: state.players[0].hand[0], seat: 1 as const, tsumogiri: false, turn: 3 };
    expect(claimWindowState(undefined, 0)).toBe("idle");
    expect(claimWindowState(discard, 1)).toBe("open");
    expect(claimWindowState(discard, 0)).toBe("closed");
  });

  it("explains whether a claim window is open", () => {
    const state = createGame(42);
    expect(claimWindowLabel(undefined, 0)).toBe("No open claim window");
    expect(claimWindowLabel({ tile: state.players[0].hand[0], seat: 1, tsumogiri: false, turn: 3 }, 2)).toContain("2 claim options");
    expect(claimWindowLabel({ tile: state.players[0].hand[0], seat: 1, tsumogiri: false, turn: 3 }, 0)).toContain("Waiting for the next draw");
  });

  it("maps seats to stable Arena accents", () => {
    expect(seatAccent(0)).toBe("brass");
    expect(seatAccent(1)).toBe("jade");
    expect(seatAccent(2)).toBe("paper");
    expect(seatAccent(3)).toBe("clay");
  });
});
