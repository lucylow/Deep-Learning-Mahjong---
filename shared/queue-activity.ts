import type { QueueActivityEvent } from "@/shared/ai-retry-settings";

export const QUEUE_ACTIVITY_STORAGE_KEY = "mahjong.aiLab.queueActivity";

export const queueActivityTypeLabel = (type: QueueActivityEvent["type"]) => {
  switch (type) {
    case "completed": return "Completed";
    case "paused": return "Paused";
    case "resumed": return "Resumed";
    case "retry_scheduled": return "Retry scheduled";
    case "retry_failed": return "Retry failed";
    case "removed": return "Removed";
    case "cleared": return "Cleared";
  }
};

export const queueActivityIcon = (type: QueueActivityEvent["type"]) => {
  switch (type) {
    case "completed": return "✓";
    case "paused": return "Ⅱ";
    case "resumed": return "▶";
    case "retry_scheduled": return "◷";
    case "retry_failed": return "!";
    case "removed": return "−";
    case "cleared": return "⌫";
  }
};

export const queueActivityColor = (type: QueueActivityEvent["type"]) => {
  switch (type) {
    case "completed": return "#2E6A59";
    case "paused": return "#8B5A2B";
    case "resumed": return "#2E6A59";
    case "retry_scheduled": return "#8B5A2B";
    case "retry_failed": return "#8E3D2E";
    case "removed": return "#68776F";
    case "cleared": return "#68776F";
  }
};

export const formatQueueActivityTime = (createdAt: string) => {
  const timestamp = Date.parse(createdAt);
  if (Number.isNaN(timestamp)) return "Time unavailable";
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(timestamp);
};

export const filterQueueActivity = (events: QueueActivityEvent[], query: string, type: QueueActivityEvent["type"] | "all") => {
  const normalized = query.trim().toLowerCase();
  return events.filter((event) => (type === "all" || event.type === type) && (!normalized || `${event.message} ${event.promptId ?? ""}`.toLowerCase().includes(normalized)));
};

export type QueueActivityDateRange = "all" | "today" | "7d";

export const filterQueueActivityDate = (events: QueueActivityEvent[], range: QueueActivityDateRange, now = Date.now()) => {
  if (range === "all") return events;
  const start = range === "today" ? new Date(new Date(now).setHours(0, 0, 0, 0)).getTime() : now - 7 * 24 * 60 * 60 * 1000;
  return events.filter((event) => { const timestamp = Date.parse(event.createdAt); return !Number.isNaN(timestamp) && timestamp >= start && timestamp <= now; });
};

export const parseActivityDateInput = (value: string, endOfDay = false) => {
  const trimmed = value.trim();
  if (!/^\\d{4}-\\d{2}-\\d{2}$/.test(trimmed)) return null;
  const timestamp = Date.parse(`${trimmed}T${endOfDay ? "23:59:59.999" : "00:00:00.000"}`);
  return Number.isNaN(timestamp) ? null : timestamp;
};

export const filterQueueActivityCustomDate = (events: QueueActivityEvent[], from: string, to: string, now = Date.now()) => {
  const start = from.trim() ? parseActivityDateInput(from) : null;
  const end = to.trim() ? parseActivityDateInput(to, true) : now;
  if ((from.trim() && start === null) || (to.trim() && end === null) || (start !== null && end !== null && start > end)) return { events: [], error: "Use valid dates in YYYY-MM-DD format with the start date before the end date." };
  return { events: events.filter((event) => { const timestamp = Date.parse(event.createdAt); return !Number.isNaN(timestamp) && (start === null || timestamp >= start) && (end === null || timestamp <= end); }), error: null };
};

export const formatQueueActivityCsv = (events: QueueActivityEvent[]) => {
  const escape = (value: string) => `"${value.replace(/"/g, '""')}"`;
  const rows = events.map((event) => [event.id, event.type, event.createdAt, event.promptId ?? "", event.message].map(escape).join(","));
  return ["id,type,createdAt,promptId,message", ...rows].join("\\n");
};

export const formatQueueActivityJson = (events: QueueActivityEvent[]) => JSON.stringify(events, null, 2);

export const formatQueueActivitySummary = (events: QueueActivityEvent[]) => {
  const counts = events.reduce<Record<string, number>>((result, event) => { result[event.type] = (result[event.type] ?? 0) + 1; return result; }, {});
  const lines = ["Mahjong Sensei queue activity", `Events recorded: ${events.length}`, `Completed: ${counts.completed ?? 0}`, `Retry failures: ${counts.retry_failed ?? 0}`, `Retries scheduled: ${counts.retry_scheduled ?? 0}`, `Paused: ${counts.paused ?? 0}`, `Resumed: ${counts.resumed ?? 0}`];
  const recent = events.slice(-3).reverse().map((event) => `• ${queueActivityTypeLabel(event.type)} — ${event.message} (${formatQueueActivityTime(event.createdAt)})`);
  return [...lines, "", "Recent activity", ...(recent.length ? recent : ["No activity recorded."])].join("\\n");
};
