import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "../lib/_core/auth.ts"),
  "utf8",
);

describe("auth storage safety", () => {
  it("uses shared storage guards for web user info", () => {
    expect(source).toContain('import { safeGetItem, safeRemoveItem, safeSetItem } from "@/shared/storage-utils"');
    expect(source).toContain("info = await safeGetItem(USER_INFO_KEY)");
    expect(source).toContain("await safeSetItem(USER_INFO_KEY");
    expect(source).toContain("await safeRemoveItem(USER_INFO_KEY)");
    expect(source).not.toContain("window.localStorage.getItem(USER_INFO_KEY)");
    expect(source).not.toContain("window.localStorage.setItem(USER_INFO_KEY");
    expect(source).not.toContain("window.localStorage.removeItem(USER_INFO_KEY)");
  });
});
