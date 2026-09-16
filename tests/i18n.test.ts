import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const source = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "../lib/i18n.tsx"), "utf8");

describe("multilingual translation support", () => {
  it("defines all supported language options, including both Chinese scripts", () => {
    expect(source).toContain('code: "en"');
    expect(source).toContain('code: "ja"');
    expect(source).toContain('code: "es"');
    expect(source).toContain('code: "zh-Hans"');
    expect(source).toContain('code: "zh-Hant"');
    expect(source).toContain("简体中文");
    expect(source).toContain("繁體中文");
    expect(source).toContain("日本語");
    expect(source).toContain("Español");
  });

  it("persists the selected language locally and keeps legacy Chinese data compatible", () => {
    expect(source).toContain('const STORAGE_KEY = "mahjong.language"');
    expect(source).toContain("safeGetItem(STORAGE_KEY)");
    expect(source).toContain("safeSetItem(STORAGE_KEY, next)");
    expect(source).toContain('if (value === "zh") return "zh-Hans"');
  });

  it("detects Chinese script and region correctly and refreshes non-explicit choices", () => {
    expect(source).toContain("export function languageFromDeviceLocales");
    expect(source).toContain('return script === "hant" || /zh-(tw|hk|mo)/.test(tag) ? "zh-Hant" : "zh-Hans"');
    expect(source).toContain("Localization.getLocales()");
    expect(source).toContain('nextState === "active" && !hasExplicitPreference');
  });

  it("covers expanded trusted rationale phrases without translating unknown server text", () => {
    expect(source).toContain("Use the safest visible alternative before committing.");
    expect(source).toContain("Keep the current line as the baseline.");
    expect(source).toContain("Some uncertainty remains in the visible state.");
    expect(source).toContain("return trustedRationalePhrases[text]?.[language] ?? text");
  });

  it("defines locale-aware numeric, score, date, and time formatters", () => {
    expect(source).toContain("export function formatLocalizedNumber");
    expect(source).toContain("export function formatLocalizedPercent");
    expect(source).toContain("export function formatLocalizedScore");
    expect(source).toContain("export function formatLocalizedDate");
    expect(source).toContain("export function formatLocalizedTime");
    expect(source).toContain('"zh-Hans": "zh-CN"');
    expect(source).toContain('"zh-Hant": "zh-TW"');
  });

  it("keeps trusted rationale translation whitelist-safe for both Chinese scripts", () => {
    expect(source).toContain("const trustedRationalePhrases");
    expect(source).toContain("return trustedRationalePhrases[text]?.[language] ?? text");
    expect(source).toContain("暂无理由说明。");
    expect(source).toContain("暫無理由說明。");
  });

  it("defines the language preview labels for the side-by-side Settings panel", () => {
    expect(source).toContain('languagePreview: "中文语言预览"');
    expect(source).toContain('languagePreview: "中文語言預覽"');
    expect(source).toContain("useSimplified");
    expect(source).toContain("useTraditional");
  });

  it("defines distinct Chinese Billing History and Revenue dynamic-status catalogs", () => {
    expect(source).toContain("export type BillingStatusKey");
    expect(source).toContain("billingStatusCatalog");
    expect(source).toContain('diagnosticsDisabledMessage: "本地诊断已关闭。');
    expect(source).toContain('diagnosticsDisabledMessage: "本機診斷已關閉。');
    expect(source).toContain('summaryShareReady: "转化摘要已准备好分享。');
    expect(source).toContain('summaryShareReady: "轉換摘要已準備好分享。');
    expect(source).toContain("export function billingStatusText");
  });

  it("defines distinct Chinese Billing History and Revenue short-label catalogs", () => {
    expect(source).toContain("export type BillingShortKey");
    expect(source).toContain("billingShortCatalog");
    expect(source).toContain('developerRevenue: "开发者收入"');
    expect(source).toContain('developerRevenue: "開發者收入"');
    expect(source).toContain('summaryCsv: "摘要 CSV"');
    expect(source).toContain('summaryCsv: "摘要 CSV"');
    expect(source).toContain("export function billingShortText");
  });

  it("defines distinct Chinese Billing History and Revenue explanatory catalogs", () => {
    expect(source).toContain("export type BillingLongKey");
    expect(source).toContain("billingLongCatalog");
    expect(source).toContain("已验证账单记录与本地转化诊断彼此分开");
    expect(source).toContain("已驗證帳單紀錄與本機轉換診斷彼此分開");
    expect(source).toContain("export function billingLongText");
  });

  it("includes core gameplay and recovery translations in Chinese scripts", () => {
    expect(source).toContain('dailyChallenge: "每日 Arena 挑战"');
    expect(source).toContain('dailyChallenge: "每日 Arena 挑戰"');
    expect(source).toContain('confirmDiscard: "确认打牌"');
    expect(source).toContain('confirmDiscard: "確認打牌"');
    expect(source).toContain('playDecisiveTurn: "回放关键回合"');
    expect(source).toContain('playDecisiveTurn: "回放關鍵回合"');
  });
});
