import type { ActionType, TileCode, TileInstance } from "@/shared/mahjong-types";

function combinationsForCode(hand: TileInstance[], code: TileCode, count: number): TileInstance[][] {
  const matches = hand.filter((tile) => tile.code === code);
  return matches.length >= count ? [matches.slice(0, count)] : [];
}

export function getMultiTileChoices(action: ActionType, hand: TileInstance[], discard?: TileInstance): TileInstance[][] {
  if (!discard || !["chi", "pon", "kan"].includes(action)) return [];
  if (action === "pon") return combinationsForCode(hand, discard.code, 2);
  if (action === "kan") return combinationsForCode(hand, discard.code, 3);
  if (discard.code[0] === "z") return [];

  const suit = discard.code[0] as "m" | "p" | "s";
  const number = Number(discard.code[1]);
  const codeChoices: TileCode[][] = [];
  if (number >= 3) codeChoices.push([`${suit}${number - 2}`, `${suit}${number - 1}`] as TileCode[]);
  if (number >= 2 && number <= 8) codeChoices.push([`${suit}${number - 1}`, `${suit}${number + 1}`] as TileCode[]);
  if (number <= 7) codeChoices.push([`${suit}${number + 1}`, `${suit}${number + 2}`] as TileCode[]);

  return codeChoices.flatMap((codes) => {
    const selected = codes.map((code) => hand.find((tile) => tile.code === code));
    return selected.every(Boolean) ? [selected as TileInstance[]] : [];
  });
}
