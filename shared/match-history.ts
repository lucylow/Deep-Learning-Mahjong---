export type MatchHistoryOrigin = "local" | "server" | "sample" | "legacy-unowned";

export type MatchHistoryEntry = {
  id: string;
  createdAt: string;
  seed?: number;
  label: string;
  archived?: boolean;
  origin?: MatchHistoryOrigin;
};

export function matchHistoryOrigin(entry: Pick<MatchHistoryEntry, "id" | "origin">): MatchHistoryOrigin {
  if (entry.origin) return entry.origin;
  if (entry.id.startsWith("demo-")) return "sample";
  return "local";
}

export function matchHistoryOriginLabel(origin: MatchHistoryOrigin): string {
  switch (origin) {
    case "local": return "Device-local";
    case "server": return "Server-saved";
    case "sample": return "Opt-in sample";
    case "legacy-unowned": return "Legacy · owner not verified";
  }
}

export function addMatchHistoryEntry(entries: MatchHistoryEntry[], entry: MatchHistoryEntry, limit = 8): MatchHistoryEntry[] {
  return [entry, ...entries.filter((existing) => existing.id !== entry.id)].slice(0, limit);
}

export function archiveMatchHistoryEntry(entries: MatchHistoryEntry[], id: string): MatchHistoryEntry[] {
  return entries.map((entry) => entry.id === id ? { ...entry, archived: true } : entry);
}

export function removeMatchHistoryEntry(entries: MatchHistoryEntry[], id: string): MatchHistoryEntry[] {
  return entries.filter((entry) => entry.id !== id);
}

export function filterMatchHistory(entries: MatchHistoryEntry[], query: string, includeArchived = false): MatchHistoryEntry[] {
  const visibleEntries = includeArchived ? entries : entries.filter((entry) => !entry.archived);
  const normalized = query.trim().toLowerCase();
  if (!normalized) return visibleEntries;
  return visibleEntries.filter((entry) => formatMatchHistoryLabel(entry).toLowerCase().includes(normalized));
}

export function filterMatchHistoryLegacy(entries: MatchHistoryEntry[], query: string): MatchHistoryEntry[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return entries;
  return entries.filter((entry) => formatMatchHistoryLabel(entry).toLowerCase().includes(normalized));
}

export function formatMatchHistoryLabel(entry: MatchHistoryEntry): string {
  const date = new Date(entry.createdAt);
  const timestamp = Number.isNaN(date.getTime()) ? "Recent experiment" : date.toLocaleDateString([], { month: "short", day: "numeric" });
  return `${entry.label} · ${timestamp}`;
}
