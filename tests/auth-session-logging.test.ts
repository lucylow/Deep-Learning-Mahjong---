import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "../server/_core/sdk.ts"),
  "utf8",
);

describe("server auth session diagnostics", () => {
  it("keeps expected missing-session diagnostics development-only", () => {
    expect(source).toContain('devLog("[Auth] Missing session cookie")');
    expect(source).not.toContain('console.warn("[Auth] Missing session cookie")');
  });
});
