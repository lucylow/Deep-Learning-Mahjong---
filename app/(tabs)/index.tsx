import { ActivityIndicator, Alert, Animated, Pressable, ScrollView, Text, View } from "react-native";
import { useEffect, useMemo, useRef, useState } from "react";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { trpc } from "@/lib/trpc";
import { useColors } from "@/hooks/use-colors";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useAccessibilityPreferences } from "@/lib/accessibility-preferences";
import { safeGetItem, safeRemoveItem, safeSetItem } from "@/shared/storage-utils";
import { arenaTokens } from "@/constants/arena-tokens";
import { QueryErrorState } from "@/components/query-error-state";
import { getActiveMatchId, runNavigation } from "@/shared/navigation-utils";
import { DEMO_MODE, demoBenchmarkCount } from "@/shared/demo-data";
import { analyticsDataOriginLabel } from "@/shared/analytics-provenance";
import { useI18n } from "@/lib/i18n";
import { buildOnboardingSteps, onboardingCompletion, type OnboardingStep } from "@/shared/onboarding";
import { safeParseArray } from "@/shared/storage-utils";

const brass = arenaTokens.color.brass;
const ivory = arenaTokens.color.ivory;
const muted = arenaTokens.color.muted;
const jade = arenaTokens.color.jade;

function ActionCard({ icon, title, subtitle, onPress, primary = false }: { icon: string; title: string; subtitle: string; onPress: () => void; primary?: boolean }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      accessibilityLabel={`${title}: ${subtitle}`}
      accessibilityHint="Opens this gameplay area"
      hitSlop={6}
      style={({ pressed }) => ({
        flex: 1,
        minHeight: 104,
        padding: 14,
        borderRadius: 18,
        backgroundColor: primary ? "rgba(184,149,90,0.16)" : "rgba(255,255,255,0.04)",
        borderWidth: primary ? 1.5 : 1,
        borderColor: primary ? "rgba(184,149,90,0.52)" : "rgba(255,255,255,0.08)",
        opacity: pressed ? 0.78 : 1,
        transform: [{ scale: pressed ? 0.98 : 1 }],
      })}
    >
      <View style={{ width: 30, height: 30, borderRadius: 10, alignItems: "center", justifyContent: "center", backgroundColor: primary ? "rgba(184,149,90,0.18)" : "rgba(255,255,255,0.06)", marginBottom: 9 }}>
        <Text style={{ color: primary ? brass : muted, fontSize: 16 }}>{icon}</Text>
      </View>
      <Text style={{ color: ivory, fontWeight: "700", fontSize: 13 }}>{title}</Text>
      <Text style={{ color: "#7A776F", fontSize: 11, marginTop: 3 }}>{subtitle}</Text>
    </Pressable>
  );
}

function FeatureCard({ eyebrow, title, description, onPress }: { eyebrow: string; title: string; description: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`${title}: ${description}`} accessibilityHint="Opens this study area" onPress={onPress} hitSlop={5} style={({ pressed }) => ({ opacity: pressed ? 0.78 : 1, transform: [{ scale: pressed ? 0.985 : 1 }] })}>
      <View style={{ borderRadius: 18, padding: 17, backgroundColor: "rgba(255,255,255,0.04)", borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" }}>
        <Text style={{ color: brass, fontSize: 10, fontWeight: "800", letterSpacing: 1.4, textTransform: "uppercase" }}>{eyebrow}</Text>
        <Text style={{ color: ivory, fontSize: 18, fontWeight: "800", marginTop: 7 }}>{title}</Text>
        <Text style={{ color: muted, fontSize: 13, lineHeight: 19, marginTop: 6 }}>{description}</Text>
      </View>
    </Pressable>
  );
}

export default function HomeScreen() {
  const colors = useColors();
  const { language } = useI18n();
  const entrance = useRef(new Animated.Value(0)).current;
  const systemReducedMotion = useReducedMotion();
  const { reducedMotion: preferenceReducedMotion } = useAccessibilityPreferences();
  const reducedMotion = systemReducedMotion || preferenceReducedMotion;
  useEffect(() => {
    if (reducedMotion) {
      entrance.setValue(1);
      return;
    }
    Animated.timing(entrance, { toValue: 1, duration: 280, useNativeDriver: true }).start();
  }, [entrance, reducedMotion]);
  const [error, setError] = useState<string | null>(null);
  const [navigationPending, setNavigationPending] = useState(false);
  const [navigationRetry, setNavigationRetry] = useState<(() => void) | null>(null);
  const navigateTo = (action: () => void | Promise<void>, message: string) => { setNavigationPending(true); void runNavigation(action).then((succeeded) => { if (succeeded) { setError(null); setNavigationRetry(null); } else { setError(message); setNavigationRetry(() => () => navigateTo(action, message)); } }).finally(() => setNavigationPending(false)); };
  const [activeMatchId, setActiveMatchId] = useState<string | null>(null);
  const [activeMatchLoading, setActiveMatchLoading] = useState(true);
  const [onboardingSteps, setOnboardingSteps] = useState<OnboardingStep[]>(() => buildOnboardingSteps({ hasMatch: false, hasReview: false, hasPractice: false }));
  const onboardingPercent = useMemo(() => Math.round(onboardingCompletion(onboardingSteps) * 100), [onboardingSteps]);
  const benchmarkHistory = trpc.mahjong.benchmarkHistory.useQuery();
  useEffect(() => {
    let cancelled = false;
    void Promise.all([
      safeGetItem("mahjong.activeMatchId"),
      safeGetItem("mahjong.matchHistory"),
      safeGetItem("mahjong.onboarding.reviewed"),
      safeGetItem("mahjong.guidedPractice.progress"),
    ]).then(([activeValue, historyValue, reviewedValue, practiceValue]) => {
      if (cancelled) return;
      const parsedHistory = safeParseArray(historyValue, (item): item is { id: string } => Boolean(item && typeof item === "object" && typeof (item as { id?: unknown }).id === "string"));
      let hasPractice = false;
      if (practiceValue) {
        try {
          const parsed = JSON.parse(practiceValue) as { attempts?: unknown };
          hasPractice = typeof parsed.attempts === "number" && parsed.attempts > 0;
        } catch {
          hasPractice = false;
        }
      }
      setActiveMatchId(getActiveMatchId(activeValue));
      setOnboardingSteps(buildOnboardingSteps({ hasMatch: Boolean(activeValue) || Boolean(parsedHistory?.length), hasReview: reviewedValue === "1", hasPractice }));
      setActiveMatchLoading(false);
    }).catch(() => { if (!cancelled) setActiveMatchLoading(false); });
    return () => { cancelled = true; };
  }, []);
  const createMatch = trpc.mahjong.create.useMutation({
    onSuccess: async (match) => { const saved = await safeSetItem("mahjong.activeMatchId", match.id); if (!saved) setError("The active match could not be saved locally, but you can still continue."); setActiveMatchId(match.id); navigateTo(() => router.push(`/match/${match.id}`), "The new match could not be opened. Please try again."); },
    onError: (mutationError) => setError(mutationError.message),
  });

  const startMatch = () => {
    setError(null);
    createMatch.mutate({});
  };

  const continueMatch = () => {
    setError(null);
    if (activeMatchLoading) {
      setError("Checking for an active match. Please try again in a moment.");
      return;
    }
    if (activeMatchId) {
      navigateTo(() => router.push(`/match/${activeMatchId}`), "The active match could not be reopened. Please try again.");
      return;
    }
    startMatch();
  };

  const abandonActiveMatch = () => {
    if (!activeMatchId) return;
    Alert.alert(
      "Abandon active match?",
      "This removes the local resume shortcut. Your saved history remains available.",
      [
        { text: "Keep match", style: "cancel" },
        {
          text: "Abandon",
          style: "destructive",
          onPress: () => {
            void safeRemoveItem("mahjong.activeMatchId").then((removed) => {
              if (!removed) {
                setError("The active match could not be cleared from this device.");
                return;
              }
              setActiveMatchId(null);
              setError(null);
            });
          },
        },
      ],
    );
  };

  return (
    <ScreenContainer className="px-4 pt-3" containerClassName="bg-background">
      <Animated.ScrollView contentContainerStyle={{ paddingBottom: 36 }} showsVerticalScrollIndicator={false} style={{ opacity: 1, transform: [{ translateY: entrance.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) }] }}>
        <View style={{ gap: 20 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View style={{ width: 48, height: 48, borderRadius: 15, backgroundColor: jade, borderWidth: 1, borderColor: "rgba(212,175,112,0.45)", alignItems: "center", justifyContent: "center" }}>
              <Text style={{ color: brass, fontSize: 24 }}>東</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: brass, fontSize: 10, fontWeight: "800", letterSpacing: 1.6 }}>MAHJONG AI</Text>
              <Text style={{ color: ivory, fontSize: 18, fontWeight: "800", marginTop: 3 }}>Play with understanding.</Text>{DEMO_MODE ? <Text style={{ color: "#A7B9AC", fontSize: 10, marginTop: 3, letterSpacing: 0.6 }}>DEMO MODE · SENSEI SAMPLE DATA</Text> : null}
            </View>
            <Pressable onPress={() => navigateTo(() => router.push("/settings"), "Language settings could not be opened. Please try again.")} accessibilityRole="button" accessibilityLabel="Open language preview and settings" accessibilityHint="Compare Simplified and Traditional Chinese" hitSlop={6} style={({ pressed }) => ({ width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.07)", borderWidth: 1, borderColor: "rgba(212,175,112,0.18)", opacity: pressed ? 0.7 : 1, transform: [{ scale: pressed ? 0.96 : 1 }] })}><Text style={{ color: muted, fontSize: 13, fontWeight: "800" }}>{language === "zh-Hans" ? "简" : language === "zh-Hant" ? "繁" : "中"}</Text></Pressable><Pressable onPress={() => navigateTo(() => router.push("/settings"), "Settings could not be opened. Please try again.")} accessibilityRole="button" accessibilityLabel="Open accessibility settings" accessibilityHint="Adjust display and gameplay preferences" hitSlop={6} style={({ pressed }) => ({ width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.07)", borderWidth: 1, borderColor: "rgba(212,175,112,0.18)", opacity: pressed ? 0.7 : 1, transform: [{ scale: pressed ? 0.96 : 1 }] })}>
              <Text style={{ color: muted, fontSize: 18 }}>雅</Text>
            </Pressable>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 2 }}>
            <Text style={{ color: muted, fontSize: 11, fontWeight: "700", letterSpacing: 0.5 }}>{activeMatchLoading ? "SYNCING LOCAL TABLE" : activeMatchId ? "ACTIVE TABLE READY" : "NO ACTIVE TABLE"}</Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}><View style={{ width: 7, height: 7, borderRadius: 999, backgroundColor: activeMatchLoading ? brass : activeMatchId ? "#77C69B" : "#7A776F" }} /><Text style={{ color: activeMatchId ? "#A7D8B7" : muted, fontSize: 10, fontWeight: "800", letterSpacing: 0.8 }}>{activeMatchId ? "RESUME ENABLED" : "READY TO PLAY"}</Text></View>
          </View>

          <View style={{ borderRadius: 24, padding: 20, overflow: "hidden", backgroundColor: jade, borderWidth: 1, borderColor: "rgba(184,149,90,0.34)" }}>
            <View style={{ position: "absolute", right: -20, top: -30, width: 150, height: 150, borderRadius: 75, backgroundColor: "rgba(184,149,90,0.11)" }} />
            <Text style={{ color: brass, fontSize: 10, fontWeight: "800", letterSpacing: 1.5, textTransform: "uppercase" }}>Tonight&apos;s challenge</Text>
            <Text style={{ color: ivory, fontSize: 24, lineHeight: 29, fontWeight: "800", marginTop: 8 }}>Practice balanced decisions.</Text>
            <Text style={{ color: "#C9D7CC", fontSize: 13, lineHeight: 19, marginTop: 8 }}>The AI shows speed, value, and defensive alternatives without taking control away from you.</Text>
            <Pressable onPress={startMatch} disabled={createMatch.isPending || navigationPending} accessibilityRole="button" accessibilityLabel="Start AI match" accessibilityHint="Creates a new Mahjong match" style={({ pressed }) => ({ marginTop: 18, minHeight: 50, backgroundColor: brass, borderRadius: 15, paddingVertical: 14, alignItems: "center", justifyContent: "center", opacity: createMatch.isPending || navigationPending ? 0.55 : pressed ? 0.8 : 1, transform: [{ scale: pressed ? 0.985 : 1 }] })}>
              {createMatch.isPending ? <ActivityIndicator color="#08080E" /> : <Text style={{ color: "#08080E", fontWeight: "800" }}>Start AI match</Text>}
            </Pressable>
          </View>

          {navigationPending ? <View accessibilityRole="alert" style={{ flexDirection: "row", alignItems: "center", gap: 10, borderRadius: 14, padding: 12, backgroundColor: "rgba(212,175,112,0.12)", borderWidth: 1, borderColor: "rgba(212,175,112,0.28)" }}><ActivityIndicator color={brass} size="small" /><Text style={{ color: ivory, fontSize: 12, fontWeight: "700" }}>Opening the next table…</Text></View> : null}
          {error ? <QueryErrorState message={error} onRetry={navigationRetry ?? startMatch} /> : null}
          {benchmarkHistory.error ? <QueryErrorState message="Benchmark history is temporarily unavailable." onRetry={() => void benchmarkHistory.refetch()} compact /> : null}

          <View style={{ flexDirection: "row", gap: 9 }}>
            <ActionCard icon="▶" title="Continue" subtitle={activeMatchLoading ? "Checking active match" : activeMatchId ? "Resume active match" : "Start a match"} onPress={continueMatch} />
            <ActionCard icon="◆" title="AI Lab" subtitle="Compare policies" primary onPress={() => navigateTo(() => router.push("/ai-lab"), "AI Lab could not be opened. Please try again.")} />
            <ActionCard icon="↺" title="Review" subtitle="Study decisions" onPress={() => navigateTo(() => router.push("/review"), "Review could not be opened. Please try again.")} />
          </View>

          <View style={{ borderRadius: 18, padding: 16, backgroundColor: "rgba(255,255,255,0.04)", borderWidth: 1, borderColor: "rgba(212,175,112,0.22)" }}><View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}><View><Text style={{ color: brass, fontSize: 10, fontWeight: "800", letterSpacing: 1.4, textTransform: "uppercase" }}>Analytics workspace</Text><Text style={{ color: ivory, fontSize: 18, fontWeight: "800", marginTop: 5 }}>Sensei analytics</Text></View><Pressable onPress={() => void benchmarkHistory.refetch()} disabled={benchmarkHistory.isFetching} accessibilityRole="button" accessibilityLabel="Refresh server analytics" style={({ pressed }) => ({ borderRadius: 999, borderWidth: 1, borderColor: "rgba(212,175,112,0.36)", paddingHorizontal: 10, paddingVertical: 7, opacity: benchmarkHistory.isFetching ? 0.5 : pressed ? 0.7 : 1 })}><Text style={{ color: brass, fontSize: 10, fontWeight: "800" }}>{benchmarkHistory.isFetching ? "SYNC…" : "REFRESH"}</Text></Pressable></View><View style={{ flexDirection: "row", gap: 10, marginTop: 14 }}><View style={{ flex: 1, borderRadius: 13, padding: 12, backgroundColor: "rgba(26,58,47,0.72)" }}><Text style={{ color: "#C9D7CC", fontSize: 10, textTransform: "uppercase" }}>Server analytics</Text><Text style={{ color: ivory, fontSize: 22, fontWeight: "800", marginTop: 4 }}>{benchmarkHistory.isLoading ? "—" : benchmarkHistory.error ? "!" : benchmarkHistory.data?.length || (DEMO_MODE ? demoBenchmarkCount() : 0)}</Text><Text style={{ color: "#A7B9AC", fontSize: 11, marginTop: 2 }}>{benchmarkHistory.isLoading ? "Loading server records…" : benchmarkHistory.error ? "Server records unavailable" : DEMO_MODE && !benchmarkHistory.data?.length ? analyticsDataOriginLabel("sample") : benchmarkHistory.data?.length ? analyticsDataOriginLabel("server") : "No server records yet"}</Text></View><View style={{ flex: 1, borderRadius: 13, padding: 12, backgroundColor: "rgba(26,58,47,0.72)" }}><Text style={{ color: "#C9D7CC", fontSize: 10, textTransform: "uppercase" }}>Replay</Text><Text style={{ color: ivory, fontSize: 14, fontWeight: "800", marginTop: 7 }}>{activeMatchId ? "Ready" : "Start one"}</Text><Text style={{ color: "#A7B9AC", fontSize: 11, marginTop: 2 }}>{activeMatchId ? "active match" : "no active match"}</Text></View></View><Pressable onPress={() => navigateTo(() => router.push("/history"), "Match history could not be opened. Please try again.")} accessibilityRole="button" style={({ pressed }) => ({ marginTop: 12, borderRadius: 12, borderWidth: 1, borderColor: "rgba(212,175,112,0.36)", paddingVertical: 10, alignItems: "center", opacity: pressed ? 0.7 : 1 })}><Text style={{ color: brass, fontSize: 12, fontWeight: "800" }}>Open match history</Text></Pressable>{activeMatchId ? <Pressable onPress={abandonActiveMatch} accessibilityRole="button" accessibilityLabel="Abandon active match" style={({ pressed }) => ({ marginTop: 8, paddingVertical: 8, alignItems: "center", opacity: pressed ? 0.65 : 1 })}><Text style={{ color: "#C27A72", fontSize: 11, fontWeight: "700" }}>Abandon active match</Text></Pressable> : null}</View>

          <View style={{ gap: 10 }}>
            {onboardingPercent < 100 ? <View style={{ borderRadius: 18, padding: 16, backgroundColor: "rgba(26,58,47,0.72)", borderWidth: 1, borderColor: "rgba(184,217,201,0.28)" }}><View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}><View><Text style={{ color: "#B8D9C9", fontSize: 10, fontWeight: "800", letterSpacing: 1.4, textTransform: "uppercase" }}>Start with your data</Text><Text style={{ color: ivory, fontSize: 18, fontWeight: "800", marginTop: 5 }}>First-match checklist</Text></View><Text style={{ color: "#D7AA58", fontSize: 16, fontWeight: "900" }}>{onboardingPercent}%</Text></View><Text style={{ color: "#B9D4C8", fontSize: 12, lineHeight: 18, marginTop: 7 }}>Nothing here is pre-filled. Each step becomes complete only after you create or study your own records.</Text><View style={{ gap: 8, marginTop: 12 }}>{onboardingSteps.map((step) => <Pressable key={step.id} onPress={() => navigateTo(() => router.push(step.id === "match" ? "/" : step.id === "review" ? "/history" : "/learn"), `The ${step.title.toLowerCase()} flow could not be opened. Please try again.`)} accessibilityRole="button" accessibilityState={{ disabled: step.complete }} style={({ pressed }) => ({ flexDirection: "row", alignItems: "center", gap: 10, borderRadius: 12, padding: 10, backgroundColor: step.complete ? "rgba(184,217,201,0.13)" : "rgba(255,255,255,0.06)", opacity: pressed ? 0.75 : 1 })}><Text style={{ color: step.complete ? "#B8D9C9" : "#D7AA58", fontSize: 15, fontWeight: "900" }}>{step.complete ? "✓" : "○"}</Text><View style={{ flex: 1 }}><Text style={{ color: ivory, fontSize: 12, fontWeight: "800" }}>{step.title}</Text><Text style={{ color: "#B9D4C8", fontSize: 10, lineHeight: 15, marginTop: 2 }}>{step.complete ? "Completed from your saved activity." : step.description}</Text></View></Pressable>)}</View></View> : null}
            <Text style={{ color: ivory, fontSize: 20, fontWeight: "800" }}>Available training tools</Text>
            <View style={{ flexDirection: "row", gap: 10 }}>
              <View style={{ flex: 1, borderRadius: 18, padding: 15, backgroundColor: "rgba(255,255,255,0.04)", borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" }}>
                <Text style={{ color: brass, fontSize: 22, fontWeight: "800" }}>Shape</Text>
                <Text style={{ color: ivory, fontSize: 13, fontWeight: "700", marginTop: 5 }}>Build flexible hands</Text>
                <Text style={{ color: "#7A776F", fontSize: 11, lineHeight: 16, marginTop: 4 }}>Use the AI preview to compare ukeire and value.</Text>
              </View>
              <View style={{ flex: 1, borderRadius: 18, padding: 15, backgroundColor: "rgba(255,255,255,0.04)", borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" }}>
                <Text style={{ color: brass, fontSize: 22, fontWeight: "800" }}>Defense</Text>
                <Text style={{ color: ivory, fontSize: 13, fontWeight: "700", marginTop: 5 }}>Read the table</Text>
                <Text style={{ color: "#7A776F", fontSize: 11, lineHeight: 16, marginTop: 4 }}>Inspect danger signals before committing to a discard.</Text>
              </View>
            </View>
          </View>

          <FeatureCard eyebrow="Sensei Pro · $9.99 / month" title="Study with more depth" description="Unlock deeper AI review, policy comparisons, and priority recovery when you are ready." onPress={() => navigateTo(() => router.push("/upgrade"), "The Sensei Pro pricing screen could not be opened. Please try again.")} />
          <FeatureCard eyebrow="Decision preview" title="See legality, score, and AI signals" description="Inspect what the backend knows before you choose an action." onPress={() => navigateTo(() => router.push("/preview"), "The decision preview could not be opened. Please try again.")} />
          {onboardingSteps.some((step) => step.complete) ? <FeatureCard eyebrow="Your saved activity" title="Continue learning" description="Review or practice from decisions and drills you have actually completed." onPress={() => navigateTo(() => router.push("/learn"), "The learning area could not be opened. Please try again.")} /> : <FeatureCard eyebrow="No saved study data" title="Create an experiment to unlock learning" description="Sensei will recommend review and drills after your first real decision or completed practice." onPress={() => navigateTo(() => router.push("/ai-lab"), "AI Lab could not be opened. Please try again.")} />}
          <FeatureCard eyebrow="Match library" title="Reopen a recent experiment" description="Return to a saved replay, archive old drills, or manage local match history." onPress={() => navigateTo(() => router.push("/history"), "Match history could not be opened. Please try again.")} />
        </View>
      </Animated.ScrollView>
    </ScreenContainer>
  );
}
