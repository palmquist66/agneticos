import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Switch,
  Pressable,
  Linking,
  ActivityIndicator,
  useColorScheme,
} from "react-native";
import { Colors } from "@/constants/colors";
import {
  getNotificationPermissionStatus,
  registerForPushNotifications,
  unregisterPushNotifications,
} from "@/lib/notifications";

type PermissionState = "granted" | "denied" | "undetermined" | "loading";

export function NotificationToggle() {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const [status, setStatus] = useState<PermissionState>("loading");
  const [toggling, setToggling] = useState(false);

  const checkStatus = useCallback(async () => {
    const perm = await getNotificationPermissionStatus();
    setStatus(perm);
  }, []);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  const handleToggle = async (value: boolean) => {
    setToggling(true);
    try {
      if (value) {
        const granted = await registerForPushNotifications();
        setStatus(granted ? "granted" : "denied");
      } else {
        await unregisterPushNotifications();
        setStatus("undetermined");
      }
    } catch {
      // Recheck actual status on error
      await checkStatus();
    } finally {
      setToggling(false);
    }
  };

  const openSettings = () => {
    Linking.openSettings();
  };

  if (status === "loading") {
    return (
      <View
        style={{
          backgroundColor: colors.card,
          borderRadius: 16,
          padding: 20,
          borderWidth: 1,
          borderColor: colors.border,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontFamily: "Poppins-SemiBold",
            color: colors.foreground,
          }}
        >
          Notifications
        </Text>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  }

  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: colors.border,
        gap: 8,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontFamily: "Poppins-SemiBold",
            color: colors.foreground,
          }}
        >
          Notifications
        </Text>
        {status !== "denied" ? (
          <Switch
            value={status === "granted"}
            onValueChange={handleToggle}
            disabled={toggling}
            trackColor={{ false: colors.muted, true: colors.primary }}
            thumbColor={colors.primaryForeground}
          />
        ) : null}
      </View>

      {status === "undetermined" && (
        <Text
          style={{
            fontSize: 14,
            fontFamily: "Inter",
            color: colors.mutedForeground,
          }}
        >
          Get medication reminders with quick action buttons
        </Text>
      )}

      {status === "granted" && (
        <Text
          style={{
            fontSize: 14,
            fontFamily: "Inter",
            color: colors.mutedForeground,
          }}
        >
          Medication reminders are active
        </Text>
      )}

      {status === "denied" && (
        <>
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Inter",
              color: colors.mutedForeground,
            }}
          >
            Notifications are blocked. Enable them in Settings to get medication
            reminders.
          </Text>
          <Pressable onPress={openSettings}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Inter-SemiBold",
                color: colors.primary,
                marginTop: 4,
              }}
            >
              Open Settings
            </Text>
          </Pressable>
        </>
      )}
    </View>
  );
}
