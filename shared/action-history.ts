import type { MatchEvent, ReplaySnapshot } from "@/shared/mahjong-backend";

export function formatMatchEvent(event: MatchEvent) {
  const actor = event.actorSeat === undefined ? "System" : `Seat ${event.actorSeat}`;
  const action = event.action?.type ? ` · ${event.action.type}` : "";
  return { key: `${event.sequence}-${event.id}`, title: event.type.replace(/_/g, " "), detail: `${actor}${action}`, sequence: event.sequence, createdAt: event.createdAt };
}

export function formatAuditTime(createdAt: string) {
  const date = new Date(createdAt);
  return Number.isNaN(date.getTime()) ? "Unknown time" : date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function recentMatchEvents(events: MatchEvent[], limit = 6, snapshots: ReplaySnapshot[] = []) {
  return [...events].sort((a, b) => b.sequence - a.sequence).slice(0, limit).map((event) => {
    const snapshot = snapshots.find((candidate) => candidate.sequence === event.sequence);
    const player = snapshot?.state.players[0];
    return { ...formatMatchEvent(event), time: formatAuditTime(event.createdAt), stateHash: event.stateHash.slice(0, 8), snapshot: snapshot ? { turn: snapshot.turn, wallCount: snapshot.state.wall.length, score: player?.score, visibleHand: player?.hand.map((tile) => tile.code).slice(0, 13) ?? [] } : undefined };
  });
}
