import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "../app/review.tsx"),
  "utf8",
);

describe("review replay functionality", () => {
  it("provides connected previous and next decision controls", () => {
    expect(source).toContain("const [replayIndex, setReplayIndex] = useState(0)");
    expect(source).toContain("Previous replay decision");
    expect(source).toContain("Next replay decision");
    expect(source).toContain("Decision {replayIndex + 1} of {timeline.length}");
  });

  it("exposes replay speed and progress controls", () => {
    expect(source).toContain("const [replaySpeed, setReplaySpeed] = useState<0.5 | 1 | 2>(1)");
    expect(source).toContain("Replay speed ${replaySpeed} times, change speed");
    expect(source).toContain("replayProgress");
    expect(source).toContain("Autoplay");
    expect(source).toContain("Jump to replay decision");
    expect(source).toContain("Tap any segment to jump directly to that decision.");
  });

  it("supports persistent replay study bookmarks", () => {
    expect(source).toContain('safeSetItem(bookmarkKey, String(replayIndex))');
    expect(source).toContain('safeGetItem(bookmarkKey)');
    expect(source).toContain('safeRemoveItem(bookmarkKey)');
    expect(source).toContain('Save current replay decision bookmark');
    expect(source).toContain('Clear replay decision bookmark');
    expect(source).toContain('This replay bookmark could not be saved on the device.');
  });

  it("supports direct navigation to a requested discard turn", () => {
    expect(source).toContain("turn?: string; tile?: string");
    expect(source).toContain("requestedTurn");
    expect(source).toContain("requestedTile");
    expect(source).toContain("if (requestedTile) return new Set([requestedTile])");
    expect(source).toContain("const requestedIndex");
    expect(source).toContain("setReplayIndex(Math.min(requestedIndex");
    expect(source).toContain("setIsAutoplaying(false)");
  });

  it("supports direct navigation to a saved replay bookmark", () => {
    expect(source).toContain("const jumpToBookmark = () =>");
    expect(source).toContain("setReplayIndex(Math.min(bookmarkIndex, timeline.length - 1))");
    expect(source).toContain("setIsAutoplaying(false)");
    expect(source).toContain("Jump to saved replay decision bookmark");
  });

  it("highlights the latest confirmed action tile in replay snapshots", () => {
    expect(source).toContain("ReplayBoard");
    expect(source).toContain("Full replay board");
    expect(source).toContain("originating action tile");
    expect(source).toContain("highlightedTileCodes");
    expect(source).toContain("latest confirmed action tile");
    expect(source).toContain("Gold tiles reflect the latest confirmed action.");
  });

  it("surfaces the current decision's Sensei rationale and uncertainty", () => {
    expect(source).toContain("Sensei explanation");
    expect(source).toContain("analysisRecords[replayIndex]?.analysis");
    expect(source).toContain("DEMO_REPLAY_ANALYTICS");
    expect(source).toContain("DEMO_MATCH_REPORT");
    expect(source).toContain("Uncertainty:");
    expect(source).toContain("Refresh active AI explanation");
  });
});
