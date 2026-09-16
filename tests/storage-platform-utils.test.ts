import { describe, expect, it } from "vitest";
import { shouldUseWebStorage } from "@/shared/storage-platform-utils";

describe("storage platform utilities", () => {
  it("selects browser storage only when web storage is available", () => {
    expect(shouldUseWebStorage("web", true)).toBe(true);
    expect(shouldUseWebStorage("web", false)).toBe(false);
    expect(shouldUseWebStorage("ios", true)).toBe(false);
    expect(shouldUseWebStorage("android", true)).toBe(false);
  });
});
