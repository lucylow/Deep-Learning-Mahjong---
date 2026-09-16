import { describe, expect, it } from "vitest";
import { describeGameplaySync } from "@/shared/gameplay-sync";

describe("gameplay synchronization", () => {
  it("reports a healthy fresh table", () => {
    const status = describeGameplaySync({ isFetching: false, hasError: false, dataUpdatedAt: 9_000, now: 10_000 });
    expect(status.label).toBe("Table synced");
    expect(status.needsRetry).toBe(false);
    expect(status.actionSafe).toBe(true);
    expect(status.ageLabel).toBe("Updated 1s ago");
  });

  it("prioritizes active refresh and reconnect errors", () => {
    expect(describeGameplaySync({ isFetching: true, hasError: false, dataUpdatedAt: 9_000, now: 10_000 }).tone).toBe("refreshing");
    expect(describeGameplaySync({ isFetching: true, hasError: false, dataUpdatedAt: 9_000, now: 10_000 }).actionSafe).toBe(false);
    expect(describeGameplaySync({ isFetching: false, hasError: true, dataUpdatedAt: 9_000, now: 10_000 }).needsRetry).toBe(true);
  });

  it("flags an old response before the player acts", () => {
    const status = describeGameplaySync({ isFetching: false, hasError: false, dataUpdatedAt: 1_000, now: 10_000 });
    expect(status.tone).toBe("stale");
    expect(status.actionSafe).toBe(false);
    expect(status.detail).toContain("Refresh before acting");
  });

  it("blocks actions immediately when the device is offline", () => {
    const status = describeGameplaySync({ isFetching: false, hasError: false, networkOffline: true, dataUpdatedAt: 9_000, now: 10_000 });
    expect(status.label).toBe("Offline — reconnecting");
    expect(status.tone).toBe("offline");
    expect(status.needsRetry).toBe(true);
    expect(status.actionSafe).toBe(false);
    expect(status.detail).toContain("device is offline");
  });
});
