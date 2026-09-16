export type GameplaySyncTone = "synced" | "refreshing" | "stale" | "offline";

export type GameplaySyncStatus = {
  label: string;
  detail: string;
  tone: GameplaySyncTone;
  needsRetry: boolean;
  actionSafe: boolean;
  ageLabel: string;
};

export function describeGameplaySync(input: { isFetching: boolean; hasError: boolean; networkOffline?: boolean; dataUpdatedAt?: number; now?: number; staleAfterMs?: number }): GameplaySyncStatus {
  const age = Math.max(0, (input.now ?? Date.now()) - (input.dataUpdatedAt ?? 0));
  const ageLabel = !input.dataUpdatedAt ? "No confirmed sync yet" : age < 1_000 ? "Updated just now" : `Updated ${Math.floor(age / 1_000)}s ago`;
  if (input.networkOffline) return { label: "Offline — reconnecting", detail: "Your device is offline. The last confirmed table state is protected; reconnect before submitting another action.", tone: "offline", needsRetry: true, actionSafe: false, ageLabel };
  if (input.hasError) return { label: "Reconnect needed", detail: "The table could not refresh. Your last known state is still protected; retry before submitting another action.", tone: "offline", needsRetry: true, actionSafe: false, ageLabel };
  if (input.isFetching) return { label: "Syncing table", detail: "Refreshing the hand, legal actions, and audit timeline. Actions are paused until the refresh completes.", tone: "refreshing", needsRetry: false, actionSafe: false, ageLabel };
  if (!input.dataUpdatedAt || age > (input.staleAfterMs ?? 8_000)) return { label: "Check table sync", detail: "This view may be older than the latest table event. Refresh before acting if the state looks different.", tone: "stale", needsRetry: true, actionSafe: false, ageLabel };
  return { label: "Table synced", detail: "The visible hand and legal actions match the latest server response.", tone: "synced", needsRetry: false, actionSafe: true, ageLabel };
}
