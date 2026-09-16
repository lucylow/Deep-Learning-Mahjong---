import type { LanguageCode } from "@/lib/i18n";

export type MahjongTileSuit = "m" | "p" | "s" | "h";
export type ReplaySeatFilter = "all" | 0 | 1 | 2 | 3;
export type ReplayStatus = "confirmed" | "rejected" | "pending" | "retrying";

const labels: Record<MahjongTileSuit, Record<LanguageCode, string>> = {
  m: { en: "man", ja: "萬", es: "man", "zh-Hans": "万", "zh-Hant": "萬" },
  p: { en: "pin", ja: "筒", es: "pin", "zh-Hans": "筒", "zh-Hant": "筒" },
  s: { en: "sou", ja: "索", es: "sou", "zh-Hans": "索", "zh-Hant": "索" },
  h: { en: "honor", ja: "字牌", es: "honor", "zh-Hans": "字牌", "zh-Hant": "字牌" },
};

export function tileSuitLabel(suit: string, language: LanguageCode = "en"): string {
  const key = suit as MahjongTileSuit;
  return labels[key]?.[language] ?? labels[key]?.en ?? suit;
}

export function tileAccessibilityLabel(code: string, language: LanguageCode = "en", selected = false, legal = false): string {
  const tile = `${tileSuitLabel(code[0] ?? "", language)} ${code.slice(1)}`;
  const suffix = language === "zh-Hans" ? (selected ? "，已选中" : legal ? "，可打出的合法牌" : "") : language === "zh-Hant" ? (selected ? "，已選取" : legal ? "，可打出的合法牌" : "") : selected ? ", selected" : legal ? ", legal discard candidate" : "";
  return `${tile}${suffix}`;
}

export function replaySeatFilterLabel(filter: ReplaySeatFilter, language: LanguageCode = "en"): string {
  if (filter === "all") return language === "zh-Hans" || language === "zh-Hant" ? "全部座位" : language === "ja" ? "全座位" : language === "es" ? "Todos los asientos" : "All seats";
  return language === "zh-Hans" || language === "zh-Hant" ? `座位 ${filter}` : language === "ja" ? `座席 ${filter}` : language === "es" ? `Asiento ${filter}` : `Seat ${filter}`;
}

export function localizedReplaySeatFilterLabel(language: LanguageCode, filter: ReplaySeatFilter): string { return replaySeatFilterLabel(filter, language); }

export function replaySeatFilterAccessibilityLabel(filter: ReplaySeatFilter, language: LanguageCode = "en"): string {
  if (filter === "all") return language === "zh-Hans" ? "显示全部回放座位" : language === "zh-Hant" ? "顯示全部回放座位" : language === "ja" ? "全リプレイ座席を表示" : language === "es" ? "Mostrar todos los asientos de la repetición" : "Show all replay seats";
  return language === "zh-Hans" ? `显示回放座位 ${filter}` : language === "zh-Hant" ? `顯示回放座位 ${filter}` : `Show replay seat ${filter}`;
}

export function localizedReplaySeatFilterAccessibilityLabel(language: LanguageCode, filter: ReplaySeatFilter): string { return replaySeatFilterAccessibilityLabel(filter, language); }

export function localizedReplayFilterSummary(language: LanguageCode, filter: ReplaySeatFilter): string {
  const label = replaySeatFilterLabel(filter, language);
  return language === "zh-Hans" ? `已筛选：${label}` : language === "zh-Hant" ? `已篩選：${label}` : `Filtered: ${label}`;
}

export function localizedReplaySeat(language: LanguageCode, seat: number): string { return replaySeatFilterLabel(seat as ReplaySeatFilter, language); }
export function localizedReplaySeatHeader(language: LanguageCode, seat: number, wind: string): string { return `${localizedReplaySeat(language, seat)} · ${wind}`; }

export function localizedReplayHeader(language: LanguageCode): { title: string; turn: string; instruction: string } {
  if (language === "zh-Hans") return { title: "完整回放牌盘", turn: "第 {turn} 巡 · 牌墙剩余 {wall}", instruction: "点击任意牌，跳转到对应的 Sensei 决策。金色牌会标出起始动作。" };
  if (language === "zh-Hant") return { title: "完整回放牌盤", turn: "第 {turn} 巡 · 牌牆剩餘 {wall}", instruction: "點選任意牌，跳轉到對應的 Sensei 決策。金色牌會標示起始動作。" };
  return { title: "Full replay board", turn: "Turn {turn} · {wall} wall", instruction: "Tap any tile to jump to the matching Sensei decision. Gold tiles mark the originating action." };
}

export function localizedReplayTurn(language: LanguageCode, turn: number, wall: number): string { return localizedReplayHeader(language).turn.replace("{turn}", String(turn)).replace("{wall}", String(wall)); }
export function localizedReplayOrigin(language: LanguageCode): string { return language === "zh-Hans" ? "起始动作牌" : language === "zh-Hant" ? "起始動作牌" : "originating action tile"; }
export function localizedReplayDiscard(language: LanguageCode, turn: number): string { return language === "zh-Hans" || language === "zh-Hant" ? `第 ${turn} 巡打牌` : `discard at turn ${turn}`; }

export function localizedReplayTileAccessibility(language: LanguageCode, code: string, seat: number, kind: "hand" | "discard", turn?: number, highlighted = false): string {
  const location = kind === "hand" ? `${localizedReplaySeat(language, seat)} hand` : `${localizedReplaySeat(language, seat)} ${localizedReplayDiscard(language, turn ?? 0)}`;
  return `${tileAccessibilityLabel(code, language)}${language.startsWith("zh-") ? `，${location}` : `, ${location}`}${highlighted ? `${language.startsWith("zh-") ? "，" : ", "}${localizedReplayOrigin(language)}` : ""}`;
}

export function localizedReplayStatusLabel(language: LanguageCode, status: ReplayStatus): string {
  if (language === "zh-Hans") return status === "confirmed" ? "已确认" : status === "rejected" ? "已拒绝" : status === "retrying" ? "重试中" : "处理中";
  if (language === "zh-Hant") return status === "confirmed" ? "已確認" : status === "rejected" ? "已拒絕" : status === "retrying" ? "重試中" : "處理中";
  return status === "confirmed" ? "Confirmed" : status === "rejected" ? "Rejected" : status === "retrying" ? "Retrying" : "Pending";
}

export function localizedReplayAction(language: LanguageCode): { title: string; detail: string } {
  if (language === "zh-Hans") return { title: "动作生命周期回放", detail: "Sensei 区分尝试执行的动作与牌桌实际确认的状态。" };
  if (language === "zh-Hant") return { title: "動作生命週期回放", detail: "Sensei 區分嘗試執行的動作與牌桌實際確認的狀態。" };
  return { title: "Action lifecycle replay", detail: "Sensei distinguishes attempted moves from the state confirmed by the table." };
}

export function localizedReplayNoTile(language: LanguageCode): string { return language === "zh-Hans" ? "未选择牌" : language === "zh-Hant" ? "未選擇牌" : "No tile selected"; }
export function localizedReplayTileCode(language: LanguageCode, code: string): string { return language.startsWith("zh-") ? tileAccessibilityLabel(code, language) : code; }
export function localizedActionLifecycleLabel(language: LanguageCode, entry: { label: string; status: ReplayStatus; detail: string; tileCodes?: string[]; tileIds?: string[]; createdAt: string }): string { const tiles = entry.tileCodes?.join(" · ") ?? entry.tileIds?.join(" · ") ?? localizedReplayNoTile(language); return `${entry.label} · ${localizedReplayStatusLabel(language, entry.status)} · ${entry.detail} · ${tiles} · ${entry.createdAt}`; }
