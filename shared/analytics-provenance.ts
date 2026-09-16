export type AnalyticsDataOrigin = "local" | "server" | "sample";

export type AnalyticsRecordProvenance = {
  origin: AnalyticsDataOrigin;
  isUserGenerated: boolean;
};

export const analyticsDataOriginLabel = (origin: AnalyticsDataOrigin): string => {
  switch (origin) {
    case "local": return "Saved on this device";
    case "server": return "Saved on the server";
    case "sample": return "Opt-in sample data";
  }
};

export const analyticsRecordProvenance = (origin: AnalyticsDataOrigin): AnalyticsRecordProvenance => ({
  origin,
  isUserGenerated: origin !== "sample",
});

export const isAnalyticsDataOrigin = (value: unknown): value is AnalyticsDataOrigin => value === "local" || value === "server" || value === "sample";
