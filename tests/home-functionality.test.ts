import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "../app/(tabs)/index.tsx"),
  "utf8",
);

describe("Home functionality", () => {
  it("offers resume-aware Continue behavior", () => {
    expect(source).toContain("const continueMatch = () =>");
    expect(source).toContain("if (activeMatchId)");
    expect(source).toContain("router.push(`/match/${activeMatchId}`)");
    expect(source).toContain("startMatch();");
    expect(source).toContain("Resume active match");
  });

  it("exposes a confirmed abandon action with storage failure feedback", () => {
    expect(source).toContain("const abandonActiveMatch = () =>");
    expect(source).toContain('"Abandon active match?"');
    expect(source).toContain('text: "Keep match"');
    expect(source).toContain('text: "Abandon"');
    expect(source).toContain('safeRemoveItem("mahjong.activeMatchId")');
    expect(source).toContain("The active match could not be cleared from this device.");
    expect(source).toContain('accessibilityLabel="Abandon active match"');
  });

  it("keeps active-match storage loading cancellable", () => {
    expect(source).toContain("let cancelled = false;");
    expect(source).toContain("if (cancelled) return;");
    expect(source).toContain("return () => { cancelled = true; };");
  });
});
