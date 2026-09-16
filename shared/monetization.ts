export type BillingInterval = "month" | "year";
export type BillingState = "not_configured" | "ready" | "processing" | "active" | "error";
export type EntitlementStatus = "free" | "active" | "past_due" | "canceled" | "unknown";
export type PremiumFeature = "sensei_chat" | "advanced_review" | "benchmark_exports" | "priority_recovery";
export const BILLING_INTERVAL_STORAGE_KEY = "mahjong.monetization.billingInterval";
export const BILLING_INTEREST_STORAGE_KEY = "mahjong.monetization.checkoutInterest";
export const BILLING_STATUS_CHECKED_STORAGE_KEY = "mahjong.monetization.billingStatusChecked";
export const BILLING_LAST_ACTION_STORAGE_KEY = "mahjong.monetization.lastBillingAction";

export const MONETIZATION_COMPARISON = [
  { label: "Local practice matches", free: true, pro: true },
  { label: "Core legality and score previews", free: true, pro: true },
  { label: "Sensei strategy conversations", free: false, pro: true },
  { label: "Advanced replay analytics", free: false, pro: true },
  { label: "Benchmark exports", free: false, pro: true },
  { label: "Priority AI recovery", free: false, pro: true },
] as const;

export const MONETIZATION_CONFIG = {
  free: {
    label: "Practice",
    price: "$0",
    description: "Build Mahjong fundamentals at your own pace.",
    features: ["Unlimited local practice matches", "Core legality and score previews", "Saved match history on this device"],
  },
  pro: {
    label: "Sensei Pro",
    monthlyPrice: 9.99,
    annualPrice: 89.99,
    monthlyDisplay: "$9.99 / month",
    annualDisplay: "$89.99 / year",
    description: "A focused AI study partner for deeper review and strategy work.",
    features: ["Unlimited Sensei strategy conversations", "Advanced replay analytics and policy comparisons", "Priority recovery for queued AI requests", "Benchmark history and export tools"],
  },
} as const;

export const formatPlanPrice = (amount: number, interval: BillingInterval) => `$${amount.toFixed(2)} / ${interval}`;
export const annualSavings = () => Math.max(0, MONETIZATION_CONFIG.pro.monthlyPrice * 12 - MONETIZATION_CONFIG.pro.annualPrice);
export const monthlyEquivalentAnnualPrice = () => MONETIZATION_CONFIG.pro.annualPrice / 12;
export const checkoutPriceForInterval = (interval: BillingInterval) => interval === "month" ? MONETIZATION_CONFIG.pro.monthlyPrice : MONETIZATION_CONFIG.pro.annualPrice;

export const premiumFeatureLabel = (feature: PremiumFeature) => {
  switch (feature) {
    case "sensei_chat": return "Sensei strategy conversations";
    case "advanced_review": return "Advanced replay analytics";
    case "benchmark_exports": return "Benchmark history and exports";
    case "priority_recovery": return "Priority AI recovery";
  }
};

export const hasPremiumEntitlement = (status: EntitlementStatus, _feature: PremiumFeature) => status === "active";

export const premiumFeatureAccessLabel = (status: EntitlementStatus, feature: PremiumFeature) => hasPremiumEntitlement(status, feature) ? `Included with ${premiumFeatureLabel(feature)}.` : `${premiumFeatureLabel(feature)} unlocks after verified Sensei Pro activation.`;

export const entitlementStatusLabel = (status: EntitlementStatus) => {
  switch (status) {
    case "active": return "Sensei Pro active";
    case "past_due": return "Payment needs attention";
    case "canceled": return "Sensei Pro canceled";
    case "unknown": return "Checking plan status";
    case "free": return "Free practice plan";
  }
};

export const billingActionLabel = (action: "restore" | "manage") => action === "restore" ? "Restore purchase" : "Manage subscription";

export const stripeConfigurationState = (values: { secretKey?: string; priceId?: string; webhookSecret?: string }): BillingState => {
  if (!values.secretKey || !values.priceId || !values.webhookSecret) return "not_configured";
  return "ready";
};

export const billingStateLabel = (state: BillingState) => {
  switch (state) {
    case "not_configured": return "Payments setup pending";
    case "ready": return "Ready to upgrade";
    case "processing": return "Opening secure checkout…";
    case "active": return "Sensei Pro active";
    case "error": return "Payment setup needs attention";
  }
};
