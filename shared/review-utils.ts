import type { AIOpponentDecision } from "./mahjong-backend";

export function presentDecision(decision: AIOpponentDecision, index: number) {
  return {
    key: `${decision.createdAt}-${index}`,
    label: `Moment ${index + 1} · seat ${decision.seat}`,
    title: decision.objective,
    policy: decision.policy,
    confidence: `${Math.round(decision.confidence * 100)}%`,
    detail: decision.rationale || "The AI recorded a legal decision from visible state.",
    action: decision.action.type,
    contributions: decision.contributions.slice(0, 3),
    timestamp: new Date(decision.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  };
}
