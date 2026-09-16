import { describe, expect, it } from "vitest";
import { safeParseArray, safeParseJson } from "@/shared/storage-utils";

describe("storage utilities", () => {
  it("parses valid JSON and rejects malformed or empty values", () => {
    expect(safeParseJson<{ ok: boolean }>("{\"ok\":true}")).toEqual({ ok: true });
    expect(safeParseJson("{broken")).toBeNull();
    expect(safeParseJson("")).toBeNull();
    expect(safeParseJson(null)).toBeNull();
  });

  it("preserves array shape for persisted list validation", () => {
    const parsed = safeParseJson<string[]>("[\"one\",\"two\"]");
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed).toEqual(["one", "two"]);
  });

  it("rejects arrays containing malformed records", () => {
    const isString = (item: unknown): item is string => typeof item === "string";
    expect(safeParseArray('["one", "two"]', isString)).toEqual(["one", "two"]);
    expect(safeParseArray('["one", {"bad":true}]', isString)).toBeNull();
  });
});
