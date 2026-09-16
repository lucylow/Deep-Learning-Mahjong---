import { safeGetItem, safeParseArray, safeSetItem } from "@/shared/storage-utils";

export const MONETIZATION_EVENTS_STORAGE_KEY = "mahjong.monetization.events";
export const PAYMENT_NOTIFICATION_SETTINGS_KEY = "mahjong.monetization.paymentNotifications";
export const MONETIZATION_DIAGNOSTICS_CONSENT_KEY = "mahjong.monetization.diagnosticsConsent";
export const MONETIZATION_EVENTS_RETENTION_LIMIT = 500;
export const MONETIZATION_RETENTION_WINDOW_KEY = "mahjong.monetization.retentionWindow";
export type MonetizationRetentionWindow = "30d" | "90d" | "recent";
export const DEFAULT_MONETIZATION_RETENTION_WINDOW: MonetizationRetentionWindow = "recent";

export type MonetizationEventName = "paywall_viewed" | "checkout_started" | "checkout_completed" | "checkout_failed" | "checkout_interest_saved" | "billing_intent_saved" | "recovery_offer_viewed" | "recovery_manage_started" | "winback_offer_viewed" | "winback_checkout_started";
export type MonetizationEvent = { id: string; name: MonetizationEventName; createdAt: string; variant?: string; promotion?: string; campaign?: string };
const isMonetizationEvent = (value: unknown): value is MonetizationEvent => {
  if (!value || typeof value !== "object") return false;
  const event = value as Partial<MonetizationEvent>;
  return typeof event.id === "string" && typeof event.name === "string" && typeof event.createdAt === "string";
};
export async function isMonetizationDiagnosticsEnabled() {
  return (await safeGetItem(MONETIZATION_DIAGNOSTICS_CONSENT_KEY)) === "1";
}
export async function getMonetizationRetentionWindow(): Promise<MonetizationRetentionWindow> {
  const value = await safeGetItem(MONETIZATION_RETENTION_WINDOW_KEY);
  return value === "30d" || value === "90d" || value === "recent" ? value : DEFAULT_MONETIZATION_RETENTION_WINDOW;
}
export async function recordMonetizationEvent(name: MonetizationEventName, details: Omit<MonetizationEvent, "id" | "name" | "createdAt"> = {}) {
  if (!(await isMonetizationDiagnosticsEnabled())) return false;
  const existing = safeParseArray(await safeGetItem(MONETIZATION_EVENTS_STORAGE_KEY), isMonetizationEvent) ?? [];
  const event: MonetizationEvent = { id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, name, createdAt: new Date().toISOString(), ...details };
  const window = await getMonetizationRetentionWindow();
  const cutoff = window === "recent" ? 0 : Date.now() - (window === "30d" ? 30 : 90) * 24 * 60 * 60 * 1000;
  const retained = cutoff ? existing.filter((item) => Date.parse(item.createdAt) >= cutoff) : existing;
  return safeSetItem(MONETIZATION_EVENTS_STORAGE_KEY, JSON.stringify([...retained, event].slice(-MONETIZATION_EVENTS_RETENTION_LIMIT)));
}
export type AnalyticsRange = "7d" | "30d" | "90d" | "all";
export type PaymentNotificationSettings = { enabled: boolean; unsubscribed: boolean };
export const DEFAULT_PAYMENT_NOTIFICATION_SETTINGS: PaymentNotificationSettings = { enabled: false, unsubscribed: false };

export function filterEventsByRange(events: MonetizationEvent[], range: AnalyticsRange, now = new Date()) {
  if (range === "all") return events;
  const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;
  const cutoff = now.getTime() - days * 24 * 60 * 60 * 1000;
  return events.filter((event) => Date.parse(event.createdAt) >= cutoff);
}

export function summarizeMonetizationEvents(events: MonetizationEvent[]) {
  const count = (name: MonetizationEventName) => events.filter((event) => event.name === name).length;
  const paywallViews = count("paywall_viewed");
  const checkoutStarts = count("checkout_started");
  const completed = count("checkout_completed");
  const checkoutInterest = count("checkout_interest_saved");
  const billingIntents = count("billing_intent_saved");
  const monthlyInterest = events.filter((event) => event.name === "checkout_interest_saved" && event.variant === "month").length;
  const annualInterest = events.filter((event) => event.name === "checkout_interest_saved" && event.variant === "year").length;
  const recoveryOffers = count("recovery_offer_viewed");
  const recoveryStarts = count("recovery_manage_started");
  const winbackOffers = count("winback_offer_viewed");
  return { totalEvents: events.length, paywallViews, checkoutStarts, checkoutInterest, billingIntents, monthlyInterest, annualInterest, completed, recoveryOffers, recoveryStarts, winbackOffers, paywallToCheckoutRate: paywallViews ? checkoutStarts / paywallViews : 0, interestSaveRate: paywallViews ? checkoutInterest / paywallViews : 0, billingIntentRate: paywallViews ? billingIntents / paywallViews : 0, checkoutCompletionRate: checkoutStarts ? completed / checkoutStarts : 0, recoveryActionRate: recoveryOffers ? recoveryStarts / recoveryOffers : 0, winbackCoverageRate: paywallViews ? winbackOffers / paywallViews : 0 };
}

export function formatRate(value: number) { return `${Math.round(value * 100)}%`; }
export function formatShare(part: number, total: number) { return formatRate(total ? part / total : 0); }
export function analyticsConfidenceLabel(paywallViews: number) { return paywallViews === 0 ? "No local sample" : paywallViews < 10 ? "Preliminary local sample" : "Observed local sample"; }
export function latestMonetizationEventAt(events: MonetizationEvent[]) { return events.reduce<string | null>((latest, event) => !latest || Date.parse(event.createdAt) > Date.parse(latest) ? event.createdAt : latest, null); }
export function analyticsFreshnessLabel(latestCreatedAt: string | null, now = new Date()) { if (!latestCreatedAt) return "No local signal"; const age = now.getTime() - Date.parse(latestCreatedAt); return age <= 7 * 24 * 60 * 60 * 1000 ? "Recent local signal" : "Stale local signal"; }
function csvCell(value: unknown) { const text = String(value ?? ""); return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text; }
export type MonetizationCsvLanguage = "en" | "ja" | "es" | "zh-Hans" | "zh-Hant";
const monetizationCsvHeaders: Record<MonetizationCsvLanguage, { event: string[]; summary: string[] }> = {
  en: { event: ["event_id", "event_name", "created_at", "variant", "promotion", "campaign"], summary: ["metric", "value"] },
  ja: { event: ["イベントID", "イベント名", "作成日時", "バリエーション", "プロモーション", "キャンペーン"], summary: ["指標", "値"] },
  es: { event: ["id_evento", "nombre_evento", "creado_en", "variante", "promoción", "campaña"], summary: ["métrica", "valor"] },
  "zh-Hans": { event: ["事件 ID", "事件名称", "创建时间", "变体", "促销", "活动"], summary: ["指标", "数值"] },
  "zh-Hant": { event: ["事件 ID", "事件名稱", "建立時間", "變體", "促銷", "活動"], summary: ["指標", "數值"] },
};
export function monetizationEventsToCsv(events: MonetizationEvent[], language: MonetizationCsvLanguage = "en") { const headers = monetizationCsvHeaders[language].event; const rows = events.map((event) => [event.id, event.name, event.createdAt, event.variant, event.promotion, event.campaign].map(csvCell).join(",")); return [headers.map(csvCell).join(","), ...rows].join("\n"); }
export function monetizationSummaryToCsv(summary: ReturnType<typeof summarizeMonetizationEvents>, range: AnalyticsRange, metadata: { latestLocalSignalAt?: string | null } = {}, language: MonetizationCsvLanguage = "en") { const rows: Array<[string, string | number]> = [["range", range], ["sample_quality", analyticsConfidenceLabel(summary.paywallViews)], ["signal_freshness", analyticsFreshnessLabel(metadata.latestLocalSignalAt ?? null)], ["latest_local_signal_at", metadata.latestLocalSignalAt ?? ""], ["total_events", summary.totalEvents], ["paywall_views", summary.paywallViews], ["checkout_interest", summary.checkoutInterest], ["monthly_interest", summary.monthlyInterest], ["annual_interest", summary.annualInterest], ["monthly_interest_share", formatShare(summary.monthlyInterest, summary.monthlyInterest + summary.annualInterest)], ["annual_interest_share", formatShare(summary.annualInterest, summary.monthlyInterest + summary.annualInterest)], ["billing_intents", summary.billingIntents], ["verified_checkout_completions", summary.completed], ["interest_save_rate", formatRate(summary.interestSaveRate)], ["billing_intent_rate", formatRate(summary.billingIntentRate)], ["checkout_completion_rate", formatRate(summary.checkoutCompletionRate)]]; return [monetizationCsvHeaders[language].summary.join(","), ...rows.map(([metric, value]) => `${csvCell(metric)},${csvCell(value)}`)].join("\n"); }
export function clampPaymentNotificationSettings(value: Partial<PaymentNotificationSettings> | undefined): PaymentNotificationSettings { return { enabled: value?.enabled === true && value?.unsubscribed !== true, unsubscribed: value?.unsubscribed === true }; }
export function paymentNotificationCopy(settings: PaymentNotificationSettings) { return settings.unsubscribed ? "Payment-failure alerts are unsubscribed." : settings.enabled ? "Payment-failure alerts are on." : "Payment-failure alerts are off."; }
export async function exportCsv(csv: string, filename = "mahjong-monetization.csv") { if (typeof document !== "undefined") { const blob = new Blob([csv], { type: "text/csv;charset=utf-8" }); const url = URL.createObjectURL(blob); const anchor = document.createElement("a"); anchor.href = url; anchor.download = filename; anchor.click(); URL.revokeObjectURL(url); return "downloaded" as const; } const { Share } = await import("react-native"); await Share.share({ title: filename, message: csv }); return "shared" as const; }
