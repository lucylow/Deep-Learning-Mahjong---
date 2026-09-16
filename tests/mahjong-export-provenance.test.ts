import { describe, expect, it } from "vitest";
import { formatVisualMahjongSummary } from "@/shared/mahjong-export";

describe("visual replay export provenance", () => {
  it("labels server-saved analytics in shared summaries", () => {
    const summary = formatVisualMahjongSummary({ dataOrigin: "server", benchmarkCount: 2 });
    expect(summary).toContain("Data origin: server-saved");
    expect(summary).toContain("Benchmarks saved: 2");
  });

  it("labels opt-in sample summaries honestly", () => {
    expect(formatVisualMahjongSummary({ dataOrigin: "sample" })).toContain("Data origin: opt-in sample");
  });

  it("does not infer server ownership or zero benchmarks when provenance is absent", () => {
    const summary = formatVisualMahjongSummary({});
    expect(summary).toContain("Data origin: not specified");
    expect(summary).toContain("Benchmarks saved: not available");
    expect(summary).not.toContain("Data origin: server-saved");
  });
});
