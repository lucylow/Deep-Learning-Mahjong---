import { Pressable, ScrollView, Text, View } from "react-native";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { BILLING_INTEREST_STORAGE_KEY, BILLING_LAST_ACTION_STORAGE_KEY, BILLING_STATUS_CHECKED_STORAGE_KEY, MONETIZATION_COMPARISON, MONETIZATION_CONFIG, annualSavings, billingActionLabel, billingStateLabel, checkoutPriceForInterval, entitlementStatusLabel, monthlyEquivalentAnnualPrice, premiumFeatureAccessLabel, type BillingInterval, type BillingState, type EntitlementStatus, type PremiumFeature } from "@/shared/monetization";
import { useEffect, useState } from "react";
import { safeGetItem, safeSetItem } from "@/shared/storage-utils";
import { BILLING_INTERVAL_STORAGE_KEY } from "@/shared/monetization";
import { trpc } from "@/lib/trpc";
import { recordMonetizationEvent } from "@/shared/monetization-analytics";
import { billingShortText, billingStatusText, formatLocalizedTime, useI18n } from "@/lib/i18n";

export default function UpgradeScreen() {
  const { language, t } = useI18n();
  const [billingState, setBillingState] = useState<BillingState>("not_configured");
  const billingStatusQuery = trpc.billing.status.useQuery(undefined, { staleTime: 60_000, retry: 1 });
  const billingComponents = billingStatusQuery.data?.components;
  const [billingInterval, setBillingInterval] = useState<BillingInterval>("month");
  const [entitlementStatus] = useState<EntitlementStatus>("free");
  const [billingMessage, setBillingMessage] = useState("Stripe checkout is not connected yet.");
  const [billingSelectionSaved, setBillingSelectionSaved] = useState(true);
  const [checkoutInterestSaved, setCheckoutInterestSaved] = useState(false);
  const [billingStatusCheckedAt, setBillingStatusCheckedAt] = useState<string | null>(null);
  const [lastBillingAction, setLastBillingAction] = useState<"restore" | "manage" | null>(null);
  const premiumFeatures: PremiumFeature[] = ["sensei_chat", "advanced_review", "benchmark_exports", "priority_recovery"];
  useEffect(() => {
    if (billingStatusQuery.data?.state) setBillingState(billingStatusQuery.data.state);
  }, [billingStatusQuery.data?.state]);
  useEffect(() => {
    void recordMonetizationEvent("paywall_viewed", { variant: "sensei-pro-upgrade" });
  }, []);
  useEffect(() => {
    let cancelled = false;
    void Promise.all([safeGetItem(BILLING_INTERVAL_STORAGE_KEY), safeGetItem(BILLING_INTEREST_STORAGE_KEY), safeGetItem(BILLING_STATUS_CHECKED_STORAGE_KEY), safeGetItem(BILLING_LAST_ACTION_STORAGE_KEY)]).then(([value, interestValue, checkedAt, lastAction]) => {
      if (!cancelled) {
        setCheckoutInterestSaved(interestValue === "1");
        setBillingStatusCheckedAt(checkedAt);
        setLastBillingAction(lastAction === "restore" || lastAction === "manage" ? lastAction : null);
      }
      if (cancelled || (value !== "month" && value !== "year")) return;
      setBillingInterval(value);
    });
    return () => { cancelled = true; };
  }, []);
  const selectBillingInterval = (interval: BillingInterval) => {
    setBillingInterval(interval);
    setBillingSelectionSaved(false);
    void safeSetItem(BILLING_INTERVAL_STORAGE_KEY, interval).then((saved) => {
      setBillingSelectionSaved(saved);
      if (!saved) setBillingMessage("Your plan choice could not be saved on this device, but you can still review pricing.");
    });
  };
  const startCheckout = () => {
    setBillingState("not_configured");
    setBillingMessage("Secure checkout will appear after the Stripe account and product price are configured.");
  };
  const saveCheckoutInterest = () => {
    void safeSetItem(BILLING_INTEREST_STORAGE_KEY, "1").then((saved) => {
      setCheckoutInterestSaved(saved);
      if (saved) void recordMonetizationEvent("checkout_interest_saved", { variant: billingInterval });
      setBillingMessage(saved ? "Saved. We will keep this plan selection ready for secure checkout." : "Your interest could not be saved on this device, but pricing remains available to review.");
    });
  };
  const refreshBillingStatus = () => {
    const checkedAt = new Date().toISOString();
    setBillingMessage("Checking secure billing configuration…");
    void billingStatusQuery.refetch().then(({ data }) => {
      if (data?.state) setBillingState(data.state);
      setBillingStatusCheckedAt(checkedAt);
      void safeSetItem(BILLING_STATUS_CHECKED_STORAGE_KEY, checkedAt).then((saved) => {
        setBillingMessage(saved ? (data?.checkoutAvailable ? "Billing configuration checked. Secure checkout is available; no entitlement was changed." : "Billing configuration checked. No verified Stripe entitlement is available on this device. Secure checkout is not connected, and no entitlement was changed.") : "Billing status was checked, but the check time could not be saved on this device; no entitlement was changed.");
      });
    }).catch(() => {
      setBillingState("error");
      setBillingMessage("Billing configuration could not be checked right now; no payment or entitlement was changed.");
    });
  };
  const persistBillingIntent = (action: "restore" | "manage") => {
    setLastBillingAction(action);
    void safeSetItem(BILLING_LAST_ACTION_STORAGE_KEY, action).then((saved) => {
      if (saved) void recordMonetizationEvent("billing_intent_saved", { variant: action });
      setBillingMessage(saved ? (action === "restore" ? "Restore request saved. No purchase data was changed." : "Subscription-management request saved. It will open after Stripe is connected.") : "This billing request could not be saved on this device; no entitlement was changed.");
    });
  };
  const restorePurchase = () => persistBillingIntent("restore");
  const manageSubscription = () => persistBillingIntent("manage");
  const clearBillingIntent = () => {
    setLastBillingAction(null);
    void safeSetItem(BILLING_LAST_ACTION_STORAGE_KEY, "").then((saved) => {
      setBillingMessage(saved ? "Saved billing request cleared on this device." : "The saved billing request could not be cleared on this device.");
    });
  };

  return (
    <ScreenContainer className="px-5 pt-5">
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View className="gap-5">
          <View className="flex-row items-center justify-between">
            <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Go back" style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}>
              <Text className="font-semibold text-primary">‹ Back</Text>
            </Pressable>
            <Text className="text-xs font-bold uppercase tracking-widest text-primary">Mahjong Arena</Text>
          </View>
          <View>
            <Text className="text-sm font-semibold uppercase tracking-widest text-primary">{t("upgrade")} · Sensei Pro</Text>
            <Text className="mt-1 text-4xl font-bold text-foreground">Study with more depth.</Text>
            <Text className="mt-2 text-base leading-6 text-muted">{t("upgradeHeroDetail")}</Text>
          </View>
          <View className="rounded-2xl border border-border bg-surface p-4"><View className="flex-row items-center justify-between"><View><Text className="text-xs font-bold uppercase tracking-widest text-primary">Current plan</Text><Text className="mt-2 text-lg font-bold text-foreground">{entitlementStatusLabel(entitlementStatus)}</Text></View><Text className="text-xl font-bold text-primary">$0</Text></View><Text className="mt-2 text-sm leading-5 text-muted">{t("currentPlanDetail")}</Text><View className="mt-3 flex-row gap-2"><Pressable onPress={restorePurchase} accessibilityRole="button" accessibilityLabel={billingActionLabel("restore")} style={({ pressed }) => ({ flex: 1, alignItems: "center", borderRadius: 12, borderWidth: 1, borderColor: "#D7AA58", paddingVertical: 10, opacity: pressed ? 0.72 : 1 })}><Text className="text-xs font-bold text-primary">{billingActionLabel("restore")}</Text></Pressable><Pressable onPress={manageSubscription} accessibilityRole="button" accessibilityLabel={billingActionLabel("manage")} style={({ pressed }) => ({ flex: 1, alignItems: "center", borderRadius: 12, backgroundColor: "#F7F0E3", paddingVertical: 10, opacity: pressed ? 0.72 : 1 })}><Text className="text-xs font-bold text-primary">{billingActionLabel("manage")}</Text></Pressable></View><Text accessibilityRole="alert" className="mt-3 text-xs leading-4 text-muted">{billingMessage}</Text>{lastBillingAction ? <View className="mt-2 flex-row items-center gap-2"><Text className="text-[10px] font-semibold text-primary">Last billing request: {lastBillingAction === "restore" ? "restore purchase" : "manage subscription"}</Text><Pressable onPress={clearBillingIntent} accessibilityRole="button" accessibilityLabel="Clear saved billing request"><Text className="text-[10px] font-bold text-primary">Clear</Text></Pressable></View> : null}<Pressable onPress={refreshBillingStatus} disabled={billingStatusQuery.isFetching} accessibilityRole="button" accessibilityLabel={billingShortText(language, "refreshBillingStatus")} style={({ pressed }) => ({ alignSelf: "flex-start", marginTop: 10, borderRadius: 10, borderWidth: 1, borderColor: "#D7AA58", paddingHorizontal: 10, paddingVertical: 8, opacity: pressed ? 0.72 : 1 })}><Text className="text-xs font-bold text-primary">{billingStatusQuery.isFetching ? billingStatusText(language, "checking") : billingShortText(language, "refreshBillingStatus")}</Text></Pressable>{billingStatusCheckedAt ? <Text className="mt-2 text-[10px] text-muted">{billingStatusText(language, "lastChecked")}: {formatLocalizedTime(language, billingStatusCheckedAt)}</Text> : null}{billingComponents ? <View className="mt-3 rounded-xl bg-background p-3"><Text className="text-xs font-bold uppercase tracking-widest text-primary">{t("secureSetup")}</Text><View className="mt-2 flex-row flex-wrap gap-2"><Text className="text-[11px] text-muted">{billingComponents.secretKeyConfigured ? "✓" : "○"} {billingShortText(language, "serverKey")}</Text><Text className="text-[11px] text-muted">{billingComponents.priceIdConfigured ? "✓" : "○"} {billingShortText(language, "priceId")}</Text><Text className="text-[11px] text-muted">{billingComponents.webhookSecretConfigured ? "✓" : "○"} {billingShortText(language, "webhookSecret")}</Text></View><Text className="mt-2 text-[10px] leading-4 text-muted">These indicators show configuration readiness only; they do not confirm a payment or entitlement.</Text></View> : null}</View>
          <View className="rounded-3xl border border-primary bg-surface p-5">
            <View className="flex-row items-start justify-between">
              <View className="flex-1"><Text className="text-xs font-bold uppercase tracking-widest text-primary">Recommended</Text><Text className="mt-2 text-2xl font-bold text-foreground">{MONETIZATION_CONFIG.pro.label}</Text><Text className="mt-2 text-sm leading-5 text-muted">{MONETIZATION_CONFIG.pro.description}</Text></View>
              <Text className="text-2xl font-bold text-primary">${checkoutPriceForInterval(billingInterval).toFixed(2)}</Text>
            </View>
            <Text className="mt-2 text-xs font-semibold text-muted">per {billingInterval} · cancel anytime</Text>
            <View className="mt-4 flex-row rounded-2xl bg-background p-1"><Pressable onPress={() => selectBillingInterval("month")} accessibilityRole="button" accessibilityLabel="Choose monthly billing" style={{ flex: 1, alignItems: "center", borderRadius: 14, backgroundColor: billingInterval === "month" ? "#D7AA58" : "transparent", paddingVertical: 10 }}><Text className="text-xs font-bold text-foreground">Monthly · $9.99</Text></Pressable><Pressable onPress={() => selectBillingInterval("year")} accessibilityRole="button" accessibilityLabel="Choose annual billing" style={{ flex: 1, alignItems: "center", borderRadius: 14, backgroundColor: billingInterval === "year" ? "#D7AA58" : "transparent", paddingVertical: 10 }}><Text className="text-xs font-bold text-foreground">Annual · $89.99</Text></Pressable></View>
            <View className="mt-4 gap-3">{MONETIZATION_CONFIG.pro.features.map((feature) => <View key={feature} className="flex-row gap-2"><Text className="font-bold text-primary">✓</Text><Text className="flex-1 text-sm leading-5 text-foreground">{feature}</Text></View>)}</View>
            <View className="mt-4 rounded-2xl bg-background p-3"><Text className="text-xs font-bold text-primary">{billingInterval === "year" ? `Save $${annualSavings().toFixed(2)} each year` : "Save with annual billing"}</Text><Text className="mt-1 text-sm font-semibold text-foreground">{billingInterval === "year" ? `$${monthlyEquivalentAnnualPrice().toFixed(2)} / month equivalent · billed annually` : `${MONETIZATION_CONFIG.pro.annualDisplay} · two months included`}</Text></View>
            <Pressable onPress={billingState === "not_configured" ? saveCheckoutInterest : startCheckout} accessibilityRole="button" accessibilityLabel="Upgrade to Sensei Pro" style={({ pressed }) => ({ marginTop: 16, alignItems: "center", borderRadius: 14, backgroundColor: "#D7AA58", paddingVertical: 14, opacity: pressed ? 0.78 : 1 })}><Text className="font-bold text-background">{billingState === "not_configured" ? (checkoutInterestSaved ? "Interest saved" : "Notify me when ready") : billingStateLabel(billingState)}</Text></Pressable>
            <Text className="mt-3 text-center text-xs leading-4 text-muted">{billingState === "not_configured" ? `Selected plan: ${billingInterval === "year" ? MONETIZATION_CONFIG.pro.annualDisplay : MONETIZATION_CONFIG.pro.monthlyDisplay}. Checkout is not connected yet; no payment has been started.` : billingStateLabel(billingState)}</Text><Text className="mt-2 text-center text-xs font-semibold text-primary">{billingSelectionSaved ? "Plan choice saved on this device." : "Saving plan choice…"}{checkoutInterestSaved ? " Checkout interest saved." : ""}</Text>
          </View>
          <View className="rounded-2xl border border-border bg-surface p-4"><Text className="text-xs font-bold uppercase tracking-widest text-primary">Premium access map</Text><Text className="mt-2 text-sm leading-5 text-muted">These capabilities remain locked until a verified billing event activates your entitlement.</Text><View className="mt-3 gap-2">{premiumFeatures.map((feature) => <View key={feature} className="rounded-xl border border-border bg-background p-3"><Text className="text-sm font-bold text-foreground">{premiumFeatureAccessLabel(entitlementStatus, feature)}</Text></View>)}</View></View>
          <View className="rounded-2xl border border-border bg-surface p-4"><Text className="text-xs font-bold uppercase tracking-widest text-primary">Plan comparison</Text><View className="mt-3 flex-row border-b border-border pb-2"><Text className="flex-1 text-xs font-bold text-muted">Feature</Text><Text className="w-20 text-center text-xs font-bold text-muted">Free</Text><Text className="w-20 text-center text-xs font-bold text-primary">Pro</Text></View><View className="mt-1">{MONETIZATION_COMPARISON.map((item) => <View key={item.label} className="flex-row items-center border-b border-border py-3"><Text className="flex-1 pr-2 text-sm leading-5 text-foreground">{item.label}</Text><Text className="w-20 text-center text-sm font-bold text-muted">{item.free ? "✓" : "—"}</Text><Text className="w-20 text-center text-sm font-bold text-primary">{item.pro ? "✓" : "—"}</Text></View>)}</View></View>
          <View className="rounded-2xl border border-border bg-surface p-4"><Text className="text-xs font-bold uppercase tracking-widest text-primary">Free practice</Text><Text className="mt-2 text-2xl font-bold text-foreground">{MONETIZATION_CONFIG.free.price}</Text><Text className="mt-2 text-sm leading-5 text-muted">{MONETIZATION_CONFIG.free.description}</Text><View className="mt-4 gap-3">{MONETIZATION_CONFIG.free.features.map((feature) => <View key={feature} className="flex-row gap-2"><Text className="font-bold text-primary">✓</Text><Text className="flex-1 text-sm leading-5 text-foreground">{feature}</Text></View>)}</View></View>
          <View className="rounded-2xl border border-border bg-surface p-4"><Text className="text-xs font-bold uppercase tracking-widest text-primary">{t("billingHistory")}</Text><Text className="mt-2 text-sm leading-5 text-muted">{t("verifiedBillingOnly")}</Text><Pressable onPress={() => router.push("/billing-history")} accessibilityRole="button" accessibilityLabel={billingShortText(language, "openBillingHistory")} style={({ pressed }) => ({ marginTop: 12, borderRadius: 12, backgroundColor: "#F7F0E3", paddingVertical: 11, alignItems: "center", opacity: pressed ? 0.7 : 1 })}><Text className="text-sm font-bold text-primary">{billingShortText(language, "openBillingHistory")}</Text></Pressable></View>
          <View className="rounded-2xl bg-surface p-4"><Text className="text-xs font-bold uppercase tracking-widest text-primary">{t("billingClarity")}</Text><Text className="mt-2 text-sm leading-5 text-muted">{t("billingSecureCheckout")} Restore and subscription management will use the same account after billing is connected.</Text><Text className="mt-4 text-xs font-bold uppercase tracking-widest text-primary">Readiness checklist</Text><View className="mt-3 gap-2"><View className="flex-row items-center gap-2"><Text className="text-sm font-bold text-primary">{billingSelectionSaved ? "✓" : "○"}</Text><Text className="flex-1 text-sm text-foreground">Choose a monthly or annual plan</Text></View><View className="flex-row items-center gap-2"><Text className="text-sm font-bold text-primary">{billingState === "not_configured" ? "○" : "✓"}</Text><Text className="flex-1 text-sm text-foreground">Connect secure Stripe checkout</Text></View><View className="flex-row items-center gap-2"><Text className="text-sm font-bold text-primary">{entitlementStatus === "active" ? "✓" : "○"}</Text><Text className="flex-1 text-sm text-foreground">Receive a verified Sensei Pro entitlement</Text></View></View></View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
