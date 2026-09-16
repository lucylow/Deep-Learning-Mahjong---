import { describe, expect, it, vi } from "vitest";
import { devLog, isDevelopmentRuntime } from "@/lib/_core/dev-log";

describe("development diagnostics", () => {
  it("recognizes the test runtime as development-like", () => {
    expect(isDevelopmentRuntime()).toBe(true);
  });

  it("forwards logs in development-like runtimes", () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => undefined);
    devLog("diagnostic", { ok: true });
    expect(logSpy).toHaveBeenCalledWith("diagnostic", { ok: true });
    logSpy.mockRestore();
  });
});
