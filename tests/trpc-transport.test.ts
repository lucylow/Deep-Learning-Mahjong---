import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const trpcSource = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "../lib/trpc.ts"),
  "utf8",
);

describe("tRPC Expo transport", () => {
  it("guards AbortController and preserves the original signal fallback", () => {
    expect(trpcSource).toContain("hasAbortController()");
    expect(trpcSource).toContain("controller?.signal ?? originalSignal");
    expect(trpcSource).not.toContain("signal: controller.signal");
  });
});
