import { describe, expect, it } from "vitest";
import { toUserErrorMessage } from "@/shared/error-utils";

describe("error message normalization", () => {
  it("preserves useful Error and string messages", () => {
    expect(toUserErrorMessage(new Error("Network unavailable"))).toBe("Network unavailable");
    expect(toUserErrorMessage("Try again later")).toBe("Try again later");
  });

  it("uses a safe fallback for unknown failures", () => {
    expect(toUserErrorMessage({ code: "UNKNOWN" })).toBe("Something went wrong. Please try again.");
  });
});
