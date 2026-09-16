import { useEffect, useState } from "react";
import { Platform, Text, View } from "react-native";

export function ConnectivityBanner() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    if (Platform.OS !== "web" || typeof window === "undefined") return;
    const update = () => setOffline(window.navigator.onLine === false);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  if (!offline) return null;
  return <View accessibilityRole="alert" style={{ backgroundColor: "#8E3D2E", paddingHorizontal: 16, paddingVertical: 9 }}><Text style={{ color: "#FFFFFF", textAlign: "center", fontSize: 12, fontWeight: "700" }}>You are offline. Saved local history remains available; AI and server actions will retry when you reconnect.</Text></View>;
}
