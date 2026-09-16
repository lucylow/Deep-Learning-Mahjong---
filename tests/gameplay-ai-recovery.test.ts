import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "../app/match/[id].tsx"),
  "utf8",
);

describe("gameplay and AI recovery states", () => {
  it("shows selected-tile discard feedback", () => {
    expect(source).toContain("const selectedTileData = player?.hand.find");
    expect(source).toContain('>Selected discard</Text>');
    expect(source).toContain("Tap a tile to select it");
  });

  it("connects legality and score previews to the backend", () => {
    expect(source).toContain("trpc.mahjong.legalityPreview.useQuery");
    expect(source).toContain("trpc.mahjong.scorePreview.useQuery");
    expect(source).toContain('>Decision preview</Text>');
    expect(source).toContain("Preview points");
  });

  it("offers a retry path when Copilot analysis is stale or unavailable", () => {
    expect(source).toContain("analysis.reset()");
    expect(source).toContain('title="Copilot needs a fresh state"');
    expect(source).toContain(">Retry Copilot</Text>");
  });
});
