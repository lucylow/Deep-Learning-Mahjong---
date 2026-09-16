import type { GameState, PlayerSeat } from "@/shared/mahjong-types";
import { createGame } from "./mahjong-engine";

export interface RoundTransition {
  state: GameState;
  matchComplete: boolean;
  reason: "dealer_continues" | "dealer_rotates" | "south_round_complete";
}

export function advanceAfterHand(state: GameState): RoundTransition {
  if (state.phase !== "hand_complete") throw new Error("HAND_NOT_COMPLETE");
  const winner = state.winner;
  const dealerWon = winner === state.dealer;
  const nextDealer = dealerWon ? state.dealer : ((state.dealer + 1) % 4) as PlayerSeat;
  const nextHandNumber = state.handNumber + 1;
  const entersSouth = state.roundWind === "east" && nextHandNumber >= 4;
  const nextRoundWind = entersSouth || state.roundWind === "south" ? "south" : "east";
  const normalizedHandNumber = nextHandNumber >= 4 ? nextHandNumber - 4 : nextHandNumber;
  const matchComplete = state.roundWind === "south" && nextHandNumber >= 4;
  if (matchComplete) return { state: { ...state, phase: "match_complete" }, matchComplete: true, reason: "south_round_complete" };
  const next = createGame(state.seed + nextHandNumber + 1);
  const players = next.players.map((player) => ({ ...player, score: state.players[player.seat].score })) as GameState["players"];
  const honba = dealerWon ? state.honba + 1 : 0;
  const riichiSticks = state.riichiSticks + (state.result?.yaku.includes("Riichi") ? 1 : 0);
  return {
    state: { ...next, id: state.id, seed: state.seed, roundWind: nextRoundWind, handNumber: normalizedHandNumber, dealer: nextDealer, honba, riichiSticks, players, phase: "playing" },
    matchComplete: false,
    reason: dealerWon ? "dealer_continues" : "dealer_rotates",
  };
}
