import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "../components/app-error-boundary.tsx"),
  "utf8",
);

describe("app error boundary recovery", () => {
  it("guards browser-only route reset from native Expo builds", () => {
    expect(source).toContain('Platform.OS !== "web"');
    expect(source).toContain('typeof window === "undefined"');
    expect(source).toContain('window.location.assign("/")');
  });
});
