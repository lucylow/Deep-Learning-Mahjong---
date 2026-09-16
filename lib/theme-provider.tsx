import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Appearance, Platform, View, useColorScheme as useSystemColorScheme } from "react-native";
import { colorScheme as nativewindColorScheme, vars } from "nativewind";

import { SchemeColors, type ColorScheme } from "@/constants/theme";
import { safeGetItem, safeSetItem } from "@/shared/storage-utils";

export type ArenaThemePreset = "standard" | "dark" | "high-contrast" | "low-light";
const THEME_PRESET_STORAGE_KEY = "mahjong.arena.themePreset";

type ThemeContextValue = {
  colorScheme: ColorScheme;
  themePreset: ArenaThemePreset;
  setColorScheme: (scheme: ColorScheme) => void;
  setThemePreset: (preset: ArenaThemePreset) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function paletteForPreset(scheme: ColorScheme, preset: ArenaThemePreset) {
  const base = SchemeColors[scheme];
  if (preset === "high-contrast") {
    return {
      ...base,
      background: scheme === "dark" ? "#020403" : "#FFFFFF",
      surface: scheme === "dark" ? "#0B100E" : "#FFFFFF",
      foreground: scheme === "dark" ? "#FFFFFF" : "#11181C",
      muted: scheme === "dark" ? "#D8E5DE" : "#334155",
      border: scheme === "dark" ? "#D8E5DE" : "#11181C",
      primary: scheme === "dark" ? "#FFE29A" : "#744B00",
    };
  }
  if (preset === "low-light") {
    return {
      ...base,
      background: "#08100D",
      surface: "#101C18",
      foreground: "#E8F3ED",
      muted: "#A2B8AD",
      border: "#2A4C40",
      primary: "#D7AA58",
      success: "#79C6A1",
      warning: "#F2C36B",
      error: "#F08B78",
    };
  }
  return preset === "dark" ? SchemeColors.dark : base;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useSystemColorScheme() ?? "light";
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>(systemScheme);
  const [themePreset, setThemePresetState] = useState<ArenaThemePreset>(systemScheme === "dark" ? "dark" : "standard");

  const applyScheme = useCallback((scheme: ColorScheme, preset: ArenaThemePreset) => {
    nativewindColorScheme.set(scheme);
    if (Platform.OS !== "web") Appearance.setColorScheme?.(scheme);
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      root.dataset.theme = scheme;
      root.dataset.arenaPreset = preset;
      root.classList.toggle("dark", scheme === "dark");
      const palette = paletteForPreset(scheme, preset);
      Object.entries(palette).forEach(([token, value]) => {
        root.style.setProperty(`--color-${token}`, value);
      });
    }
  }, []);

  const setColorScheme = useCallback((scheme: ColorScheme) => {
    setColorSchemeState(scheme);
    setThemePresetState(scheme === "dark" ? "dark" : "standard");
  }, []);

  const setThemePreset = useCallback((preset: ArenaThemePreset) => {
    setThemePresetState(preset);
    if (preset === "dark") setColorSchemeState("dark");
    if (preset === "standard") setColorSchemeState(systemScheme);
    if (preset === "high-contrast" || preset === "low-light") setColorSchemeState("dark");
  }, [systemScheme]);

  useEffect(() => {
    let active = true;
    void safeGetItem(THEME_PRESET_STORAGE_KEY).then((value) => {
      if (!active || !value) return;
      if (["standard", "dark", "high-contrast", "low-light"].includes(value)) setThemePresetState(value as ArenaThemePreset);
      if (value === "dark" || value === "high-contrast" || value === "low-light") setColorSchemeState("dark");
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    applyScheme(colorScheme, themePreset);
    void safeSetItem(THEME_PRESET_STORAGE_KEY, themePreset);
  }, [applyScheme, colorScheme, themePreset]);

  const palette = paletteForPreset(colorScheme, themePreset);
  const themeVariables = useMemo(
    () => vars({
      "color-primary": palette.primary,
      "color-background": palette.background,
      "color-surface": palette.surface,
      "color-foreground": palette.foreground,
      "color-muted": palette.muted,
      "color-border": palette.border,
      "color-success": palette.success,
      "color-warning": palette.warning,
      "color-error": palette.error,
    }),
    [palette],
  );

  const value = useMemo(() => ({ colorScheme, themePreset, setColorScheme, setThemePreset }), [colorScheme, setColorScheme, setThemePreset, themePreset]);
  return <ThemeContext.Provider value={value}><View style={[{ flex: 1 }, themeVariables]}>{children}</View></ThemeContext.Provider>;
}

export function useThemeContext(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useThemeContext must be used within ThemeProvider");
  return ctx;
}
