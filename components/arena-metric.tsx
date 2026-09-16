import { Animated, Text, View } from "react-native";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { arenaTokens } from "@/constants/arena-tokens";

export function ArenaMetric({ label, value, suffix = "", progress }: { label: string; value: number | string; suffix?: string; progress?: number }) {
  const entrance = useRef(new Animated.Value(0)).current;
  const reducedMotion = useReducedMotion();
  useEffect(() => { if (reducedMotion) { entrance.setValue(1); return; } entrance.setValue(0); Animated.timing(entrance, { toValue: 1, duration: arenaTokens.motion.card, useNativeDriver: true }).start(); }, [entrance, reducedMotion, value]);
  const normalized = Math.max(0, Math.min(1, progress ?? 0));
  return <Animated.View accessibilityLabel={`${label}: ${value}${suffix}`} style={{ flex: 1, opacity: entrance, transform: [{ translateY: entrance.interpolate({ inputRange: [0, 1], outputRange: [4, 0] }) }], borderRadius: arenaTokens.radius.lg, backgroundColor: "#E4F0E9", padding: arenaTokens.spacing.md }}><Text style={{ color: "#567266", fontSize: 11, textTransform: "uppercase" }}>{label}</Text><Text style={{ color: "#17211F", fontSize: 20, fontWeight: "800", marginTop: 4 }}>{value}{suffix}</Text><View style={{ height: 5, marginTop: 9, overflow: "hidden", borderRadius: 999, backgroundColor: "rgba(46,106,89,0.14)" }}><View style={{ width: `${Math.round(normalized * 100)}%`, height: "100%", borderRadius: 999, backgroundColor: "#2E6A59" }} /></View></Animated.View>;
}
