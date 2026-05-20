import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { Platform } from "react-native";
import { api } from "./api";
import { router } from "expo-router";

// ─── Foreground display config ────────────────────────────

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// ─── Registration ─────────────────────────────────────────

export async function registerForPushNotifications(): Promise<boolean> {
  if (!Device.isDevice) {
    console.warn("Push notifications require a physical device");
    return false;
  }

  const { status: existing } = await Notifications.getPermissionsAsync();
  let finalStatus = existing;

  if (existing !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    return false;
  }

  const projectId = Constants.expoConfig?.extra?.eas?.projectId;
  const tokenData = await Notifications.getExpoPushTokenAsync({
    projectId,
  });

  // Register token with backend
  await api("/api/notifications/device-token", {
    method: "POST",
    body: JSON.stringify({
      token: tokenData.data,
      platform: Platform.OS as "ios" | "android",
    }),
  });

  return true;
}

export async function unregisterPushNotifications(): Promise<void> {
  try {
    const projectId = Constants.expoConfig?.extra?.eas?.projectId;
    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId,
    });

    await api("/api/notifications/device-token", {
      method: "DELETE",
      body: JSON.stringify({ token: tokenData.data }),
    });
  } catch {
    // Best-effort — token may already be removed or permission denied
  }
}

// ─── iOS Notification Categories ──────────────────────────

export async function setupNotificationCategories(): Promise<void> {
  if (Platform.OS !== "ios") return;

  await Notifications.setNotificationCategoryAsync("medication-reminder", [
    {
      identifier: "MARK_TAKEN",
      buttonTitle: "Mark as Taken",
      options: { opensAppToForeground: false },
    },
    {
      identifier: "SNOOZE_15",
      buttonTitle: "Snooze 15min",
      options: { opensAppToForeground: false },
    },
  ]);
}

// ─── Response Handler ─────────────────────────────────────

export async function handleNotificationResponse(
  response: Notifications.NotificationResponse
): Promise<void> {
  const data = response.notification.request.content.data as {
    actionToken?: string;
    scheduleId?: string;
  };

  const actionId = response.actionIdentifier;

  if (actionId === "MARK_TAKEN" && data.actionToken) {
    try {
      await api("/api/notifications/mark-taken", {
        method: "POST",
        body: JSON.stringify({ token: data.actionToken }),
      });
    } catch (err) {
      console.error("Failed to mark as taken:", err);
    }
    return;
  }

  if (actionId === "SNOOZE_15" && data.actionToken) {
    try {
      await api("/api/notifications/snooze", {
        method: "POST",
        body: JSON.stringify({ token: data.actionToken }),
      });
    } catch (err) {
      console.error("Failed to snooze:", err);
    }
    return;
  }

  // Default tap — navigate to Today tab
  if (actionId === Notifications.DEFAULT_ACTION_IDENTIFIER) {
    router.navigate("/(tabs)/today");
  }
}

// ─── Permission Status ────────────────────────────────────

export async function getNotificationPermissionStatus(): Promise<
  "granted" | "denied" | "undetermined"
> {
  const { status } = await Notifications.getPermissionsAsync();
  if (status === "granted") return "granted";
  if (status === "denied") return "denied";
  return "undetermined";
}
