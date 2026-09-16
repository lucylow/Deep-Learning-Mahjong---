import { describe, expect, it } from "vitest";
import { arenaTokens } from "@/constants/arena-tokens";

describe("Mahjong Arena visual tokens", () => {
  it("keeps the premium jade, brass, and ivory palette stable", () => {
    expect(arenaTokens.color.jade).toBe("#1A3A2F");
    expect(arenaTokens.color.brass).toBe("#D4AF70");
    expect(arenaTokens.color.ivory).toBe("#F5F0E8");
  });

  it("provides bounded mobile-friendly motion and tap radii", () => {
    expect(arenaTokens.motion.press).toBeLessThanOrEqual(100);
    expect(arenaTokens.motion.screen).toBeLessThanOrEqual(320);
    expect(arenaTokens.radius.md).toBeGreaterThanOrEqual(12);
  });
});
