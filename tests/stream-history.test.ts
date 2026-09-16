import { describe, expect, it, vi } from "vitest";
import { archiveMatchHistoryEntry, removeMatchHistoryEntry, type MatchHistoryEntry } from "@/shared/match-history";
import { streamSenseiChat } from "@/lib/stream-sensei";

const entry: MatchHistoryEntry = { id: "match-1", createdAt: "2026-08-15T01:00:00.000Z", label: "Experiment" };

describe("streaming Sensei and match management", () => {
  it("archives and deletes local match entries deterministically", () => {
    expect(archiveMatchHistoryEntry([entry], entry.id)[0]?.archived).toBe(true);
    expect(removeMatchHistoryEntry([entry], entry.id)).toEqual([]);
  });

  it("parses streamed Sensei deltas", async () => {
    const originalFetch = globalThis.fetch;
    const body = new ReadableStream({ start(controller) { controller.enqueue(new TextEncoder().encode('data: {"delta":"Hello"}\n\n')); controller.enqueue(new TextEncoder().encode('data: {"delta":" world"}\n\ndata: [DONE]\n\n')); controller.close(); } });
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(body, { status: 200 })));
    const deltas: string[] = [];
    await streamSenseiChat({ endpoint: "/stream", body: { message: "hello", history: [] }, signal: new AbortController().signal, onDelta: (delta) => deltas.push(delta) });
    expect(deltas.join("")).toBe("Hello world");
    vi.stubGlobal("fetch", originalFetch);
  });
});

  it("normalizes HTTP and malformed stream failures", async () => {
    const originalFetch = globalThis.fetch;
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("", { status: 503 })));
    await expect(streamSenseiChat({ endpoint: "/stream", body: { message: "hello", history: [] }, signal: new AbortController().signal, onDelta: () => undefined })).rejects.toThrow("Sensei request failed (503).");
    const body = new ReadableStream({ start(controller) { controller.enqueue(new TextEncoder().encode("data: {invalid}\n\n")); controller.close(); } });
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(body, { status: 200 })));
    await expect(streamSenseiChat({ endpoint: "/stream", body: { message: "hello", history: [] }, signal: new AbortController().signal, onDelta: () => undefined })).rejects.toThrow("Sensei returned an unreadable response.");
    vi.stubGlobal("fetch", originalFetch);
  });
