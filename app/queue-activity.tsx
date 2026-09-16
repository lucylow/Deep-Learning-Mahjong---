import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { ArenaSkeleton } from "@/components/arena-skeleton";
import { safeGetItem, safeParseArray, safeRemoveItem } from "@/shared/storage-utils";
import { isQueueActivityEvent, type QueueActivityEvent } from "@/shared/ai-retry-settings";
import { filterQueueActivity, filterQueueActivityCustomDate, filterQueueActivityDate, formatQueueActivityCsv, formatQueueActivityJson, formatQueueActivitySummary, formatQueueActivityTime, queueActivityColor, queueActivityIcon, queueActivityTypeLabel, QUEUE_ACTIVITY_STORAGE_KEY, type QueueActivityDateRange } from "@/shared/queue-activity";
import { runNavigation } from "@/shared/navigation-utils";
import { shareText } from "@/shared/share-utils";

const FILTERS: Array<{ label: string; value: QueueActivityEvent["type"] | "all" }> = [
  { label: "All", value: "all" },
  { label: "Retries", value: "retry_scheduled" },
  { label: "Failures", value: "retry_failed" },
  { label: "Completed", value: "completed" },
  { label: "Controls", value: "paused" },
];

export default function QueueActivityScreen() {
  const [events, setEvents] = useState<QueueActivityEvent[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<QueueActivityEvent["type"] | "all">("all");
  const [dateRange, setDateRange] = useState<QueueActivityDateRange>("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [storageError, setStorageError] = useState<string | null>(null);

  useEffect(() => {
    void safeGetItem(QUEUE_ACTIVITY_STORAGE_KEY).then((value) => {
      const parsed = safeParseArray(value, isQueueActivityEvent);
      if (parsed) setEvents(parsed.slice(-30));
      else if (value) setStorageError("Queue activity could not be read. New events will still be recorded.");
    }).catch(() => setStorageError("Queue activity could not be read. New events will still be recorded.")).finally(() => setLoading(false));
  }, []);

  const customDateResult = useMemo(() => filterQueueActivityCustomDate(filterQueueActivity(events, query, filter), fromDate, toDate), [events, filter, fromDate, query, toDate]);
  const visibleEvents = useMemo(() => filterQueueActivityDate(customDateResult.events, dateRange).slice().reverse(), [customDateResult.events, dateRange]);
  const shareActivity = async () => { const shared = await shareText("Mahjong Sensei queue activity", formatQueueActivitySummary(visibleEvents)); if (!shared) setStorageError("The queue summary could not be shared. Try again or copy the summary manually."); };
  const shareCsv = async () => { const shared = await shareText("Mahjong Sensei queue activity CSV", formatQueueActivityCsv(visibleEvents)); if (!shared) setStorageError("The CSV export could not be shared. Try again or copy it manually."); };
  const shareJson = async () => { const shared = await shareText("Mahjong Sensei queue activity JSON", formatQueueActivityJson(visibleEvents)); if (!shared) setStorageError("The JSON export could not be shared. Try again or copy it manually."); };
  const clearActivity = async () => {
    const removed = await safeRemoveItem(QUEUE_ACTIVITY_STORAGE_KEY);
    if (!removed) { setStorageError("Queue activity could not be cleared locally."); return; }
    setEvents([]);
    setStorageError(null);
  };

  return <ScreenContainer className="px-5 pt-5"><ScrollView contentContainerStyle={{ paddingBottom: 40 }}><View className="gap-5"><View className="flex-row items-center justify-between"><Pressable onPress={() => void runNavigation(() => router.back(), () => setStorageError("This screen could not navigate back. Please try again."))} accessibilityRole="button" accessibilityLabel="Go back" style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}><Text className="font-semibold text-primary">‹ Back</Text></Pressable><Pressable onPress={() => void runNavigation(() => router.push("/ai-lab"), () => setStorageError("AI Lab could not be opened. Please try again."))} accessibilityRole="button" style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}><Text className="font-semibold text-primary">AI Lab</Text></Pressable></View><View><Text className="text-sm font-semibold uppercase tracking-widest text-primary">Sensei recovery</Text><Text className="mt-1 text-4xl font-bold text-foreground">Queue activity.</Text><Text className="mt-2 text-base leading-6 text-muted">Review when automatic retries paused, resumed, failed, or completed. Activity stays on this device.</Text></View><View className="flex-row flex-wrap gap-2">{FILTERS.map((item) => <Pressable key={item.value} onPress={() => setFilter(item.value)} accessibilityRole="button" accessibilityState={{ selected: filter === item.value }} style={({ pressed }) => ({ borderRadius: 999, backgroundColor: filter === item.value ? "#17211F" : "#E8F1ED", paddingHorizontal: 12, paddingVertical: 9, opacity: pressed ? 0.7 : 1 })}><Text className={filter === item.value ? "text-xs font-bold text-white" : "text-xs font-bold text-primary"}>{item.label}</Text></Pressable>)}{[{ label: "Today", value: "today" as const }, { label: "7 days", value: "7d" as const }, { label: "All dates", value: "all" as const }].map((item) => <Pressable key={item.value} onPress={() => setDateRange(item.value)} accessibilityRole="button" accessibilityState={{ selected: dateRange === item.value }} style={({ pressed }) => ({ borderRadius: 999, backgroundColor: dateRange === item.value ? "#8B5A2B" : "#F7F0E2", paddingHorizontal: 12, paddingVertical: 9, opacity: pressed ? 0.7 : 1 })}><Text className="text-xs font-bold text-primary">{item.label}</Text></Pressable>)}</View><TextInput accessibilityLabel="Search queue activity" value={query} onChangeText={setQuery} placeholder="Search activity" placeholderTextColor="#7B8B84" style={{ borderRadius: 14, backgroundColor: "#F7F8F5", paddingHorizontal: 14, paddingVertical: 12, color: "#17211F" }} /><View className="flex-row gap-2"><TextInput accessibilityLabel="Activity start date" value={fromDate} onChangeText={setFromDate} placeholder="From YYYY-MM-DD" placeholderTextColor="#7B8B84" style={{ flex: 1, borderRadius: 12, backgroundColor: "#F7F8F5", paddingHorizontal: 12, paddingVertical: 10, color: "#17211F" }} /><TextInput accessibilityLabel="Activity end date" value={toDate} onChangeText={setToDate} placeholder="To YYYY-MM-DD" placeholderTextColor="#7B8B84" style={{ flex: 1, borderRadius: 12, backgroundColor: "#F7F8F5", paddingHorizontal: 12, paddingVertical: 10, color: "#17211F" }} /></View>{customDateResult.error ? <Text accessibilityRole="alert" className="rounded-xl bg-[#FFF5DE] p-3 text-sm text-[#8B5A2B]">{customDateResult.error}</Text> : null}{storageError ? <Text accessibilityRole="alert" className="rounded-xl bg-[#FDE9E4] p-3 text-sm text-error">{storageError}</Text> : null}{loading ? <ArenaSkeleton lines={4} /> : null}<View className="flex-row items-center justify-between"><Text className="text-sm font-bold text-foreground">{visibleEvents.length} event{visibleEvents.length === 1 ? "" : "s"}</Text><View className="flex-row items-center gap-3">{events.length ? <><Pressable onPress={() => void shareActivity()} accessibilityRole="button" accessibilityLabel="Share Sensei queue activity summary" style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}><Text className="text-sm font-bold text-primary">Share</Text></Pressable><Pressable onPress={() => void shareCsv()} accessibilityRole="button" accessibilityLabel="Export Sensei queue activity as CSV" style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}><Text className="text-sm font-bold text-primary">CSV</Text></Pressable><Pressable onPress={() => void shareJson()} accessibilityRole="button" accessibilityLabel="Export Sensei queue activity as JSON" style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}><Text className="text-sm font-bold text-primary">JSON</Text></Pressable></> : null}{events.length ? <Pressable onPress={() => void clearActivity()} accessibilityRole="button" accessibilityLabel="Clear all queue activity" style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}><Text className="text-sm font-bold text-error">Clear all</Text></Pressable> : null}</View></View><View className="gap-3">{visibleEvents.map((event) => <View key={event.id} className="rounded-2xl border border-border bg-surface p-4"><View className="flex-row items-start gap-3"><Text style={{ color: queueActivityColor(event.type), fontSize: 22, fontWeight: "900" }}>{queueActivityIcon(event.type)}</Text><View className="flex-1"><View className="flex-row items-center justify-between gap-3"><Text className="text-sm font-bold text-foreground">{queueActivityTypeLabel(event.type)}</Text><Text className="text-[11px] text-muted">{formatQueueActivityTime(event.createdAt)}</Text></View><Text className="mt-2 text-sm leading-5 text-muted">{event.message}</Text>{event.promptId ? <Text className="mt-2 text-[11px] text-muted">Question {event.promptId}</Text> : null}</View></View></View>)}{!loading && visibleEvents.length === 0 ? <View className="rounded-2xl border border-border bg-surface p-5"><Text className="font-bold text-foreground">No matching activity</Text><Text className="mt-1 text-sm leading-5 text-muted">Retry events will appear here when Sensei works through a saved question.</Text></View> : null}</View></View></ScrollView></ScreenContainer>;
}
