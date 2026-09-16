import type { TileCode, TileInstance } from "@/shared/mahjong-types";
import { countTileCodes } from "./mahjong-tiles";

export interface HandDecomposition {
  pair: TileCode;
  melds: TileCode[][];
  shape: "standard" | "seven_pairs";
}

function index(code: TileCode): number {
  if (code[0] === "m") return Number(code[1]) - 1;
  if (code[0] === "p") return 9 + Number(code[1]) - 1;
  if (code[0] === "s") return 18 + Number(code[1]) - 1;
  return 27 + Number(code[1]) - 1;
}

function codeAt(value: number): TileCode {
  if (value < 9) return `m${value + 1}` as TileCode;
  if (value < 18) return `p${value - 8}` as TileCode;
  if (value < 27) return `s${value - 17}` as TileCode;
  return `z${value - 26}` as TileCode;
}

function search(counts: number[], pair: number, melds: TileCode[][]): HandDecomposition | null {
  const first = counts.findIndex((count) => count > 0);
  if (first === -1) return pair >= 0 ? { pair: codeAt(pair), melds, shape: "standard" } : null;
  if (pair < 0 && counts[first] >= 2) {
    counts[first] -= 2;
    const result = search(counts, first, melds);
    counts[first] += 2;
    if (result) return result;
  }
  if (counts[first] >= 3) {
    counts[first] -= 3;
    const result = search(counts, pair, [...melds, [codeAt(first), codeAt(first), codeAt(first)]]);
    counts[first] += 3;
    if (result) return result;
  }
  if (first < 27 && first % 9 <= 6 && counts[first + 1] > 0 && counts[first + 2] > 0) {
    counts[first] -= 1; counts[first + 1] -= 1; counts[first + 2] -= 1;
    const result = search(counts, pair, [...melds, [codeAt(first), codeAt(first + 1), codeAt(first + 2)]]);
    counts[first] += 1; counts[first + 1] += 1; counts[first + 2] += 1;
    if (result) return result;
  }
  return null;
}

export function decomposeHand(tiles: TileInstance[]): HandDecomposition | null {
  if (tiles.length !== 14) return null;
  const counts = Array.from({ length: 34 }, () => 0);
  for (const tile of tiles) counts[index(tile.code)] += 1;
  const pairs = counts.filter((count) => count === 2).length;
  if (pairs === 7 && counts.every((count) => count === 0 || count === 2)) return { pair: codeAt(counts.findIndex((count) => count === 2)), melds: [], shape: "seven_pairs" };
  return search(counts, -1, []);
}

export function isWinningHand(tiles: TileInstance[]): boolean {
  return decomposeHand(tiles) !== null;
}

export function estimateWinningTiles(tiles: TileInstance[], candidates: TileInstance[]): TileCode[] {
  const found = new Set<TileCode>();
  for (const candidate of candidates) if (isWinningHand([...tiles, candidate])) found.add(candidate.code);
  return [...found];
}

export function tileCountsForDecomposition(tiles: TileInstance[]) {
  return countTileCodes(tiles);
}
