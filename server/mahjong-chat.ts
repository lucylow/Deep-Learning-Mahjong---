import type { StrategyChatMessage, StrategyChatResponse } from "@/shared/mahjong-backend";
import { invokeLLM, invokeLLMStream } from "./_core/llm";
import type { Message } from "./_core/llm";
import { getMatch } from "./mahjong-store";

const disclaimer = "Strategy suggestions are estimates based on visible information; they are not guaranteed winning moves and must not reveal concealed tiles.";

function fallbackAnswer(message: string, matchId?: string): StrategyChatResponse {
  if (!matchId) return { answer: "Create or select a real experiment first. Sensei needs the visible table state to explain a decision without inventing tiles, scores, or recommendations.", suggestions: ["Create an experiment", "Open match history"], disclaimer, usedFallback: true };
  const lower = message.toLowerCase();
  if (lower.includes("defen") || lower.includes("fold") || lower.includes("safe")) {
    return { answer: "Start with visible danger: respect riichi declarations, avoid tiles adjacent to an opponent's recent sequences, and prefer genbutsu when available. Compare the defensive line with the fastest legal route before discarding.", suggestions: ["Which discard is safest?", "Explain genbutsu simply", "Compare speed versus defense"], disclaimer, usedFallback: true };
  }
  if (lower.includes("shanten") || lower.includes("ukeire") || lower.includes("shape")) {
    return { answer: "For hand shape, prefer the discard that preserves the most useful acceptance tiles while keeping multiple routes to tenpai. A slightly lower-value line can be stronger when it keeps the hand flexible.", suggestions: ["What is my best ukeire line?", "Should I prioritize speed?", "Explain this shape without jargon"], disclaimer, usedFallback: true };
  }
  if (lower.includes("riichi") || lower.includes("reach") || lower.includes("call")) {
    return { answer: "Before declaring riichi or calling, check whether the action improves your winning path, preserves enough value, and changes your defensive options. The right choice depends on score pressure, visible danger, and remaining draws.", suggestions: ["Should I declare riichi here?", "When should I call chi or pon?", "What changes when I am ahead?"], disclaimer, usedFallback: true };
  }
  return { answer: matchId ? "I can help you inspect this match. Ask about speed, value, defense, riichi, calls, shanten, ukeire, or a specific discard. I will separate visible facts from uncertain inferences." : "Ask me about shanten, ukeire, defense, riichi, calls, scoring, or how to compare two discard choices.", suggestions: ["What should I discard?", "How do I improve this hand?", "What is the safer line?"], disclaimer, usedFallback: true };
}

function extractText(content: string | Array<{ type: string; text?: string }>): string {
  if (typeof content === "string") return content;
  return content.filter((part) => part.type === "text").map((part) => part.text ?? "").join("\n");
}

export function buildStrategyChatMessages(input: { message: string; matchId?: string; history?: StrategyChatMessage[] }): { message: string; matchId?: string; messages: Message[] } {
  const message = input.message.trim();
  if (!message) throw new Error("CHAT_MESSAGE_REQUIRED");
  const context = input.matchId ? getMatch(input.matchId) : undefined;
  const visibleContext = context ? JSON.stringify({ phase: context.phase, roundWind: context.roundWind, handNumber: context.handNumber, dealer: context.dealer, turn: context.turn, wallRemaining: context.wall.length, scores: context.players.map((player) => ({ seat: player.seat, score: player.score, discards: player.discards.map((discard) => discard.tile.code), meldCount: player.melds.length })), yourHand: context.players[0]?.hand.map((tile) => tile.code) }) : "No live match context was provided.";
  return { message, matchId: input.matchId, messages: [
    { role: "system", content: `You are Mahjong Sensei inside a riichi Mahjong mobile app. Give concise, practical strategy guidance. Use only visible state. Never claim to know concealed opponent tiles. Separate observed facts from inferences, mention uncertainty, and avoid guarantees. Explain technical terms briefly. End with one actionable next step. Current visible context: ${visibleContext}` },
    ...(input.history ?? []).slice(-8).map((entry) => ({ role: entry.role, content: entry.content } as const)),
    { role: "user", content: message },
  ] };
}

export async function askStrategyChat(input: { message: string; matchId?: string; history?: StrategyChatMessage[] }): Promise<StrategyChatResponse> {
  if (!input.matchId) return fallbackAnswer(input.message.trim(), undefined);
  const request = buildStrategyChatMessages(input);
  const message = request.message;
  try {
    const result = await invokeLLM({
      messages: request.messages,
      maxTokens: 700,
    });
    const answer = extractText(result.choices[0]?.message?.content ?? "").trim();
    if (!answer) return fallbackAnswer(message, input.matchId);
    return { answer, suggestions: ["Compare speed and value", "Show the defensive alternative", "Explain the terms"], disclaimer, usedFallback: false };
  } catch (error) {
    console.warn("[MahjongChat] AI fallback:", error);
    return fallbackAnswer(message, input.matchId);
  }
}

export async function streamStrategyChat(input: { message: string; matchId?: string; history?: StrategyChatMessage[] }, signal: AbortSignal, onDelta: (delta: string) => void): Promise<void> {
  const request = buildStrategyChatMessages(input);
  const response = await invokeLLMStream({ messages: request.messages, maxTokens: 700, signal });
  if (!response.body) throw new Error("LLM_STREAM_BODY_MISSING");
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const events = buffer.split("\\n\\n");
      buffer = events.pop() ?? "";
      for (const event of events) {
        const data = event.split("\\n").find((line) => line.startsWith("data:"))?.slice(5).trim();
        if (!data || data === "[DONE]") continue;
        try {
          const parsed = JSON.parse(data) as { choices?: Array<{ delta?: { content?: string } }> };
          const delta = parsed.choices?.[0]?.delta?.content;
          if (delta) onDelta(delta);
        } catch {
          // Ignore non-JSON keepalive frames.
        }
      }
    }
  } finally {
    await reader.cancel().catch(() => undefined);
  }
}
