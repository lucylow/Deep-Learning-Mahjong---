import type { Discard, GameState, PlayerSeat } from "./mahjong-types";

export type DiscardRiverEntry = Discard & {
  seatLabel: string;
};

export function buildDiscardRiver(state: GameState, limit = 16): DiscardRiverEntry[] {
  const boundedLimit = Math.max(1, Math.min(limit, 48));
  return state.players
    .flatMap((player) => player.discards.map((discard) => ({ ...discard, seatLabel: `${player.displayName} · ${player.wind}` })))
    .sort((left, right) => left.turn - right.turn || left.seat - right.seat)
    .slice(-boundedLimit);
}

export type ClaimWindowState = "open" | "closed" | "idle";

export function claimWindowState(lastDiscard: Discard | undefined, legalActionCount: number): ClaimWindowState {
  if (!lastDiscard) return "idle";
  return legalActionCount > 0 ? "open" : "closed";
}

export function claimWindowLabel(lastDiscard: Discard | undefined, legalActionCount: number): string {
  if (!lastDiscard) return "No open claim window";
  if (legalActionCount > 0) return `${legalActionCount} claim option${legalActionCount === 1 ? "" : "s"} available for seat ${lastDiscard.seat}.`;
  return `Discard from seat ${lastDiscard.seat} is resolved. Waiting for the next draw.`;
}

export function seatAccent(seat: PlayerSeat): "jade" | "brass" | "paper" | "clay" {
  return seat === 0 ? "brass" : seat === 1 ? "jade" : seat === 2 ? "paper" : "clay";
}
