export interface ReplaySummaryInput {
  phase?: string;
  decisions?: number;
  averageConfidence?: number;
  decisionCount?: number;
  roundWind?: string;
  handNumber?: number;
  dealer?: number;
  benchmarkCount?: number;
  dataOrigin?: "local" | "server" | "sample";
}

function bar(value: number, width = 10): string {
  const safe = Math.max(0, Math.min(1, value));
  const filled = Math.round(safe * width);
  return "▰".repeat(filled) + "▱".repeat(width - filled);
}

export function formatVisualMahjongSummary(input: ReplaySummaryInput): string {
  const confidence = input.averageConfidence ?? 0;
  const originLabel = input.dataOrigin === "sample" ? "opt-in sample" : input.dataOrigin === "local" ? "device-local" : input.dataOrigin === "server" ? "server-saved" : "not specified";
  const benchmarkLabel = input.benchmarkCount === undefined ? "not available" : String(input.benchmarkCount);
  return [
    "MAHJONG ARENA · SENSEI SUMMARY",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    `Run: ${input.phase ?? "current experiment"} · ${input.decisions ?? 0} decisions`,
    `Confidence: ${bar(confidence)} ${Math.round(confidence * 100)}%`,
    `Replay: ${input.decisionCount ?? 0} decisions analyzed`,
    `Round: ${input.roundWind ?? "—"} · Hand ${input.handNumber ?? "—"} · Dealer seat ${input.dealer ?? "—"}`,
    `Benchmarks saved: ${benchmarkLabel}`,
    `Data origin: ${originLabel}`,
    "",
    "Visible-state analytics only. Concealed tiles are never exported.",
  ].join("\n");
}
