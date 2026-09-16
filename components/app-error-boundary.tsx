import React from "react";
import { Platform, Pressable, Text, View } from "react-native";
import { toUserErrorMessage } from "@/shared/error-utils";

type Props = { children: React.ReactNode };
type State = { error: Error | null };

export class AppErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    if (__DEV__) console.error("Mahjong Arena render error", error, info.componentStack);
  }

  handleRetry = () => this.setState({ error: null });

  handleReset = () => {
    this.setState({ error: null });
    if (Platform.OS !== "web" || typeof window === "undefined") return;
    window.location.assign("/");
  };

  render() {
    if (!this.state.error) return this.props.children;
    const message = toUserErrorMessage(this.state.error, "The screen could not be rendered.");
    return (
      <View style={{ flex: 1, justifyContent: "center", padding: 24, backgroundColor: "#08080E" }}>
        <Text style={{ color: "#D4AF70", fontSize: 12, fontWeight: "800", letterSpacing: 1.4 }}>MAHJONG ARENA RECOVERY</Text>
        <Text accessibilityRole="alert" style={{ color: "#F5F0E8", fontSize: 28, fontWeight: "800", marginTop: 10 }}>Something went wrong.</Text>
        <Text style={{ color: "#B9C8BD", fontSize: 15, lineHeight: 22, marginTop: 10 }}>The app caught a screen error instead of showing a blank screen. Retry first; reset the route if the problem persists.</Text>
        {__DEV__ ? <Text selectable style={{ color: "#FFB4A5", fontSize: 12, lineHeight: 18, marginTop: 16 }}>{message}</Text> : null}
        <View style={{ flexDirection: "row", gap: 10, marginTop: 24 }}>
          <Pressable accessibilityRole="button" accessibilityLabel="Retry screen" onPress={this.handleRetry} style={({ pressed }) => ({ flex: 1, padding: 14, borderRadius: 14, backgroundColor: "#B8955A", opacity: pressed ? 0.75 : 1 })}>
            <Text style={{ color: "#08080E", textAlign: "center", fontWeight: "800" }}>Retry</Text>
          </Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel="Reset app route" onPress={this.handleReset} style={({ pressed }) => ({ flex: 1, padding: 14, borderRadius: 14, borderWidth: 1, borderColor: "#B8955A", opacity: pressed ? 0.75 : 1 })}>
            <Text style={{ color: "#D4AF70", textAlign: "center", fontWeight: "800" }}>Reset route</Text>
          </Pressable>
        </View>
      </View>
    );
  }
}
