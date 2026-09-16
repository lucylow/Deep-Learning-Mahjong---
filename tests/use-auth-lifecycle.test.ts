import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "../hooks/use-auth.ts"),
  "utf8",
);

describe("useAuth lifecycle safety", () => {
  it("guards async state updates after unmount", () => {
    expect(source).toContain("const mountedRef = useRef(true)");
    expect(source).toContain("if (mountedRef.current) setUser(next)");
    expect(source).toContain("if (mountedRef.current) setLoading(next)");
    expect(source).toContain("if (mountedRef.current) setError(next)");
    expect(source).toContain("mountedRef.current = false");
  });
});
