import { describe, expect, it } from "vitest";
import { createGame } from "@/lib/mahjong-engine";
import { canDeclareRiichi, canPon, canTsumo, isWinningHand } from "@/lib/mahjong-rules";
import { calculateBasePoints, detectYaku, scoreHand } from "@/lib/mahjong-scoring";
import { InMemoryMahjongRepository } from "@/server/mahjong-repository";

describe("Mahjong legality and scoring primitives", () => {
  it("recognizes a standard complete hand", () => {
    const state = createGame(330);
    const winningCodes = ["m1", "m2", "m3", "p2", "p3", "p4", "s3", "s4", "s5", "m7", "m8", "m9", "z1", "z1"] as const;
    const tiles = winningCodes.map((code, index) => ({ id: `fixture-${index}`, code, copy: 1, red: false }));
    expect(isWinningHand(tiles)).toBe(true);
    expect(isWinningHand(state.players[0].hand)).toBe(false);
  });

  it("requires tenpai and points before riichi", () => {
    const state = createGame(331);
    const result = canDeclareRiichi(state, 0);
    expect(result.allowed).toBe(false);
    expect(result.reason).toBeDefined();
  });

  it("checks pon prerequisites from visible tiles", () => {
    const player = createGame(332).players[0];
    const discard = { id: "discard", code: player.hand[0].code, copy: 0, red: false };
    const twoCopies = [discard, { ...discard, id: "second" }];
    expect(canPon(twoCopies, discard)).toBe(true);
    expect(canPon([discard], discard)).toBe(false);
  });

  it("returns a legal tsumo result only for a complete 14-tile hand", () => {
    const state = createGame(333);
    expect(canTsumo(state, 0).allowed).toBe(false);
    const winningCodes = ["m1", "m2", "m3", "p2", "p3", "p4", "s3", "s4", "s5", "m7", "m8", "m9", "z1", "z1"] as const;
    state.players[0].hand = winningCodes.map((code, index) => ({ id: `score-${index}`, code, copy: 1, red: false }));
    expect(canTsumo(state, 0).allowed).toBe(true);
    state.players[0].hand.push({ id: "draw", code: "z2", copy: 1, red: false });
    expect(canTsumo(state, 0).allowed).toBe(false);
  });

  it("detects starter yaku and bounded point calculation", () => {
    const state = createGame(334);
    const tiles = ["m2", "m3", "m4", "p2", "p3", "p4", "s2", "s3", "s4", "m5", "m6", "m7", "p5", "p5"].map((code, index) => ({ id: `simple-${index}`, code: code as any, copy: 1, red: false }));
    const yaku = detectYaku(tiles, { seat: 0, dealer: 0, tsumo: true, riichi: true, roundWind: "east", seatWind: "east" });
    expect(yaku).toContain("Riichi");
    expect(calculateBasePoints(2, 30)).toBeGreaterThan(0);
    expect(scoreHand(tiles, { seat: 0, dealer: 0, tsumo: true, riichi: true, roundWind: "east", seatWind: "east" }).points).toBeGreaterThan(0);
  });

  it("isolates repository snapshots from callers", async () => {
    const repository = new InMemoryMahjongRepository();
    const state = createGame(335);
    await repository.createMatch(state);
    const bundle = await repository.getAuditBundle(state.id);
    expect(bundle?.matchId).toBe(state.id);
    if (bundle) bundle.snapshots[0].state.turn = 999;
    expect((await repository.getAuditBundle(state.id))?.snapshots[0].state.turn).toBe(0);
  });
});
