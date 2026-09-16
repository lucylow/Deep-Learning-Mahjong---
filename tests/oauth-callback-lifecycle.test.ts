import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "../app/oauth/callback.tsx"),
  "utf8",
);

describe("OAuth callback lifecycle", () => {
  it("clears delayed redirects when the callback screen unmounts", () => {
    expect(source).toContain("let redirectTimer");
    expect(source).toContain("redirectTimer = setTimeout");
    expect(source).toContain("clearTimeout(redirectTimer)");
  });

  it("routes routine callback diagnostics through devLog", () => {
    expect(source).toContain('import { devLog } from "@/lib/_core/dev-log"');
    expect(source).not.toMatch(/console\.(log|debug|info)\(/);
  });
});
