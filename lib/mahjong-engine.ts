import type {
  ActionEnvelope,
  GameState,
  HandResult,
  LegalAction,
  Meld,
  PlayerSeat,
  PlayerState,
  TileInstance,
  TileCode,
} from "@/shared/mahjong-types";
import { createWall, isHonor, isSimple, isTerminal, sortTiles, shuffle, tileNumber, tileSuit } from "./mahjong-tiles";
import { canChi, canDeclareRiichi, canKan, canPon, canRon, canTsumo } from "./mahjong-rules";

const WINDS: PlayerState["wind"][] = ["east", "south", "west", "north"];

function drawFromWall(state: GameState, seat: PlayerSeat): TileInstance | undefined {
  const tile = state.wall.shift();
  if (tile) state.players[seat].hand.push(tile);
  return tile;
}

export function createGame(seed = Date.now(), names = ["You", "Mika", "Ren", "Sora"]): GameState {
  const wall = shuffle(createWall(), seed);
  const deadWall = wall.splice(0, 14);
  const players = [0, 1, 2, 3].map((seat) => ({
    seat: seat as PlayerSeat,
    displayName: names[seat] ?? `Player ${seat + 1}`,
    wind: WINDS[seat],
    score: 25_000,
    hand: [] as TileInstance[],
    melds: [] as Meld[],
    discards: [],
    riichi: false,
    connected: true,
  })) as unknown as [PlayerState, PlayerState, PlayerState, PlayerState];

  for (let round = 0; round < 13; round += 1) {
    for (const player of players) {
      const tile = wall.shift();
      if (tile) player.hand.push(tile);
    }
  }
  for (const player of players) player.hand = sortTiles(player.hand);
  const indicators = deadWall.slice(0, 1);
  return {
    id: `match-${seed.toString(36)}`,
    ruleSet: "riichi",
    phase: "playing",
    roundWind: "east",
    handNumber: 1,
    honba: 0,
    riichiSticks: 0,
    dealer: 0,
    currentSeat: 0,
    wall,
    deadWall,
    dora: { indicators, revealed: indicators.map((tile) => tile), },
    players,
    turn: 0,
    seed,
  };
}

function hasTile(state: GameState, seat: PlayerSeat, tileId?: string): TileInstance | undefined {
  return state.players[seat].hand.find((tile) => tile.id === tileId);
}

export function handShanten(tiles: TileInstance[]): number {
  const counts = new Map<string, number>();
  for (const tile of tiles) counts.set(tile.code, (counts.get(tile.code) ?? 0) + 1);
  let pairs = 0;
  let groups = 0;
  for (const count of counts.values()) {
    if (count >= 3) groups += 1;
    if (count >= 2) pairs += 1;
  }
  const sequences = ["m", "p", "s"].reduce((total, suit) => {
    let found = 0;
    for (let number = 1; number <= 7; number += 1) {
      if (counts.has(`${suit}${number}`) && counts.has(`${suit}${number + 1}`) && counts.has(`${suit}${number + 2}`)) found += 1;
    }
    return total + found;
  }, 0);
  groups += sequences;
  const usefulGroups = Math.min(groups, 4);
  const usefulPairs = Math.min(Math.max(pairs - Math.min(usefulGroups, pairs), 0), 1);
  return Math.max(0, 8 - usefulGroups * 2 - usefulPairs);
}

export function estimateUkeire(tiles: TileInstance[]): number {
  const counts = new Map<string, number>();
  for (const tile of tiles) counts.set(tile.code, (counts.get(tile.code) ?? 0) + 1);
  let value = 0;
  for (const tile of tiles) {
    if (isSimple(tile.code)) value += 2;
    else if (isTerminal(tile.code)) value += 1;
    else if (isHonor(tile.code)) value += counts.get(tile.code) === 2 ? 1 : 0;
  }
  return Math.min(23, value);
}

export function legalActions(state: GameState, seat: PlayerSeat = state.currentSeat): LegalAction[] {
  if (state.phase !== "playing" || seat !== state.currentSeat) return [];
  const player = state.players[seat];
  const actions: LegalAction[] = player.hand.map((tile) => ({
    type: "discard",
    seat,
    tileIds: [tile.id],
    label: `Discard ${tile.code}`,
    enabled: true,
  }));
  const riichi = canDeclareRiichi(state, seat);
    if (riichi.allowed) actions.push({ type: "riichi", seat, tileIds: player.hand.map((tile) => tile.id), label: "Declare riichi", enabled: true });
  const tsumo = canTsumo(state, seat);
  if (tsumo.allowed) actions.push({ type: "tsumo", seat, label: "Tsumo", enabled: true });
  if (state.lastDiscard && state.lastDiscard.seat !== seat) {
    const ron = canRon(state, seat);
    if (ron.allowed) actions.push({ type: "ron", seat, label: "Ron", enabled: true });
    if (canPon(player.hand, state.lastDiscard.tile)) actions.push({ type: "pon", seat, tileIds: player.hand.filter((tile) => tile.code === state.lastDiscard?.tile.code).slice(0, 2).map((tile) => tile.id), label: "Pon", enabled: true });
    if (canKan(player.hand, state.lastDiscard.tile)) actions.push({ type: "kan", seat, tileIds: player.hand.filter((tile) => tile.code === state.lastDiscard?.tile.code).slice(0, 3).map((tile) => tile.id), label: "Kan", enabled: true });
    if (canChi(seat, state.lastDiscard.seat, player.hand, state.lastDiscard.tile)) actions.push({ type: "chi", seat, label: "Chi", enabled: true });
    actions.push({ type: "pass", seat, label: "Pass", enabled: true });
  }
  return actions;
}

function advanceToNextSeat(state: GameState) {
  state.currentSeat = ((state.currentSeat + 1) % 4) as PlayerSeat;
  state.turn += 1;
}

function isValidChiSelection(tiles: TileInstance[], discard: TileInstance): boolean {
  if (tiles.length !== 2 || discard.code[0] === "z") return false;
  const suit = tileSuit(discard.code);
  const number = tileNumber(discard.code);
  const selectedCodes = new Set(tiles.map((tile) => tile.code));
  const choices: TileCode[][] = [];
  if (number >= 3) choices.push([`${suit}${number - 2}`, `${suit}${number - 1}`] as TileCode[]);
  if (number >= 2 && number <= 8) choices.push([`${suit}${number - 1}`, `${suit}${number + 1}`] as TileCode[]);
  if (number <= 7) choices.push([`${suit}${number + 1}`, `${suit}${number + 2}`] as TileCode[]);
  return choices.some((choice) => choice.every((code) => selectedCodes.has(code)));
}

export function applyAction(input: GameState, action: ActionEnvelope): GameState {
  const state = structuredClone(input);
  if (state.phase !== "playing") throw new Error("MATCH_NOT_PLAYING");
  if (action.seat !== state.currentSeat) throw new Error("NOT_YOUR_TURN");
  const legal = legalActions(state, action.seat).some((candidate) => candidate.type === action.type && (action.type === "chi" || !action.tileIds?.[0] || candidate.tileIds?.includes(action.tileIds[0])));
  if (!legal) throw new Error("ILLEGAL_ACTION");
  const player = state.players[action.seat];

  if (action.type === "discard") {
    const tile = hasTile(state, action.seat, action.tileIds?.[0]);
    if (!tile) throw new Error("TILE_NOT_IN_HAND");
    player.hand = player.hand.filter((candidate) => candidate.id !== tile.id);
    const discard = { tile, seat: action.seat, tsumogiri: Boolean(action.tsumogiri), turn: state.turn };
    player.discards.push(discard);
    state.lastDiscard = discard;
    advanceToNextSeat(state);
    drawFromWall(state, state.currentSeat);
  } else if (action.type === "riichi") {
    player.riichi = true;
    player.score -= 1_000;
    state.riichiSticks += 1;
    const discard = hasTile(state, action.seat, action.tileIds?.[0]);
    if (!discard) throw new Error("RIICHI_TILE_NOT_IN_HAND");
    player.hand = player.hand.filter((candidate) => candidate.id !== discard.id);
    const riichiDiscard = { tile: discard, seat: action.seat, tsumogiri: false, riichiDeclaration: true, turn: state.turn };
    player.discards.push(riichiDiscard);
    state.lastDiscard = riichiDiscard;
    advanceToNextSeat(state);
    drawFromWall(state, state.currentSeat);
  } else if (action.type === "tsumo" || action.type === "ron") {
    state.phase = "hand_complete";
    state.winner = action.seat;
    state.result = createBasicResult(state, action.seat, action.type);
  } else if (action.type === "pon" || action.type === "kan" || action.type === "chi") {
    const discard = state.lastDiscard;
    if (!discard || discard.seat === action.seat) throw new Error("CLAIM_NOT_AVAILABLE");
    const selectedIds = action.tileIds ?? [];
    const selected = selectedIds.map((id) => hasTile(state, action.seat, id));
    if (selected.some((tile) => !tile)) throw new Error("CLAIM_TILE_NOT_IN_HAND");
    const tiles = selected as TileInstance[];
    const expectedCount = action.type === "chi" || action.type === "pon" ? 2 : 3;
    if (tiles.length !== expectedCount) throw new Error("CLAIM_TILE_COUNT_INVALID");
    if (action.type === "pon" && !canPon(player.hand, discard.tile)) throw new Error("PON_NOT_ALLOWED");
    if (action.type === "kan" && !canKan(player.hand, discard.tile)) throw new Error("KAN_NOT_ALLOWED");
    if (action.type === "chi" && (!canChi(action.seat, discard.seat, player.hand, discard.tile) || !isValidChiSelection(tiles, discard.tile))) throw new Error("CHI_NOT_ALLOWED");
    if (action.type !== "chi" && tiles.some((tile) => tile.code !== discard.tile.code)) throw new Error("CLAIM_TILE_MISMATCH");
    player.hand = player.hand.filter((candidate) => !selectedIds.includes(candidate.id));
    player.melds.push({ type: action.type, tiles: [...tiles, discard.tile], fromSeat: discard.seat, open: true });
    state.currentSeat = action.seat;
  } else if (action.type === "pass") {
    advanceToNextSeat(state);
    drawFromWall(state, state.currentSeat);
  }
  player.hand = sortTiles(player.hand);
  return state;
}

export function createBasicResult(state: GameState, winner: PlayerSeat, method: "ron" | "tsumo"): HandResult {
  const points = method === "tsumo" ? 2_000 : 1_000;
  const scoreDeltas: Record<PlayerSeat, number> = { 0: -points, 1: -points, 2: -points, 3: -points };
  scoreDeltas[winner] = points * 3;
  return { winner, method, points, han: 1, fu: 30, yaku: [method === "tsumo" ? "Menzen Tsumo" : "Ron"], scoreDeltas };
}
