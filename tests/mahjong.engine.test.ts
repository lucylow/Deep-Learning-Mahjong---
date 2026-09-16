import { describe, expect, it } from "vitest";
import { applyAction, createGame, estimateUkeire, handShanten, legalActions } from "@/lib/mahjong-engine";
import { createWall } from "@/lib/mahjong-tiles";
import { heuristicAnalysis } from "@/server/mahjong-ai";

describe("Mahjong tile and game engine", () => {
  it("creates a standard 136-tile wall", () => {
    expect(createWall()).toHaveLength(136);
  });

  it("creates deterministic game states from the same seed", () => {
    const first = createGame(42);
    const second = createGame(42);
    expect(first.id).toBe(second.id);
    expect(first.players[0].hand.map((tile) => tile.id)).toEqual(second.players[0].hand.map((tile) => tile.id));
  });

  it("deals 13 tiles to each player and leaves the dealer to draw", () => {
    const state = createGame(7);
    expect(state.players.every((player) => player.hand.length === 13)).toBe(true);
    expect(state.currentSeat).toBe(0);
    expect(state.wall.length).toBe(70);
  });

  it("offers discard actions for the current player", () => {
    const state = createGame(99);
    const actions = legalActions(state, 0);
    expect(actions.filter((action) => action.type === "discard")).toHaveLength(13);
  });

  it("applies a legal discard and advances the turn", () => {
    const state = createGame(100);
    const tile = state.players[0].hand[0];
    const next = applyAction(state, { type: "discard", seat: 0, tileIds: [tile.id] });
    expect(next.players[0].hand).toHaveLength(12);
    expect(next.players[1].hand).toHaveLength(14);
    expect(next.currentSeat).toBe(1);
    expect(next.lastDiscard?.tile.id).toBe(tile.id);
  });

  it("rejects an action from the wrong seat", () => {
    const state = createGame(101);
    expect(() => applyAction(state, { type: "pass", seat: 2 })).toThrow("NOT_YOUR_TURN");
  });

  it("returns bounded hand-shape metrics", () => {
    const state = createGame(102);
    expect(handShanten(state.players[0].hand)).toBeGreaterThanOrEqual(0);
    expect(estimateUkeire(state.players[0].hand)).toBeGreaterThanOrEqual(0);
  });

  it("returns explainable heuristic AI alternatives", () => {
    const state = createGame(103);
    const analysis = heuristicAnalysis(state, 0, "balanced");
    expect(analysis.alternatives.length).toBeGreaterThan(0);
    expect(analysis.observedFacts.length).toBeGreaterThan(0);
    expect(analysis.inferredSignals[0].confidence).toBeLessThanOrEqual(1);
    expect(analysis.disclaimer).toContain("estimate");
  });
});


describe("connected meld transitions", () => {
  it("applies a pon claim and records the open meld", () => {
    const state = createGame(200);
    state.currentSeat = 0;
    const discard = { id: "m3-discard", code: "m3" as const, copy: 1, red: false };
    state.lastDiscard = { tile: discard, seat: 1, tsumogiri: false, turn: 1 };
    state.players[0].hand = [
      { id: "m3-hand-1", code: "m3", copy: 2, red: false },
      { id: "m3-hand-2", code: "m3", copy: 3, red: false },
      { id: "p1-1", code: "p1", copy: 1, red: false },
    ];

    const next = applyAction(state, { type: "pon", seat: 0, tileIds: ["m3-hand-1", "m3-hand-2"] });

    expect(next.players[0].hand.map((tile) => tile.id)).not.toContain("m3-hand-1");
    expect(next.players[0].melds[0]).toMatchObject({ type: "pon", fromSeat: 1, open: true });
    expect(next.players[0].melds[0].tiles.map((tile) => tile.code)).toEqual(["m3", "m3", "m3"]);
    expect(next.currentSeat).toBe(0);
  });

  it("applies a chi claim only for a valid sequence around the discard", () => {
    const state = createGame(201);
    state.currentSeat = 0;
    const discard = { id: "m3-discard", code: "m3" as const, copy: 1, red: false };
    state.lastDiscard = { tile: discard, seat: 3, tsumogiri: false, turn: 1 };
    state.players[0].hand = [
      { id: "m1-hand", code: "m1", copy: 1, red: false },
      { id: "m2-hand", code: "m2", copy: 1, red: false },
      { id: "p1-1", code: "p1", copy: 1, red: false },
    ];

    const next = applyAction(state, { type: "chi", seat: 0, tileIds: ["m1-hand", "m2-hand"] });

    expect(next.players[0].melds[0]).toMatchObject({ type: "chi", fromSeat: 3, open: true });
    expect(next.players[0].melds[0].tiles.map((tile) => tile.code)).toEqual(["m1", "m2", "m3"]);
    expect(next.currentSeat).toBe(0);
  });
});
