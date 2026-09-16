import type { TileCode, TileInstance } from "@/shared/mahjong-types";

export const SUITED_TILES: TileCode[] = [
  ...(["m", "p", "s"] as const).flatMap((suit) =>
    Array.from({ length: 9 }, (_, index) => `${suit}${index + 1}` as TileCode),
  ),
];

export const HONOR_TILES: TileCode[] = Array.from({ length: 7 }, (_, index) => `z${index + 1}` as TileCode);
export const ALL_TILE_CODES = [...SUITED_TILES, ...HONOR_TILES];

export function tileNumber(code: TileCode): number {
  return Number(code.slice(1));
}

export function tileSuit(code: TileCode): "m" | "p" | "s" | "z" {
  return code[0] as "m" | "p" | "s" | "z";
}

export function isHonor(code: TileCode): boolean {
  return tileSuit(code) === "z";
}

export function isTerminal(code: TileCode): boolean {
  return !isHonor(code) && (tileNumber(code) === 1 || tileNumber(code) === 9);
}

export function isSimple(code: TileCode): boolean {
  return !isHonor(code) && !isTerminal(code);
}

export function tileLabel(code: TileCode): string {
  const suitLabels: Record<string, string> = { m: "Man", p: "Pin", s: "Sou", z: "Honor" };
  return `${tileNumber(code)} ${suitLabels[tileSuit(code)]}`;
}

export function createWall(): TileInstance[] {
  return ALL_TILE_CODES.flatMap((code) =>
    Array.from({ length: 4 }, (_, copy) => ({
      id: `${code}-${copy + 1}`,
      code,
      copy: copy + 1,
      red: code === "m5" && copy === 0,
    })),
  );
}

export function seededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

export function shuffle<T>(items: T[], seed: number): T[] {
  const output = [...items];
  const random = seededRandom(seed);
  for (let index = output.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [output[index], output[target]] = [output[target], output[index]];
  }
  return output;
}

export function sortTiles(tiles: TileInstance[]): TileInstance[] {
  return [...tiles].sort((a, b) => {
    const suitOrder = tileSuit(a.code).localeCompare(tileSuit(b.code));
    return suitOrder || tileNumber(a.code) - tileNumber(b.code) || a.copy - b.copy;
  });
}

export function countTileCodes(tiles: TileInstance[]): Map<TileCode, number> {
  const counts = new Map<TileCode, number>();
  for (const tile of tiles) counts.set(tile.code, (counts.get(tile.code) ?? 0) + 1);
  return counts;
}
