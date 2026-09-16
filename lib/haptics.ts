import { Platform } from "react-native";
import * as Haptics from "expo-haptics";
import { canUseHaptics } from "@/lib/haptics-utils";

export type HapticImpact = Haptics.ImpactFeedbackStyle;

export function triggerHapticImpact(
  style: HapticImpact = Haptics.ImpactFeedbackStyle.Light,
  enabled = true,
): void {
  if (!canUseHaptics(Platform.OS, enabled)) return;
  void Haptics.impactAsync(style).catch(() => undefined);
}

export const haptic = {
  selection: () => {
    if (!canUseHaptics(Platform.OS)) return;
    void Haptics.selectionAsync().catch(() => undefined);
  },
  success: () => {
    if (!canUseHaptics(Platform.OS)) return;
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
  },
  error: () => {
    if (!canUseHaptics(Platform.OS)) return;
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => undefined);
  },
  light: () => triggerHapticImpact(),
};
