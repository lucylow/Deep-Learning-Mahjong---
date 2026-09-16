import type { ActionEnvelope, GameState, LegalAction, PlayerSeat } from "./mahjong-types";

export type TurnStatusTone = "active" | "waiting" | "complete";

export type TurnStatus = {
  label: string;
  detail: string;
  tone: TurnStatusTone;
};

export function describeTurnStatus(state: GameState, seat: PlayerSeat = 0): TurnStatus {
  if (state.phase === "match_complete") return { label: "Match complete", detail: "Review the final score or return to the home screen.", tone: "complete" };
  if (state.phase === "hand_complete") return { label: "Hand complete", detail: "Review the result before starting the next hand.", tone: "complete" };
  if (state.phase !== "playing") return { label: "Table preparing", detail: "The table is restoring the current hand state.", tone: "waiting" };
  if (state.currentSeat === seat) return { label: "Your turn", detail: `Turn ${state.turn} · ${state.wall.length} tiles remain. Choose a tile or an available legal action.`, tone: "active" };
  const player = state.players[state.currentSeat];
  return { label: `${player.displayName}'s turn`, detail: `Turn ${state.turn} · ${state.wall.length} tiles remain. Sensei is waiting for the table to advance. Your controls will refresh automatically.`, tone: "waiting" };
}

export function availableActionSummary(actions: LegalAction[]): string {
  const enabled = actions.filter((action) => action.enabled);
  if (!enabled.length) return "No special calls are available. Select a tile to discard when it is your turn.";
  const labels = enabled.slice(0, 3).map((action) => action.label).join(", ");
  return enabled.length > 3 ? `${labels}, and ${enabled.length - 3} more.` : `${labels}.`;
}

export function describeActionIntent(action: ActionEnvelope): string {
  const tileContext = action.tileCodes?.length ? ` (${action.tileCodes.join(" · ")})` : "";
  if (action.type === "discard") return `Discard${tileContext} submitted. Sensei is waiting for the next table turn.`;
  if (action.type === "riichi") return `Riichi declaration${tileContext} submitted. The table will refresh the new risk state.`;
  if (action.type === "tsumo" || action.type === "ron") return `${action.type === "tsumo" ? "Tsumo" : "Ron"} submitted${tileContext}. Resolving the hand…`;
  if (action.type === "chi" || action.type === "pon" || action.type === "kan") return `${action.type.toUpperCase()} submitted${tileContext}. Updating the open-hand state…`;
  if (action.type === "pass") return "Pass submitted. Waiting for the next draw.";
  return "Action submitted. Refreshing the table state…";
}

export function describeRoundTransition(reason: "dealer_continues" | "dealer_rotates" | "south_round_complete"): string {
  if (reason === "dealer_continues") return "The dealer continues. A fresh hand is ready with the current score pressure preserved.";
  if (reason === "dealer_rotates") return "The dealer rotates. A fresh hand is ready and the round state has been refreshed.";
  return "The South round is complete. Review the final match result before leaving the table.";
}

export function explainGameplayError(message: string): string {
  const normalized = message.toUpperCase();
  if (normalized.includes("NOT_YOUR_TURN")) return "The table moved before this action arrived. The current turn has been refreshed.";
  if (normalized.includes("MATCH_NOT_PLAYING")) return "This hand has already ended. Review the result or start the next hand.";
  if (normalized.includes("TILE_NOT_IN_HAND")) return "That tile is no longer in your hand. Select a tile from the refreshed hand.";
  if (normalized.includes("ILLEGAL_ACTION")) return "That action is not legal in the current visible state. Choose one of the highlighted legal actions.";
  if (normalized.includes("CLAIM")) return "The claim changed before submission. Reopen the action and select the exact visible tiles.";
  return message;
}
