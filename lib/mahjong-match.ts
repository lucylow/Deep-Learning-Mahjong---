import type { ActionEnvelope, GameState, HandResult } from "@/shared/mahjong-types";
import { canRon, canTsumo } from "./mahjong-rules";
import { scoreHand } from "./mahjong-scoring";

export type HandStopReason = "tsumo" | "ron" | "exhaustive_draw" | null;

export function resolveHandEnd(previous: GameState, next: GameState, action: ActionEnvelope): { state: GameState; reason: HandStopReason } {
  if (action.type === "tsumo") {
    const check = canTsumo(previous, action.seat);
    if (check.allowed) {
      const result = scoreHand(previous.players[action.seat].hand, { seat: action.seat, dealer: previous.dealer, tsumo: true, riichi: previous.players[action.seat].riichi, roundWind: previous.roundWind, seatWind: previous.players[action.seat].wind });
      return applyResult(next, result, "tsumo");
    }
  }
  if (action.type === "ron") {
    const check = canRon(previous, action.seat);
    if (check.allowed && previous.lastDiscard) {
      const result = scoreHand([...previous.players[action.seat].hand, previous.lastDiscard.tile], { seat: action.seat, dealer: previous.dealer, tsumo: false, riichi: previous.players[action.seat].riichi, roundWind: previous.roundWind, seatWind: previous.players[action.seat].wind });
      return applyResult(next, result, "ron");
    }
  }
  if (next.wall.length === 0) {
    return { state: { ...next, phase: "hand_complete" }, reason: "exhaustive_draw" };
  }
  return { state: next, reason: null };
}

function applyResult(state: GameState, result: HandResult, reason: "tsumo" | "ron"): { state: GameState; reason: HandStopReason } {
  const players = state.players.map((player) => ({ ...player, score: player.score + (result.scoreDeltas[player.seat] ?? 0) })) as GameState["players"];
  return { state: { ...state, players, phase: "hand_complete" as const, winner: result.winner, result }, reason };
}
