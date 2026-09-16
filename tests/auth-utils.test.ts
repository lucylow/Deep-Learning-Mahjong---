import { describe, expect, it } from "vitest";
import { isStoredUserPayload } from "@/shared/auth-utils";

describe("auth payload utilities", () => {
  it("accepts a valid persisted user payload", () => {
    expect(isStoredUserPayload({ id: 1, openId: "open-1", name: "Player", email: null, loginMethod: "oauth", lastSignedIn: "2026-08-15T00:00:00.000Z" })).toBe(true);
  });

  it("rejects incomplete identities and invalid dates", () => {
    expect(isStoredUserPayload({ id: "1", openId: "open-1", name: null, email: null, loginMethod: null, lastSignedIn: "2026-08-15" })).toBe(false);
    expect(isStoredUserPayload({ id: 1, openId: "open-1", name: null, email: null, loginMethod: null, lastSignedIn: "not-a-date" })).toBe(false);
    expect(isStoredUserPayload(null)).toBe(false);
  });
});
