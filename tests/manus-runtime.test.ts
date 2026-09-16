import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "../lib/_core/manus-runtime.ts"),
  "utf8",
);

describe("Manus runtime bridge", () => {
  it("does not treat SSR without window as an iframe", () => {
    expect(source).toContain('Platform.OS !== "web" || typeof window === "undefined"');
  });

  it("routes bridge logs through the development logger", () => {
    expect(source).toContain('import { devLog } from "./dev-log"');
    expect(source).not.toMatch(/console\.(log|debug|info)\(/);
  });
});
