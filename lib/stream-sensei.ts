import { hasAbortController, hasTextDecoder } from "./stream-runtime-utils";

type StreamSenseiInput = {
  message: string;
  matchId?: string;
  history: Array<{ role: "user" | "assistant"; content: string; createdAt: string }>;
};

export async function streamSenseiChat(input: { endpoint: string; token?: string | null; body: StreamSenseiInput; signal?: AbortSignal; onDelta: (delta: string) => void }): Promise<void> {
  if (!hasTextDecoder()) throw new Error("Sensei streaming is unavailable on this device. Please retry in a supported runtime.");

  const controller = hasAbortController() ? new AbortController() : null;
  const inputSignal = input.signal;
  let timedOut = false;
  const timeout = setTimeout(() => {
    timedOut = true;
    controller?.abort();
  }, 45_000);
  const forwardAbort = () => controller?.abort();
  inputSignal?.addEventListener("abort", forwardAbort, { once: true });
  try {
    const response = await fetch(input.endpoint, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json", ...(input.token ? { Authorization: `Bearer ${input.token}` } : {}) },
      body: JSON.stringify(input.body),
      signal: controller?.signal ?? inputSignal,
    });
    if (!response.ok) throw new Error(response.status === 401 ? "Please sign in again before asking Sensei." : `Sensei request failed (${response.status}).`);
    if (!response.body) throw new Error("Sensei did not return a readable response.");
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop() ?? "";
        for (const event of events) {
          const data = event.split("\n").find((line) => line.startsWith("data:"))?.slice(5).trim();
          if (!data || data === "[DONE]") continue;
          try {
            const parsed = JSON.parse(data) as { delta?: string; message?: string };
            if (parsed.message) throw new Error(parsed.message);
            if (parsed.delta) input.onDelta(parsed.delta);
          } catch (error) {
            if (error instanceof Error && !(error instanceof SyntaxError)) throw error;
            throw new Error("Sensei returned an unreadable response.");
          }
        }
      }
    } finally {
      await reader.cancel().catch(() => undefined);
    }
  } catch (error) {
    if (timedOut) throw new Error("Sensei took too long to respond. Please retry.");
    if (inputSignal?.aborted) throw error;
    if (error instanceof TypeError) throw new Error("Network connection failed. Check your connection and retry.");
    throw error;
  } finally {
    clearTimeout(timeout);
    inputSignal?.removeEventListener("abort", forwardAbort);
  }
}
