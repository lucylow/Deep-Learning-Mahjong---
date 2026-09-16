import type { PropsWithChildren, ReactElement } from "react";
import { View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollOffset,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/use-colors";

const HEADER_HEIGHT = 250;

type Props = PropsWithChildren<{
  headerImage: ReactElement;
  headerBackgroundColor?: string;
}>;

/**
 * A scroll view with parallax header effect.
 * Note: Animated components require style objects for dynamic animations.
 */
export default function ParallaxScrollView({
  children,
  headerImage,
  headerBackgroundColor,
}: Props) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollOffset(scrollRef);

  const headerHeight = HEADER_HEIGHT + insets.top;

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          scrollOffset.value,
          [-headerHeight, 0, headerHeight],
          [-headerHeight / 2, 0, headerHeight * 0.75],
        ),
      },
      {
        scale: interpolate(scrollOffset.value, [-headerHeight, 0, headerHeight], [2, 1, 1]),
      },
    ],
  }));

  return (
    <Animated.ScrollView
      ref={scrollRef}
      style={{ backgroundColor: colors.background, flex: 1 }}
      contentContainerStyle={{
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
      scrollEventThrottle={16}
    >
      <Animated.View
        style={[
          {
            overflow: "hidden",
            backgroundColor: headerBackgroundColor ?? colors.primary,
            height: headerHeight,
            paddingTop: insets.top,
          },
          headerAnimatedStyle,
        ]}
      >
        {headerImage}
      </Animated.View>
      <View className="flex-1 p-8 gap-4 overflow-hidden bg-background">
        {children}
      </View>
    </Animated.ScrollView>
  );
}
