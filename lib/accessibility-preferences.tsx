import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";
import { normalizeAccessibilityPreferences } from "@/shared/preference-utils";
import { safeGetItem, safeSetItem } from "@/shared/storage-utils";

const STORAGE_KEY = "mahjong.accessibility.preferences";

type AccessibilityPreferences = {
  highContrast: boolean;
  largeTiles: boolean;
  reducedMotion: boolean;
  hapticsEnabled: boolean;
  confirmBeforeDiscard: boolean;
  setHighContrast: (enabled: boolean) => void;
  setLargeTiles: (enabled: boolean) => void;
  setReducedMotion: (enabled: boolean) => void;
  setHapticsEnabled: (enabled: boolean) => void;
  setConfirmBeforeDiscard: (enabled: boolean) => void;
};

const AccessibilityContext = createContext<AccessibilityPreferences | null>(null);

export function AccessibilityPreferencesProvider({ children }: PropsWithChildren) {
  const [highContrast, setHighContrast] = useState(false);
  const [largeTiles, setLargeTiles] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [confirmBeforeDiscard, setConfirmBeforeDiscard] = useState(false);

  useEffect(() => {
    safeGetItem(STORAGE_KEY).then((value) => {
      if (!value) return;
      try {
        const parsed = normalizeAccessibilityPreferences(JSON.parse(value));
        setHighContrast(parsed.highContrast);
        setLargeTiles(parsed.largeTiles);
        setReducedMotion(parsed.reducedMotion);
        setHapticsEnabled(parsed.hapticsEnabled);
        setConfirmBeforeDiscard(parsed.confirmBeforeDiscard);
      } catch {
        // Ignore malformed local preferences and keep accessible defaults.
      }
    });
  }, []);

  useEffect(() => {
    void safeSetItem(STORAGE_KEY, JSON.stringify({ highContrast, largeTiles, reducedMotion, hapticsEnabled, confirmBeforeDiscard }));
  }, [highContrast, largeTiles, reducedMotion, hapticsEnabled, confirmBeforeDiscard]);

  const value = useMemo(() => ({ highContrast, largeTiles, reducedMotion, hapticsEnabled, confirmBeforeDiscard, setHighContrast, setLargeTiles, setReducedMotion, setHapticsEnabled, setConfirmBeforeDiscard }), [highContrast, largeTiles, reducedMotion, hapticsEnabled, confirmBeforeDiscard]);
  return <AccessibilityContext.Provider value={value}>{children}</AccessibilityContext.Provider>;
}

export function useAccessibilityPreferences() {
  const context = useContext(AccessibilityContext);
  if (!context) throw new Error("useAccessibilityPreferences must be used within AccessibilityPreferencesProvider");
  return context;
}
