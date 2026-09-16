import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import type { AiNotificationSettings } from "@/shared/ai-notification-settings";
import { shouldNotifyForQueueEvent } from "@/shared/ai-notification-settings";

let configured = false;

async function ensureNotificationChannel() {
  if (Platform.OS !== "android") return;
  await Notifications.setNotificationChannelAsync("sensei-recovery", {
    name: "Sensei recovery",
    importance: Notifications.AndroidImportance.DEFAULT,
    vibrationPattern: [0, 180],
    lightColor: "#D7AA58",
  });
}

export async function requestAiNotificationPermission() {
  if (Platform.OS === "web") return false;
  await ensureNotificationChannel();
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

export function configureAiNotifications() {
  if (configured || Platform.OS === "web") return;
  configured = true;
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
}

export async function notifyAiQueueEvent(
  type: string,
  message: string,
  settings: AiNotificationSettings,
) {
  if (Platform.OS === "web" || !shouldNotifyForQueueEvent(type, settings)) return false;
  const allowed = await requestAiNotificationPermission();
  if (!allowed) return false;
  await Notifications.scheduleNotificationAsync({
    content: {
      title: type === "completed" ? "Sensei finished" : "Sensei retry needs attention",
      body: message,
      data: { screen: "/ai-lab", eventType: type },
    },
    trigger: null,
  });
  return true;
}
