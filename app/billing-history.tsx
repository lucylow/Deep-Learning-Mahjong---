import { Pressable, ScrollView, Text, View } from "react-native";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { billingLongText, billingShortText, billingStatusText, formatLocalizedNumber, formatLocalizedPercent, formatLocalizedTime, useI18n } from "@/lib/i18n";
import { safeGetItem, safeParseArray, safeSetItem } from "@/shared/storage-utils";
import {
  MONETIZATION_DIAGNOSTICS_CONSENT_KEY,
  DEFAULT_MONETIZATION_RETENTION_WINDOW,
  MONETIZATION_EVENTS_RETENTION_LIMIT,
  MONETIZATION_EVENTS_STORAGE_KEY,
  MONETIZATION_RETENTION_WINDOW_KEY,
  exportCsv,
  filterEventsByRange,
  formatRate,
  monetizationEventsToCsv,
  monetizationSummaryToCsv,
  summarizeMonetizationEvents,
  type AnalyticsRange,
  type MonetizationEvent,
} from "@/shared/monetization-analytics";

const isMonetizationEvent = (value: unknown): value is MonetizationEvent => {
  if (!value || typeof value !== "object") return false;
  const event = value as Partial<MonetizationEvent>;
  return typeof event.id === "string" && typeof event.name === "string" && typeof event.createdAt === "string";
};

const ranges: AnalyticsRange[] = ["7d", "30d", "90d", "all"];

export default function BillingHistoryScreen() {
  const { language, t } = useI18n();
  const [events, setEvents] = useState<MonetizationEvent[]>([]);
  const [range, setRange] = useState<AnalyticsRange>("30d");
  const [message, setMessage] = useState(billingStatusText(language, "localOnly"));
  const [diagnosticsEnabled, setDiagnosticsEnabled] = useState(false);
  const [clearConfirmationVisible, setClearConfirmationVisible] = useState(false);
  const [retentionWindow, setRetentionWindow] = useState(DEFAULT_MONETIZATION_RETENTION_WINDOW);

  const loadEvents = () => {
    void safeGetItem(MONETIZATION_DIAGNOSTICS_CONSENT_KEY).then((value) => setDiagnosticsEnabled(value === "1"));
    void safeGetItem(MONETIZATION_RETENTION_WINDOW_KEY).then((value) => setRetentionWindow(value === "30d" || value === "90d" || value === "recent" ? value : DEFAULT_MONETIZATION_RETENTION_WINDOW));
    void safeGetItem(MONETIZATION_EVENTS_STORAGE_KEY).then((value) => {
      setEvents(safeParseArray(value, isMonetizationEvent) ?? []);
    });
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const filteredEvents = useMemo(() => filterEventsByRange(events, range), [events, range]);
  const summary = useMemo(() => summarizeMonetizationEvents(filteredEvents), [filteredEvents]);
  const selectRetentionWindow = (value: "30d" | "90d" | "recent") => {
    setRetentionWindow(value);
    void safeSetItem(MONETIZATION_RETENTION_WINDOW_KEY, value).then((saved) => setMessage(saved ? billingStatusText(language, "retentionSaved") : billingStatusText(language, "retentionSaveFailed")));
  };
  const toggleDiagnosticsConsent = () => {
    const nextEnabled = !diagnosticsEnabled;
    void safeSetItem(MONETIZATION_DIAGNOSTICS_CONSENT_KEY, nextEnabled ? "1" : "0").then((saved) => {
      if (saved) {
        setDiagnosticsEnabled(nextEnabled);
        setMessage(nextEnabled ? billingStatusText(language, "consentEnabled") : billingStatusText(language, "consentDisabled"));
      } else {
        setMessage(billingStatusText(language, "preferenceSaveFailed"));
      }
    });
  };
  const clearLocalDiagnostics = () => {
    if (!clearConfirmationVisible) {
      setClearConfirmationVisible(true);
      setMessage(billingStatusText(language, "confirmClear"));
      return;
    }
    void safeSetItem(MONETIZATION_EVENTS_STORAGE_KEY, "[]").then((saved) => {
      setClearConfirmationVisible(false);
      if (saved) {
        setEvents([]);
        setMessage(billingStatusText(language, "cleared"));
      } else {
        setMessage(billingStatusText(language, "clearFailed"));
      }
    });
  };
  const exportSummary = () => {
    void exportCsv(monetizationSummaryToCsv(summary, range, {}, language), `mahjong-conversion-summary-${range}.csv`).then((result) => {
      setMessage(result === "downloaded" ? billingStatusText(language, "summaryExported") : billingStatusText(language, "summaryShareReady"));
    }).catch(() => setMessage(billingStatusText(language, "summaryExportFailed")));
  };
  const exportDiagnostics = () => {
    void exportCsv(monetizationEventsToCsv(filteredEvents, language), `mahjong-conversion-${range}.csv`).then((result) => {
      setMessage(result === "downloaded" ? billingStatusText(language, "rawExported") : billingStatusText(language, "rawShareReady"));
    }).catch(() => setMessage(billingStatusText(language, "rawExportFailed")));
  };

  return (
    <ScreenContainer className="px-5 pb-6">
      <ScrollView contentContainerStyle={{ paddingBottom: 28 }} showsVerticalScrollIndicator={false}>
        <View className="gap-5 pt-4">
          <View className="flex-row items-center justify-between">
            <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel={billingShortText(language, "back")} style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}>
              <Text className="text-sm font-bold text-primary">‹ {billingShortText(language, "back")}</Text>
            </Pressable>
            <Text className="text-xs font-bold uppercase tracking-widest text-primary">{billingShortText(language, "account")}</Text>
          </View>

          <View>
            <Text className="text-3xl font-bold text-foreground">{t("billingHistory")}</Text>
            <Text className="mt-2 text-sm leading-5 text-muted">{billingLongText(language, "historyDetail")}</Text>
          </View>

          <View className="rounded-3xl border border-border bg-surface p-5">
            <Text className="text-xs font-bold uppercase tracking-widest text-primary">{t("verifiedBilling")} events</Text>
            <Text className="mt-2 text-xl font-bold text-foreground">No verified billing events</Text>
            <Text className="mt-2 text-sm leading-5 text-muted">{t("noVerifiedBilling")}</Text>
            <View className="mt-4 rounded-2xl border border-border bg-background p-4">
              <Text className="xs font-bold uppercase tracking-widest text-primary">{billingShortText(language, "whatWillAppear")}</Text>
              <Text className="mt-2 text-sm leading-5 text-foreground">{billingLongText(language, "verifiedWillAppear")}</Text>
            </View>
          </View>

          <View className="rounded-3xl border border-border bg-surface p-5">
            <Text className="text-xs font-bold uppercase tracking-widest text-primary">{billingShortText(language, "diagnosticsConsent")}</Text>
            <Text className="mt-2 text-sm leading-5 text-muted">{billingLongText(language, "diagnosticsConsent")}</Text>
            <Text className="mt-2 text-xs leading-4 text-muted">Retention: {retentionWindow === "recent" ? `up to ${MONETIZATION_EVENTS_RETENTION_LIMIT} recent interactions` : retentionWindow === "30d" ? "up to 30 days of interactions" : "up to 90 days of interactions"} on this device. Data stays local until you clear it or disable diagnostics; disabling stops new events but does not delete existing records.</Text>
            <View className="mt-3 flex-row gap-2">{(["30d", "90d", "recent"] as const).map((option) => <Pressable key={option} onPress={() => selectRetentionWindow(option)} accessibilityRole="radio" accessibilityState={{ selected: retentionWindow === option }} accessibilityLabel={`${billingShortText(language, "diagnosticsConsent")}: ${option === "recent" ? billingShortText(language, "recent500") : option === "30d" ? billingShortText(language, "days30") : billingShortText(language, "days90")}`} style={({ pressed }) => ({ flex: 1, alignItems: "center", borderRadius: 10, backgroundColor: retentionWindow === option ? "#D7AA58" : "#F7F0E3", paddingVertical: 9, opacity: pressed ? 0.7 : 1 })}><Text className="text-[11px] font-bold text-primary">{option === "recent" ? billingShortText(language, "recent500") : option === "30d" ? billingShortText(language, "days30") : billingShortText(language, "days90")}</Text></Pressable>)}</View>
            <Pressable onPress={toggleDiagnosticsConsent} accessibilityRole="switch" accessibilityState={{ checked: diagnosticsEnabled }} accessibilityLabel={billingShortText(language, "diagnosticsConsent")} style={({ pressed }) => ({ marginTop: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderRadius: 12, backgroundColor: "#F7F0E3", padding: 12, opacity: pressed ? 0.7 : 1 })}><Text className="text-sm font-bold text-primary">{diagnosticsEnabled ? billingShortText(language, "diagnosticsEnabled") : billingShortText(language, "diagnosticsDisabled")}</Text><Text className="text-xs font-bold text-primary">{diagnosticsEnabled ? billingShortText(language, "on") : billingShortText(language, "off")}</Text></Pressable>
            <View className="mt-4 flex-row items-start justify-between gap-3">
              <View className="flex-1">
                <Text className="text-xs font-bold uppercase tracking-widest text-primary">{t("localDiagnostics")}</Text>
                <Text className="mt-2 text-sm leading-5 text-muted">{t("diagnosticsLocalDetail")}</Text>
              </View>
              <Text className="text-2xl font-bold text-primary">{formatLocalizedNumber(language, summary.totalEvents)}</Text>
            </View>
            <View className="mt-4 flex-row gap-2">
              {ranges.map((option) => <Pressable key={option} onPress={() => setRange(option)} accessibilityRole="button" accessibilityLabel={`${billingShortText(language, "dateRange")}: ${option}`} style={({ pressed }) => ({ flex: 1, alignItems: "center", borderRadius: 10, backgroundColor: range === option ? "#D7AA58" : "#F7F0E3", paddingVertical: 9, opacity: pressed ? 0.7 : 1 })}><Text className="text-[11px] font-bold text-primary">{option}</Text></Pressable>)}
            </View>
            <View className="mt-4 gap-2">
              <View className="flex-row items-center justify-between"><Text className="text-sm text-foreground">{billingShortText(language, "paywallViews")}</Text><Text className="font-bold text-foreground">{formatLocalizedNumber(language, summary.paywallViews)}</Text></View>
              <View className="flex-row items-center justify-between"><Text className="text-sm text-foreground">{billingShortText(language, "checkoutInterest")}</Text><Text className="font-bold text-foreground">{formatLocalizedNumber(language, summary.checkoutInterest)}</Text></View>
              <View className="flex-row items-center justify-between"><Text className="text-sm text-foreground">{billingShortText(language, "monthlyPlanInterest")}</Text><Text className="font-bold text-foreground">{formatLocalizedNumber(language, summary.monthlyInterest)}</Text></View>
              <View className="flex-row items-center justify-between"><Text className="text-sm text-foreground">{billingShortText(language, "annualPlanInterest")}</Text><Text className="font-bold text-foreground">{formatLocalizedNumber(language, summary.annualInterest)}</Text></View>
              <View className="flex-row items-center justify-between"><Text className="text-sm text-foreground">{billingShortText(language, "interestSaveRate")}</Text><Text className="font-bold text-primary">{formatLocalizedPercent(language, summary.interestSaveRate)}</Text></View>
              <View className="flex-row items-center justify-between"><Text className="text-sm text-foreground">{billingShortText(language, "billingIntents")}</Text><Text className="font-bold text-foreground">{formatLocalizedNumber(language, summary.billingIntents)}</Text></View>
              <View className="flex-row items-center justify-between"><Text className="text-sm text-foreground">{billingShortText(language, "billingIntentRate")}</Text><Text className="font-bold text-primary">{formatLocalizedPercent(language, summary.billingIntentRate)}</Text></View>
              <View className="flex-row items-center justify-between"><Text className="text-sm text-foreground">{billingShortText(language, "verifiedCheckoutCompletions")}</Text><Text className="font-bold text-foreground">{formatLocalizedNumber(language, summary.completed)}</Text></View>
              <View className="flex-row items-center justify-between"><Text className="text-sm text-foreground">{billingShortText(language, "checkoutCompletionRate")}</Text><Text className="font-bold text-primary">{formatLocalizedPercent(language, summary.checkoutCompletionRate)}</Text></View>
            </View>
            <Text className="mt-3 text-xs leading-4 text-muted">Retention is bounded to the most recent {MONETIZATION_EVENTS_RETENTION_LIMIT} local interactions. Monthly and annual interest counts describe plan selection demand on this device. Interest and intent rates describe local actions only. {t("diagnosticsHonestDetail")} {billingLongText(language, "privacyNoClaims")}</Text>
            <View className="mt-4 flex-row gap-2">
              <Pressable onPress={exportSummary} accessibilityRole="button" accessibilityLabel={billingShortText(language, "exportSummaryA11y")} style={({ pressed }) => ({ flex: 1, alignItems: "center", borderWidth: 1, borderColor: "#D7AA58", borderRadius: 12, paddingVertical: 10, opacity: pressed ? 0.7 : 1 })}><Text className="text-xs font-bold text-primary">{billingShortText(language, "summaryCsv")}</Text></Pressable>
              <Pressable onPress={exportDiagnostics} accessibilityRole="button" accessibilityLabel={billingShortText(language, "exportRawA11y")} style={({ pressed }) => ({ flex: 1, alignItems: "center", borderRadius: 12, borderWidth: 1, borderColor: "#D7AA58", paddingVertical: 10, opacity: pressed ? 0.7 : 1 })}><Text className="text-xs font-bold text-primary">{billingShortText(language, "rawEvents")}</Text></Pressable>
              <Pressable onPress={clearLocalDiagnostics} accessibilityRole="button" accessibilityLabel={billingShortText(language, "clearData")} style={({ pressed }) => ({ flex: 1, alignItems: "center", borderRadius: 12, backgroundColor: "#F7F0E3", paddingVertical: 10, opacity: pressed ? 0.7 : 1 })}><Text className="text-xs font-bold text-primary">{clearConfirmationVisible ? billingShortText(language, "clearConfirm") : billingShortText(language, "clearData")}</Text></Pressable>
            </View>
            {clearConfirmationVisible ? <Pressable onPress={() => { setClearConfirmationVisible(false); setMessage(billingStatusText(language, "clearCancelled")); }} accessibilityRole="button" accessibilityLabel={billingShortText(language, "cancel")} style={({ pressed }) => ({ alignSelf: "flex-end", marginTop: 8, paddingVertical: 4, opacity: pressed ? 0.7 : 1 })}><Text className="text-xs font-bold text-primary">{billingShortText(language, "cancel")}</Text></Pressable> : null}
            <Text accessibilityRole="alert" className="mt-3 text-xs leading-4 text-muted">{message}</Text>
          </View>

          <View className="rounded-2xl bg-surface p-4">
            <Text className="text-xs font-bold uppercase tracking-widest text-primary">{billingShortText(language, "currentAccess")}</Text>
            <Text className="mt-2 text-lg font-bold text-foreground">{billingShortText(language, "freePracticePlan")}</Text>
            <Text className="mt-1 text-sm leading-5 text-muted">Premium Sensei features remain locked until a verified entitlement is received.</Text>
          </View>

          <Pressable onPress={() => router.push("/upgrade")} accessibilityRole="button" accessibilityLabel={billingShortText(language, "reviewSenseiPlans")} style={({ pressed }) => ({ borderRadius: 16, backgroundColor: "#17493F", paddingVertical: 15, alignItems: "center", opacity: pressed ? 0.86 : 1 })}>
            <Text className="font-bold text-white">View Sensei Pro plans</Text>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
