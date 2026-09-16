import { Animated, Text, View } from "react-native";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { arenaTokens } from "@/constants/arena-tokens";

export function ArenaFeedback({ tone = "success", title, message }: { tone?: "success" | "warning" | "error"; title: string; message: string }) {
  const entrance = useRef(new Animated.Value(0)).current;
  const reducedMotion = useReducedMotion();
  useEffect(() => { if (reducedMotion) { entrance.setValue(1); return; } Animated.timing(entrance, { toValue: 1, duration: arenaTokens.motion.card, useNativeDriver: true }).start(); }, [entrance, reducedMotion]);
  const palette = tone === "error" ? { backgroundColor: arenaTokens.color.errorSurface, borderColor: "#CC2200", title: "#9B2414", body: "#7B3428" } : tone === "warning" ? { backgroundColor: "#F7F0E2", borderColor: arenaTokens.color.brassMuted, title: "#8B5A2B", body: "#7B6B5A" } : { backgroundColor: arenaTokens.color.successSurface, borderColor: "#2E6A59", title: "#2E6A59", body: "#4B6258" };
  return <Animated.View accessibilityRole="alert" style={{ opacity: entrance, transform: [{ translateY: entrance.interpolate({ inputRange: [0, 1], outputRange: [6, 0] }) }], borderRadius: arenaTokens.radius.lg, borderWidth: 1, borderColor: palette.borderColor, backgroundColor: palette.backgroundColor, padding: arenaTokens.spacing.lg }}><Text style={{ color: palette.title, fontSize: 14, fontWeight: "800" }}>{title}</Text><Text style={{ color: palette.body, fontSize: 13, lineHeight: 19, marginTop: 5 }}>{message}</Text></Animated.View>;
}
