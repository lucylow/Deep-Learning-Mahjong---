import { Pressable, Text, View } from "react-native";

export function QueryErrorState({ message = "We could not load this data.", onRetry, compact = false }: { message?: string; onRetry?: () => void; compact?: boolean }) {
  return (
    <View accessibilityRole="alert" style={{ borderRadius: 16, borderWidth: 1, borderColor: "#B87843", backgroundColor: "#FDE9E4", padding: compact ? 10 : 14 }}>
      <Text style={{ color: "#8E3D2E", fontSize: 13, lineHeight: 19 }}>{message}</Text>
      {onRetry ? <Pressable accessibilityRole="button" accessibilityLabel="Retry loading data" onPress={onRetry} style={({ pressed }) => ({ alignSelf: "flex-start", marginTop: 9, borderRadius: 10, backgroundColor: "#8E3D2E", paddingHorizontal: 11, paddingVertical: 8, opacity: pressed ? 0.72 : 1 })}><Text style={{ color: "#FFFFFF", fontSize: 12, fontWeight: "800" }}>Retry</Text></Pressable> : null}
    </View>
  );
}
