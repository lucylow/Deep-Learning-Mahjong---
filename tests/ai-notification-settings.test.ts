import { describe, expect, it } from "vitest";
import { clampAiNotificationSettings, DEFAULT_AI_NOTIFICATION_SETTINGS, notificationSettingSummary, shouldNotifyForQueueEvent } from "@/shared/ai-notification-settings";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const settingsSource = readFileSync(resolve(process.cwd(), "app/settings.tsx"), "utf8");
const aiLabSource = readFileSync(resolve(process.cwd(), "app/ai-lab.tsx"), "utf8");
const configSource = readFileSync(resolve(process.cwd(), "app.config.ts"), "utf8");

describe("Sensei notification settings", () => {
  it("uses safe defaults and preserves boolean values", () => {
    expect(clampAiNotificationSettings(undefined)).toEqual(DEFAULT_AI_NOTIFICATION_SETTINGS);
    expect(clampAiNotificationSettings({ retryCompleted: false })).toEqual({ retryCompleted: false, retryFailed: true });
  });

  it("only allows configured terminal queue events to notify", () => {
    expect(shouldNotifyForQueueEvent("completed", { retryCompleted: true, retryFailed: false })).toBe(true);
    expect(shouldNotifyForQueueEvent("retry_failed", { retryCompleted: true, retryFailed: false })).toBe(false);
    expect(shouldNotifyForQueueEvent("paused", DEFAULT_AI_NOTIFICATION_SETTINGS)).toBe(false);
  });

  it("summarizes the active alert preferences", () => {
    expect(notificationSettingSummary({ retryCompleted: true, retryFailed: false })).toContain("Completion alerts on");
    expect(notificationSettingSummary({ retryCompleted: true, retryFailed: false })).toContain("Failure alerts off");
  });

  it("exposes persisted settings and lifecycle notification integration", () => {
    expect(settingsSource).toContain('safeGetItem("mahjong.aiLab.notificationSettings")');
    expect(settingsSource).toContain('safeSetItem("mahjong.aiLab.notificationSettings"');
    expect(settingsSource).toContain("Retry completed");
    expect(settingsSource).toContain("Retry failed");
    expect(aiLabSource).toContain('safeGetItem("mahjong.aiLab.notificationSettings")');
    expect(aiLabSource).toContain("notifyAiQueueEvent");
    expect(configSource).toContain('"expo-notifications"');
  });
});
