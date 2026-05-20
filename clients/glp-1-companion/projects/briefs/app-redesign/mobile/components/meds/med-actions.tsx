import { useState } from "react";
import { View, Text, Pressable, ActivityIndicator, Alert } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { api } from "@/lib/api";
import type { AppColors } from "@/constants/colors";

interface Props {
  scheduleId: string;
  active: boolean;
  colors: AppColors;
}

export function MedActions({ scheduleId, active, colors }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDeactivate = () => {
    Alert.alert(
      "Deactivate Medication",
      "This will remove it from your daily schedule. You can reactivate it later.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Deactivate",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            try {
              await api(`/api/meds/${scheduleId}/deactivate`, {
                method: "POST",
              });
              await Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success
              );
              router.back();
            } catch {
              Alert.alert("Error", "Failed to deactivate medication");
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleReactivate = async () => {
    setLoading(true);
    try {
      await api(`/api/meds/${scheduleId}/reactivate`, {
        method: "POST",
      });
      await Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Success
      );
      router.back();
    } catch {
      Alert.alert("Error", "Failed to reactivate medication");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ marginTop: 4 }}>
      {active ? (
        <Pressable
          onPress={handleDeactivate}
          disabled={loading}
          style={{
            borderWidth: 1,
            borderColor: colors.error,
            borderRadius: 12,
            paddingVertical: 14,
            alignItems: "center",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? (
            <ActivityIndicator color={colors.error} />
          ) : (
            <Text
              style={{
                fontSize: 15,
                fontFamily: "Inter-SemiBold",
                color: colors.error,
              }}
            >
              Deactivate Medication
            </Text>
          )}
        </Pressable>
      ) : (
        <Pressable
          onPress={handleReactivate}
          disabled={loading}
          style={{
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 12,
            paddingVertical: 14,
            alignItems: "center",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? (
            <ActivityIndicator color={colors.foreground} />
          ) : (
            <Text
              style={{
                fontSize: 15,
                fontFamily: "Inter-SemiBold",
                color: colors.foreground,
              }}
            >
              Reactivate Medication
            </Text>
          )}
        </Pressable>
      )}
    </View>
  );
}
