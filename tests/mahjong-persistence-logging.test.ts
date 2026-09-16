import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "../server/mahjong-store.ts"),
  "utf8",
);

describe("Mahjong persistence diagnostics", () => {
  it("keeps expected event persistence fallback logs development-only", () => {
    expect(source).not.toContain('console.warn("[MahjongStore] Event persistence skipped:"');
    expect(source).toContain('devLog("[MahjongStore] Event persistence unavailable; using local audit fallback")');
    expect(source).not.toContain("error instanceof Error ? error.message : error");
  });
});
