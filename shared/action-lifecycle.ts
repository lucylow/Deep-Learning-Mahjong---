import type { ActionEnvelope, PlayerSeat, TileCode } from "@/shared/mahjong-types";

export type ActionLifecycleLanguage = "en" | "ja" | "es" | "zh-Hans" | "zh-Hant";
export type ActionLifecycleStatus = "pending" | "confirmed" | "rejected" | "retrying";

type ActionType = ActionEnvelope["type"];

export type ActionLifecycleEntry = {
  id: string;
  action: ActionType;
  seat?: PlayerSeat;
  status: ActionLifecycleStatus;
  label: string;
  detail: string;
  createdAt: string;
  tileIds?: string[];
  tileCodes?: TileCode[];
};

const ACTION_LABELS: Record<ActionLifecycleLanguage, Partial<Record<ActionType, string>> & { pass: string }> = {
  en: { discard: "Discard", riichi: "Riichi", tsumo: "Tsumo", ron: "Ron", chi: "CHI", pon: "PON", kan: "KAN", pass: "Pass" },
  ja: { discard: "打牌", riichi: "立直", tsumo: "ツモ", ron: "ロン", chi: "チー", pon: "ポン", kan: "カン", pass: "パス" },
  es: { discard: "Descartar", riichi: "Riichi", tsumo: "Tsumo", ron: "Ron", chi: "CHI", pon: "PON", kan: "KAN", pass: "Pasar" },
  "zh-Hans": { discard: "打牌", riichi: "立直", tsumo: "自摸", ron: "荣和", chi: "吃", pon: "碰", kan: "杠", pass: "跳过" },
  "zh-Hant": { discard: "打牌", riichi: "立直", tsumo: "自摸", ron: "榮和", chi: "吃", pon: "碰", kan: "槓", pass: "跳過" },
};

const STATUS_COPY: Record<ActionLifecycleLanguage, Record<ActionLifecycleStatus, (label: string) => string>> = {
  en: { pending: (label) => `${label} sent; waiting for the confirmed table state.`, retrying: (label) => `Retrying ${label.toLowerCase()} after the table rejected the first request.`, confirmed: (label) => `${label} confirmed by the table.`, rejected: (label) => `${label} was not accepted. Review the refreshed legal actions before trying again.` },
  ja: { pending: (label) => `${label}を送信しました。卓の確定状態を待っています。`, retrying: (label) => `最初の${label}が卓に拒否されたため、再試行しています。`, confirmed: (label) => `${label}が卓で確定しました。`, rejected: (label) => `${label}は受け付けられませんでした。更新された合法手を確認して、もう一度試してください。` },
  es: { pending: (label) => `${label} enviado; esperando el estado confirmado de la mesa.`, retrying: (label) => `Reintentando ${label.toLowerCase()} después de que la mesa rechazara la primera solicitud.`, confirmed: (label) => `${label} confirmado por la mesa.`, rejected: (label) => `${label} no fue aceptado. Revisa las acciones legales actualizadas antes de intentarlo de nuevo.` },
  "zh-Hans": { pending: (label) => `已发送${label}，正在等待牌桌确认状态。`, retrying: (label) => `首次${label}被牌桌拒绝，正在重试。`, confirmed: (label) => `牌桌已确认${label}。`, rejected: (label) => `${label}未被接受。请查看刷新后的合法操作，然后重试。` },
  "zh-Hant": { pending: (label) => `已送出${label}，正在等待牌桌確認狀態。`, retrying: (label) => `首次${label}遭牌桌拒絕，正在重試。`, confirmed: (label) => `牌桌已確認${label}。`, rejected: (label) => `${label}未被接受。請查看重新整理後的合法操作，再試一次。` },
};

export function actionLifecycleLabel(action: ActionType, language: ActionLifecycleLanguage = "en"): string {
  const labels = ACTION_LABELS[language];
  if (action === "chi" || action === "pon" || action === "kan" || action === "discard" || action === "riichi" || action === "tsumo" || action === "ron") return labels[action] ?? ACTION_LABELS.en[action] ?? action;
  return labels.pass;
}

export function actionLifecycleDetail(status: ActionLifecycleStatus, action: ActionType, language: ActionLifecycleLanguage = "en"): string {
  const label = actionLifecycleLabel(action, language);
  return STATUS_COPY[language][status](label);
}

export function createActionLifecycleEntry(action: ActionEnvelope, status: ActionLifecycleStatus, id = `${Date.now()}-${action.type}`, language: ActionLifecycleLanguage = "en"): ActionLifecycleEntry {
  return { id, action: action.type, seat: action.seat, status, label: actionLifecycleLabel(action.type, language), detail: actionLifecycleDetail(status, action.type, language), createdAt: new Date().toISOString(), tileIds: action.tileIds?.slice(), tileCodes: action.tileCodes?.slice() };
}

export function appendActionLifecycle(entries: ActionLifecycleEntry[], next: ActionLifecycleEntry, limit = 6): ActionLifecycleEntry[] {
  return [...entries, next].slice(-Math.max(1, limit));
}

export function isActionLifecycleEntry(value: unknown): value is ActionLifecycleEntry {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  return typeof candidate.id === "string" && typeof candidate.action === "string" && typeof candidate.status === "string" && typeof candidate.label === "string" && typeof candidate.detail === "string" && typeof candidate.createdAt === "string" && (candidate.seat === undefined || candidate.seat === 0 || candidate.seat === 1 || candidate.seat === 2 || candidate.seat === 3) && (candidate.tileIds === undefined || Array.isArray(candidate.tileIds)) && (candidate.tileCodes === undefined || Array.isArray(candidate.tileCodes));
}

export function formatActionLifecycleTime(createdAt: string, language: ActionLifecycleLanguage = "en"): string {
  const timestamp = Date.parse(createdAt);
  return Number.isNaN(timestamp) ? (language === "zh-Hans" ? "时间不可用" : language === "zh-Hant" ? "時間不可用" : "Time unavailable") : new Date(timestamp).toLocaleTimeString(language === "zh-Hans" ? "zh-CN" : language === "zh-Hant" ? "zh-TW" : language, { hour: "2-digit", minute: "2-digit" });
}
