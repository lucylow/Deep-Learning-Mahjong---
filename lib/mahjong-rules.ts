import type { GameState, PlayerSeat, TileCode, TileInstance } from "@/shared/mahjong-types";
import { countTileCodes, isHonor, tileNumber, tileSuit } from "./mahjong-tiles";

function codeKey(code: TileCode) {
  return `${code[0]}${code[1]}`;
}

function canFormMelds(counts: Map<string, number>, remaining: number): boolean {
  if (remaining === 0) return true;
  const first = [...counts.entries()].find(([, count]) => count > 0)?.[0];
  if (!first) return false;
  const current = counts.get(first) ?? 0;
  if (current >= 3) {
    counts.set(first, current - 3);
    if (canFormMelds(counts, remaining - 3)) return true;
    counts.set(first, current);
  }
  const suit = first[0] as "m" | "p" | "s" | "z";
  const number = Number(first[1]);
  if (!isHonor(first as TileCode) && number <= 7) {
    const second = `${suit}${number + 1}`;
    const third = `${suit}${number + 2}`;
    if ((counts.get(second) ?? 0) > 0 && (counts.get(third) ?? 0) > 0) {
      counts.set(first, current - 1);
      counts.set(second, (counts.get(second) ?? 0) - 1);
      counts.set(third, (counts.get(third) ?? 0) - 1);
      if (canFormMelds(counts, remaining - 3)) return true;
      counts.set(first, current);
      counts.set(second, (counts.get(second) ?? 0) + 1);
      counts.set(third, (counts.get(third) ?? 0) + 1);
    }
  }
  return false;
}

export function isWinningHand(tiles: TileInstance[]): boolean {
  if (tiles.length !== 14) return false;
  const counts = countTileCodes(tiles);
  for (const [pairCode, pairCount] of counts.entries()) {
    if (pairCount < 2) continue;
    counts.set(pairCode as TileCode, pairCount - 2);
    if (canFormMelds(new Map([...counts].map(([code, count]) => [codeKey(code), count])), 12)) return true;
    counts.set(pairCode as TileCode, pairCount);
  }
  return false;
}

export function isTenpai(tiles: TileInstance[], wallCodes: TileCode[]): boolean {
  if (tiles.length !== 13) return false;
  return wallCodes.some((code) => isWinningHand([...tiles, { id: `test-${code}`, code, copy: 0, red: false }]));
}

export function isFuriten(state: GameState, seat: PlayerSeat): boolean {
  const player = state.players[seat];
  const winningDiscardCodes = new Set<TileCode>();
  for (const discard of player.discards) winningDiscardCodes.add(discard.tile.code);
  return state.lastDiscard?.seat !== seat && state.lastDiscard ? winningDiscardCodes.has(state.lastDiscard.tile.code) : false;
}

export function canDeclareRiichi(state: GameState, seat: PlayerSeat): { allowed: boolean; reason?: string } {
  const player = state.players[seat];
  if (state.phase !== "playing") return { allowed: false, reason: "The hand is not active." };
  if (state.currentSeat !== seat) return { allowed: false, reason: "It is not this player’s turn." };
  if (player.riichi) return { allowed: false, reason: "Riichi has already been declared." };
  if (player.score < 1_000) return { allowed: false, reason: "At least 1,000 points are required." };
  if (!isTenpai(player.hand, state.wall.map((tile) => tile.code))) return { allowed: false, reason: "The hand must be tenpai." };
  return { allowed: true };
}

export function canTsumo(state: GameState, seat: PlayerSeat): { allowed: boolean; reason?: string } {
  const player = state.players[seat];
  if (state.currentSeat !== seat) return { allowed: false, reason: "It is not this player’s turn." };
  if (player.hand.length !== 14) return { allowed: false, reason: "A tsumo hand must contain 14 tiles." };
  if (!isWinningHand(player.hand)) return { allowed: false, reason: "The tiles do not form a complete hand." };
  return { allowed: true };
}

export function canRon(state: GameState, seat: PlayerSeat): { allowed: boolean; reason?: string } {
  const discard = state.lastDiscard;
  if (!discard || discard.seat === seat) return { allowed: false, reason: "There is no opponent discard to claim." };
  if (isFuriten(state, seat)) return { allowed: false, reason: "The player is furiten." };
  const player = state.players[seat];
  if (!isWinningHand([...player.hand, discard.tile])) return { allowed: false, reason: "The discard does not complete the hand." };
  return { allowed: true };
}

export function canPon(playerTiles: TileInstance[], discard: TileInstance): boolean {
  return playerTiles.filter((tile) => tile.code === discard.code).length >= 2;
}

export function canKan(playerTiles: TileInstance[], discard: TileInstance): boolean {
  return playerTiles.filter((tile) => tile.code === discard.code).length >= 3;
}

export function canChi(playerSeat: PlayerSeat, discardSeat: PlayerSeat, playerTiles: TileInstance[], discard: TileInstance): boolean {
  if ((playerSeat + 3) % 4 !== discardSeat) return false;
  if (isHonor(discard.code)) return false;
  const number = tileNumber(discard.code);
  const suit = tileSuit(discard.code);
  const codes = new Set(playerTiles.map((tile) => tile.code));
  const choices: TileCode[][] = [];
  if (number >= 3) choices.push([`${suit}${number - 2}`, `${suit}${number - 1}`] as TileCode[]);
  if (number >= 2 && number <= 8) choices.push([`${suit}${number - 1}`, `${suit}${number + 1}`] as TileCode[]);
  if (number <= 7) choices.push([`${suit}${number + 1}`, `${suit}${number + 2}`] as TileCode[]);
  return choices.some((choice) => choice.every((code) => codes.has(code)));
}
