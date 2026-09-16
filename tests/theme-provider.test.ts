import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const themeProviderSource = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "../lib/theme-provider.tsx"),
  "utf8",
);

describe("theme provider runtime behavior", () => {
  it("does not log during render", () => {
    expect(themeProviderSource).not.toMatch(/console\.(log|debug|info)\(/);
  });

  it("persists and applies Arena theme presets", () => {
    expect(themeProviderSource).toContain('mahjong.arena.themePreset');
    expect(themeProviderSource).toContain('"high-contrast"');
    expect(themeProviderSource).toContain('"low-light"');
    expect(themeProviderSource).toContain("root.dataset.arenaPreset");
    expect(themeProviderSource).toContain("safeSetItem");
  });
});
