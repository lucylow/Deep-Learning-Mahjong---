import { AppState } from "react-native";
import * as Localization from "expo-localization";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { safeGetItem, safeSetItem } from "@/shared/storage-utils";

export type LanguageCode = "en" | "ja" | "es" | "zh-Hans" | "zh-Hant";

export const LANGUAGE_OPTIONS: ReadonlyArray<{ code: LanguageCode; label: string; nativeLabel: string }> = [
  { code: "en", label: "English", nativeLabel: "English" },
  { code: "ja", label: "Japanese", nativeLabel: "日本語" },
  { code: "es", label: "Spanish", nativeLabel: "Español" },
  { code: "zh-Hans", label: "Chinese (Simplified)", nativeLabel: "简体中文" },
  { code: "zh-Hant", label: "Chinese (Traditional)", nativeLabel: "繁體中文" },
];

const STORAGE_KEY = "mahjong.language";

type TranslationKey =
  | "home" | "settings" | "history" | "review" | "back" | "language" | "languageDetail"
  | "english" | "japanese" | "spanish" | "chinese" | "chineseSimplified" | "chineseTraditional" | "saveAutomatically" | "dailyChallenge"
  | "newObjective" | "tableMomentum" | "freshTable" | "warmingUp" | "inRhythm" | "onFire"
  | "yourHand" | "clear" | "askCopilot" | "discard" | "waiting" | "confirmDiscard"
  | "keepReviewing" | "handComplete" | "playDecisiveTurn" | "reviewHand" | "startNextHand"
  | "rematchChoice" | "queueFreshObjective" | "replayUnavailable" | "retry"
  | "upgrade" | "billingHistory" | "billingClarity" | "secureSetup" | "verifiedBilling" | "localDiagnostics" | "privacyNote" | "aiLab" | "retryStatus" | "connectionDetails" | "pendingQuestions" | "queueActivity"
  | "upgradeHeroDetail" | "currentPlanDetail" | "verifiedBillingOnly" | "billingSecureCheckout" | "diagnosticsLocalDetail" | "diagnosticsHonestDetail" | "noVerifiedBilling" | "aiLabIntro" | "languagePreview" | "previewDescription" | "useSimplified" | "useTraditional";

type Catalog = Record<TranslationKey, string>;

const english: Catalog = {
  home: "Home", settings: "Settings", history: "Match history", review: "Review", back: "Back",
  language: "Language", languageDetail: "Choose the language used across navigation, gameplay, challenges, and recovery messages.",
  english: "English", japanese: "Japanese", spanish: "Spanish", chinese: "Chinese", chineseSimplified: "Chinese (Simplified)", chineseTraditional: "Chinese (Traditional)", saveAutomatically: "Changes save automatically.",
  dailyChallenge: "Daily Arena challenge", newObjective: "New objective", tableMomentum: "Table momentum",
  freshTable: "Fresh table", warmingUp: "Warming up", inRhythm: "In rhythm", onFire: "On fire",
  yourHand: "Your hand", clear: "Clear", askCopilot: "Ask Copilot", discard: "Discard", waiting: "Waiting",
  confirmDiscard: "Confirm discard", keepReviewing: "Keep reviewing", handComplete: "Hand complete",
  playDecisiveTurn: "Play decisive turn", reviewHand: "Review hand", startNextHand: "Start next hand",
  rematchChoice: "Rematch choice", queueFreshObjective: "Queue fresh objective", replayUnavailable: "Replay is not available yet.", retry: "Retry",
  upgrade: "Upgrade", billingHistory: "Billing history", billingClarity: "Billing clarity", secureSetup: "Secure setup status", verifiedBilling: "Verified billing", localDiagnostics: "Local conversion diagnostics", privacyNote: "Configuration readiness does not confirm a payment or entitlement.", aiLab: "AI Lab", retryStatus: "Retry status", connectionDetails: "Connection details", pendingQuestions: "Pending Sensei questions", queueActivity: "Queue activity",
  upgradeHeroDetail: "Keep the free practice table. Upgrade when you want deeper AI analysis and a more complete review workspace.", currentPlanDetail: "Premium access should only be granted after verified billing events update the entitlement.", verifiedBillingOnly: "Review only verified billing events. Local plan choices and checkout-interest requests are never shown as payments.", billingSecureCheckout: "You will see the final amount and payment method in Stripe’s secure checkout before any charge. This app does not store card numbers.", diagnosticsLocalDetail: "Counts come only from real interactions on this device, not from simulated revenue or completed payments.", diagnosticsHonestDetail: "A 0% completion rate means no verified checkout completion event exists; it does not estimate lost revenue.", noVerifiedBilling: "There are no Stripe-confirmed purchases, refunds, renewals, or entitlement changes available to display yet. This empty state is intentional.", aiLabIntro: "Explore Suphx-inspired policy trade-offs, then ask Sensei why a line works.", languagePreview: "Chinese language preview", previewDescription: "Compare the same labels in Simplified and Traditional Chinese before choosing the active language.", useSimplified: "Use Simplified Chinese", useTraditional: "Use Traditional Chinese",
};

const japanese: Catalog = {
  home: "ホーム", settings: "設定", history: "対局履歴", review: "レビュー", back: "戻る",
  language: "言語", languageDetail: "ナビゲーション、対局、チャレンジ、復旧メッセージで使う言語を選択します。",
  english: "英語", japanese: "日本語", spanish: "スペイン語", chinese: "中国語", chineseSimplified: "中国語（簡体字）", chineseTraditional: "中国語（繁体字）", saveAutomatically: "変更は自動的に保存されます。",
  dailyChallenge: "デイリーArenaチャレンジ", newObjective: "新しい目標", tableMomentum: "卓の勢い", freshTable: "開始", warmingUp: "準備中", inRhythm: "好調", onFire: "絶好調",
  yourHand: "あなたの手牌", clear: "クリア", askCopilot: "Copilotに聞く", discard: "打牌", waiting: "待機中", confirmDiscard: "打牌を確認", keepReviewing: "見直す", handComplete: "局終了", playDecisiveTurn: "決定局面を再生", reviewHand: "局をレビュー", startNextHand: "次の局へ", rematchChoice: "再戦の選択", queueFreshObjective: "新しい目標を予約", replayUnavailable: "リプレイはまだ利用できません。", retry: "再試行",
  upgrade: "アップグレード", billingHistory: "請求履歴", billingClarity: "請求の明確さ", secureSetup: "安全な設定状況", verifiedBilling: "確認済みの請求", localDiagnostics: "ローカルコンバージョン診断", privacyNote: "設定状況は支払いまたは権利付与を確認するものではありません。", aiLab: "AI Lab", retryStatus: "再試行状況", connectionDetails: "接続の詳細", pendingQuestions: "保留中のSensei質問", queueActivity: "キューのアクティビティ",
  upgradeHeroDetail: "無料の練習卓はそのままに、より深いAI分析と充実したレビュー環境が必要なときにアップグレードできます。", currentPlanDetail: "プレミアムアクセスは、確認済みの請求イベントで権利が更新された後にのみ付与されます。", verifiedBillingOnly: "確認済みの請求イベントのみを表示します。ローカルのプラン選択やチェックアウト関心は支払いとして表示されません。", billingSecureCheckout: "請求前にStripeの安全なチェックアウトで最終金額と支払い方法を確認できます。このアプリはカード番号を保存しません。", diagnosticsLocalDetail: "集計対象はこの端末で実際に行われた操作のみで、推定収益や完了済みの支払いではありません。", diagnosticsHonestDetail: "完了率0%は確認済みチェックアウト完了イベントがないことを示すだけで、失われた収益を推定するものではありません。", noVerifiedBilling: "表示できるStripe確認済みの購入、返金、更新、権利変更はまだありません。この空の状態は意図的なものです。", aiLabIntro: "Suphxに着想を得た方針の違いを比較し、なぜその打ち筋が有効なのかをSenseiに尋ねましょう。", languagePreview: "中国語プレビュー", previewDescription: "アクティブな言語を選ぶ前に、簡体字と繁体字の同じラベルを比較できます。", useSimplified: "簡体字を使用", useTraditional: "繁体字を使用",
};

const spanish: Catalog = {
  home: "Inicio", settings: "Ajustes", history: "Historial", review: "Revisión", back: "Atrás",
  language: "Idioma", languageDetail: "Elige el idioma para la navegación, la partida, los desafíos y los mensajes de recuperación.",
  english: "Inglés", japanese: "Japonés", spanish: "Español", chinese: "Chino", chineseSimplified: "Chino simplificado", chineseTraditional: "Chino tradicional", saveAutomatically: "Los cambios se guardan automáticamente.",
  dailyChallenge: "Desafío Arena diario", newObjective: "Nuevo objetivo", tableMomentum: "Ritmo de la mesa", freshTable: "Mesa lista", warmingUp: "Calentando", inRhythm: "En ritmo", onFire: "En racha", yourHand: "Tu mano", clear: "Limpiar", askCopilot: "Preguntar a Copilot", discard: "Descartar", waiting: "Esperando", confirmDiscard: "Confirmar descarte", keepReviewing: "Seguir revisando", handComplete: "Mano completada", playDecisiveTurn: "Reproducir turno decisivo", reviewHand: "Revisar mano", startNextHand: "Siguiente mano", rematchChoice: "Elegir revancha", queueFreshObjective: "Programar nuevo objetivo", replayUnavailable: "La repetición aún no está disponible.", retry: "Reintentar",
  upgrade: "Actualizar", billingHistory: "Historial de pagos", billingClarity: "Claridad de facturación", secureSetup: "Estado de configuración segura", verifiedBilling: "Facturación verificada", localDiagnostics: "Diagnóstico local de conversión", privacyNote: "El estado de configuración no confirma un pago ni una suscripción.", aiLab: "Laboratorio de IA", retryStatus: "Estado de reintento", connectionDetails: "Detalles de conexión", pendingQuestions: "Preguntas de Sensei pendientes", queueActivity: "Actividad de la cola",
  upgradeHeroDetail: "Conserva la mesa de práctica gratuita y actualiza cuando quieras un análisis de IA más profundo y un espacio de revisión más completo.", currentPlanDetail: "El acceso premium solo se activa después de que eventos de facturación verificados actualicen la suscripción.", verifiedBillingOnly: "Solo mostramos eventos de facturación verificados. Las selecciones locales de plan y el interés en checkout nunca se muestran como pagos.", billingSecureCheckout: "Antes de cualquier cargo verás el importe final y el método de pago en el checkout seguro de Stripe. Esta app no almacena números de tarjeta.", diagnosticsLocalDetail: "Los conteos proceden únicamente de interacciones reales en este dispositivo, no de ingresos simulados ni pagos completados.", diagnosticsHonestDetail: "Una tasa de finalización del 0% significa que no existe un evento de checkout verificado; no estima ingresos perdidos.", noVerifiedBilling: "Todavía no hay compras, reembolsos, renovaciones ni cambios de suscripción confirmados por Stripe para mostrar. Este estado vacío es intencional.", aiLabIntro: "Explora las diferencias entre políticas inspiradas en Suphx y pregunta a Sensei por qué funciona una línea.", languagePreview: "Vista previa del chino", previewDescription: "Compara las mismas etiquetas en chino simplificado y tradicional antes de elegir el idioma activo.", useSimplified: "Usar chino simplificado", useTraditional: "Usar chino tradicional",
};

const simplifiedChinese: Catalog = {
  home: "首页", settings: "设置", history: "对局记录", review: "复盘", back: "返回",
  language: "语言", languageDetail: "选择用于导航、对局、挑战和恢复提示的语言。",
  english: "英语", japanese: "日语", spanish: "西班牙语", chinese: "中文", chineseSimplified: "简体中文", chineseTraditional: "繁体中文", saveAutomatically: "更改会自动保存。",
  dailyChallenge: "每日 Arena 挑战", newObjective: "新目标", tableMomentum: "牌桌节奏", freshTable: "刚开局", warmingUp: "渐入状态", inRhythm: "节奏正佳", onFire: "火力全开",   yourHand: "你的手牌", clear: "清除", askCopilot: "询问 Copilot", discard: "打牌", waiting: "等待中", confirmDiscard: "确认打牌", keepReviewing: "继续复盘", handComplete: "本局结束", playDecisiveTurn: "回放关键回合", reviewHand: "复盘本局", startNextHand: "开始下一局", rematchChoice: "再战选择", queueFreshObjective: "安排新目标", replayUnavailable: "回放暂不可用。", retry: "重试",
  upgrade: "升级", billingHistory: "账单记录", billingClarity: "账单说明", secureSetup: "安全设置状态", verifiedBilling: "已验证账单", localDiagnostics: "本地转化诊断", privacyNote: "设置就绪状态不代表付款或权益已确认。", aiLab: "AI 实验室", retryStatus: "重试状态", connectionDetails: "连接详情", pendingQuestions: "待处理的 Sensei 问题", queueActivity: "队列活动",
  upgradeHeroDetail: "保留免费的练习牌桌，在你需要更深入的 AI 分析和更完整的复盘空间时再升级。", currentPlanDetail: "只有在已验证的账单事件更新权益后，才会授予高级访问权限。", verifiedBillingOnly: "这里只显示已验证的账单事件。本地方案选择和结账意向不会被显示为付款。", billingSecureCheckout: "任何扣款前，你都可以在 Stripe 安全结账页查看最终金额和付款方式。本应用不会保存卡号。", diagnosticsLocalDetail: "这些统计只来自本设备上的真实操作，不代表模拟收入或已完成付款。", diagnosticsHonestDetail: "完成率为 0% 只表示没有已验证的结账完成事件，并不估算流失收入。", noVerifiedBilling: "目前没有可显示的 Stripe 已确认购买、退款、续订或权益变更记录。这个空状态是有意保留的。", aiLabIntro: "探索受 Suphx 启发的策略取舍，然后询问 Sensei 为什么某条牌路有效。", languagePreview: "中文语言预览", previewDescription: "选择当前语言前，先对比简体中文和繁体中文中的相同标签。", useSimplified: "使用简体中文", useTraditional: "使用繁体中文",
};

const traditionalChinese: Catalog = {
  home: "首頁", settings: "設定", history: "對局紀錄", review: "複盤", back: "返回",
  language: "語言", languageDetail: "選擇用於導覽、對局、挑戰與復原提示的語言。",
  english: "英文", japanese: "日文", spanish: "西班牙文", chinese: "中文", chineseSimplified: "簡體中文", chineseTraditional: "繁體中文", saveAutomatically: "變更會自動儲存。",
  dailyChallenge: "每日 Arena 挑戰", newObjective: "新目標", tableMomentum: "牌桌節奏", freshTable: "剛開局", warmingUp: "逐漸進入狀態", inRhythm: "節奏正佳", onFire: "火力全開",   yourHand: "你的手牌", clear: "清除", askCopilot: "詢問 Copilot", discard: "打牌", waiting: "等待中", confirmDiscard: "確認打牌", keepReviewing: "繼續複盤", handComplete: "本局結束", playDecisiveTurn: "回放關鍵回合", reviewHand: "複盤本局", startNextHand: "開始下一局", rematchChoice: "再戰選擇", queueFreshObjective: "安排新目標", replayUnavailable: "回放暫不可用。", retry: "重試",
  upgrade: "升級", billingHistory: "帳單紀錄", billingClarity: "帳單說明", secureSetup: "安全設定狀態", verifiedBilling: "已驗證帳單", localDiagnostics: "本機轉換診斷", privacyNote: "設定就緒狀態不代表付款或權益已確認。", aiLab: "AI 實驗室", retryStatus: "重試狀態", connectionDetails: "連線詳細資料", pendingQuestions: "待處理的 Sensei 問題", queueActivity: "佇列活動",
  upgradeHeroDetail: "保留免費的練習牌桌，在你需要更深入的 AI 分析和更完整的複盤空間時再升級。", currentPlanDetail: "只有在已驗證的帳單事件更新權益後，才會授予進階存取權限。", verifiedBillingOnly: "這裡只顯示已驗證的帳單事件。本機方案選擇和結帳意向不會被顯示為付款。", billingSecureCheckout: "任何扣款前，你都可以在 Stripe 安全結帳頁查看最終金額和付款方式。本應用程式不會儲存卡號。", diagnosticsLocalDetail: "這些統計只來自本機上的真實操作，不代表模擬收入或已完成付款。", diagnosticsHonestDetail: "完成率為 0% 只表示沒有已驗證的結帳完成事件，並不估算流失收入。", noVerifiedBilling: "目前沒有可顯示的 Stripe 已確認購買、退款、續訂或權益變更紀錄。這個空狀態是有意保留的。", aiLabIntro: "探索受 Suphx 啟發的策略取捨，然後詢問 Sensei 為什麼某條牌路有效。", languagePreview: "中文語言預覽", previewDescription: "選擇目前語言前，先比較簡體中文和繁體中文中的相同標籤。", useSimplified: "使用簡體中文", useTraditional: "使用繁體中文",
};

const catalog: Record<LanguageCode, Catalog> = { en: english, ja: japanese, es: spanish, "zh-Hans": simplifiedChinese, "zh-Hant": traditionalChinese };

export function languageFromDeviceLocales(locales: ReadonlyArray<{ languageCode?: string | null; languageTag?: string; languageScriptCode?: string | null; regionCode?: string | null }>): LanguageCode {
  const preferred = locales[0];
  const code = (preferred?.languageCode ?? preferred?.languageTag?.split("-")[0] ?? "en").toLowerCase();
  if (code === "zh") {
    const tag = `${preferred?.languageTag ?? ""}-${preferred?.regionCode ?? ""}`.toLowerCase();
    const script = (preferred?.languageScriptCode ?? "").toLowerCase();
    return script === "hant" || /zh-(tw|hk|mo)/.test(tag) ? "zh-Hant" : "zh-Hans";
  }
  if (code === "ja") return "ja";
  if (code === "es") return "es";
  return "en";
}

function storedLanguage(value: string | null): LanguageCode | null {
  if (value === "zh") return "zh-Hans";
  return value === "en" || value === "ja" || value === "es" || value === "zh-Hans" || value === "zh-Hant" ? value : null;
}

interface I18nContextValue {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  t: (key: TranslationKey) => string;
  languageOptions: typeof LANGUAGE_OPTIONS;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>("en");
  const [hasExplicitPreference, setHasExplicitPreference] = useState(false);

  useEffect(() => {
    let mounted = true;
    void safeGetItem(STORAGE_KEY).then((value) => {
      if (!mounted) return;
      const saved = storedLanguage(value);
      if (saved) {
        setLanguageState(saved);
        setHasExplicitPreference(true);
      } else {
        setLanguageState(languageFromDeviceLocales(Localization.getLocales()));
      }
    });
    const subscription = AppState.addEventListener("change", (nextState) => {
      if (nextState === "active" && !hasExplicitPreference) setLanguageState(languageFromDeviceLocales(Localization.getLocales()));
    });
    return () => { mounted = false; subscription.remove(); };
  }, [hasExplicitPreference]);

  const setLanguage = (next: LanguageCode) => {
    setLanguageState(next);
    setHasExplicitPreference(true);
    void safeSetItem(STORAGE_KEY, next);
  };

  const value = useMemo<I18nContextValue>(() => ({ language, setLanguage, t: (key) => catalog[language][key], languageOptions: LANGUAGE_OPTIONS }), [language]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n must be used inside I18nProvider");
  return context;
}

export type RecoveryTranslationKey = "storageRestricted" | "savedOffline" | "retryLimitPaused" | "retryLimitResumed" | "reconnectManually" | "queuedAnswer" | "queuedStillSaved" | "networkProtected";

const recoveryCatalog: Record<"en" | "zh-Hans" | "zh-Hant", Record<RecoveryTranslationKey, string>> = {
  en: {
    storageRestricted: "Local storage is restricted. AI Lab still works, but chat and match history may not persist on this device.",
    savedOffline: "Saved offline. Sensei will retry this question when you reconnect.",
    retryLimitPaused: "Automatic retries paused after reaching the configured limit.",
    retryLimitResumed: "Automatic retries resumed for paused Sensei questions.",
    reconnectManually: "Reconnect before sending a queued question manually.",
    queuedAnswer: "Sensei answered a queued question.",
    queuedStillSaved: "Sensei could not retry the queued question. It remains saved for another attempt.",
    networkProtected: "Network-dependent AI actions are available. Local study context remains protected by recovery checks.",
  },
  "zh-Hans": {
    storageRestricted: "本地存储受限。AI 实验室仍可使用，但聊天和对局记录可能无法保存在本设备上。",
    savedOffline: "已离线保存。重新连接后，Sensei 会重试这个问题。",
    retryLimitPaused: "已达到设置的上限，自动重试已暂停。",
    retryLimitResumed: "已恢复暂停的 Sensei 问题的自动重试。",
    reconnectManually: "请先重新连接，再手动发送队列中的问题。",
    queuedAnswer: "Sensei 已回答一个队列中的问题。",
    queuedStillSaved: "Sensei 暂时无法重试这个队列问题。问题仍已保存，可稍后再次尝试。",
    networkProtected: "依赖网络的 AI 操作已可用。本地学习上下文仍受到恢复检查保护。",
  },
  "zh-Hant": {
    storageRestricted: "本機儲存空間受限。AI 實驗室仍可使用，但聊天和對局紀錄可能無法保存在本機上。",
    savedOffline: "已離線儲存。重新連線後，Sensei 會重試這個問題。",
    retryLimitPaused: "已達到設定的上限，自動重試已暫停。",
    retryLimitResumed: "已恢復暫停的 Sensei 問題的自動重試。",
    reconnectManually: "請先重新連線，再手動傳送佇列中的問題。",
    queuedAnswer: "Sensei 已回答一個佇列中的問題。",
    queuedStillSaved: "Sensei 暫時無法重試這個佇列問題。問題仍已儲存，可稍後再次嘗試。",
    networkProtected: "依賴網路的 AI 操作已可用。本機學習上下文仍受到復原檢查保護。",
  },
};

export function recoveryText(language: LanguageCode, key: RecoveryTranslationKey): string {
  const recoveryLanguage = language === "zh-Hans" || language === "zh-Hant" ? language : "en";
  return recoveryCatalog[recoveryLanguage][key];
}

export type AiLabActionKey = "lastAttemptUnavailable" | "retryUnavailable" | "nextRetry" | "scheduled" | "paused" | "pauseRetries" | "resumeRetries" | "searchMatches" | "currentlyOpen" | "savedLocalContext" | "createExperiment" | "reconnectToCreate" | "retryLastQuestion" | "retryAllQuestions" | "clearQueuedQuestions" | "askStrategy" | "stop" | "compareWays" | "offlineTitle" | "limitedRecovery" | "needsAttention" | "policyExperiment" | "senseiCopilot" | "confidenceMap" | "policyOutputs" | "tradeoff" | "nextStep" | "comparePolicies" | "openReview" | "liveTimeline" | "reviewTimeline" | "retryRecovery" | "viewActivity" | "localHistory" | "runAISteps" | "runFourSeats" | "runHandEnd" | "replayAnalytics" | "shareSummary" | "matchReport" | "seat" | "topDiscard" | "objective" | "confidence" | "decision" | "averageConfidence" | "savedBenchmark";

const aiLabActionCatalog: Record<"en" | "zh-Hans" | "zh-Hant", Record<AiLabActionKey, string>> = {
  en: {
    lastAttemptUnavailable: "Last attempt time unavailable", retryUnavailable: "Retry time unavailable", nextRetry: "Next retry", scheduled: "Scheduled", paused: "Paused", pauseRetries: "Pause automatic retries", resumeRetries: "Resume automatic retries", searchMatches: "Search recent matches", currentlyOpen: "Currently open", savedLocalContext: "Saved on this device · open replay and chat context", createExperiment: "Create experiment state", reconnectToCreate: "Reconnect to create", retryLastQuestion: "Retry last question", retryAllQuestions: "Retry all", clearQueuedQuestions: "Clear queued Sensei questions", askStrategy: "Ask about your strategy", stop: "Stop", compareWays: "Compare ways to play.", offlineTitle: "AI Lab is offline", limitedRecovery: "Local recovery is limited", needsAttention: "AI Lab needs attention", policyExperiment: "Policy experiment", senseiCopilot: "Sensei / Copilot", confidenceMap: "Confidence map", policyOutputs: "Policy outputs", tradeoff: "Trade-off", nextStep: "Sensei next step", comparePolicies: "Compare four policies", openReview: "Open detailed review", liveTimeline: "Open live review timeline", reviewTimeline: "Open review timeline", retryRecovery: "Retry recovery", viewActivity: "View full activity", localHistory: "Local study history", runAISteps: "Run AI seats", runFourSeats: "Run four AI seats", runHandEnd: "Run until hand end", replayAnalytics: "Replay analytics", shareSummary: "Share visual summary", matchReport: "Match report", seat: "Seat", topDiscard: "Top discard", objective: "Objective", confidence: "Confidence", decision: "AI decision", averageConfidence: "average confidence", savedBenchmark: "Saved benchmark history",
  },
  "zh-Hans": {
    lastAttemptUnavailable: "上次尝试时间不可用", retryUnavailable: "重试时间不可用", nextRetry: "下次重试", scheduled: "已安排", paused: "已暂停", pauseRetries: "暂停自动重试", resumeRetries: "恢复自动重试", searchMatches: "搜索最近对局", currentlyOpen: "当前打开", savedLocalContext: "已保存在本设备 · 打开回放和聊天上下文", createExperiment: "创建实验状态", reconnectToCreate: "重新连接后创建", retryLastQuestion: "重试上一个问题", retryAllQuestions: "全部重试", clearQueuedQuestions: "清除队列中的 Sensei 问题", askStrategy: "询问你的策略", stop: "停止", compareWays: "比较不同打法。", offlineTitle: "AI 实验室处于离线状态", limitedRecovery: "本地恢复受限", needsAttention: "AI 实验室需要处理", policyExperiment: "策略实验", senseiCopilot: "Sensei / Copilot", confidenceMap: "信心图", policyOutputs: "策略输出", tradeoff: "取舍", nextStep: "Sensei 下一步", comparePolicies: "比较四种策略", openReview: "打开详细复盘", liveTimeline: "打开实时复盘时间线", reviewTimeline: "打开复盘时间线", retryRecovery: "重试恢复", viewActivity: "查看完整活动", localHistory: "本地学习记录", runAISteps: "运行 AI 牌位", runFourSeats: "运行四个 AI 牌位", runHandEnd: "运行到本局结束", replayAnalytics: "回放分析", shareSummary: "分享可视化摘要", matchReport: "对局报告", seat: "座位", topDiscard: "首选打牌", objective: "目标", confidence: "信心", decision: "AI 决策", averageConfidence: "平均信心", savedBenchmark: "已保存的基准记录",
  },
  "zh-Hant": {
    lastAttemptUnavailable: "上次嘗試時間無法取得", retryUnavailable: "重試時間無法取得", nextRetry: "下次重試", scheduled: "已排程", paused: "已暫停", pauseRetries: "暫停自動重試", resumeRetries: "恢復自動重試", searchMatches: "搜尋最近對局", currentlyOpen: "目前開啟", savedLocalContext: "已儲存在本機 · 開啟回放和聊天上下文", createExperiment: "建立實驗狀態", reconnectToCreate: "重新連線後建立", retryLastQuestion: "重試上一個問題", retryAllQuestions: "全部重試", clearQueuedQuestions: "清除佇列中的 Sensei 問題", askStrategy: "詢問你的策略", stop: "停止", compareWays: "比較不同打法。", offlineTitle: "AI 實驗室處於離線狀態", limitedRecovery: "本機復原受限", needsAttention: "AI 實驗室需要處理", policyExperiment: "策略實驗", senseiCopilot: "Sensei / Copilot", confidenceMap: "信心圖", policyOutputs: "策略輸出", tradeoff: "取捨", nextStep: "Sensei 下一步", comparePolicies: "比較四種策略", openReview: "開啟詳細複盤", liveTimeline: "開啟即時複盤時間線", reviewTimeline: "開啟複盤時間線", retryRecovery: "重試復原", viewActivity: "查看完整活動", localHistory: "本機學習紀錄", runAISteps: "執行 AI 座位", runFourSeats: "執行四個 AI 座位", runHandEnd: "執行至本局結束", replayAnalytics: "回放分析", shareSummary: "分享視覺化摘要", matchReport: "對局報告", seat: "座位", topDiscard: "首選打牌", objective: "目標", confidence: "信心", decision: "AI 決策", averageConfidence: "平均信心", savedBenchmark: "已儲存的基準紀錄",
  },
};

export function aiLabText(language: LanguageCode, key: AiLabActionKey): string {
  const actionLanguage = language === "zh-Hans" || language === "zh-Hant" ? language : "en";
  return aiLabActionCatalog[actionLanguage][key];
}

export type AiLabCoachingMode = "defensive" | "balanced" | "exploratory";

export function aiLabCoachingModeLabel(language: LanguageCode, mode: AiLabCoachingMode): string {
  if (language === "zh-Hans") return mode === "defensive" ? "防守" : mode === "exploratory" ? "探索" : "平衡";
  if (language === "zh-Hant") return mode === "defensive" ? "防守" : mode === "exploratory" ? "探索" : "平衡";
  return mode === "defensive" ? "Defensive" : mode === "exploratory" ? "Exploratory" : "Balanced";
}

export function aiLabCoachingModeDescription(language: LanguageCode, mode: AiLabCoachingMode): string {
  if (language === "zh-Hans") return mode === "defensive" ? "优先考虑更安全的进张、可见危险检查和可控的分数保护。" : mode === "exploratory" ? "在风险预算清晰可见时，允许尝试更多价值与牌型变化。" : "结合当前牌桌状态，在速度、价值和防守之间保持平衡。";
  if (language === "zh-Hant") return mode === "defensive" ? "優先考慮更安全的進張、可見危險檢查和可控的分數保護。" : mode === "exploratory" ? "在風險預算清楚可見時，允許嘗試更多價值與牌型變化。" : "結合目前牌桌狀態，在速度、價值和防守之間保持平衡。";
  return mode === "defensive" ? "Prefer safer waits, visible danger checks, and controlled score protection." : mode === "exploratory" ? "Allow more value and shape experiments when the risk budget is visible." : "Balance speed, value, and defense using the current table context.";
}

export function aiLabModePolicyAction(language: LanguageCode, mode: AiLabCoachingMode, topAction?: string): { title: string; action: string } {
  const action = topAction ?? (language === "zh-Hans" ? "首选牌路" : language === "zh-Hant" ? "首選牌路" : "the preferred line");
  if (language === "zh-Hans") {
    if (mode === "defensive") return { title: "保护下行空间", action: `只有在检查最安全的可见替代方案和当前危险信号后，才使用${action}。` };
    if (mode === "exploratory") return { title: "有意识地承担风险", action: `当额外价值或牌型收益可见且风险预算可接受时，将${action}作为一次尝试。` };
    return { title: "保持牌路平衡", action: `以${action}为基线，然后在提交前比较一个速度、价值和防守事实。` };
  }
  if (language === "zh-Hant") {
    if (mode === "defensive") return { title: "保護下行空間", action: `只有在檢查最安全的可見替代方案和目前危險訊號後，才使用${action}。` };
    if (mode === "exploratory") return { title: "有意識地承擔風險", action: `當額外價值或牌型收益可見且風險預算可接受時，將${action}作為一次嘗試。` };
    return { title: "保持牌路平衡", action: `以${action}為基線，然後在提交前比較一個速度、價值和防守事實。` };
  }
  if (mode === "defensive") return { title: "Protect the downside", action: `Use ${action} only after checking the safest visible alternative and the current danger signals.` };
  if (mode === "exploratory") return { title: "Spend risk deliberately", action: `Use ${action} as an experiment when the extra value or shape gain is visible and the risk budget is acceptable.` };
  return { title: "Keep the line balanced", action: `Use ${action} as the baseline, then compare one speed, value, and defense fact before committing.` };
}

export type AiLabLongFormKey = "comparisonDetail" | "visibleStateDetail" | "strategyEstimate" | "confidenceDetail" | "replayUnavailable" | "tradeoffFallback" | "inspectPolicyState" | "askSavedExperiment" | "createFirstExperiment";

const aiLabLongFormCatalog: Record<"en" | "zh-Hans" | "zh-Hant", Record<AiLabLongFormKey, string>> = {
  en: {
    comparisonDetail: "The comparison never exposes concealed tiles. It shows different reasonable priorities and their uncertainty.", visibleStateDetail: "Ask in plain language. Sensei uses visible state only and explains uncertainty instead of pretending to know hidden tiles.", strategyEstimate: "Strategy suggestions are estimates, not guaranteed winning moves.", confidenceDetail: "Compare confidence across objectives without leaving the experiment.", replayUnavailable: "Some replay data is unavailable right now.", tradeoffFallback: "Compare this line with the other policies before committing.", inspectPolicyState: "Create a state to inspect how policies differ.", askSavedExperiment: "Ask Sensei about this saved experiment to get visible-state guidance.", createFirstExperiment: "Create a policy experiment first; Sensei will then explain the actual state instead of showing sample advice.",
  },
  "zh-Hans": {
    comparisonDetail: "比较不会暴露隐藏牌。它展示不同的合理优先级以及各自的不确定性。", visibleStateDetail: "用自然语言提问吧。Sensei 只使用可见状态，并解释不确定性，不会假装知道隐藏牌。", strategyEstimate: "策略建议只是估计，并不保证一定获胜。", confidenceDetail: "无需离开实验，即可比较不同目标下的信心。", replayUnavailable: "部分回放数据目前不可用。", tradeoffFallback: "提交前，请将这条牌路与其他策略进行比较。", inspectPolicyState: "创建一个状态，以查看不同策略的差异。", askSavedExperiment: "询问 Sensei 这个已保存的实验，获取基于可见状态的指导。", createFirstExperiment: "请先创建策略实验；Sensei 会解释真实状态，而不是展示示例建议。",
  },
  "zh-Hant": {
    comparisonDetail: "比較不會暴露隱藏牌。它展示不同的合理優先級以及各自的不確定性。", visibleStateDetail: "用自然語言提問吧。Sensei 只使用可見狀態，並解釋不確定性，不會假裝知道隱藏牌。", strategyEstimate: "策略建議只是估計，並不保證一定獲勝。", confidenceDetail: "無需離開實驗，即可比較不同目標下的信心。", replayUnavailable: "部分回放資料目前無法使用。", tradeoffFallback: "提交前，請將這條牌路與其他策略進行比較。", inspectPolicyState: "建立一個狀態，以查看不同策略的差異。", askSavedExperiment: "詢問 Sensei 這個已儲存的實驗，取得基於可見狀態的指導。", createFirstExperiment: "請先建立策略實驗；Sensei 會解釋真實狀態，而不是展示範例建議。",
  },
};

export function aiLabNextStepCopy(language: LanguageCode, agreement: number, topAction?: string, objective?: string): { title: string; action: string; evidence: string } {
  const action = topAction ?? (language === "zh-Hans" ? "首选牌路" : language === "zh-Hant" ? "首選牌路" : "the preferred discard");
  const percentage = Math.round(agreement * 100);
  const target = objective ?? (language === "zh-Hans" ? "当前目标" : language === "zh-Hant" ? "目前目標" : "the current objective");
  if (language === "zh-Hans") {
    if (agreement < 0.5) return { title: "解决取舍", action: `提交前，将${action}与一个防守反事实进行比较。`, evidence: `策略只有 ${percentage}% 的时间同意首选动作，因此可见的取舍比单一建议更重要。` };
    return { title: "校准首选牌路", action: `以${action}为基线，然后指出一个会让你切换策略的可见事实。`, evidence: `比较线路中有 ${percentage}% 同意首选动作，但剩余差异仍有助于学习${target}。` };
  }
  if (language === "zh-Hant") {
    if (agreement < 0.5) return { title: "解決取捨", action: `提交前，將${action}與一個防守反事實進行比較。`, evidence: `策略只有 ${percentage}% 的時間同意首選動作，因此可見的取捨比單一建議更重要。` };
    return { title: "校準首選牌路", action: `以${action}為基線，然後指出一個會讓你切換策略的可見事實。`, evidence: `比較牌路中有 ${percentage}% 同意首選動作，但剩餘差異仍有助於學習${target}。` };
  }
  if (agreement < 0.5) return { title: "Resolve the trade-off", action: `Compare ${action} against one defensive counterfactual before committing.`, evidence: `The policies agree on the top action only ${percentage}% of the time, so the visible trade-off matters more than a single recommendation.` };
  return { title: "Calibrate the preferred line", action: `Keep ${action} as the baseline, then name the visible fact that would make you switch policies.`, evidence: `${percentage}% of compared lines agree on the top action, but the remaining difference is still useful for learning ${target}.` };
}

const trustedRationalePhrases: Record<string, { "zh-Hans": string; "zh-Hant": string }> = {
  "No rationale available.": { "zh-Hans": "暂无理由说明。", "zh-Hant": "暫無理由說明。" },
  "Compare this line with the other policies before committing.": { "zh-Hans": "提交前，请将这条牌路与其他策略进行比较。", "zh-Hant": "提交前，請將這條牌路與其他策略進行比較。" },
  "The preferred line is supported by the visible state.": { "zh-Hans": "可见状态支持这条首选牌路。", "zh-Hant": "可見狀態支持這條首選牌路。" },
  "The alternatives remain useful for learning.": { "zh-Hans": "其他选项仍有助于学习。", "zh-Hant": "其他選項仍有助於學習。" },
  "Use the safest visible alternative before committing.": { "zh-Hans": "提交前，请先使用最安全的可见替代方案。", "zh-Hant": "提交前，請先使用最安全的可見替代方案。" },
  "Keep the current line as the baseline.": { "zh-Hans": "将当前牌路保留为基线。", "zh-Hant": "將目前牌路保留為基線。" },
  "Compare one speed, value, and defense fact before committing.": { "zh-Hans": "提交前，请比较一个速度、价值和防守事实。", "zh-Hant": "提交前，請比較一個速度、價值和防守事實。" },
  "Some uncertainty remains in the visible state.": { "zh-Hans": "可见状态中仍存在一定不确定性。", "zh-Hant": "可見狀態中仍存在一定不確定性。" },
  "Visible state supports this recommendation.": { "zh-Hans": "可见状态支持这项建议。", "zh-Hant": "可見狀態支持這項建議。" },
};

export function aiLabAnalyticalText(language: LanguageCode, text: string | undefined, fallbackKey: AiLabLongFormKey): string {
  if (!text) return aiLabLongText(language, fallbackKey);
  if (language !== "zh-Hans" && language !== "zh-Hant") return text;
  return trustedRationalePhrases[text]?.[language] ?? text;
}

const localeForLanguage: Record<LanguageCode, string> = { en: "en-US", ja: "ja-JP", es: "es-ES", "zh-Hans": "zh-CN", "zh-Hant": "zh-TW" };

export function formatLocalizedNumber(language: LanguageCode, value: number, maximumFractionDigits = 0): string {
  return new Intl.NumberFormat(localeForLanguage[language], { maximumFractionDigits }).format(value);
}

export function formatLocalizedPercent(language: LanguageCode, value: number): string {
  return new Intl.NumberFormat(localeForLanguage[language], { style: "percent", maximumFractionDigits: 0 }).format(value);
}

export function formatLocalizedScore(language: LanguageCode, value: number): string {
  return formatLocalizedNumber(language, value, 0);
}

export function formatLocalizedDate(language: LanguageCode, value: string | number | Date): string {
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat(localeForLanguage[language], { year: "numeric", month: "short", day: "numeric" }).format(date);
}

export function formatLocalizedTime(language: LanguageCode, value: string | number | Date): string {
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat(localeForLanguage[language], { hour: "numeric", minute: "2-digit" }).format(date);
}

export type BillingLongKey = "historyDetail" | "verifiedWillAppear" | "diagnosticsConsent" | "privacyNoClaims" | "noSignals" | "exportDetail" | "revenueInterpretation" | "stripeReadiness" | "conversionDashboard" | "localDiagnosticsDisabled";

const billingLongCatalog: Record<"en" | "zh-Hans" | "zh-Hant", Record<BillingLongKey, string>> = {
  en: {
    historyDetail: "Verified billing records and local conversion diagnostics stay separate so local activity is never mistaken for revenue.", verifiedWillAppear: "Verified checkout completion, entitlement changes, renewals, refunds, and cancellations received from the billing provider.", diagnosticsConsent: "Allow this device to retain anonymous interaction counts for conversion analysis. No card details, concealed Mahjong tiles, or payment claims are stored.", privacyNoClaims: "No card details, concealed Mahjong tiles, revenue, or entitlement claims are stored locally.", noSignals: "No local conversion signals are shown until you enable consent in Settings. Verified billing data appears here only after authenticated Stripe sync is connected.", exportDetail: "CSV contains event IDs, event names, timestamps, variants, promotions, and campaigns. It does not include payment credentials. Export remains empty while diagnostics consent is off.", revenueInterpretation: "Conversion rates describe funnel behavior, not recognized revenue. Sample-quality labels are descriptive, not statistical confidence intervals. Reconcile completed checkouts with verified Stripe subscription and invoice records before making financial decisions.", stripeReadiness: "This checks server configuration only. It does not expose secrets or confirm a customer entitlement.", conversionDashboard: "Filter monetization signals by time range, compare conversion rates, and export event rows as CSV. Monthly and annual demand are local interest signals, not revenue or subscriptions.", localDiagnosticsDisabled: "Local diagnostics are disabled.",
  },
  "zh-Hans": {
    historyDetail: "已验证账单记录与本地转化诊断彼此分开，因此本地活动不会被误认为收入。", verifiedWillAppear: "这里会显示从账单服务商收到的已验证结账完成、权益变更、续订、退款和取消记录。", diagnosticsConsent: "允许本设备保留匿名互动次数用于转化分析。不保存卡片信息、隐藏的麻将牌面或付款声明。", privacyNoClaims: "本地不会保存卡片信息、隐藏的麻将牌面、收入或权益声明。", noSignals: "在设置中启用同意前，不会显示本地转化信号。只有连接经过身份验证的 Stripe 同步后，这里才会显示已验证账单数据。", exportDetail: "CSV 包含事件 ID、事件名称、时间戳、变体、促销和活动信息，不包含付款凭据。关闭诊断同意时，导出内容保持为空。", revenueInterpretation: "转化率描述漏斗行为，不代表已确认收入。样本质量标签只是描述性信息，不是统计置信区间。在进行财务判断前，应将已完成结账与已验证的 Stripe 订阅和发票记录进行核对。", stripeReadiness: "这里只检查服务器配置，不会暴露密钥，也不会确认客户权益。", conversionDashboard: "按时间范围筛选变现信号、比较转化率并导出事件行 CSV。月度和年度需求是本地兴趣信号，不是收入或订阅。", localDiagnosticsDisabled: "本地诊断已关闭。",
  },
  "zh-Hant": {
    historyDetail: "已驗證帳單紀錄與本機轉換診斷彼此分開，因此本機活動不會被誤認為收入。", verifiedWillAppear: "這裡會顯示從帳單服務商收到的已驗證結帳完成、權益變更、續訂、退款和取消紀錄。", diagnosticsConsent: "允許本機保留匿名互動次數用於轉換分析。不儲存卡片資訊、隱藏的麻將牌面或付款聲明。", privacyNoClaims: "本機不會儲存卡片資訊、隱藏的麻將牌面、收入或權益聲明。", noSignals: "在設定中啟用同意前，不會顯示本機轉換信號。只有連接經過驗證的 Stripe 同步後，這裡才會顯示已驗證帳單資料。", exportDetail: "CSV 包含事件 ID、事件名稱、時間戳、變體、促銷和活動資訊，不包含付款憑據。關閉診斷同意時，匯出內容保持為空。", revenueInterpretation: "轉換率描述漏斗行為，不代表已確認收入。樣本品質標籤只是描述性資訊，不是統計信賴區間。在進行財務判斷前，應將已完成結帳與已驗證的 Stripe 訂閱和發票紀錄進行核對。", stripeReadiness: "這裡只檢查伺服器設定，不會暴露密鑰，也不會確認客戶權益。", conversionDashboard: "按時間範圍篩選變現信號、比較轉換率並匯出事件列 CSV。月度和年度需求是本機興趣信號，不是收入或訂閱。", localDiagnosticsDisabled: "本機診斷已關閉。",
  },
};

export function billingLongText(language: LanguageCode, key: BillingLongKey): string {
  const copyLanguage = language === "zh-Hans" || language === "zh-Hant" ? language : "en";
  return billingLongCatalog[copyLanguage][key];
}

export type BillingShortKey = "back" | "account" | "events" | "whatWillAppear" | "diagnosticsConsent" | "dateRange" | "exportAnalytics" | "summaryCsv" | "rawEvents" | "exportRange" | "openPrivacy" | "refreshReadiness" | "reviewPlans" | "developerRevenue" | "conversionDashboard" | "stripeReadiness" | "sampleQuality" | "signalFreshness" | "paywallCheckout" | "checkoutComplete" | "recoveryAction" | "monthlyDemand" | "annualDemand" | "eventRows" | "freePracticePlan" | "currentAccess" | "viewPlans" | "diagnosticsEnabled" | "diagnosticsDisabled" | "on" | "off" | "recent500" | "days30" | "days90" | "noLocalInteraction" | "paywallViews" | "checkoutInterest" | "monthlyPlanInterest" | "annualPlanInterest" | "interestSaveRate" | "billingIntents" | "billingIntentRate" | "verifiedCheckoutCompletions" | "checkoutCompletionRate" | "clearConfirm" | "clearData" | "cancel" | "serverKey" | "priceId" | "webhookSecret" | "refreshBillingStatus" | "reviewSenseiPlans" | "openPrivacySettings" | "exportSummaryA11y" | "exportRawA11y" | "openBillingHistory";
const billingShortCatalog: Record<"en" | "zh-Hans" | "zh-Hant", Record<BillingShortKey, string>> = {
  en: { back: "Back", account: "Account", events: "events", whatWillAppear: "What will appear here", diagnosticsConsent: "Diagnostics consent", dateRange: "Date range", exportAnalytics: "Export analytics", summaryCsv: "Summary CSV", rawEvents: "Raw events", exportRange: "Export range as CSV", openPrivacy: "Open privacy settings", refreshReadiness: "Refresh readiness", reviewPlans: "Review plans", developerRevenue: "Developer revenue", conversionDashboard: "Conversion dashboard", stripeReadiness: "Stripe readiness", sampleQuality: "Sample quality", signalFreshness: "Signal freshness", paywallCheckout: "Paywall → checkout", checkoutComplete: "Checkout complete", recoveryAction: "Recovery action", monthlyDemand: "Monthly demand", annualDemand: "Annual demand", eventRows: "Event rows", freePracticePlan: "Free practice plan", currentAccess: "Current access", viewPlans: "View Sensei Pro plans", diagnosticsEnabled: "Diagnostics enabled", diagnosticsDisabled: "Diagnostics disabled", on: "ON", off: "OFF", recent500: "Recent 500", days30: "30 days", days90: "90 days", noLocalInteraction: "No local interaction in range", paywallViews: "Upgrade surface views", checkoutInterest: "Saved checkout interest", monthlyPlanInterest: "Monthly plan interest", annualPlanInterest: "Annual plan interest", interestSaveRate: "Interest save rate", billingIntents: "Saved billing intents", billingIntentRate: "Billing intent rate", verifiedCheckoutCompletions: "Verified checkout completions", checkoutCompletionRate: "Checkout completion rate", clearConfirm: "Confirm clear", clearData: "Clear local data", cancel: "Cancel", serverKey: "server key", priceId: "price ID", webhookSecret: "webhook secret", refreshBillingStatus: "Refresh billing status", reviewSenseiPlans: "Review Sensei Pro plans", openPrivacySettings: "Open monetization privacy settings", exportSummaryA11y: "Export conversion summary CSV", exportRawA11y: "Export raw monetization events CSV", openBillingHistory: "Open billing history" },
  "zh-Hans": { back: "返回", account: "账户", events: "事件", whatWillAppear: "这里会显示什么", diagnosticsConsent: "诊断同意", dateRange: "日期范围", exportAnalytics: "导出分析", summaryCsv: "摘要 CSV", rawEvents: "原始事件", exportRange: "导出此范围 CSV", openPrivacy: "打开隐私设置", refreshReadiness: "刷新就绪状态", reviewPlans: "查看方案", developerRevenue: "开发者收入", conversionDashboard: "转化仪表板", stripeReadiness: "Stripe 就绪状态", sampleQuality: "样本质量", signalFreshness: "信号新鲜度", paywallCheckout: "付费墙 → 结账", checkoutComplete: "结账完成", recoveryAction: "恢复操作", monthlyDemand: "月度需求", annualDemand: "年度需求", eventRows: "事件行", freePracticePlan: "免费练习方案", currentAccess: "当前权益", viewPlans: "查看 Sensei Pro 方案", diagnosticsEnabled: "诊断已启用", diagnosticsDisabled: "诊断已关闭", on: "开启", off: "关闭", recent500: "最近 500 条", days30: "30 天", days90: "90 天", noLocalInteraction: "此范围内没有本地互动", paywallViews: "升级页面浏览", checkoutInterest: "已保存的结账兴趣", monthlyPlanInterest: "月度方案兴趣", annualPlanInterest: "年度方案兴趣", interestSaveRate: "兴趣保存率", billingIntents: "已保存的账单意向", billingIntentRate: "账单意向率", verifiedCheckoutCompletions: "已验证结账完成", checkoutCompletionRate: "结账完成率", clearConfirm: "确认清除", clearData: "清除本地数据", cancel: "取消", serverKey: "服务器密钥", priceId: "价格 ID", webhookSecret: "Webhook 密钥", refreshBillingStatus: "刷新账单状态", reviewSenseiPlans: "查看 Sensei Pro 方案", openPrivacySettings: "打开变现隐私设置", exportSummaryA11y: "导出转化摘要 CSV", exportRawA11y: "导出原始变现事件 CSV", openBillingHistory: "打开账单历史" },
  "zh-Hant": { back: "返回", account: "帳戶", events: "事件", whatWillAppear: "這裡會顯示什麼", diagnosticsConsent: "診斷同意", dateRange: "日期範圍", exportAnalytics: "匯出分析", summaryCsv: "摘要 CSV", rawEvents: "原始事件", exportRange: "匯出此範圍 CSV", openPrivacy: "開啟隱私設定", refreshReadiness: "重新整理就緒狀態", reviewPlans: "查看方案", developerRevenue: "開發者收入", conversionDashboard: "轉換儀表板", stripeReadiness: "Stripe 就緒狀態", sampleQuality: "樣本品質", signalFreshness: "信號新鮮度", paywallCheckout: "付費牆 → 結帳", checkoutComplete: "結帳完成", recoveryAction: "復原操作", monthlyDemand: "月度需求", annualDemand: "年度需求", eventRows: "事件列", freePracticePlan: "免費練習方案", currentAccess: "目前權益", viewPlans: "查看 Sensei Pro 方案", diagnosticsEnabled: "診斷已啟用", diagnosticsDisabled: "診斷已關閉", on: "開啟", off: "關閉", recent500: "最近 500 筆", days30: "30 天", days90: "90 天", noLocalInteraction: "此範圍內沒有本機互動", paywallViews: "升級頁面瀏覽", checkoutInterest: "已儲存的結帳興趣", monthlyPlanInterest: "月度方案興趣", annualPlanInterest: "年度方案興趣", interestSaveRate: "興趣儲存率", billingIntents: "已儲存的帳單意向", billingIntentRate: "帳單意向率", verifiedCheckoutCompletions: "已驗證結帳完成", checkoutCompletionRate: "結帳完成率", clearConfirm: "確認清除", clearData: "清除本機資料", cancel: "取消", serverKey: "伺服器金鑰", priceId: "價格 ID", webhookSecret: "Webhook 密鑰", refreshBillingStatus: "重新整理帳單狀態", reviewSenseiPlans: "查看 Sensei Pro 方案", openPrivacySettings: "開啟變現隱私設定", exportSummaryA11y: "匯出轉換摘要 CSV", exportRawA11y: "匯出原始變現事件 CSV", openBillingHistory: "開啟帳單歷史" },
};
export function billingShortText(language: LanguageCode, key: BillingShortKey): string { const copyLanguage = language === "zh-Hans" || language === "zh-Hant" ? language : "en"; return billingShortCatalog[copyLanguage][key]; }

export type BillingStatusKey = "localOnly" | "diagnosticsDisabledMessage" | "analyticsReadError" | "retentionSaved" | "retentionSaveFailed" | "consentEnabled" | "consentDisabled" | "preferenceSaveFailed" | "confirmClear" | "cleared" | "clearFailed" | "clearCancelled" | "summaryExported" | "summaryShareReady" | "summaryExportFailed" | "rawExported" | "rawShareReady" | "rawExportFailed" | "statusUnavailable" | "checking" | "checkoutConfigured" | "notConfigured" | "notChecked" | "lastChecked";
const billingStatusCatalog: Record<"en" | "zh-Hans" | "zh-Hant", Record<BillingStatusKey, string>> = {
  en: { localOnly: "Local diagnostics stay on this device until protected server sync is enabled.", diagnosticsDisabledMessage: "Local diagnostics are disabled. Enable consent in Settings before viewing local conversion signals.", analyticsReadError: "Some analytics data could not be read; showing a safe empty state.", retentionSaved: "Diagnostics retention preference saved on this device.", retentionSaveFailed: "Diagnostics retention preference could not be saved on this device.", consentEnabled: "Local diagnostics enabled on this device.", consentDisabled: "Local diagnostics disabled. Existing records remain until you clear them.", preferenceSaveFailed: "The diagnostics preference could not be saved on this device.", confirmClear: "Confirm clearing local conversion diagnostics. Verified billing history will not be changed.", cleared: "Local diagnostics cleared. Verified billing history was not changed.", clearFailed: "Local diagnostics could not be cleared on this device.", clearCancelled: "Clear request cancelled. Local diagnostics were not changed.", summaryExported: "Conversion summary exported.", summaryShareReady: "Conversion summary ready to share.", summaryExportFailed: "Conversion summary could not be exported.", rawExported: "Conversion diagnostics exported.", rawShareReady: "Conversion diagnostics ready to share.", rawExportFailed: "Conversion diagnostics could not be exported.", statusUnavailable: "Status unavailable", checking: "Checking…", checkoutConfigured: "Checkout configured", notConfigured: "Not configured", notChecked: "Not checked on this device", lastChecked: "Last checked" },
  "zh-Hans": { localOnly: "本地诊断数据会保留在此设备上，直到启用受保护的服务器同步。", diagnosticsDisabledMessage: "本地诊断已关闭。请在设置中启用同意后再查看本地转化信号。", analyticsReadError: "部分分析数据无法读取；当前显示安全的空状态。", retentionSaved: "诊断保留偏好已保存到此设备。", retentionSaveFailed: "诊断保留偏好无法保存到此设备。", consentEnabled: "本地诊断已在此设备启用。", consentDisabled: "本地诊断已关闭。现有记录会保留，直到你清除它们。", preferenceSaveFailed: "诊断偏好无法保存到此设备。", confirmClear: "请确认清除本地转化诊断。已验证账单历史不会改变。", cleared: "本地诊断已清除。已验证账单历史未改变。", clearFailed: "本地诊断无法从此设备清除。", clearCancelled: "清除请求已取消。本地诊断未改变。", summaryExported: "转化摘要已导出。", summaryShareReady: "转化摘要已准备好分享。", summaryExportFailed: "转化摘要无法导出。", rawExported: "转化诊断已导出。", rawShareReady: "转化诊断已准备好分享。", rawExportFailed: "转化诊断无法导出。", statusUnavailable: "状态不可用", checking: "检查中…", checkoutConfigured: "结账已配置", notConfigured: "尚未配置", notChecked: "此设备尚未检查", lastChecked: "上次检查" },
  "zh-Hant": { localOnly: "本機診斷資料會保留在此裝置上，直到啟用受保護的伺服器同步。", diagnosticsDisabledMessage: "本機診斷已關閉。請在設定中啟用同意後再查看本機轉換信號。", analyticsReadError: "部分分析資料無法讀取；目前顯示安全的空狀態。", retentionSaved: "診斷保留偏好已儲存至此裝置。", retentionSaveFailed: "診斷保留偏好無法儲存至此裝置。", consentEnabled: "本機診斷已在此裝置啟用。", consentDisabled: "本機診斷已關閉。現有紀錄會保留，直到你清除它們。", preferenceSaveFailed: "診斷偏好無法儲存至此裝置。", confirmClear: "請確認清除本機轉換診斷。已驗證帳單歷史不會改變。", cleared: "本機診斷已清除。已驗證帳單歷史未改變。", clearFailed: "本機診斷無法從此裝置清除。", clearCancelled: "清除請求已取消。本機診斷未改變。", summaryExported: "轉換摘要已匯出。", summaryShareReady: "轉換摘要已準備好分享。", summaryExportFailed: "轉換摘要無法匯出。", rawExported: "轉換診斷已匯出。", rawShareReady: "轉換診斷已準備好分享。", rawExportFailed: "轉換診斷無法匯出。", statusUnavailable: "狀態無法使用", checking: "檢查中…", checkoutConfigured: "結帳已設定", notConfigured: "尚未設定", notChecked: "此裝置尚未檢查", lastChecked: "上次檢查" },
};
export function billingStatusText(language: LanguageCode, key: BillingStatusKey): string { const copyLanguage = language === "zh-Hans" || language === "zh-Hant" ? language : "en"; return billingStatusCatalog[copyLanguage][key]; }

export function aiLabLongText(language: LanguageCode, key: AiLabLongFormKey): string {
  const copyLanguage = language === "zh-Hans" || language === "zh-Hant" ? language : "en";
  return aiLabLongFormCatalog[copyLanguage][key];
}

export function aiLabPolicyLabel(language: LanguageCode, policy: string): string {
  const zhHans: Record<string, string> = { balanced: "平衡", aggressive: "進攻", defensive: "防守", "human-like": "類人" };
  const zhHant: Record<string, string> = { balanced: "平衡", aggressive: "進攻", defensive: "防守", "human-like": "類人" };
  if (language === "zh-Hans") return zhHans[policy] ?? policy;
  if (language === "zh-Hant") return zhHant[policy] ?? policy;
  return policy;
}

export function aiLabObjectiveLabel(language: LanguageCode, objective: string): string {
  const zhHans: Record<string, string> = { speed: "速度", value: "價值", defense: "防守", efficiency: "效率", aggression: "進攻" };
  const zhHant: Record<string, string> = { speed: "速度", value: "價值", defense: "防守", efficiency: "效率", aggression: "進攻" };
  if (language === "zh-Hans") return zhHans[objective] ?? objective;
  if (language === "zh-Hant") return zhHant[objective] ?? objective;
  return objective;
}

export function aiLabRetryTimer(language: LanguageCode, seconds: number): string {
  const actionLanguage = language === "zh-Hans" || language === "zh-Hant" ? language : "en";
  if (actionLanguage === "zh-Hans") return seconds < 60 ? `下次重试 ${seconds} 秒后` : `下次重试 ${Math.ceil(seconds / 60)} 分钟后`;
  if (actionLanguage === "zh-Hant") return seconds < 60 ? `下次重試 ${seconds} 秒後` : `下次重試 ${Math.ceil(seconds / 60)} 分鐘後`;
  return seconds < 60 ? `Next retry in ${seconds}s` : `Next retry in ${Math.ceil(seconds / 60)}m`;
}

export const LANGUAGE_STORAGE_KEY = STORAGE_KEY;
export const TRANSLATION_KEYS = Object.keys(catalog.en) as TranslationKey[];
