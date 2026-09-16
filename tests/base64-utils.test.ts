import { describe, expect, it } from "vitest";
import { decodeBase64Utf8 } from "@/shared/base64-utils";

describe("base64 utils", () => {
  it("decodes UTF-8 OAuth payloads without Buffer", () => {
    const encoded = "eyJuYW1lIjoi5p2x5LqsIiwicm9sZSI6InBsYXllciJ9";
    expect(decodeBase64Utf8(encoded)).toBe('{"name":"東京","role":"player"}');
  });

  it("decodes URL-safe unpadded base64", () => {
    expect(decodeBase64Utf8("eyJvayI6dHJ1ZX0")).toBe('{"ok":true}');
  });

  it("throws a readable error for invalid base64", () => {
    expect(() => decodeBase64Utf8("%%%" )).toThrow();
  });
});
