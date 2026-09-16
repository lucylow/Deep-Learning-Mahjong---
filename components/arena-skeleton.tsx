import { Animated, View } from "react-native";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { arenaTokens } from "@/constants/arena-tokens";

export function ArenaSkeleton({ lines = 2 }: { lines?: number }) {
  const shimmer = useRef(new Animated.Value(0.55)).current;
  const reducedMotion = useReducedMotion();
  useEffect(() => {
    if (reducedMotion) { shimmer.setValue(0.55); return; }
    const loop = Animated.loop(Animated.sequence([Animated.timing(shimmer, { toValue: 0.95, duration: 700, useNativeDriver: true }), Animated.timing(shimmer, { toValue: 0.55, duration: 700, useNativeDriver: true })]));
    loop.start();
    return () => loop.stop();
  }, [reducedMotion, shimmer]);
  return (
    <Animated.View accessibilityLabel="Loading content" accessibilityRole="progressbar" style={{ opacity: shimmer, borderRadius: arenaTokens.radius.lg, padding: arenaTokens.spacing.lg, backgroundColor: "rgba(255,255,255,0.04)", borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" }}>
      <View style={{ width: "38%", height: 10, borderRadius: arenaTokens.radius.pill, backgroundColor: "rgba(212,175,112,0.28)" }} />
      {Array.from({ length: lines }).map((_, index) => <View key={index} style={{ width: index === lines - 1 ? "66%" : "92%", height: 12, marginTop: 12, borderRadius: arenaTokens.radius.pill, backgroundColor: "rgba(255,255,255,0.09)" }} />)}
    </Animated.View>
  );
}
