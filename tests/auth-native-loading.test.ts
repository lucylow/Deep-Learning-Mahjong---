import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const authSource = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "../lib/_core/auth.ts"), "utf8");

describe("native auth module loading", () => {
  it("defers SecureStore evaluation until native auth is used", () => {
    expect(authSource).not.toMatch(/import \* as SecureStore from/);
    expect(authSource).toContain('import("expo-secure-store")');
  });
});
