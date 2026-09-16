import { useEffect, useMemo, useState } from "react";
import { safeGetItem, safeParseArray, safeSetItem } from "@/shared/storage-utils";
import { ActivityIndicator, Pressable, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { ArenaSkeleton } from "@/components/arena-skeleton";
import { archiveMatchHistoryEntry, filterMatchHistory, formatMatchHistoryLabel, matchHistoryOrigin, matchHistoryOriginLabel, removeMatchHistoryEntry, type MatchHistoryEntry } from "@/shared/match-history";
import { runNavigation } from "@/shared/navigation-utils";
import { DEMO_MODE, demoHistoryEntries } from "@/shared/demo-data";

const STORAGE_KEY = "mahjong.matchHistory";
const isMatchHistoryEntry = (item: unknown): item is MatchHistoryEntry => { if (!item || typeof item !== "object") return false; const candidate = item as Record<string, unknown>; return typeof candidate.id === "string" && typeof candidate.createdAt === "string" && typeof candidate.label === "string"; };

export default function MatchHistoryScreen() {
  const [entries, setEntries] = useState<MatchHistoryEntry[]>([]);
  const [query, setQuery] = useState("");
  const [includeArchived, setIncludeArchived] = useState(false);
  const [loading, setLoading] = useState(true);
  const [storageError, setStorageError] = useState<string | null>(null);

  useEffect(() => {
    safeGetItem(STORAGE_KEY).then((value) => {
      if (!value) {
        if (DEMO_MODE) setEntries(demoHistoryEntries());
        return;
      }
      const parsed = safeParseArray(value, isMatchHistoryEntry); if (parsed) setEntries(parsed); else { setEntries(DEMO_MODE ? demoHistoryEntries() : []); setStorageError("Saved match history could not be read."); }
    }).catch(() => { if (DEMO_MODE) setEntries(demoHistoryEntries()); setStorageError("Saved match history could not be read."); }).finally(() => setLoading(false));
  }, []);

  const visibleEntries = useMemo(() => filterMatchHistory(entries, query, includeArchived), [entries, includeArchived, query]);
  const persist = async (next: MatchHistoryEntry[]) => { const previous = entries; setEntries(next); const saved = await safeSetItem(STORAGE_KEY, JSON.stringify(next)); if (!saved) { setEntries(previous); setStorageError("This change could not be saved locally. Your previous history was restored."); return; } setStorageError(null); };
  const archive = (id: string) => void persist(archiveMatchHistoryEntry(entries, id));
  const remove = (id: string) => void persist(removeMatchHistoryEntry(entries, id));

  return <ScreenContainer className="px-5 pt-5"><View className="gap-5"><Pressable onPress={() => void runNavigation(() => router.back(), () => setStorageError("This screen could not navigate back. Please try again."))} accessibilityRole="button" accessibilityLabel="Go back" style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}><Text className="font-semibold text-primary">‹ Back</Text></Pressable><View><Text className="text-sm font-semibold uppercase tracking-widest text-primary">Match history</Text><Text className="mt-1 text-4xl font-bold text-foreground">Manage your experiments.</Text><Text className="mt-2 text-base leading-6 text-muted">Reopen a replay, archive finished drills, or remove local history you no longer need.</Text>{DEMO_MODE ? <Text className="mt-2 text-xs font-semibold uppercase tracking-wide text-primary">Demo library · read-only sample matches</Text> : null}</View><TextInput accessibilityLabel="Search match history" value={query} onChangeText={setQuery} placeholder="Search match history" placeholderTextColor="#7B8B84" style={{ borderRadius: 14, backgroundColor: "#F7F8F5", paddingHorizontal: 14, paddingVertical: 12, color: "#17211F" }} /><Pressable onPress={() => setIncludeArchived(!includeArchived)} accessibilityRole="switch" accessibilityState={{ checked: includeArchived }} style={({ pressed }) => ({ alignSelf: "flex-start", borderRadius: 999, backgroundColor: includeArchived ? "#17211F" : "#E8F1ED", paddingHorizontal: 12, paddingVertical: 9, opacity: pressed ? 0.7 : 1 })}><Text className={includeArchived ? "text-xs font-bold text-white" : "text-xs font-bold text-primary"}>{includeArchived ? "Showing archived" : "Show archived"}</Text></Pressable>{storageError ? <Text accessibilityRole="alert" className="rounded-xl bg-[#FDE9E4] p-3 text-sm text-error">{storageError}</Text> : null}{loading ? <ArenaSkeleton lines={3} /> : null}<View className="gap-3">{visibleEntries.map((entry) => <View key={entry.id} className="rounded-2xl border border-border bg-surface p-4"><View className="flex-row items-start justify-between gap-3"><View className="flex-1"><Text className="text-lg font-bold text-foreground">{formatMatchHistoryLabel(entry)}</Text><Text className="mt-1 text-xs uppercase tracking-wide text-muted">{entry.archived ? "Archived" : "Active"} · {entry.id}</Text><View className="mt-2 self-start rounded-full border border-[#B8D9C9] bg-[#E8F1ED] px-2 py-1"><Text className="text-[10px] font-bold uppercase tracking-wide text-[#2E6A59]">{matchHistoryOriginLabel(matchHistoryOrigin(entry))}</Text></View></View><Pressable onPress={() => void runNavigation(() => entry.id.startsWith("demo-") ? router.push("/review") : router.push({ pathname: "/review", params: { matchId: entry.id } }), () => setStorageError("This replay could not be opened. Please try again."))} accessibilityRole="button" style={({ pressed }) => ({ borderRadius: 10, backgroundColor: "#E8F1ED", paddingHorizontal: 10, paddingVertical: 8, opacity: pressed ? 0.7 : 1 })}><Text className="text-xs font-bold text-primary">Open</Text></Pressable></View><View className="mt-3 flex-row gap-2"><Pressable onPress={() => archive(entry.id)} disabled={Boolean(entry.archived)} accessibilityRole="button" style={({ pressed }) => ({ flex: 1, borderRadius: 10, backgroundColor: entry.archived ? "#F0F1EE" : "#F7F0E2", padding: 10, opacity: pressed || entry.archived ? 0.55 : 1 })}><Text className="text-center text-xs font-bold text-[#8B5A2B]">{entry.archived ? "Archived" : "Archive"}</Text></Pressable><Pressable onPress={() => remove(entry.id)} accessibilityRole="button" style={({ pressed }) => ({ flex: 1, borderRadius: 10, backgroundColor: "#FDE9E4", padding: 10, opacity: pressed ? 0.7 : 1 })}><Text className="text-center text-xs font-bold text-error">Delete</Text></Pressable></View></View>)}{visibleEntries.length === 0 ? <View className="rounded-2xl border border-border bg-surface p-5"><Text className="font-bold text-foreground">No matching experiments</Text><Text className="mt-1 text-sm leading-5 text-muted">Create an AI experiment to build a local history you can revisit here.</Text></View> : null}</View></View></ScreenContainer>;
}
