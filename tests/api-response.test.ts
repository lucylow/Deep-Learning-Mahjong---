import { describe, expect, it } from "vitest";
import { getApiErrorMessage, normalizeNetworkError, parseJsonText } from "@/shared/api-response";

describe("API response helpers", () => {
  it("extracts safe JSON error messages and bounds plain text", () => {
    expect(getApiErrorMessage(400, "Bad Request", '{"message":"Invalid move"}')).toBe("Invalid move");
    expect(getApiErrorMessage(503, "Unavailable", "")).toBe("API call failed (503: Unavailable).");
    expect(getApiErrorMessage(500, "Error", "x".repeat(500))).toHaveLength(240);
  });

  it("normalizes low-level request failures", () => {
    expect(normalizeNetworkError(new TypeError("fetch failed")).message).toContain("Network connection failed");
    expect(normalizeNetworkError("unknown").message).toContain("failed unexpectedly");
    const existing = new Error("already readable");
    expect(normalizeNetworkError(existing)).toBe(existing);
  });

  it("parses valid text and normalizes invalid responses", () => {
    expect(parseJsonText<{ ok: boolean }>("{\"ok\":true}")).toEqual({ ok: true });
    expect(parseJsonText<Record<string, never>>(" ")).toEqual({});
    expect(() => parseJsonText("not json")).toThrow("unreadable response");
  });
});
