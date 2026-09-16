import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const useAuthSource = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "../hooks/use-auth.ts"),
  "utf8",
);

describe("useAuth diagnostics", () => {
  it("does not emit unconditional routine console logs", () => {
    expect(useAuthSource).not.toMatch(/console\.(log|debug|info)\(/);
    expect(useAuthSource).toContain("devLog(");
  });
});
