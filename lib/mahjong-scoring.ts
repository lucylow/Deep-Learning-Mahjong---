import type { HandResult, PlayerSeat, TileInstance } from "@/shared/mahjong-types";
import { countTileCodes, isHonor, isSimple, isTerminal } from "./mahjong-tiles";

export interface ScoringContext {
  seat: PlayerSeat;
  dealer: PlayerSeat;
  tsumo: boolean;
  riichi: boolean;
  roundWind: "east" | "south";
  seatWind: "east" | "south" | "west" | "north";
  doraCount?: number;
}

export function detectYaku(tiles: TileInstance[], context: ScoringContext): string[] {
  const yaku: string[] = [];
  if (context.tsumo && !context.riichi) yaku.push("Menzen Tsumo");
  if (context.riichi) yaku.push("Riichi");
  const allSimple = tiles.every((tile) => isSimple(tile.code));
  if (allSimple) yaku.push("Tanyao");
  const counts = countTileCodes(tiles);
  const hasHonor = tiles.some((tile) => isHonor(tile.code));
  const hasTerminal = tiles.some((tile) => isTerminal(tile.code));
  if (!hasHonor && !hasTerminal && allSimple) yaku.push("No Honors or Terminals");
  const tripletCount = [...counts.values()].filter((count) => count >= 3).length;
  if (tripletCount >= 3) yaku.push("Triplet-rich hand");
  return [...new Set(yaku)];
}

export function estimateFu(tiles: TileInstance[], context: ScoringContext): number {
  let fu = 20;
  if (context.tsumo) fu += 2;
  if (context.riichi) fu += 2;
  const counts = countTileCodes(tiles);
  for (const [code, count] of counts.entries()) {
    if (count < 3) continue;
    const honorOrTerminal = isHonor(code) || isTerminal(code);
    fu += honorOrTerminal ? 8 : 4;
  }
  return Math.ceil(fu / 10) * 10;
}

export function calculateBasePoints(han: number, fu: number): number {
  if (han >= 13) return 8_000;
  if (han >= 11) return 6_000;
  if (han >= 8) return 4_000;
  if (han >= 6) return 3_000;
  return Math.min(2_000, fu * 2 ** (han + 2));
}

export function calculateScoreDeltas(basePoints: number, context: ScoringContext): Record<PlayerSeat, number> {
  const deltas: Record<PlayerSeat, number> = { 0: 0, 1: 0, 2: 0, 3: 0 };
  if (!context.tsumo) {
    const payer = ((context.seat + 1) % 4) as PlayerSeat;
    deltas[payer] -= context.seat === context.dealer ? basePoints * 6 : basePoints * 4;
    deltas[context.seat] += context.seat === context.dealer ? basePoints * 6 : basePoints * 4;
    return deltas;
  }
  for (let seat = 0; seat < 4; seat += 1) {
    if (seat === context.seat) continue;
    const amount = context.seat === context.dealer || seat === context.dealer ? basePoints * 2 : basePoints;
    deltas[seat as PlayerSeat] -= amount;
    deltas[context.seat] += amount;
  }
  return deltas;
}

export function scoreHand(tiles: TileInstance[], context: ScoringContext): HandResult {
  const yaku = detectYaku(tiles, context);
  const han = yaku.length + (context.doraCount ?? 0);
  const fu = estimateFu(tiles, context);
  const points = calculateBasePoints(Math.max(1, han), fu);
  return { winner: context.seat, method: context.tsumo ? "tsumo" : "ron", points, han: Math.max(1, han), fu, yaku, scoreDeltas: calculateScoreDeltas(points, context) };
}
