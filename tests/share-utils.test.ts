import { describe, expect, it } from "vitest";
import { runShare } from "@/shared/share-utils-core";

describe("share utilities", () => {
  it("returns true when the share sheet completes", async () => {
    await expect(runShare(async () => ({ action: "shared" }), "Summary", "text", "dismissed")).resolves.toBe(true);
  });

  it("returns false when sharing is dismissed or rejected", async () => {
    await expect(runShare(async () => ({ action: "dismissed" }), "Summary", "text", "dismissed")).resolves.toBe(false);
    await expect(runShare(async () => { throw new Error("share unavailable"); }, "Summary", "text", "dismissed")).resolves.toBe(false);
  });
});
