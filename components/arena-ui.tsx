import { Pressable, Text, View, type PressableProps, type ViewProps } from "react-native";
import { arenaTokens } from "@/constants/arena-tokens";

type ArenaCardProps = ViewProps & { title?: string; eyebrow?: string; tone?: "surface" | "jade" | "paper" };

export function ArenaCard({ title, eyebrow, tone = "surface", children, style, ...props }: ArenaCardProps) {
  const backgroundColor = tone === "jade" ? arenaTokens.color.jadeSurface : tone === "paper" ? arenaTokens.color.paper : "rgba(255,255,255,0.04)";
  return <View {...props} style={[{ borderRadius: arenaTokens.radius.xl, padding: arenaTokens.spacing.lg, backgroundColor, borderWidth: 1, borderColor: tone === "jade" ? "#2E6A59" : tone === "paper" ? arenaTokens.color.paperBorder : "rgba(255,255,255,0.08)" }, style]}>{eyebrow ? <Text style={{ color: tone === "paper" ? arenaTokens.color.brassMuted : arenaTokens.color.brass, fontSize: arenaTokens.type.eyebrow, fontWeight: "800", letterSpacing: 1.4, textTransform: "uppercase" }}>{eyebrow}</Text> : null}{title ? <Text style={{ color: tone === "paper" ? arenaTokens.color.ink : arenaTokens.color.ivory, fontSize: arenaTokens.type.title, fontWeight: "800", marginTop: eyebrow ? 6 : 0 }}>{title}</Text> : null}{children}</View>;
}

type ArenaButtonProps = PressableProps & { label: string; variant?: "brass" | "jade" | "ghost" };

export function ArenaButton({ label, variant = "brass", style, ...props }: ArenaButtonProps) {
  const colors = variant === "brass" ? { backgroundColor: arenaTokens.color.brass, color: arenaTokens.color.ink, borderColor: arenaTokens.color.brass } : variant === "jade" ? { backgroundColor: arenaTokens.color.successSurface, color: "#2E6A59", borderColor: "#2E6A59" } : { backgroundColor: "transparent", color: arenaTokens.color.brass, borderColor: "rgba(212,175,112,0.4)" };
  return <Pressable {...props} accessibilityRole={props.accessibilityRole ?? "button"} accessibilityLabel={props.accessibilityLabel ?? label} style={(state) => [{ minHeight: 44, borderRadius: arenaTokens.radius.md, borderWidth: 1, borderColor: colors.borderColor, backgroundColor: colors.backgroundColor, paddingHorizontal: arenaTokens.spacing.lg, paddingVertical: arenaTokens.spacing.md, alignItems: "center", justifyContent: "center", opacity: state.pressed ? 0.72 : 1 }, typeof style === "function" ? style(state) : style]}><Text style={{ color: colors.color, fontWeight: "800", fontSize: 13 }}>{label}</Text></Pressable>;
}
