import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const apiSource = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "../lib/_core/api.ts"),
  "utf8",
);
const authHookSource = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "../hooks/use-auth.ts"),
  "utf8",
);

describe("Expo auth refresh cancellation", () => {
  it("passes an optional signal through the web current-user request", () => {
    expect(apiSource).toContain("export async function getMe(signal?: AbortSignal)");
    expect(apiSource).toContain('apiCall<{ user: any }>("/api/auth/me", { signal })');
    expect(apiSource).toContain('error.name === "AbortError"');
  });

  it("cancels refresh work on teardown and ignores abort as an auth error", () => {
    expect(authHookSource).toContain("const refreshControllerRef = useRef<AbortController | null>(null)");
    expect(authHookSource).toContain("refreshControllerRef.current?.abort()");
    expect(authHookSource).toContain("const controller = hasAbortController() ? new AbortController() : null");
    expect(authHookSource).toContain("if (isAbortError(err) || controller?.signal.aborted)");
    expect(authHookSource).toContain("void fetchUser()");
  });
});
