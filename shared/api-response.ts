export function parseJsonText<T>(text: string): T {
  if (!text.trim()) return {} as T;
  try { return JSON.parse(text) as T; } catch { throw new Error("The server returned an unreadable response. Please retry."); }
}

export function normalizeNetworkError(error: unknown): Error {
  if (error instanceof Error && error.message.includes("Network connection failed")) return error;
  if (error instanceof TypeError) return new Error("Network connection failed. Check your connection and retry.");
  if (error instanceof Error) return error;
  return new Error("The request failed unexpectedly. Please retry.");
}

export function getApiErrorMessage(status: number, statusText: string, body: string): string {
  try {
    const parsed = JSON.parse(body) as { error?: unknown; message?: unknown };
    if (typeof parsed.error === "string" && parsed.error.trim()) return parsed.error;
    if (typeof parsed.message === "string" && parsed.message.trim()) return parsed.message;
  } catch {
    // Fall through to the bounded plain-text message.
  }
  const text = body.trim();
  return text.slice(0, 240) || `API call failed (${status}${statusText ? `: ${statusText}` : ""}).`;
}
