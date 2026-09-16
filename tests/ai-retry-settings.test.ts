import { describe, expect, it } from "vitest";
import { clampRetrySettings, isQueueActivityEvent, retryDelayMs } from "@/shared/ai-retry-settings";

describe("advanced AI retry settings", () => {
  it("clamps unsafe values to bounded settings", () => {
    expect(clampRetrySettings({ maxAttempts: 99, backoffBaseMs: 1, backoffMaxMs: 999999 })).toEqual({ maxAttempts: 10, backoffBaseMs: 250, backoffMaxMs: 300000 });
  });

  it("uses the configured exponential backoff ceiling", () => {
    const settings = clampRetrySettings({ maxAttempts: 4, backoffBaseMs: 500, backoffMaxMs: 2000 });
    expect(retryDelayMs(1, settings)).toBe(500);
    expect(retryDelayMs(3, settings)).toBe(2000);
    expect(retryDelayMs(8, settings)).toBe(2000);
  });

  it("validates persisted queue activity events", () => {
    expect(isQueueActivityEvent({ id: "1", type: "completed", message: "Done", createdAt: new Date().toISOString() })).toBe(true);
    expect(isQueueActivityEvent({ id: "1", type: "completed" })).toBe(false);
  });
});
