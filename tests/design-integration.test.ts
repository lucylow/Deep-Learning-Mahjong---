import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("Figma Make Expo integration", () => {
  it("preserves the downloaded design source as a non-runtime reference", () => {
    expect(existsSync(resolve(process.cwd(), "design-reference/src/App.tsx.source"))).toBe(true);
    expect(existsSync(resolve(process.cwd(), "design-reference/src/index.css"))).toBe(true);
  });

  it("keeps the native dashboard connected to the live match procedure", () => {
    const home = readFileSync(resolve(process.cwd(), "app/(tabs)/index.tsx"), "utf8");
    expect(home).toContain("trpc.mahjong.create.useMutation");
    expect(home).toContain("router.push(\"/ai-lab\")");
    expect(home).toContain("Start AI match");
  });
});
