import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const aiLabSource = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "../app/ai-lab.tsx"),
  "utf8",
);
const streamSource = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "../lib/stream-sensei.ts"),
  "utf8",
);

describe("AI Lab cancellation compatibility", () => {
  it("guards controller construction in the screen", () => {
    expect(aiLabSource).toContain('import { hasAbortController } from "@/lib/stream-runtime-utils"');
    expect(aiLabSource).toContain("hasAbortController() ? new AbortController() : null");
  });

  it("allows streaming without an AbortController signal", () => {
    expect(streamSource).toContain("signal?: AbortSignal");
    expect(streamSource).toContain("inputSignal?.addEventListener");
    expect(streamSource).toContain("controller?.signal ?? inputSignal");
  });

  it("exposes offline and restricted-storage recovery controls", () => {
    expect(aiLabSource).toContain('const [networkStatus, setNetworkStatus]');
    expect(aiLabSource).toContain('window.addEventListener("offline", update)');
    expect(aiLabSource).toContain('safeSetItem("mahjong.aiLab.storageProbe", "ok")');
    expect(aiLabSource).toContain("Retry AI Lab recovery");
    expect(aiLabSource).toContain("Reconnect to create");
  });

  it("queues offline Sensei prompts for automatic reconnect retry", () => {
    expect(aiLabSource).toContain('const [queuedPrompts, setQueuedPrompts]');
    expect(aiLabSource).toContain('mahjong.aiLab.pendingPrompts');
    expect(aiLabSource).toContain('recoveryText(language, "savedOffline")');
    expect(aiLabSource).toContain("flushQueuedPrompts");
    expect(aiLabSource).toContain("queued offline");
  });

  it("provides controls for managing queued Sensei prompts", () => {
    expect(aiLabSource).toContain("sendQueuedPrompt");
    expect(aiLabSource).toContain("removeQueuedPrompt");
    expect(aiLabSource).toContain("clearQueuedPrompts");
    expect(aiLabSource).toContain("Send now");
    expect(aiLabSource).toContain("Clear queued Sensei questions");
  });

  it("surfaces the current connection status in the AI Lab header", () => {
    expect(aiLabSource).toContain("const connectionLabel");
    expect(aiLabSource).toContain("Connection status: ${connectionLabel}");
    expect(aiLabSource).toContain('window.addEventListener("online", update)');
    expect(aiLabSource).toContain('window.addEventListener("offline", update)');
  });

  it("exposes advanced retry settings and queue activity observability", () => {
    expect(aiLabSource).toContain('safeGetItem("mahjong.aiLab.retrySettings")');
    expect(aiLabSource).toContain('safeGetItem("mahjong.aiLab.queueActivity")');
    expect(aiLabSource).toContain("retrySettings.maxAttempts");
    expect(aiLabSource).toContain("retryStatusLabel");
    expect(aiLabSource).toContain('t("queueActivity")');
    expect(aiLabSource).toContain('safeRemoveItem("mahjong.aiLab.queueActivity")');
    expect(aiLabSource).toContain("Clear Sensei queue activity");
    expect(aiLabSource).toContain('router.push("/queue-activity")');
    expect(aiLabSource).toContain("Advanced retry settings");
  });

  it("exposes a persisted automatic-retry preference in connection details", () => {
    expect(aiLabSource).toContain('safeGetItem("mahjong.aiLab.automaticRetries")');
    expect(aiLabSource).toContain('safeSetItem("mahjong.aiLab.automaticRetries", String(next))');
    expect(aiLabSource).toContain('aiLabText(language, automaticRetriesEnabled ? "pauseRetries" : "resumeRetries")');
    expect(aiLabSource).toContain('aiLabText(language, "resumeRetries")');
    expect(aiLabSource).toContain('accessibilityRole="switch"');
  });

  it("exposes the next scheduled retry in connection details", () => {
    expect(aiLabSource).toContain("const nextScheduledPrompt = useMemo");
    expect(aiLabSource).toContain('aiLabText(language, "nextRetry")');
    expect(aiLabSource).toContain("formatQueueRetry(nextScheduledPrompt, language, queueClock)");
  });

  it("uses bounded exponential retry scheduling for failed prompts", () => {
    expect(aiLabSource).toContain("retrySettings.maxAttempts");
    expect(aiLabSource).toContain("retryDelayMs(attempts, retrySettings)");
    expect(aiLabSource).toContain("nextRetryAt");
    expect(aiLabSource).toContain('recoveryText(language, "retryLimitPaused")');
    expect(aiLabSource).toContain("scheduleQueueRetry");
  });

  it("shows retry timing diagnostics for queued prompts", () => {
    expect(aiLabSource).toContain("const formatQueueAttempt");
    expect(aiLabSource).toContain("Last tried");
    expect(aiLabSource).toContain('aiLabText(language, "lastAttemptUnavailable")');
    expect(aiLabSource).toContain("formatQueueAttempt(prompt, language)");
  });

  it("tracks retry attempts and bounds Retry all to three prompts", () => {
    expect(aiLabSource).toContain("attempts?: number");
    expect(aiLabSource).toContain("lastAttemptAt?: string");
    expect(aiLabSource).toContain("lastError?: string");
    expect(aiLabSource).toContain("const snapshot = queuedPromptsRef.current.slice(0, 3)");
    expect(aiLabSource).toContain("Retry up to three queued Sensei questions");
  });

  it("keeps queued prompts when automatic or manual retry fails", () => {
    expect(aiLabSource).toContain("Promise<boolean>");
    expect(aiLabSource).toContain("const sent = await sendChat(prompt.content)");
    expect(aiLabSource).toContain("It remains saved for another attempt.");
    expect(aiLabSource).toContain("lastError: \"Sensei could not answer yet.\"");
  });

  it("provides expandable connection details and recovery access", () => {
    expect(aiLabSource).toContain("showConnectionDetails");
    expect(aiLabSource).toContain('t("connectionDetails")');
    expect(aiLabSource).toContain('t("pendingQuestions")');
    expect(aiLabSource).toContain("Retry connection and local recovery");
    expect(aiLabSource).toContain("connectionTypeLabel");
  });

  it("aborts active chat work when the screen unmounts", () => {
    expect(aiLabSource).toContain("streamControllerRef.current?.abort()");
    expect(aiLabSource).toContain("}, []);");
  });
});
