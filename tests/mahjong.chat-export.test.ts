import { beforeEach, describe, expect, it, vi } from "vitest";
import { formatVisualMahjongSummary } from "@/shared/mahjong-export";

const { invokeLLM } = vi.hoisted(() => ({ invokeLLM: vi.fn() }));
vi.mock("@/server/_core/llm", () => ({ invokeLLM }));

import { askStrategyChat } from "@/server/mahjong-chat";
import { createMatch } from "@/server/mahjong-store";

describe("strategy chat and visual export", () => {
  beforeEach(() => invokeLLM.mockReset());

  it("formats a visual summary with a bounded confidence bar", () => {
    const summary = formatVisualMahjongSummary({ phase: "east-1", decisions: 12, averageConfidence: 0.7, decisionCount: 10, roundWind: "east", handNumber: 1, dealer: 0, benchmarkCount: 3 });
    expect(summary).toContain("MAHJONG ARENA · SENSEI SUMMARY");
    expect(summary).toContain("Confidence: ▰▰▰▰▰▰▰▱▱▱ 70%");
    expect(summary).toContain("Benchmarks saved: 3");
    expect(summary).toContain("Concealed tiles are never exported");
  });

  it("returns a structured AI answer and safe suggestions for a real experiment", async () => {
    invokeLLM.mockResolvedValue({ choices: [{ message: { content: "Keep the flexible shape and compare the safer discard." } }] });
    const response = await askStrategyChat({ message: "Should I keep this shape?", matchId: createMatch(4411).id });
    expect(response.usedFallback).toBe(false);
    expect(response.answer).toContain("flexible shape");
    expect(response.suggestions.length).toBeGreaterThan(0);
    expect(response.disclaimer).toContain("not guaranteed");
  });

  it("falls back to deterministic strategy guidance when AI returns no usable answer for a real experiment", async () => {
    invokeLLM.mockResolvedValue({ choices: [{ message: { content: "" } }] });
    const response = await askStrategyChat({ message: "What is the safest discard?", matchId: createMatch(4412).id });
    expect(response.usedFallback).toBe(true);
    expect(response.answer.toLowerCase()).toContain("visible danger");
  });

  it("does not invent advice without a real experiment context", async () => {
    const response = await askStrategyChat({ message: "What should I discard?" });
    expect(response.usedFallback).toBe(true);
    expect(response.answer).toContain("Create or select a real experiment first");
    expect(response.answer).not.toContain("visible danger");
    expect(invokeLLM).not.toHaveBeenCalled();
  });
});
