import { describe, expect, it } from "vitest";
import { appendActionLifecycle, actionLifecycleDetail, actionLifecycleLabel, createActionLifecycleEntry, formatActionLifecycleTime, isActionLifecycleEntry } from "@/shared/action-lifecycle";
import type { ActionEnvelope } from "@/shared/mahjong-types";

const discard: ActionEnvelope = { type: "discard", seat: 0, tileIds: ["m1-0"], tsumogiri: false };

describe("action lifecycle", () => {
  it("uses readable labels and status-specific detail", () => {
    expect(actionLifecycleLabel("riichi")).toBe("Riichi");
    expect(actionLifecycleLabel("pon")).toBe("PON");
    expect(actionLifecycleDetail("retrying", "discard")).toContain("Retrying discard");
    expect(actionLifecycleDetail("rejected", "discard")).toContain("not accepted");
  });

  it("localizes Mahjong actions for Simplified and Traditional Chinese", () => {
    expect(actionLifecycleLabel("discard", "zh-Hans")).toBe("打牌");
    expect(actionLifecycleLabel("ron", "zh-Hans")).toBe("荣和");
    expect(actionLifecycleLabel("kan", "zh-Hant")).toBe("槓");
    expect(actionLifecycleDetail("confirmed", "tsumo", "zh-Hant")).toContain("已確認自摸");
    expect(actionLifecycleDetail("rejected", "discard", "zh-Hans")).toContain("未被接受");
  });

  it("creates entries with tile identity and keeps only the bounded tail", () => {
    const first = createActionLifecycleEntry({ ...discard, tileCodes: ["m1"] }, "pending", "first");
    expect(first.tileIds).toEqual(["m1-0"]);
    expect(first.tileCodes).toEqual(["m1"]);
    expect(first.seat).toBe(0);
    const second = createActionLifecycleEntry(discard, "confirmed", "second");
    const third = createActionLifecycleEntry(discard, "rejected", "third");
    expect(appendActionLifecycle([first, second], third, 2).map((entry) => entry.id)).toEqual(["second", "third"]);
  });

  it("rejects malformed persisted entries without throwing", () => {
    expect(isActionLifecycleEntry({ id: "ok", action: "discard", status: "confirmed", label: "Discard", detail: "done", createdAt: "now" })).toBe(true);
    expect(isActionLifecycleEntry({ id: "bad", action: "discard" })).toBe(false);
    expect(isActionLifecycleEntry({ id: "bad-seat", action: "discard", status: "confirmed", label: "Discard", detail: "done", createdAt: "now", seat: 4 })).toBe(false);
  });

  it("formats valid and invalid timestamps without throwing", () => {
    expect(formatActionLifecycleTime("2026-01-02T03:04:05.000Z")).toMatch(/\d/);
    expect(formatActionLifecycleTime("not-a-date")).toBe("Time unavailable");
    expect(formatActionLifecycleTime("not-a-date", "zh-Hans")).toBe("时间不可用");
    expect(formatActionLifecycleTime("not-a-date", "zh-Hant")).toBe("時間不可用");
  });
});
