import { describe, expect, it } from "vitest";
import { analyticsFreshnessLabel, clampPaymentNotificationSettings, filterEventsByRange, formatRate, latestMonetizationEventAt, monetizationEventsToCsv, monetizationSummaryToCsv, summarizeMonetizationEvents } from "@/shared/monetization-analytics";
import type { MonetizationEvent } from "@/shared/monetization-analytics";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const analyticsSource = readFileSync(resolve(process.cwd(), "shared/monetization-analytics.ts"), "utf8");
const upgradeSource = readFileSync(resolve(process.cwd(), "app/upgrade.tsx"), "utf8");
const billingHistorySource = readFileSync(resolve(process.cwd(), "app/billing-history.tsx"), "utf8");
const settingsSource = readFileSync(resolve(process.cwd(), "app/settings.tsx"), "utf8");
const revenueSource = readFileSync(resolve(process.cwd(), "app/revenue.tsx"), "utf8");

describe("monetization dashboard analytics", () => {
  const now = new Date("2026-08-17T12:00:00.000Z");
  const events: MonetizationEvent[] = [
    { id: "1", name: "paywall_viewed", createdAt: "2026-08-16T12:00:00.000Z" },
    { id: "2", name: "checkout_started", createdAt: "2026-08-15T12:00:00.000Z" },
    { id: "3", name: "checkout_completed", createdAt: "2026-08-14T12:00:00.000Z" },
    { id: "4", name: "paywall_viewed", createdAt: "2026-07-01T12:00:00.000Z", promotion: "annual, savings" },
  ];

  it("filters events by a selected range", () => {
    expect(filterEventsByRange(events, "7d", now)).toHaveLength(3);
    expect(filterEventsByRange(events, "30d", now)).toHaveLength(3);
    expect(filterEventsByRange(events, "all", now)).toHaveLength(4);
  });

  it("calculates funnel rates without dividing by zero", () => {
    const summary = summarizeMonetizationEvents(events.slice(0, 3));
    expect(summary.paywallToCheckoutRate).toBe(1);
    expect(summary.interestSaveRate).toBe(0);
    expect(summary.billingIntentRate).toBe(0);
    expect(summary.monthlyInterest).toBe(0);
    expect(summary.annualInterest).toBe(0);
    expect(summary.checkoutCompletionRate).toBe(1);
    expect(formatRate(summary.checkoutCompletionRate)).toBe("100%");
    expect(summarizeMonetizationEvents([]).checkoutCompletionRate).toBe(0);
  });

  it("exports an aggregate summary separately from raw events", () => {
    const csv = monetizationSummaryToCsv(summarizeMonetizationEvents(events.slice(0, 3)), "30d");
    expect(csv).toContain("metric,value");
    expect(csv).toContain("sample_quality,Preliminary local sample");
    expect(csv).toContain("signal_freshness,No local signal");
    expect(csv).toContain("interest_save_rate,0%");
    expect(csv).toContain("checkout_completion_rate,100%");
    expect(csv).not.toContain("event_id");
  });

  it("escapes CSV values safely", () => {
    const csv = monetizationEventsToCsv(events.slice(-1));
    expect(csv).toContain('"annual, savings"');
    expect(csv.split("\n")).toHaveLength(2);
  });

  it("records only bounded local interaction telemetry", () => {
    expect(analyticsSource).toContain("recordMonetizationEvent");
    expect(analyticsSource).toContain("MONETIZATION_DIAGNOSTICS_CONSENT_KEY");
    expect(analyticsSource).toContain("isMonetizationDiagnosticsEnabled");
    expect(analyticsSource).toContain("if (!(await isMonetizationDiagnosticsEnabled())) return false;");
    expect(billingHistorySource).toContain('billingShortText(language, "diagnosticsConsent")');
    expect(billingHistorySource).toContain('billingShortText(language, "summaryCsv")');
    expect(billingHistorySource).toContain('billingShortText(language, "rawEvents")');
    expect(analyticsSource).toContain("monetizationSummaryToCsv");
    expect(billingHistorySource).toContain('t("localDiagnostics")');
    expect(billingHistorySource).toContain('billingShortText(language, "interestSaveRate")');
    expect(billingHistorySource).toContain('billingShortText(language, "monthlyPlanInterest")');
    expect(billingHistorySource).toContain('billingShortText(language, "annualPlanInterest")');
    expect(analyticsSource).toContain("monthlyInterest");
    expect(analyticsSource).toContain("annualInterest");
    expect(billingHistorySource).toContain('billingShortText(language, "billingIntentRate")');
    expect(analyticsSource).toContain("interestSaveRate");
    expect(analyticsSource).toContain("billingIntentRate");
    expect(billingHistorySource).toContain('billingShortText(language, "diagnosticsDisabled")');
    expect(billingHistorySource).toContain('billingStatusText(language, "confirmClear")');
    expect(billingHistorySource).toContain('billingShortText(language, "clearConfirm")');
    expect(billingHistorySource).toContain('billingStatusText(language, "clearCancelled")');
    expect(settingsSource).toContain("Monetization privacy");
    expect(settingsSource).toContain("MONETIZATION_DIAGNOSTICS_CONSENT_KEY");
    expect(settingsSource).toContain("MONETIZATION_RETENTION_WINDOW_KEY");
    expect(settingsSource).toContain("Diagnostics retention");
    expect(settingsSource).toContain("Recent 500");
    expect(settingsSource).toContain("Open billing history and diagnostics");
    expect(analyticsSource).toContain("MONETIZATION_EVENTS_RETENTION_LIMIT");
    expect(analyticsSource).toContain("slice(-MONETIZATION_EVENTS_RETENTION_LIMIT)");
    expect(billingHistorySource).toContain("Retention: ");
    expect(billingHistorySource).toContain('billingShortText(language, "days30")');
    expect(billingHistorySource).toContain('billingShortText(language, "days90")');
    expect(billingHistorySource).toContain('billingShortText(language, "recent500")');
    expect(analyticsSource).toContain("MONETIZATION_RETENTION_WINDOW_KEY");
    expect(analyticsSource).toContain("getMonetizationRetentionWindow");
    expect(billingHistorySource).toContain("disabling stops new events but does not delete existing records");
    expect(analyticsSource).toContain("checkout_interest_saved");
    expect(analyticsSource).toContain("billing_intent_saved");
    expect(upgradeSource).toContain('recordMonetizationEvent("paywall_viewed"');
    expect(upgradeSource).toContain('recordMonetizationEvent("checkout_interest_saved"');
    expect(upgradeSource).toContain('recordMonetizationEvent("billing_intent_saved"');
    expect(upgradeSource).not.toContain('recordMonetizationEvent("checkout_completed"');
  });

  it("labels local signal freshness without overstating demand", () => {
    expect(latestMonetizationEventAt(events)).toBe("2026-08-16T12:00:00.000Z");
    expect(analyticsFreshnessLabel(null, now)).toBe("No local signal");
    expect(analyticsFreshnessLabel("2026-08-16T12:00:00.000Z", now)).toBe("Recent local signal");
    expect(analyticsFreshnessLabel("2026-07-01T12:00:00.000Z", now)).toBe("Stale local signal");
    expect(revenueSource).toContain('billingShortText(language, "signalFreshness")');
    expect(revenueSource).toContain('billingShortText(language, "noLocalInteraction")');
    expect(revenueSource).toContain("latestLocalSignalAt");
    expect(analyticsSource).toContain("latest_local_signal_at");
  });

  it("requires explicit opt-in and supports unsubscribe", () => {
    expect(clampPaymentNotificationSettings({ enabled: true })).toEqual({ enabled: true, unsubscribed: false });
    expect(clampPaymentNotificationSettings({ enabled: true, unsubscribed: true })).toEqual({ enabled: false, unsubscribed: true });
  });
});
