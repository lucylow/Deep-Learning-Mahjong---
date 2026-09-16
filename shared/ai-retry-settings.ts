export type AiRetrySettings = {
  maxAttempts: number;
  backoffBaseMs: number;
  backoffMaxMs: number;
};

export type QueueActivityEvent = {
  id: string;
  type: "paused" | "resumed" | "retry_scheduled" | "retry_failed" | "completed" | "removed" | "cleared";
  message: string;
  createdAt: string;
  promptId?: string;
};

export const DEFAULT_AI_RETRY_SETTINGS: AiRetrySettings = {
  maxAttempts: 5,
  backoffBaseMs: 1000,
  backoffMaxMs: 60000,
};

export const clampRetrySettings = (value: Partial<AiRetrySettings> | null | undefined): AiRetrySettings => ({
  maxAttempts: Math.min(10, Math.max(1, Math.round(value?.maxAttempts ?? DEFAULT_AI_RETRY_SETTINGS.maxAttempts))),
  backoffBaseMs: Math.min(30000, Math.max(250, Math.round(value?.backoffBaseMs ?? DEFAULT_AI_RETRY_SETTINGS.backoffBaseMs))),
  backoffMaxMs: Math.min(300000, Math.max(1000, Math.round(value?.backoffMaxMs ?? DEFAULT_AI_RETRY_SETTINGS.backoffMaxMs))),
});

export const retryDelayMs = (attempts: number, settings: AiRetrySettings = DEFAULT_AI_RETRY_SETTINGS) =>
  Math.min(settings.backoffMaxMs, settings.backoffBaseMs * 2 ** Math.max(0, attempts - 1));

export const isQueueActivityEvent = (item: unknown): item is QueueActivityEvent => {
  if (!item || typeof item !== "object") return false;
  const candidate = item as Record<string, unknown>;
  return typeof candidate.id === "string" && typeof candidate.type === "string" && typeof candidate.message === "string" && typeof candidate.createdAt === "string";
};

export const formatRetryDuration = (milliseconds: number) => {
  if (!Number.isFinite(milliseconds)) return "Unknown";
  if (milliseconds < 1000) return "now";
  if (milliseconds < 60000) return `${Math.ceil(milliseconds / 1000)}s`;
  return `${Math.ceil(milliseconds / 60000)}m`;
};
