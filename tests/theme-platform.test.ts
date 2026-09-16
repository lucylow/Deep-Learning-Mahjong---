import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "../lib/theme-provider.tsx"),
  "utf8",
);

describe("theme platform behavior", () => {
  it("does not mutate native Appearance on web", () => {
    expect(source).toContain('Platform.OS !== "web"');
    expect(source).toContain("Appearance.setColorScheme?.(scheme)");
    expect(source).toContain('typeof document !== "undefined"');
  });
});
