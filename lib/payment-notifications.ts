import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import { clampPaymentNotificationSettings, type PaymentNotificationSettings } from "@/shared/monetization-analytics";

let configured = false;

async function ensureChannel() {
  if (Platform.OS !== "android") return;
  await Notifications.setNotificationChannelAsync("billing-recovery", {
    name: "Billing recovery",
    importance: Notifications.AndroidImportance.DEFAULT,
    vibrationPattern: [0, 180],
    lightColor: "#D7AA58",
  });
}

export async function requestPaymentNotificationPermission() {
  if (Platform.OS === "web") return false;
  await ensureChannel();
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

export function configurePaymentNotifications() {
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

export async function notifyPaymentFailure(settings: PaymentNotificationSettings, body = "Your Sensei Pro payment needs attention. Open the app to update your billing details.") {
  const safeSettings = clampPaymentNotificationSettings(settings);
  if (Platform.OS === "web" || !safeSettings.enabled || safeSettings.unsubscribed) return false;
  const allowed = await requestPaymentNotificationPermission();
  if (!allowed) return false;
  await Notifications.scheduleNotificationAsync({
    content: { title: "Payment needs attention", body, data: { screen: "/upgrade", eventType: "payment_failed" } },
    trigger: null,
  });
  return true;
}
