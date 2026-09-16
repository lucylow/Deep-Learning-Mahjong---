import type { HandResult, PlayerSeat } from "./mahjong-types";

export interface ScoreBreakdownLine {
  label: string;
  han: number;
  detail: string;
}

export interface ScoreBreakdown {
  lines: ScoreBreakdownLine[];
  basePoints: number;
  paymentLabel: string;
  formula: string;
}

function calculateBasePoints(han: number, fu: number): number {
  if (han >= 13) return 8_000;
  if (han >= 11) return 6_000;
  if (han >= 8) return 4_000;
  if (han >= 6) return 3_000;
  return Math.min(2_000, fu * 2 ** (han + 2));
}

export function buildScoreBreakdown(result: HandResult, winner: PlayerSeat, dealer: PlayerSeat): ScoreBreakdown {
  const yakuLines = result.yaku.map((label) => ({ label, han: 1, detail: "1 han" }));
  const bonusHan = Math.max(0, result.han - yakuLines.reduce((sum, line) => sum + line.han, 0));
  const lines = bonusHan > 0
    ? [...yakuLines, { label: "Dora / bonus han", han: bonusHan, detail: `${bonusHan} han` }]
    : yakuLines;
  const basePoints = calculateBasePoints(result.han, result.fu);
  const winnerDelta = result.scoreDeltas[winner] ?? result.points;
  const ronPayment = Math.abs(winnerDelta);
  const paymentLabel = result.method === "ron"
    ? `Ron payment · ${ronPayment.toLocaleString()} points`
    : `Tsumo total · ${winnerDelta.toLocaleString()} points`;
  const formula = `${result.fu} fu × 2^(${result.han} han + 2) = ${basePoints.toLocaleString()} base${result.han >= 6 ? " · limit applied" : ""}`;

  return { lines, basePoints, paymentLabel, formula: `${formula} · ${winner === dealer ? "dealer" : "non-dealer"}` };
}
