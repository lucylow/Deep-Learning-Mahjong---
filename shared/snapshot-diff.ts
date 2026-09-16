import type { ReplaySnapshot } from "./mahjong-backend";

export function summarizeSnapshot(snapshot: ReplaySnapshot) {
  const player = snapshot.state.players[0];
  return { sequence: snapshot.sequence, turn: snapshot.turn, score: player?.score ?? 0, wallCount: snapshot.state.wall.length, hand: player?.hand.map((tile) => tile.code) ?? [], stateHash: snapshot.stateHash.slice(0, 8) };
}

export function compareSnapshots(current: ReplaySnapshot, previous?: ReplaySnapshot) {
  const currentSummary = summarizeSnapshot(current);
  if (!previous) return { ...currentSummary, scoreDelta: 0, wallDelta: 0, addedTiles: currentSummary.hand, removedTiles: [] as string[] };
  const previousSummary = summarizeSnapshot(previous);
  const previousHand = [...previousSummary.hand];
  const addedTiles: string[] = [];
  for (const tile of currentSummary.hand) {
    const index = previousHand.indexOf(tile);
    if (index >= 0) previousHand.splice(index, 1);
    else addedTiles.push(tile);
  }
  return { ...currentSummary, scoreDelta: currentSummary.score - previousSummary.score, wallDelta: currentSummary.wallCount - previousSummary.wallCount, addedTiles, removedTiles: previousHand };
}
