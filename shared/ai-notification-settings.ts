export type AiNotificationSettings = {
  retryCompleted: boolean;
  retryFailed: boolean;
};

export const DEFAULT_AI_NOTIFICATION_SETTINGS: AiNotificationSettings = {
  retryCompleted: true,
  retryFailed: true,
};

export const clampAiNotificationSettings = (
  value: Partial<AiNotificationSettings> | null | undefined,
): AiNotificationSettings => ({
  retryCompleted: value?.retryCompleted ?? DEFAULT_AI_NOTIFICATION_SETTINGS.retryCompleted,
  retryFailed: value?.retryFailed ?? DEFAULT_AI_NOTIFICATION_SETTINGS.retryFailed,
});

export const shouldNotifyForQueueEvent = (
  type: "completed" | "retry_failed" | string,
  settings: AiNotificationSettings,
) => (type === "completed" ? settings.retryCompleted : type === "retry_failed" ? settings.retryFailed : false);

export const notificationSettingSummary = (settings: AiNotificationSettings) =>
  `${settings.retryCompleted ? "Completion alerts on" : "Completion alerts off"} · ${settings.retryFailed ? "Failure alerts on" : "Failure alerts off"}`;
