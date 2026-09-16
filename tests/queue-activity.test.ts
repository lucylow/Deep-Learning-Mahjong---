import { describe, expect, it } from "vitest";
import { filterQueueActivity, filterQueueActivityDate, formatQueueActivityCsv, formatQueueActivityJson, formatQueueActivitySummary } from "@/shared/queue-activity";
import type { QueueActivityEvent } from "@/shared/ai-retry-settings";

const events: QueueActivityEvent[] = [
  { id: "1", type: "retry_scheduled", message: "Retry scheduled after attempt 1.", createdAt: "2026-08-15T12:00:00.000Z", promptId: "p1" },
  { id: "2", type: "completed", message: "Sensei answered a queued question.", createdAt: "2026-08-15T12:01:00.000Z", promptId: "p1" },
];

describe("queue activity helpers", () => {
  it("filters by event type and text", () => {
    expect(filterQueueActivity(events, "attempt", "retry_scheduled")).toHaveLength(1);
    expect(filterQueueActivity(events, "sensei", "all")).toHaveLength(1);
  });

  it("filters activity by a stable date range", () => {
    const now = Date.parse("2026-08-15T12:02:00.000Z");
    expect(filterQueueActivityDate(events, "7d", now)).toHaveLength(2);
    expect(filterQueueActivityDate(events, "today", now)).toHaveLength(2);
  });

  it("creates CSV and JSON exports safely", () => {
    const csv = formatQueueActivityCsv(events);
    expect(csv).toContain("id,type,createdAt,promptId,message");
    expect(csv).toContain('"Retry scheduled after attempt 1."');
    expect(JSON.parse(formatQueueActivityJson(events))).toHaveLength(2);
  });

  it("creates a shareable summary with outcome counts", () => {
    const summary = formatQueueActivitySummary(events);
    expect(summary).toContain("Events recorded: 2");
    expect(summary).toContain("Completed: 1");
    expect(summary).toContain("Retries scheduled: 1");
    expect(summary).toContain("Recent activity");
  });
});
