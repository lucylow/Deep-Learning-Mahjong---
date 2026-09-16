import { describe, expect, it } from "vitest";
import { hasAbortController, hasTextDecoder } from "@/lib/stream-runtime-utils";

describe("Sensei streaming runtime utilities", () => {
  it("detects the current runtime streaming primitives", () => {
    expect(hasAbortController()).toBe(typeof AbortController === "function");
    expect(hasTextDecoder()).toBe(typeof TextDecoder === "function");
  });
});
