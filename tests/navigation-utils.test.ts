import { describe, expect, it, vi } from "vitest";
import { getActiveMatchId, runNavigation } from "@/shared/navigation-utils";

describe("navigation utilities", () => {
  it("returns success for sync and async navigation actions", async () => {
    expect(await runNavigation(() => undefined)).toBe(true);
    expect(await runNavigation(async () => undefined)).toBe(true);
  });

  it("normalizes persisted active-match IDs for safe resume routing", () => {
    expect(getActiveMatchId(" match-123 ")).toBe("match-123");
    expect(getActiveMatchId("   ")).toBeNull();
    expect(getActiveMatchId(null)).toBeNull();
  });

  it("captures rejected navigation without throwing", async () => {
    const onError = vi.fn();
    const result = await runNavigation(() => Promise.reject(new Error("stale route")), onError);
    expect(result).toBe(false);
    expect(onError).toHaveBeenCalledOnce();
  });
});
