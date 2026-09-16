import { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import { PlatformPressable } from "@react-navigation/elements";
import { Platform } from "react-native";
import { haptic } from "@/lib/haptics";
import { shouldHapticTabPress } from "@/lib/haptics-utils";

export function HapticTab(props: BottomTabBarButtonProps) {
  return (
    <PlatformPressable
      {...props}
      onPressIn={(ev) => {
        if (shouldHapticTabPress(Platform.OS)) {
          // Add a soft haptic feedback when pressing down on the tabs.
          haptic.light();
        }
        props.onPressIn?.(ev);
      }}
    />
  );
}
