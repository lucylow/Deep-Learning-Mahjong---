import { describe, expect, it } from "vitest";
import { analyticsConfidenceLabel, formatShare, monetizationEventsToCsv, monetizationSummaryToCsv, summarizeMonetizationEvents } from "@/shared/monetization-analytics";
import { BILLING_INTEREST_STORAGE_KEY, BILLING_INTERVAL_STORAGE_KEY, BILLING_LAST_ACTION_STORAGE_KEY, BILLING_STATUS_CHECKED_STORAGE_KEY, MONETIZATION_COMPARISON, MONETIZATION_CONFIG, annualSavings, billingActionLabel, billingStateLabel, checkoutPriceForInterval, entitlementStatusLabel, formatPlanPrice, hasPremiumEntitlement, monthlyEquivalentAnnualPrice, premiumFeatureAccessLabel, stripeConfigurationState } from "@/shared/monetization";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const homeSource = readFileSync(resolve(process.cwd(), "app/(tabs)/index.tsx"), "utf8");
const settingsSource = readFileSync(resolve(process.cwd(), "app/settings.tsx"), "utf8");
const upgradeSource = readFileSync(resolve(process.cwd(), "app/upgrade.tsx"), "utf8");
const billingHistorySource = readFileSync(resolve(process.cwd(), "app/billing-history.tsx"), "utf8");
const revenueSource = readFileSync(resolve(process.cwd(), "app/revenue.tsx"), "utf8");

describe("Mahjong monetization", () => {
  it("labels local sample size honestly", () => {
    expect(analyticsConfidenceLabel(0)).toBe("No local sample");
    expect(analyticsConfidenceLabel(3)).toBe("Preliminary local sample");
    expect(analyticsConfidenceLabel(10)).toBe("Observed local sample");
    expect(formatShare(3, 4)).toBe("75%");
    expect(formatShare(0, 0)).toBe("0%");
  });
  it("localizes monetization CSV headers by Chinese script without changing exported signals", () => {
    const events = [{ id: "evt-1", name: "paywall_viewed" as const, createdAt: "2026-08-18T00:00:00.000Z", variant: "month" }];
    const summary = summarizeMonetizationEvents(events);
    const simplifiedEvents = monetizationEventsToCsv(events, "zh-Hans");
    const traditionalEvents = monetizationEventsToCsv(events, "zh-Hant");
    expect(simplifiedEvents.split("\n")[0]).toBe("事件 ID,事件名称,创建时间,变体,促销,活动");
    expect(traditionalEvents.split("\n")[0]).toBe("事件 ID,事件名稱,建立時間,變體,促銷,活動");
    expect(simplifiedEvents).toContain("paywall_viewed");
    expect(monetizationSummaryToCsv(summary, "30d", {}, "zh-Hans").split("\n")[0]).toBe("指标,数值");
    expect(monetizationSummaryToCsv(summary, "30d", {}, "zh-Hant").split("\n")[0]).toBe("指標,數值");
  });

  it("defines a simple average-priced monthly and annual plan", () => {
    expect(MONETIZATION_CONFIG.pro.monthlyPrice).toBe(9.99);
    expect(MONETIZATION_CONFIG.pro.annualPrice).toBe(89.99);
    expect(formatPlanPrice(MONETIZATION_CONFIG.pro.monthlyPrice, "month")).toBe("$9.99 / month");
  });

  it("keeps the free tier explicit and readable", () => {
    expect(MONETIZATION_CONFIG.free.price).toBe("$0");
    expect(MONETIZATION_CONFIG.free.features.length).toBeGreaterThan(1);
  });

  it("keeps free and Pro feature boundaries explicit", () => {
    expect(MONETIZATION_COMPARISON.some((item) => item.free && item.pro)).toBe(true);
    expect(MONETIZATION_COMPARISON.some((item) => !item.free && item.pro)).toBe(true);
    expect(upgradeSource).toContain("Premium access map");
    expect(upgradeSource).toContain("Readiness checklist");
    expect(upgradeSource).toContain("Connect secure Stripe checkout");
    expect(upgradeSource).toContain("Receive a verified Sensei Pro entitlement");
    expect(upgradeSource).toContain("Plan comparison");
    expect(upgradeSource).toContain("Feature");
  });

  it("calculates the annual conversion incentive without overstating savings", () => {
    expect(annualSavings()).toBeCloseTo(29.89, 2);
    expect(monthlyEquivalentAnnualPrice()).toBeCloseTo(7.5, 2);
    expect(checkoutPriceForInterval("month")).toBe(9.99);
    expect(checkoutPriceForInterval("year")).toBe(89.99);
  });

  it("gates premium features until a verified active entitlement exists", () => {
    expect(hasPremiumEntitlement("free", "sensei_chat")).toBe(false);
    expect(hasPremiumEntitlement("past_due", "advanced_review")).toBe(false);
    expect(hasPremiumEntitlement("active", "benchmark_exports")).toBe(true);
    expect(entitlementStatusLabel("free")).toBe("Free practice plan");
    expect(premiumFeatureAccessLabel("free", "sensei_chat")).toContain("unlocks after verified Sensei Pro activation");
    expect(premiumFeatureAccessLabel("active", "sensei_chat")).toContain("Included with");
    expect(billingActionLabel("restore")).toBe("Restore purchase");
  });

  it("reports missing Stripe configuration without pretending checkout is ready", () => {
    expect(stripeConfigurationState({})).toBe("not_configured");
    expect(billingStateLabel("not_configured")).toBe("Payments setup pending");
    expect(upgradeSource).toContain("Notify me when ready");
    expect(upgradeSource).toContain("Checkout is not connected yet; no payment has been started.");
    expect(upgradeSource).toContain('billingActionLabel("restore")');
    expect(upgradeSource).toContain('billingActionLabel("manage")');
    expect(upgradeSource).toContain('t("currentPlanDetail")');
    expect(upgradeSource).toContain("Choose monthly billing");
    expect(upgradeSource).toContain("Choose annual billing");
    expect(upgradeSource).toContain("Selected plan:");
    expect(upgradeSource).toContain("BILLING_INTERVAL_STORAGE_KEY");
    expect(BILLING_INTEREST_STORAGE_KEY).toBe("mahjong.monetization.checkoutInterest");
    expect(BILLING_STATUS_CHECKED_STORAGE_KEY).toBe("mahjong.monetization.billingStatusChecked");
    expect(BILLING_LAST_ACTION_STORAGE_KEY).toBe("mahjong.monetization.lastBillingAction");
    expect(upgradeSource).toContain("BILLING_INTEREST_STORAGE_KEY");
    expect(upgradeSource).toContain('billingShortText(language, "refreshBillingStatus")');
    expect(upgradeSource).toContain("Last billing request:");
    expect(upgradeSource).toContain("Clear saved billing request");
    expect(upgradeSource).toContain("Saved billing request cleared on this device.");
    expect(upgradeSource).toContain("persistBillingIntent");
    expect(upgradeSource).toContain("No verified Stripe entitlement is available on this device.");
    expect(upgradeSource).toContain("Plan choice saved on this device.");
    expect(upgradeSource).toContain("Your plan choice could not be saved on this device");
    expect(upgradeSource).toContain('router.push("/billing-history")');
    expect(billingHistorySource).toContain("No verified billing events");
    expect(billingHistorySource).toContain('billingLongText(language, "historyDetail")');
    expect(billingHistorySource).toContain('t("localDiagnostics")');
    expect(billingHistorySource).toContain('const ranges: AnalyticsRange[] = ["7d", "30d", "90d", "all"]');
    expect(billingHistorySource).toContain("setRange(option)");
    expect(billingHistorySource).toContain('billingShortText(language, "summaryCsv")');
    expect(billingHistorySource).toContain('billingShortText(language, "rawEvents")');
    expect(billingHistorySource).toContain('billingShortText(language, "clearData")');
    expect(billingHistorySource).toContain('t("diagnosticsHonestDetail")');
    expect(billingHistorySource).toContain('router.push("/upgrade")');
    expect(revenueSource).toContain("isMonetizationDiagnosticsEnabled");
    expect(revenueSource).toContain('billingStatusText(language, "diagnosticsDisabledMessage")');
    expect(revenueSource).toContain("Open privacy settings");
    expect(revenueSource).toContain('router.push("/settings")');
    expect(revenueSource).toContain("monetizationSummaryToCsv");
    expect(revenueSource).toContain('billingShortText(language, "summaryCsv")');
    expect(revenueSource).toContain('billingShortText(language, "rawEvents")');
    expect(revenueSource).toContain('billingShortText(language, "monthlyDemand")');
    expect(revenueSource).toContain('billingShortText(language, "annualDemand")');
    expect(revenueSource).toContain('billingLongText(language, "conversionDashboard")');
    expect(revenueSource).toContain("analyticsConfidenceLabel");
    expect(revenueSource).toContain('billingShortText(language, "sampleQuality")');
    expect(revenueSource).toContain('billingLongText(language, "revenueInterpretation")');
    expect(revenueSource).toContain("formatShare(summary.monthlyInterest");
    expect(revenueSource).toContain("formatShare(summary.annualInterest");
    expect(revenueSource).toContain("trpc.billing.status.useQuery");
    expect(revenueSource).toContain('billingShortText(language, "stripeReadiness")');
    expect(revenueSource).toContain('billingShortText(language, "refreshReadiness")');
    expect(revenueSource).toContain('billingLongText(language, "stripeReadiness")');
    expect(revenueSource).toContain('router.push("/upgrade")');
    expect(revenueSource).toContain("Review plans opens the real upgrade screen");
    expect(revenueSource).toContain("BILLING_STATUS_CHECKED_STORAGE_KEY");
    expect(revenueSource).toContain('billingStatusText(language, "lastChecked")');
    expect(revenueSource).toContain('billingStatusText(language, "notChecked")');
  });

  it("exposes upgrade navigation from core surfaces", () => {
    expect(homeSource).toContain('router.push("/upgrade")');
    expect(settingsSource).toContain('router.push("/upgrade")');
  });
});
