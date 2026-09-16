import { describe, expect, it } from "vitest";
import { analyticsDataOriginLabel, analyticsRecordProvenance, isAnalyticsDataOrigin } from "@/shared/analytics-provenance";

describe("analytics provenance", () => {
  it("labels each data origin clearly", () => {
    expect(analyticsDataOriginLabel("local")).toBe("Saved on this device");
    expect(analyticsDataOriginLabel("server")).toBe("Saved on the server");
    expect(analyticsDataOriginLabel("sample")).toBe("Opt-in sample data");
  });

  it("marks only sample records as non-user-generated", () => {
    expect(analyticsRecordProvenance("local").isUserGenerated).toBe(true);
    expect(analyticsRecordProvenance("server").isUserGenerated).toBe(true);
    expect(analyticsRecordProvenance("sample").isUserGenerated).toBe(false);
  });

  it("rejects unknown origins", () => {
    expect(isAnalyticsDataOrigin("fixture")).toBe(false);
    expect(isAnalyticsDataOrigin("server")).toBe(true);
  });
});
