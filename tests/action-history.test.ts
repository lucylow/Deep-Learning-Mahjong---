import { describe, expect, it } from "vitest";
import { recentMatchEvents } from "@/shared/action-history";
import type { MatchEvent } from "@/shared/mahjong-backend";

describe("live action history presentation", () => {
  it("orders newest backend events first and preserves action context", () => {
    const events: MatchEvent[] = [
      { id: "a", matchId: "m", sequence: 1, type: "match_created", stateHash: "a", createdAt: "2026-01-01T00:00:00Z" },
      { id: "b", matchId: "m", sequence: 2, type: "action_submitted", actorSeat: 0, action: { type: "discard", seat: 0, tileIds: ["m1"], tsumogiri: false }, stateHash: "b", createdAt: "2026-01-01T00:00:01Z" },
    ];
    expect(recentMatchEvents(events)).toEqual([
      { key: "2-b", title: "action submitted", detail: "Seat 0 · discard", sequence: 2, createdAt: "2026-01-01T00:00:01Z", time: "12:00 AM", stateHash: "b" },
      { key: "1-a", title: "match created", detail: "System", sequence: 1, createdAt: "2026-01-01T00:00:00Z", time: "12:00 AM", stateHash: "a" },
    ]);
  });
});
