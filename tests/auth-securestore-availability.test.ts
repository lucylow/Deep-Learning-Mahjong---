import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "../lib/_core/auth.ts"),
  "utf8",
);

describe("native SecureStore availability", () => {
  it("keeps SecureStore lazy and checks native availability", () => {
    expect(source).toContain('import("expo-secure-store")');
    expect(source).toContain("export async function assertNativeStorageAvailable()");
    expect(source).toContain("isAvailableAsync()");
    expect(source).toContain('if (Platform.OS === "web") return');
  });

  it("preserves an actionable recovery message for unavailable native storage", () => {
    expect(source).toContain("Secure device storage is unavailable. Unlock the device and try again.");
    expect(source).toContain('error.message.startsWith("Secure device storage is unavailable")');
  });
});
