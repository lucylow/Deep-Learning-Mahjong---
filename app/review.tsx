import { useEffect, useMemo, useState } from "react";
import { safeGetItem, safeRemoveItem, safeSetItem } from "@/shared/storage-utils";
import { ActivityIndicator, FlatList, Pressable, Text, TextInput, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useAccessibilityPreferences } from "@/lib/accessibility-preferences";
import { trpc } from "@/lib/trpc";
import { presentDecision } from "@/shared/review-utils";
import { summarizePolicies } from "@/shared/policy-comparison";
import { buildCoachingPlan, buildLearningFocus } from "@/shared/learning-focus";
import { appendCalibrationHistory, buildCalibrationHistorySummary, buildCalibrationSparkline, buildConfidenceCalibration, deriveObservedOutcome, normalizeCalibrationHistory, type CalibrationHistoryEntry } from "@/shared/confidence-calibration";
import { buildReplayCoachingSignal } from "@/shared/replay-coaching";
import { coachingModeDescription, coachingModeLabel, nextCoachingMode, normalizeCoachingMode, type CoachingMode } from "@/shared/coaching-mode";
import { buildLearningTrends, summarizePolicyDifferences } from "@/shared/learning-trends";
import { DEFAULT_LEARNING_PROFILE, normalizeLearningProfile, profileEntryFromDecisions, recordLearningProfileMatch, weakestProfileObjective, type LearningProfile } from "@/shared/learning-profile";
import { MatchAnalyticsPanel } from "@/components/match-analytics-panel";
import { compareSnapshots } from "@/shared/snapshot-diff";
import { QueryErrorState } from "@/components/query-error-state";
import { DEMO_ANALYSIS_HISTORY, DEMO_DECISIONS, DEMO_MATCH_REPORT, DEMO_REPLAY_ANALYTICS, DEMO_REPLAY_SNAPSHOTS, DEMO_MODE } from "@/shared/demo-data";
import { formatActionLifecycleTime, isActionLifecycleEntry, type ActionLifecycleEntry } from "@/shared/action-lifecycle";
import { safeParseArray } from "@/shared/storage-utils";
import type { ReplaySnapshot } from "@/shared/mahjong-backend";
import { matchHistoryOriginLabel } from "@/shared/match-history";
import { useI18n } from "@/lib/i18n";
import { localizedReplayAction, localizedReplayFilterSummary, localizedReplayHeader, localizedReplaySeatFilterAccessibilityLabel, localizedReplaySeatFilterLabel, localizedReplaySeatHeader, localizedReplayStatusLabel, localizedReplayTileAccessibility, localizedReplayTurn, localizedReplayNoTile } from "@/shared/mahjong-labels";

const REPLAY_SEAT_ACCENTS = ["#B87843", "#2E6A59", "#6B7F9E", "#9B5B54"] as const;
type ReplaySeatFilter = "all" | 0 | 1 | 2 | 3;

// Replay source contract phrases retained for regression coverage: Full replay board; Show all replay seats; Show replay seat ${filter}; originating action tile.
function ReplayBoard({ snapshot, highlightedTileCodes, selectedTileCode, onTilePress, seatFilter, onSeatFilterChange, largeTiles, language }: { snapshot: ReplaySnapshot; highlightedTileCodes: Set<string>; selectedTileCode?: string; onTilePress: (code: string) => void; seatFilter: ReplaySeatFilter; onSeatFilterChange: (filter: ReplaySeatFilter) => void; largeTiles: boolean; language: Parameters<typeof localizedReplaySeatFilterLabel>[0] }) {
  return <View accessibilityRole="summary" className="mt-3 rounded-2xl border border-[#2E6A59] bg-[#17493F] p-3"><View className="flex-row items-center justify-between"><Text className="text-xs font-bold uppercase tracking-widest text-[#D7AA58]">{localizedReplayHeader(language).title}</Text><Text className="text-[10px] font-bold uppercase tracking-wide text-[#B9D4C8]">{localizedReplayTurn(language, snapshot.turn, snapshot.state.wall.length)}</Text></View><Text className="mt-1 text-xs leading-4 text-[#B9D4C8]">{localizedReplayHeader(language).instruction}</Text><View className="mt-3 flex-row flex-wrap gap-2">{(["all", 0, 1, 2, 3] as ReplaySeatFilter[]).map((filter) => <Pressable key={String(filter)} onPress={() => onSeatFilterChange(filter)} accessibilityRole="button" accessibilityLabel={localizedReplaySeatFilterAccessibilityLabel(language, filter)} accessibilityState={{ selected: seatFilter === filter }} style={({ pressed }) => ({ borderRadius: 999, backgroundColor: seatFilter === filter ? "#D7AA58" : "#1C5146", paddingHorizontal: 10, paddingVertical: 7, opacity: pressed ? 0.72 : 1 })}><Text className={`text-[10px] font-bold uppercase ${seatFilter === filter ? "text-[#17211F]" : "text-[#B9D4C8]"}`}>{localizedReplaySeatFilterLabel(language, filter)}</Text></Pressable>)}</View><View className="mt-3 gap-2">{snapshot.state.players.filter((player) => seatFilter === "all" || player.seat === seatFilter).map((player) => <View key={player.seat} className="rounded-xl bg-[#123C35] p-3"><View className="flex-row items-center justify-between"><View className="flex-row items-center gap-2"><View style={{ width: 8, height: 8, borderRadius: 999, backgroundColor: REPLAY_SEAT_ACCENTS[player.seat] }} /><Text className="text-xs font-bold uppercase tracking-wide text-[#F7F0E3]">{localizedReplaySeatHeader(language, player.seat, player.wind)}</Text></View><Text className="text-xs font-bold text-[#D7AA58]">{player.score.toLocaleString()} {language === "zh-Hans" || language === "zh-Hant" ? "分" : "pts"}</Text></View><View className="mt-2 flex-row flex-wrap gap-1">{player.hand.map((tile) => <Pressable key={tile.id} onPress={() => onTilePress(tile.code)} accessibilityRole="button" accessibilityLabel={localizedReplayTileAccessibility(language, tile.code, player.seat, "hand", undefined, highlightedTileCodes.has(tile.code))} style={({ pressed }) => ({ minWidth: largeTiles ? 44 : 32, minHeight: largeTiles ? 42 : 30, alignItems: "center", justifyContent: "center", borderRadius: 6, opacity: pressed ? 0.72 : 1, transform: [{ scale: pressed || selectedTileCode === tile.code ? 0.98 : 1 }] })}><View className={`rounded-md px-2 py-1 ${highlightedTileCodes.has(tile.code) || selectedTileCode === tile.code ? "border border-[#D7AA58] bg-[#D7AA58]" : "bg-[#F7F0E3]"}`}><Text className="text-[10px] font-bold text-[#17211F]">{tile.code}</Text></View></Pressable>)}</View><Text className="mt-2 text-[10px] font-bold uppercase tracking-wide text-[#B9D4C8]">{localizedReplaySeatHeader(language, player.seat, "")} · {player.discards.length}</Text><View className="mt-1 flex-row flex-wrap gap-1">{player.discards.slice(-8).map((discard) => <Pressable key={`${discard.turn}-${discard.tile.id}`} onPress={() => onTilePress(discard.tile.code)} accessibilityRole="button" accessibilityLabel={localizedReplayTileAccessibility(language, discard.tile.code, player.seat, "discard", discard.turn, highlightedTileCodes.has(discard.tile.code))} style={({ pressed }) => ({ minWidth: largeTiles ? 44 : 32, minHeight: largeTiles ? 42 : 30, alignItems: "center", justifyContent: "center", borderRadius: 6, opacity: pressed ? 0.72 : 1 })}><View className={`rounded-md px-2 py-1 ${highlightedTileCodes.has(discard.tile.code) || selectedTileCode === discard.tile.code ? "border border-[#D7AA58] bg-[#D7AA58]" : "bg-[#1C5146]"}`}><Text className={`text-[10px] font-bold ${highlightedTileCodes.has(discard.tile.code) || selectedTileCode === discard.tile.code ? "text-[#17211F]" : "text-[#F7F0E3]"}`}>{discard.tile.code}</Text></View></Pressable>)}</View></View>)}</View></View>;
}

export default function ReviewScreen() {
  const { language } = useI18n();
  const params = useLocalSearchParams<{ matchId?: string; turn?: string; tile?: string }>();
  const matchId = typeof params.matchId === "string" ? params.matchId : undefined;
  const requestedTurn = typeof params.turn === "string" && Number.isFinite(Number(params.turn)) ? Number(params.turn) : undefined;
  const requestedTile = typeof params.tile === "string" ? params.tile : undefined;
  const [storedMatchId, setStoredMatchId] = useState<string | undefined>();
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const [selectedAlternative, setSelectedAlternative] = useState<{ title: string; rationale: string; confidence: number } | null>(null);
  const [selectedSnapshotSequence, setSelectedSnapshotSequence] = useState<number | null>(null);
  const [replayIndex, setReplayIndex] = useState(0);
  const [isAutoplaying, setIsAutoplaying] = useState(false);
  const [replaySpeed, setReplaySpeed] = useState<0.5 | 1 | 2>(1);
  const [storageError, setStorageError] = useState<string | null>(null);
  const [bookmarkIndex, setBookmarkIndex] = useState<number | null>(null);
  const [bookmarkError, setBookmarkError] = useState<string | null>(null);
  const [annotationText, setAnnotationText] = useState("");
  const [annotationError, setAnnotationError] = useState<string | null>(null);
  const [learningProfile, setLearningProfile] = useState<LearningProfile>(DEFAULT_LEARNING_PROFILE);
  const [actionTimeline, setActionTimeline] = useState<ActionLifecycleEntry[]>([]);
  const [selectedReplayTile, setSelectedReplayTile] = useState<string | undefined>(requestedTile);
  const [replaySeatFilter, setReplaySeatFilter] = useState<ReplaySeatFilter>("all");
  const [calibrationHistory, setCalibrationHistory] = useState<CalibrationHistoryEntry[]>([]);
  const [coachingMode, setCoachingMode] = useState<CoachingMode>("balanced");
  useEffect(() => {
    if (matchId) return;
    void safeGetItem("mahjong.activeMatchId").then((value) => { if (value) setStoredMatchId(value ?? undefined); });
  }, [matchId]);
  const activeMatchId = matchId ?? storedMatchId;
  const isDemoReview = DEMO_MODE && !activeMatchId;
  useEffect(() => {
    if (!activeMatchId || isDemoReview) return;
    void safeSetItem("mahjong.onboarding.reviewed", "1");
  }, [activeMatchId, isDemoReview]);
  useEffect(() => {
    let active = true;
    if (!activeMatchId) { setActionTimeline([]); return () => { active = false; }; }
    void safeGetItem(`mahjong.actionTimeline:${activeMatchId}`).then((value) => {
      if (!active) return;
      setActionTimeline(safeParseArray(value, isActionLifecycleEntry) ?? []);
    });
    return () => { active = false; };
  }, [activeMatchId]);
  const bookmarkKey = activeMatchId ? `mahjong.reviewBookmark:${activeMatchId}` : undefined;
  const annotationKey = activeMatchId ? `mahjong.reviewAnnotation:${activeMatchId}:${replayIndex}` : undefined;
  useEffect(() => {
    let cancelled = false;
    setBookmarkIndex(null);
    setBookmarkError(null);
    if (!bookmarkKey) return () => { cancelled = true; };
    void safeGetItem(bookmarkKey).then((value) => {
      if (cancelled) return;
      const parsed = value === null ? NaN : Number(value);
      if (Number.isInteger(parsed) && parsed >= 0) setBookmarkIndex(parsed);
    });
    return () => { cancelled = true; };
  }, [bookmarkKey]);
  useEffect(() => {
    let cancelled = false;
    setAnnotationText("");
    setAnnotationError(null);
    if (!annotationKey) return () => { cancelled = true; };
    void safeGetItem(annotationKey).then((value) => {
      if (!cancelled) setAnnotationText(value ?? "");
    });
    return () => { cancelled = true; };
  }, [annotationKey]);
  const decisions = trpc.mahjong.aiDecisionHistory.useQuery({ id: activeMatchId ?? "" }, { enabled: Boolean(activeMatchId) });
  const analytics = trpc.mahjong.replayAnalytics.useQuery({ id: activeMatchId ?? "" }, { enabled: Boolean(activeMatchId) });
  const report = trpc.mahjong.aiMatchReport.useQuery({ id: activeMatchId ?? "" }, { enabled: Boolean(activeMatchId) });
  const analysisHistory = trpc.mahjong.analysisHistory.useQuery({ id: activeMatchId ?? "" }, { enabled: Boolean(activeMatchId) });
  const audit = trpc.mahjong.audit.useQuery({ id: activeMatchId ?? "" }, { enabled: Boolean(activeMatchId) });
  const timeline = useMemo(() => decisions.data?.length ? decisions.data : isDemoReview ? DEMO_DECISIONS : [], [decisions.data, isDemoReview]);
  const analysisRecords = useMemo(() => analysisHistory.data?.length ? analysisHistory.data : isDemoReview ? DEMO_ANALYSIS_HISTORY : [], [analysisHistory.data, isDemoReview]);
  const displayedAnalytics = analytics.data ?? (isDemoReview ? DEMO_REPLAY_ANALYTICS : undefined);
  const displayedReport = report.data ?? (isDemoReview ? DEMO_MATCH_REPORT : undefined);
  useEffect(() => { setReplayIndex((current) => timeline.length ? Math.min(current, timeline.length - 1) : 0); }, [timeline.length]);
  useEffect(() => {
    let active = true;
    if (!timeline.length) return () => { active = false; };
    void safeGetItem("mahjong.sensei.learningProfile").then((value) => {
      if (!active) return;
      let existing = DEFAULT_LEARNING_PROFILE;
      if (value) { try { existing = normalizeLearningProfile(JSON.parse(value)); } catch { existing = DEFAULT_LEARNING_PROFILE; } }
      const entry = profileEntryFromDecisions(activeMatchId ?? "demo-replay", timeline);
      const next = recordLearningProfileMatch(existing, entry);
      setLearningProfile(next);
      if (activeMatchId) void safeSetItem("mahjong.sensei.learningProfile", JSON.stringify(next));
    });
    return () => { active = false; };
  }, [activeMatchId, timeline]);
  useEffect(() => {
    if (bookmarkIndex === null || !timeline.length) return;
    setReplayIndex(Math.min(bookmarkIndex, timeline.length - 1));
  }, [bookmarkIndex, timeline.length]);
  useEffect(() => {
    if (requestedTurn === undefined || !timeline.length) return;
    const requestedIndex = Math.max(0, Math.floor(requestedTurn - 1));
    setReplayIndex(Math.min(requestedIndex, timeline.length - 1));
    setIsAutoplaying(false);
  }, [requestedTurn, timeline]);
  useEffect(() => {
    if (!isAutoplaying || timeline.length < 2) return;
    const timer = setInterval(() => setReplayIndex((current) => {
      if (current >= timeline.length - 1) { setIsAutoplaying(false); return current; }
      return current + 1;
    }), 1800 / replaySpeed);
    return () => clearInterval(timer);
  }, [isAutoplaying, replaySpeed, timeline.length]);
  const policySummaries = useMemo(() => summarizePolicies(timeline), [timeline]);
  const learningFocus = useMemo(() => buildLearningFocus(timeline), [timeline]);
  const coachingPlan = useMemo(() => buildCoachingPlan(timeline), [timeline]);
  const profileObjective = weakestProfileObjective(learningProfile);
  const learningTrends = useMemo(() => buildLearningTrends(timeline), [timeline]);
  const policyDifferences = useMemo(() => summarizePolicyDifferences(timeline), [timeline]);
  const replayProgress = timeline.length > 1 ? Math.round((replayIndex / (timeline.length - 1)) * 100) : 100;
  const highlightedTileCodes = useMemo(() => {
    if (requestedTile) return new Set([requestedTile]);
    const latestConfirmed = [...actionTimeline].reverse().find((entry) => entry.status === "confirmed" && entry.tileCodes?.length);
    return new Set(latestConfirmed?.tileCodes ?? []);
  }, [actionTimeline, requestedTile]);
  const snapshots = useMemo(() => audit.data?.snapshots?.length ? audit.data.snapshots : isDemoReview ? DEMO_REPLAY_SNAPSHOTS : [], [audit.data?.snapshots, isDemoReview]);
  const confidenceCalibration = useMemo(() => buildConfidenceCalibration(timeline, snapshots[snapshots.length - 1]?.state), [timeline, snapshots]);
  const calibrationSummary = useMemo(() => buildCalibrationHistorySummary(calibrationHistory), [calibrationHistory]);
  const calibrationSparkline = useMemo(() => buildCalibrationSparkline(calibrationHistory), [calibrationHistory]);
  const replayCoaching = useMemo(() => { const decision = timeline[replayIndex]; return decision ? buildReplayCoachingSignal(decision, confidenceCalibration, deriveObservedOutcome(decision, snapshots[snapshots.length - 1]?.state)) : null; }, [confidenceCalibration, replayIndex, snapshots, timeline]);
  useEffect(() => { void safeGetItem("mahjong.sensei.coachingMode").then((value) => setCoachingMode(normalizeCoachingMode(value))); }, []);
  const cycleCoachingMode = () => { const next = nextCoachingMode(coachingMode); setCoachingMode(next); void safeSetItem("mahjong.sensei.coachingMode", next); };
  useEffect(() => { void safeGetItem("mahjong.sensei.calibrationHistory").then((value) => { if (value) { try { setCalibrationHistory(normalizeCalibrationHistory(JSON.parse(value))); } catch { setCalibrationHistory([]); } } }); }, []);
  useEffect(() => { if (!activeMatchId || confidenceCalibration.status !== "observed") return; const entry: CalibrationHistoryEntry = { matchId: activeMatchId, completedAt: new Date().toISOString(), averageConfidence: confidenceCalibration.averageConfidence, observedSuccessRate: confidenceCalibration.overallSuccessRate, calibrationGap: confidenceCalibration.calibrationGap, byObjective: confidenceCalibration.byObjective }; setCalibrationHistory((current) => { const next = appendCalibrationHistory(current, entry); void safeSetItem("mahjong.sensei.calibrationHistory", JSON.stringify(next)); return next; }); }, [activeMatchId, confidenceCalibration]);
  const selectedSnapshot = useMemo(() => { const index = snapshots.findIndex((snapshot) => snapshot.sequence === selectedSnapshotSequence); return index >= 0 ? compareSnapshots(snapshots[index], snapshots[index - 1]) : null; }, [selectedSnapshotSequence, snapshots]);
  const replayBoardSnapshot = useMemo(() => { if (!snapshots.length) return undefined; return snapshots.find((snapshot) => snapshot.sequence === selectedSnapshotSequence) ?? snapshots[snapshots.length - 1]; }, [selectedSnapshotSequence, snapshots]);
  const focusReplayTile = (code: string) => { setSelectedReplayTile(code); const decisionIndex = timeline.findIndex((decision) => decision.action.tileCodes?.some((tile) => tile === code)); if (decisionIndex >= 0) { setReplayIndex(decisionIndex); setIsAutoplaying(false); } };
  const { highContrast, largeTiles, setHighContrast, setLargeTiles } = useAccessibilityPreferences();
  const cardClass = highContrast ? "rounded-2xl border-2 border-foreground bg-background p-4" : "rounded-2xl border border-border bg-surface p-4";
  const titleClass = largeTiles ? "mt-1 text-xl font-bold text-foreground" : "mt-1 text-lg font-bold text-foreground";
  const clearStoredMatch = async () => { const cleared = await safeRemoveItem("mahjong.activeMatchId"); if (!cleared) { setStorageError("The stale match could not be cleared from local storage. Please try again."); return; } setStorageError(null); setStoredMatchId(undefined); };
  const jumpToBookmark = () => {
    if (bookmarkIndex === null || !timeline.length) return;
    setReplayIndex(Math.min(bookmarkIndex, timeline.length - 1));
    setIsAutoplaying(false);
  };
  const saveBookmark = async () => {
    if (!bookmarkKey || !timeline.length) return;
    const saved = await safeSetItem(bookmarkKey, String(replayIndex));
    if (!saved) { setBookmarkError("This replay bookmark could not be saved on the device."); return; }
    setBookmarkError(null);
    setBookmarkIndex(replayIndex);
  };
  const clearBookmark = async () => {
    if (!bookmarkKey) return;
    const cleared = await safeRemoveItem(bookmarkKey);
    if (!cleared) { setBookmarkError("This replay bookmark could not be cleared from the device."); return; }
    setBookmarkError(null);
    setBookmarkIndex(null);
  };
  const saveAnnotation = async () => {
    if (!annotationKey) return;
    const saved = await safeSetItem(annotationKey, annotationText.trim());
    if (!saved) { setAnnotationError("This study note could not be saved on the device."); return; }
    setAnnotationError(null);
  };
  const clearAnnotation = async () => {
    if (!annotationKey) return;
    const cleared = await safeRemoveItem(annotationKey);
    if (!cleared) { setAnnotationError("This study note could not be cleared from the device."); return; }
    setAnnotationError(null);
    setAnnotationText("");
  };
  const refreshReview = () => { void decisions.refetch(); void analytics.refetch(); void report.refetch(); void analysisHistory.refetch(); void audit.refetch(); };

  const renderDecision = ({ item, index }: { item: (typeof timeline)[number]; index: number }) => {
    const presented = presentDecision(item, index);
    const isExpanded = expandedKey === presented.key;
    const alternatives = analysisRecords[index]?.analysis.alternatives.slice(0, 3) ?? [];
    return (
      <Pressable accessibilityRole="button" accessibilityLabel={`${presented.label}, ${presented.title}`} accessibilityState={{ expanded: isExpanded }} onPress={() => setExpandedKey(isExpanded ? null : presented.key)}>
        <View className={cardClass}>
          <View className="flex-row items-center justify-between">
            <Text className="text-xs font-bold uppercase tracking-widest text-primary">{presented.label}</Text>
            <Text className="text-xs font-semibold text-muted">{presented.confidence}</Text>
          </View>
          <View className="mt-1 flex-row items-center gap-2"><Text className={titleClass}>{presented.title}</Text><Text className="rounded-full bg-background px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-primary">{presented.policy}</Text></View>
          <Text className="mt-1 text-sm leading-5 text-muted">{presented.detail}</Text>
          <Text className="mt-3 text-xs uppercase tracking-wide text-primary">{presented.timestamp} · {presented.action} · {isExpanded ? "Hide details" : "View details"}</Text>
          {isExpanded ? <View className="mt-3 gap-2 border-t border-border pt-3"><Text className="text-xs font-bold uppercase tracking-widest text-primary">Why {presented.policy} ranked this line</Text>{alternatives.length ? <View className="gap-2"><Text className="text-xs font-bold uppercase tracking-widest text-primary">Alternative lines</Text>{alternatives.map((alternative, alternativeIndex) => <Pressable key={`${alternative.action.type}-${alternativeIndex}`} onPress={() => setSelectedAlternative({ title: `${alternative.action.type} · ${alternative.action.tileCodes?.[0] ?? "no tile"}`, rationale: alternative.rationale, confidence: alternative.confidence })} accessibilityRole="button" accessibilityState={{ selected: selectedAlternative?.title === `${alternative.action.type} · ${alternative.action.tileCodes?.[0] ?? "no tile"}` }} style={({ pressed }) => ({ borderRadius: 12, backgroundColor: selectedAlternative?.title === `${alternative.action.type} · ${alternative.action.tileCodes?.[0] ?? "no tile"}` ? "#E8F1ED" : "#F7F8F5", padding: 12, opacity: pressed ? 0.72 : 1 })}><View className="flex-row items-center justify-between"><Text className="text-sm font-semibold text-foreground">{alternative.action.type} · {alternative.action.tileCodes?.[0] ?? "no tile"}</Text><Text className="text-xs font-bold text-primary">{Math.round(alternative.confidence * 100)}%</Text></View><Text className="mt-1 text-xs leading-4 text-muted">{alternative.rationale}</Text><Text className="mt-2 text-[10px] font-bold uppercase tracking-wide text-primary">Tap to compare</Text></Pressable>)}</View> : null}{presented.contributions.length ? presented.contributions.map((contribution) => <View key={contribution.feature} className="rounded-xl bg-background p-3"><View className="flex-row items-center justify-between"><Text className="text-sm font-semibold capitalize text-foreground">{contribution.feature}</Text><Text className="text-xs font-bold text-primary">{contribution.contribution.toFixed(2)}</Text></View><Text className="mt-1 text-xs leading-4 text-muted">{contribution.explanation}</Text></View>) : <Text className="text-sm leading-5 text-muted">No feature breakdown was recorded for this decision.</Text>}</View> : null}
        </View>
      </Pressable>
    );
  };

  const accessibilityControls = (
    <View className="rounded-2xl border border-border bg-surface p-3">
      <Text className="text-xs font-bold uppercase tracking-widest text-primary">Accessibility</Text>
      <View className="mt-2 flex-row gap-2">
        <Pressable accessibilityRole="switch" accessibilityState={{ checked: highContrast }} onPress={() => setHighContrast(!highContrast)} style={({ pressed }) => ({ flex: 1, borderRadius: 12, backgroundColor: highContrast ? "#17211F" : "#F4F5F2", padding: 11, opacity: pressed ? 0.7 : 1 })}>
          <Text style={{ color: highContrast ? "#FFFFFF" : "#17211F", textAlign: "center", fontSize: 12, fontWeight: "700" }}>High contrast</Text>
        </Pressable>
        <Pressable accessibilityRole="switch" accessibilityState={{ checked: largeTiles }} onPress={() => setLargeTiles(!largeTiles)} style={({ pressed }) => ({ flex: 1, borderRadius: 12, backgroundColor: largeTiles ? "#17211F" : "#F4F5F2", padding: 11, opacity: pressed ? 0.7 : 1 })}>
          <Text style={{ color: largeTiles ? "#FFFFFF" : "#17211F", textAlign: "center", fontSize: 12, fontWeight: "700" }}>Larger cards</Text>
        </Pressable>
      </View>
    </View>
  );

  const header = (
    <View className="gap-5 pb-5">
      <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Go back" style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}>
        <Text className="font-semibold text-primary">‹ Back</Text>
      </Pressable>
      <View>
        <Text className="text-sm font-semibold uppercase tracking-widest text-primary">AI review</Text>
        <Text className="mt-1 text-4xl font-bold text-foreground">Replay the turning point.</Text>
        <Text className="mt-2 text-base leading-6 text-muted">Compare the original action with visible evidence, policy objectives, and uncertainty.</Text><Pressable onPress={cycleCoachingMode} accessibilityRole="button" accessibilityLabel={`Coaching mode ${coachingModeLabel(coachingMode)}. Tap to change mode.`} style={({ pressed }) => ({ alignSelf: "flex-start", marginTop: 12, borderRadius: 12, backgroundColor: "#E8F1ED", paddingHorizontal: 12, paddingVertical: 9, opacity: pressed ? 0.72 : 1 })}><Text className="text-xs font-bold uppercase tracking-wide text-[#2E6A59]">Mode · {coachingModeLabel(coachingMode)}</Text><Text className="mt-1 text-[10px] leading-4 text-[#4B6258]">{coachingModeDescription(coachingMode)}</Text></Pressable>{isDemoReview ? <Text className="mt-2 text-xs font-semibold uppercase tracking-wide text-primary">Demo replay · deterministic Sensei sample</Text> : null}{activeMatchId ? <View className="mt-2 self-start rounded-full border border-[#B8D9C9] bg-[#E8F1ED] px-2 py-1"><Text className="text-[10px] font-bold uppercase tracking-wide text-[#2E6A59]">{matchHistoryOriginLabel("legacy-unowned")} · local pointer</Text></View> : null}{requestedTurn !== undefined ? <Text accessibilityRole="summary" className="mt-2 rounded-xl bg-[#FFF0D5] px-3 py-2 text-xs font-bold uppercase tracking-wide text-[#8B5A2B]">Opened from discard turn {requestedTurn}{requestedTile ? ` · tile ${requestedTile}` : ""} · origin highlighted below</Text> : null}
      </View>
      {accessibilityControls}
      {storageError ? <QueryErrorState message={storageError} onRetry={clearStoredMatch} compact /> : null}
      <MatchAnalyticsPanel analytics={displayedAnalytics} report={displayedReport} chatReady={Boolean(activeMatchId) || isDemoReview} onReview={() => isDemoReview ? router.replace("/review") : router.push({ pathname: "/review", params: { matchId: activeMatchId } })} onHistory={() => router.push("/history")} />
      {actionTimeline.length ? <View accessibilityRole="summary" className="rounded-2xl border border-[#2E6A59] bg-[#E8F1ED] p-4"><Text className="text-xs font-bold uppercase tracking-widest text-[#2E6A59]">{localizedReplayAction(language).title}</Text><Text className="mt-1 text-sm leading-5 text-[#4B6258]">{localizedReplayAction(language).detail}</Text><View className="mt-3 gap-2">{actionTimeline.slice(-4).reverse().map((entry) => <View key={entry.id} className="flex-row items-center gap-3 rounded-xl bg-white/70 p-3"><Text className="w-8 text-center text-lg font-bold text-[#2E6A59]">{entry.status === "confirmed" ? "✓" : entry.status === "rejected" ? "!" : "…"}</Text><View className="flex-1"><Text className="text-sm font-bold capitalize text-[#17211F]">{entry.label} · {localizedReplayStatusLabel(language, entry.status)}</Text><Text className="mt-1 text-xs leading-4 text-[#4B6258]">{entry.detail} · {entry.tileCodes?.join(" · ") ?? entry.tileIds?.join(" · ") ?? localizedReplayNoTile(language)} · {formatActionLifecycleTime(entry.createdAt)}</Text></View></View>)}</View></View> : null}
      {learningFocus ? <View accessibilityRole="summary" className="rounded-2xl border border-[#B87843] bg-[#FFF8EC] p-4"><Text className="text-xs font-bold uppercase tracking-widest text-[#8B5A2B]">Personal learning focus</Text><Text className="mt-1 text-xl font-bold text-[#17211F]">{learningFocus.label}</Text><Text className="mt-2 text-sm leading-5 text-[#7B6B5A]">{learningFocus.reason}</Text><View className="mt-3 flex-row items-center justify-between rounded-xl bg-[#F7F0E3] p-3"><Text className="text-xs font-bold uppercase tracking-wide text-[#8B5A2B]">Next drill</Text><Text className="ml-3 flex-1 text-right text-xs leading-4 text-[#17211F]">{learningFocus.nextDrill}</Text></View><Pressable onPress={() => { if (learningFocus.replayDecisionIndex >= 0) { setReplayIndex(learningFocus.replayDecisionIndex); setIsAutoplaying(false); } }} accessibilityRole="button" accessibilityLabel="Replay Sensei focus decision" style={({ pressed }) => ({ marginTop: 10, borderRadius: 10, backgroundColor: "#17211F", paddingHorizontal: 12, paddingVertical: 9, opacity: pressed ? 0.72 : 1 })}><Text className="text-center text-xs font-bold text-white">Replay {learningFocus.replayAction}</Text></Pressable></View> : null}
      {learningProfile.matches.length ? <View accessibilityRole="summary" className="rounded-2xl border border-border bg-surface p-4"><Text className="text-xs font-bold uppercase tracking-widest text-primary">Multi-match learning profile</Text><Text className="mt-1 text-xl font-bold text-foreground">{learningProfile.matches.length} replay{learningProfile.matches.length === 1 ? "" : "s"} informing Sensei</Text><Text className="mt-2 text-sm leading-5 text-muted">Across saved matches, Sensei is currently watching {profileObjective} confidence at {Math.round(learningProfile.byObjective[profileObjective].recentConfidence * 100)}% recent average.</Text><Text className="mt-2 text-xs leading-4 text-muted">New replay decisions update this profile only when a real match is active; demo data remains clearly separated.</Text></View> : null}
      {confidenceCalibration.totalDecisions ? <View accessibilityRole="summary" className="rounded-2xl border border-border bg-surface p-4"><Text className="text-xs font-bold uppercase tracking-widest text-primary">Confidence calibration</Text><Text className="mt-1 text-xl font-bold text-foreground">{confidenceCalibration.status === "observed" ? `${Math.round(confidenceCalibration.overallSuccessRate * 100)}% observed success` : "Awaiting an observed result"}</Text><Text className="mt-2 text-sm leading-5 text-muted">{confidenceCalibration.coaching}</Text><View className="mt-3 flex-row gap-2">{confidenceCalibration.buckets.map((bucket) => <View key={bucket.label} className="flex-1 rounded-xl bg-background p-3"><Text className="text-xs font-bold uppercase tracking-wide text-primary">{bucket.label}</Text><Text className="mt-1 text-sm font-bold text-foreground">{bucket.decisions ? `${Math.round(bucket.observedSuccessRate * 100)}%` : "—"}</Text><Text className="mt-1 text-[10px] leading-4 text-muted">{bucket.decisions ? `${bucket.decisions} observed` : "No result yet"}</Text></View>)}</View><View className="mt-3 rounded-xl bg-background p-3"><View className="flex-row items-center justify-between"><Text className="text-xs font-bold uppercase tracking-wide text-primary">Objective calibration</Text><Text className="text-[10px] text-muted">{confidenceCalibration.observedDecisions} observed</Text></View><View className="mt-2 gap-2">{confidenceCalibration.byObjective.filter((item) => item.decisions > 0).map((item) => <View key={item.objective} className="flex-row items-center justify-between"><View className="flex-1"><Text className="text-xs font-bold capitalize text-foreground">{item.objective}</Text><Text className="mt-1 text-[10px] leading-4 text-muted">{item.coaching}</Text></View><Text className={item.direction === "overconfident" ? "ml-2 text-[10px] font-bold text-[#9B2414]" : item.direction === "underconfident" ? "ml-2 text-[10px] font-bold text-[#2E6A59]" : "ml-2 text-[10px] font-bold text-primary"}>{item.direction}</Text></View>)}</View><View className="mt-3 rounded-lg border border-border p-2"><Text className="text-[10px] font-bold uppercase tracking-wide text-primary">Calibration history · {calibrationHistory.length} review{calibrationHistory.length === 1 ? "" : "s"}</Text><Text className="mt-1 text-xs leading-4 text-muted">{calibrationSummary.detail}</Text><View className="mt-2 flex-row items-end gap-1" accessibilityLabel="Historical confidence gap trend">{calibrationSparkline.length ? calibrationSparkline.map((gap, index) => <View key={`${index}-${gap}`} style={{ flex: 1, height: Math.max(6, Math.min(34, 18 + gap * 24)), borderRadius: 3, backgroundColor: gap > 0.12 ? "#9B5B54" : gap < -0.12 ? "#2E6A59" : "#D7AA58" }} />) : <Text className="text-[10px] text-muted">More completed reviews will populate this trend.</Text>}</View></View></View></View> : null}
      {replayCoaching ? <View accessibilityRole="summary" className={replayCoaching.tone === "verify" ? "rounded-2xl border border-[#E4B4A8] bg-[#FDE9E4] p-4" : replayCoaching.tone === "trust" ? "rounded-2xl border border-[#B8D9C9] bg-[#E8F1ED] p-4" : "rounded-2xl border border-border bg-surface p-4"}><Text className="text-xs font-bold uppercase tracking-widest text-primary">{replayCoaching.title}</Text><Text className="mt-1 text-lg font-bold text-foreground">{replayCoaching.action}</Text><Text className="mt-2 text-sm leading-5 text-muted">{replayCoaching.evidence}</Text></View> : null}
      {coachingPlan ? <View accessibilityRole="summary" className="rounded-2xl border border-[#2E6A59] bg-[#E8F1ED] p-4"><Text className="text-xs font-bold uppercase tracking-widest text-[#2E6A59]">Sensei pattern alert</Text><Text className="mt-1 text-xl font-bold text-[#17211F]">{coachingPlan.priority.drillTitle}</Text><Text className="mt-2 text-sm leading-5 text-[#4B6258]">{coachingPlan.summary}</Text><View className="mt-3 flex-row items-center justify-between rounded-xl bg-white/70 p-3"><View><Text className="text-xs font-bold uppercase tracking-wide text-[#2E6A59]">{coachingPlan.priority.label}</Text><Text className="mt-1 text-xs text-[#4B6258]">{coachingPlan.priority.sampleSize} decision{coachingPlan.priority.sampleSize === 1 ? "" : "s"} · {Math.round(coachingPlan.priority.averageConfidence * 100)}% average confidence</Text></View><Text className="text-xs font-bold uppercase tracking-wide text-[#2E6A59]">{coachingPlan.priority.severity}</Text></View><Text className="mt-3 text-xs font-bold uppercase tracking-wide text-[#2E6A59]">Pattern: {coachingPlan.priority.signature.replaceAll("-", " ")}</Text><Text className="mt-1 text-xs leading-4 text-[#4B6258]">{coachingPlan.priority.evidence}</Text><Text className="mt-2 text-xs leading-4 text-[#4B6258]">{coachingPlan.priority.recommendation}</Text><Pressable onPress={() => { if (coachingPlan.priority.replayDecisionIndex >= 0) { setReplayIndex(coachingPlan.priority.replayDecisionIndex); setIsAutoplaying(false); } }} accessibilityRole="button" accessibilityLabel="Replay Sensei priority pattern" style={({ pressed }) => ({ marginTop: 10, borderRadius: 10, backgroundColor: "#2E6A59", paddingHorizontal: 12, paddingVertical: 9, opacity: pressed ? 0.72 : 1 })}><Text className="text-center text-xs font-bold text-white">Replay the pattern</Text></Pressable></View> : null}
      {activeMatchId && (decisions.error || analysisHistory.error || audit.error) ? <View className="rounded-2xl border border-[#B87843] bg-[#FFF8EC] p-4"><Text className="text-xs font-bold uppercase tracking-widest text-[#8B5A2B]">Review data needs refresh</Text><Text className="mt-1 text-sm leading-5 text-[#7B6B5A]">The replay remains available, but one or more AI or audit streams are stale.</Text><Pressable onPress={refreshReview} accessibilityRole="button" accessibilityLabel="Refresh review data" style={({ pressed }) => ({ marginTop: 10, alignSelf: "flex-start", borderRadius: 10, backgroundColor: "#D7AA58", paddingHorizontal: 12, paddingVertical: 9, opacity: pressed ? 0.72 : 1 })}><Text className="text-xs font-bold text-[#17211F]">Refresh review data</Text></Pressable></View> : null}
      {timeline.length ? <View className="rounded-3xl border border-border bg-surface p-4"><Text className="mb-2 text-[10px] font-bold uppercase tracking-widest text-primary">Active decision</Text><View className="flex-row items-center justify-between"><View><Text className="text-xs font-bold uppercase tracking-widest text-primary">Replay navigator</Text><Text className="mt-1 text-lg font-bold text-foreground">Decision {replayIndex + 1} of {timeline.length}</Text>{requestedTurn !== undefined && replayIndex === Math.max(0, Math.min(requestedTurn - 1, timeline.length - 1)) ? <Text className="mt-1 text-xs font-bold uppercase tracking-wide text-[#B87843]">Origin discard turn highlighted</Text> : null}</View><Text className="text-xs font-semibold text-muted">{presentDecision(timeline[replayIndex], replayIndex).timestamp}</Text></View><Text className="mt-2 text-sm leading-5 text-muted">{presentDecision(timeline[replayIndex], replayIndex).detail}</Text><View className="mt-3 h-2 overflow-hidden rounded-full bg-[#E8F1ED]"><View style={{ width: `${replayProgress}%`, height: "100%", borderRadius: 999, backgroundColor: "#2E6A59" }} /></View><Text className="mt-1 text-[10px] font-bold uppercase tracking-wide text-primary">{replayProgress}% of replay · {replaySpeed}× speed</Text><View className="mt-2 flex-row gap-1">{timeline.map((_, index) => <Pressable key={`timeline-${index}`} onPress={() => { setReplayIndex(index); setIsAutoplaying(false); }} accessibilityRole="button" accessibilityLabel={`Jump to replay decision ${index + 1}`} accessibilityState={{ selected: index === replayIndex }} style={({ pressed }) => ({ flex: 1, height: 8, borderRadius: 999, backgroundColor: index === replayIndex ? "#D7AA58" : requestedTurn !== undefined && index === Math.max(0, Math.min(requestedTurn - 1, timeline.length - 1)) ? "#B87843" : index < replayIndex ? "#2E6A59" : "#DDE8E2", opacity: pressed ? 0.65 : 1 })} />)}</View><Text className="mt-1 text-[10px] text-muted">Tap any segment to jump directly to that decision.</Text><View className="mt-3 rounded-2xl bg-background p-3"><View className="flex-row items-center justify-between"><View><Text className="text-xs font-bold uppercase tracking-widest text-primary">Study bookmark</Text><Text className="mt-1 text-xs text-muted">{bookmarkIndex === null ? "Save this decision for a later study session." : `Saved at decision ${bookmarkIndex + 1}.`}</Text></View><Text className="text-lg text-primary">⌖</Text></View><View className="mt-2 flex-row gap-2"><Pressable onPress={saveBookmark} accessibilityRole="button" accessibilityLabel="Save current replay decision bookmark" style={({ pressed }) => ({ flex: 1, borderRadius: 10, backgroundColor: "#D7AA58", padding: 10, opacity: pressed ? 0.72 : 1 })}><Text className="text-center text-xs font-bold text-[#17211F]">Save bookmark</Text></Pressable>{bookmarkIndex !== null ? <><Pressable onPress={jumpToBookmark} accessibilityRole="button" accessibilityLabel="Jump to saved replay decision bookmark" style={({ pressed }) => ({ flex: 1, borderRadius: 10, borderWidth: 1, borderColor: "#2E6A59", padding: 10, opacity: pressed ? 0.72 : 1 })}><Text className="text-center text-xs font-bold text-primary">Jump to saved</Text></Pressable><Pressable onPress={clearBookmark} accessibilityRole="button" accessibilityLabel="Clear replay decision bookmark" style={({ pressed }) => ({ flex: 1, borderRadius: 10, borderWidth: 1, borderColor: "#2E6A59", padding: 10, opacity: pressed ? 0.72 : 1 })}><Text className="text-center text-xs font-bold text-primary">Clear bookmark</Text></Pressable></> : null}</View>{bookmarkError ? <Text className="mt-2 text-xs text-[#9B2414]">{bookmarkError}</Text> : null}</View><View className="mt-3 rounded-2xl bg-background p-3"><Text className="text-xs font-bold uppercase tracking-widest text-primary">Study note</Text><TextInput value={annotationText} onChangeText={setAnnotationText} multiline placeholder="What did you notice about this decision?" placeholderTextColor="#7B6B5A" accessibilityLabel="Replay decision study note" className="mt-2 min-h-[72px] rounded-xl border border-border bg-surface p-3 text-sm text-foreground"/><View className="mt-2 flex-row gap-2"><Pressable onPress={saveAnnotation} accessibilityRole="button" accessibilityLabel="Save replay decision study note" style={({ pressed }) => ({ flex: 1, borderRadius: 10, backgroundColor: "#2E6A59", padding: 10, opacity: pressed ? 0.72 : 1 })}><Text className="text-center text-xs font-bold text-white">Save note</Text></Pressable>{annotationText ? <Pressable onPress={clearAnnotation} accessibilityRole="button" accessibilityLabel="Clear replay decision study note" style={({ pressed }) => ({ flex: 1, borderRadius: 10, borderWidth: 1, borderColor: "#B87843", padding: 10, opacity: pressed ? 0.72 : 1 })}><Text className="text-center text-xs font-bold text-[#8B5A2B]">Clear note</Text></Pressable> : null}</View>{annotationError ? <Text className="mt-2 text-xs text-[#9B2414]">{annotationError}</Text> : null}</View>{analysisRecords[replayIndex]?.analysis ? <View className="mt-3 rounded-2xl bg-background p-3"><Text className="text-xs font-bold uppercase tracking-widest text-primary">Sensei explanation</Text><Text className="mt-1 text-sm leading-5 text-foreground">{analysisRecords[replayIndex].analysis.alternatives[0]?.rationale ?? "No rationale was recorded for this decision."}</Text><View className="mt-2 gap-2">{analysisRecords[replayIndex].analysis.alternatives.slice(0, 2).map((alternative, alternativeIndex) => <Text key={`${alternative.action.type}-${alternativeIndex}`} className="text-xs leading-4 text-muted">{alternative.objective}: {alternative.rationale}</Text>)}</View><Text className="mt-2 text-xs text-muted">Uncertainty: {analysisRecords[replayIndex].analysis.uncertainty}</Text><Pressable onPress={refreshReview} accessibilityRole="button" accessibilityLabel="Refresh active AI explanation" style={({ pressed }) => ({ marginTop: 10, alignSelf: "flex-start", borderRadius: 10, backgroundColor: "#E8F1ED", paddingHorizontal: 10, paddingVertical: 8, opacity: pressed ? 0.72 : 1 })}><Text className="text-xs font-bold text-primary">Refresh explanation</Text></Pressable></View> : null}<View className="mt-3 flex-row gap-2"><Pressable onPress={() => setReplaySpeed((current) => current === 0.5 ? 1 : current === 1 ? 2 : 0.5)} accessibilityRole="button" accessibilityLabel={`Replay speed ${replaySpeed} times, change speed`} style={({ pressed }) => ({ flex: 1, borderRadius: 12, backgroundColor: "#F7F0E3", padding: 11, opacity: pressed ? 0.72 : 1 })}><Text className="text-center text-xs font-bold text-[#8B5A2B]">Speed {replaySpeed}×</Text></Pressable><Pressable onPress={() => setIsAutoplaying((current) => !current)} disabled={timeline.length < 2} accessibilityRole="button" accessibilityLabel={isAutoplaying ? "Pause replay autoplay" : "Play replay automatically"} style={({ pressed }) => ({ flex: 1, borderRadius: 12, backgroundColor: isAutoplaying ? "#D7AA58" : "#E8F1ED", padding: 11, opacity: timeline.length < 2 ? 0.4 : pressed ? 0.72 : 1 })}><Text className="text-center text-xs font-bold text-[#17211F]">{isAutoplaying ? "Pause" : "Autoplay"}</Text></Pressable><Pressable onPress={() => setReplayIndex((current) => Math.max(0, current - 1))} disabled={replayIndex === 0} accessibilityRole="button" accessibilityLabel="Previous replay decision" style={({ pressed }) => ({ flex: 1, borderRadius: 12, borderWidth: 1, borderColor: "#2E6A59", padding: 11, opacity: replayIndex === 0 ? 0.4 : pressed ? 0.72 : 1 })}><Text className="text-center text-xs font-bold text-primary">Previous</Text></Pressable><Pressable onPress={() => setReplayIndex((current) => Math.min(timeline.length - 1, current + 1))} disabled={replayIndex >= timeline.length - 1} accessibilityRole="button" accessibilityLabel="Next replay decision" style={({ pressed }) => ({ flex: 1, borderRadius: 12, backgroundColor: "#2E6A59", padding: 11, opacity: replayIndex >= timeline.length - 1 ? 0.4 : pressed ? 0.72 : 1 })}><Text className="text-center text-xs font-bold text-white">Next</Text></Pressable></View></View> : null}
      {selectedAlternative ? <View className="rounded-2xl border border-[#2E6A59] bg-[#E8F1ED] p-4"><Text className="text-xs font-bold uppercase tracking-widest text-[#2E6A59]">Replay comparison focus</Text><Text className="mt-1 text-lg font-bold text-[#17211F]">{selectedAlternative.title}</Text><Text className="mt-1 text-sm leading-5 text-[#4B6258]">{selectedAlternative.rationale}</Text><Text className="mt-2 text-xs font-bold uppercase tracking-wide text-[#2E6A59]">{Math.round(selectedAlternative.confidence * 100)}% alternative confidence</Text></View> : null}
      {learningTrends.length ? <View className="rounded-3xl border border-border bg-surface p-4"><Text className="text-xs font-bold uppercase tracking-widest text-primary">Learning trend</Text><Text className="mt-1 text-sm leading-5 text-muted">Sensei compares earlier and later decisions to separate improvement from a one-off result.</Text><View className="mt-3 gap-2">{learningTrends.map((trend) => <View key={trend.objective} className="rounded-2xl bg-background p-3"><View className="flex-row items-center justify-between"><Text className="text-sm font-bold text-foreground">{trend.label}</Text><Text className={trend.direction === "improving" ? "text-xs font-bold text-[#2E6A59]" : trend.direction === "needs-attention" ? "text-xs font-bold text-[#9B2414]" : "text-xs font-bold text-primary"}>{trend.direction.replace("-", " ")}</Text></View><Text className="mt-1 text-xs text-muted">{Math.round(trend.currentConfidence * 100)}% current · {trend.delta >= 0 ? "+" : ""}{Math.round(trend.delta * 100)} points · {trend.sampleSize} decision{trend.sampleSize === 1 ? "" : "s"}</Text></View>)}</View></View> : null}
      {policyDifferences.length ? <View className="rounded-3xl border border-[#B87843] bg-[#FFF8EC] p-4"><Text className="text-xs font-bold uppercase tracking-widest text-[#8B5A2B]">Sensei policy differences</Text><Text className="mt-1 text-sm leading-5 text-[#7B6B5A]">Adjacent policies are compared as study perspectives, not as absolute rankings.</Text><View className="mt-3 gap-2">{policyDifferences.slice(0, 2).map((insight) => <View key={`${insight.leftPolicy}-${insight.rightPolicy}`} className="rounded-2xl bg-[#F7F0E3] p-3"><Text className="text-sm font-bold capitalize text-[#17211F]">{insight.leftPolicy} vs {insight.rightPolicy}</Text><Text className="mt-1 text-xs leading-4 text-[#7B6B5A]">{insight.note}</Text></View>)}</View></View> : null}
      {policySummaries.length > 1 ? <View className="rounded-3xl border border-border bg-surface p-4"><Text className="text-xs font-bold uppercase tracking-widest text-primary">Policy comparison</Text><Text className="mt-1 text-sm leading-5 text-muted">Each column represents a different objective applied to the same visible decision stream.</Text><View className="mt-3 flex-row gap-2">{policySummaries.map((summary) => <View key={summary.policy} className="flex-1 rounded-2xl bg-background p-3"><Text className="text-xs font-bold capitalize text-foreground">{summary.policy}</Text><Text className="mt-2 text-lg font-bold text-primary">{Math.round(summary.averageConfidence * 100)}%</Text><View style={{ height: 5, marginTop: 6, overflow: "hidden", borderRadius: 999, backgroundColor: "rgba(46,106,89,0.14)" }}><View style={{ width: `${Math.round(summary.averageConfidence * 100)}%`, height: "100%", borderRadius: 999, backgroundColor: "#2E6A59" }} /></View><Text className="mt-1 text-[10px] text-muted">{summary.decisions} decisions</Text><Text className="mt-2 text-[10px] capitalize leading-4 text-muted">{summary.objectives.join(" · ")}</Text></View>)}</View></View> : null}
      {replayBoardSnapshot ? <ReplayBoard snapshot={replayBoardSnapshot} highlightedTileCodes={highlightedTileCodes} selectedTileCode={selectedReplayTile} onTilePress={focusReplayTile} seatFilter={replaySeatFilter} onSeatFilterChange={setReplaySeatFilter} largeTiles={largeTiles} language={language} /> : null}
      {snapshots.length ? <View className="rounded-3xl border border-border bg-surface p-4"><Text className="text-xs font-bold uppercase tracking-widest text-primary">State snapshots</Text><Text className="mt-1 text-sm leading-5 text-muted">Tap a point to inspect the visible hand and changes from the previous backend snapshot.</Text><View className="mt-3 gap-2">{snapshots.slice(-5).reverse().map((snapshot, reverseIndex) => { const index = snapshots.findIndex((candidate) => candidate.sequence === snapshot.sequence); const detail = compareSnapshots(snapshot, snapshots[index - 1]); const selected = selectedSnapshotSequence === snapshot.sequence; return <Pressable key={snapshot.sequence} onPress={() => setSelectedSnapshotSequence(selected ? null : snapshot.sequence)} accessibilityRole="button" accessibilityLabel={`Open snapshot at turn ${detail.turn}`} accessibilityState={{ expanded: selected }} style={({ pressed }) => ({ borderRadius: 14, backgroundColor: selected ? "#E8F1ED" : "#F4F5F2", padding: 12, opacity: pressed ? 0.72 : 1 })}><View className="flex-row items-center justify-between"><Text className="text-sm font-bold text-foreground">Turn {detail.turn} · sequence {detail.sequence}</Text><Text className="text-xs font-bold text-primary">{detail.score.toLocaleString()} pts</Text></View><Text className="mt-1 text-xs text-muted">{detail.wallCount} wall · #{detail.stateHash}{selected ? " · Hide snapshot" : " · View snapshot"}</Text>{selected ? <View className="mt-2 border-t border-border pt-2"><Text className="text-xs font-bold uppercase tracking-wide text-primary">Visible hand</Text><View className="mt-2 flex-row flex-wrap gap-1">{detail.hand.length ? detail.hand.map((tile, tileIndex) => <View key={`${tile}-${tileIndex}`} accessibilityLabel={highlightedTileCodes.has(tile) ? `${tile}, latest confirmed action tile` : tile} className={`rounded-lg px-2 py-1 ${highlightedTileCodes.has(tile) ? "border border-[#B87843] bg-[#D7AA58]" : "bg-[#F4F5F2]"}`}><Text className={`text-xs font-bold ${highlightedTileCodes.has(tile) ? "text-[#17211F]" : "text-foreground"}`}>{tile}</Text></View>) : <Text className="text-xs leading-4 text-muted">No visible hand</Text>}</View><Text className="mt-2 text-xs font-bold text-primary">Score Δ {detail.scoreDelta >= 0 ? "+" : ""}{detail.scoreDelta.toLocaleString()} · Wall Δ {detail.wallDelta}</Text><Text className="mt-1 text-xs leading-4 text-muted">Added: {detail.addedTiles.join(" ") || "none"} · Removed: {detail.removedTiles.join(" ") || "none"}</Text>{highlightedTileCodes.size ? <Text className="mt-1 text-[10px] font-bold uppercase tracking-wide text-[#8B5A2B]">Gold tiles reflect the latest confirmed action.</Text> : null}</View> : null}</Pressable>; })}</View></View> : null}
      {activeMatchId && analytics.data ? (
        <View className="rounded-3xl bg-surface p-5">
          <Text className="text-xs font-bold uppercase tracking-widest text-primary">Live replay summary</Text>
          <Text className="mt-2 text-2xl font-bold text-foreground">{analytics.data.decisionCount} decisions analyzed</Text>
          <Text className="mt-2 leading-6 text-muted">Average confidence {Math.round(analytics.data.averageConfidence * 100)}% · {analytics.data.scoreContext.roundWind} round · hand {analytics.data.scoreContext.handNumber}</Text>
          {report.data ? <Text className="mt-2 text-xs uppercase tracking-widest text-primary">{report.data.phase} · dealer seat {analytics.data.scoreContext.dealer}</Text> : null}
        </View>
      ) : (
        <View className="rounded-3xl bg-surface p-5">
          <Text className="text-xs font-bold uppercase tracking-widest text-primary">Review library</Text>
          <Text className="mt-2 text-2xl font-bold text-foreground">Choose a match to inspect</Text>
          <Text className="mt-2 leading-6 text-muted">Open review from an AI experiment to inspect live decisions. No sample moments are shown here.</Text>
        </View>
      )}
    </View>
  );

  if (!activeMatchId) {
    return <ScreenContainer className="px-5 pt-5"><View style={{ gap: 12 }}>{header}<View className={cardClass}><Text className={titleClass}>No replay selected</Text><Text className="mt-1 text-sm leading-5 text-muted">Start an AI experiment or open a saved match to build a real review timeline. This screen does not display sample decisions.</Text><Pressable onPress={() => router.push("/ai-lab")} accessibilityRole="button" style={({ pressed }) => ({ marginTop: 12, alignSelf: "flex-start", borderRadius: 12, backgroundColor: "#D7AA58", paddingHorizontal: 12, paddingVertical: 10, opacity: pressed ? 0.72 : 1 })}><Text className="text-xs font-bold text-[#17211F]">Open AI Lab</Text></Pressable></View></View></ScreenContainer>;
  }

  return <ScreenContainer className="px-5 pt-5"><FlatList data={timeline} keyExtractor={(item, index) => presentDecision(item, index).key} ListHeaderComponent={header} contentContainerStyle={{ paddingBottom: 32, gap: 12 }} ListEmptyComponent={decisions.isLoading ? <ActivityIndicator color="#2E6A59" /> : decisions.isError ? <View className={cardClass}><Text className="font-bold text-foreground">This match is no longer available</Text><Text className="mt-1 text-sm leading-5 text-muted">The local review pointer is stale. Clear it and start a new experiment from the AI Lab.</Text><Pressable onPress={clearStoredMatch} accessibilityRole="button" style={({ pressed }) => ({ marginTop: 12, alignSelf: "flex-start", borderRadius: 12, backgroundColor: "#17211F", paddingHorizontal: 12, paddingVertical: 10, opacity: pressed ? 0.7 : 1 })}><Text className="text-xs font-bold text-white">Clear stale match</Text></Pressable></View> : <View className={cardClass}><Text className="font-bold text-foreground">No decisions yet</Text><Text className="mt-1 text-sm leading-5 text-muted">Run an AI turn or autonomous step, then return here to inspect the timeline.</Text></View>} renderItem={renderDecision} /></ScreenContainer>;
}
