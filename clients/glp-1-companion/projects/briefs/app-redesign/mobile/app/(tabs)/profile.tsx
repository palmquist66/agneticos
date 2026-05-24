import { useEffect, useState } from "react";
import { View, Text, Pressable, ScrollView, ActivityIndicator, useColorScheme } from "react-native";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/colors";
import { NotificationToggle } from "@/components/profile/notification-toggle";
import { HealthTargetsCard } from "@/components/profile/health-targets-card";
import { unregisterPushNotifications } from "@/lib/notifications";
import { api } from "@/lib/api";

interface UserTargets {
  goalWeight: number | null;
  proteinTarget: number | null;
  glucoseMin: number | null;
  glucoseMax: number | null;
}

export default function ProfileScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const { signOut } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  const [targets, setTargets] = useState<UserTargets | null>(null);
  const [loadingTargets, setLoadingTargets] = useState(true);

  useEffect(() => {
    api<UserTargets>("/api/user")
      .then((data) => {
        setTargets({
          goalWeight: data.goalWeight,
          proteinTarget: data.proteinTarget,
          glucoseMin: data.glucoseMin,
          glucoseMax: data.glucoseMax,
        });
      })
      .catch(() => {
        setTargets({ goalWeight: null, proteinTarget: null, glucoseMin: null, glucoseMax: null });
      })
      .finally(() => setLoadingTargets(false));
  }, []);

  const handleSignOut = async () => {
    await unregisterPushNotifications();
    await signOut();
    router.replace("/sign-in");
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 32 }}
    >
      {/* User info card */}
      <View
        style={{
          backgroundColor: colors.card,
          borderRadius: 16,
          padding: 20,
          borderWidth: 1,
          borderColor: colors.border,
          alignItems: "center",
          gap: 8,
        }}
      >
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: colors.secondary,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 24,
              fontFamily: "Poppins-Bold",
              color: colors.primary,
            }}
          >
            {user?.firstName?.[0] || user?.emailAddresses[0]?.emailAddress[0]?.toUpperCase() || "?"}
          </Text>
        </View>
        <Text
          style={{
            fontSize: 18,
            fontFamily: "Poppins-SemiBold",
            color: colors.foreground,
          }}
        >
          {user?.fullName || "User"}
        </Text>
        <Text
          style={{
            fontSize: 14,
            fontFamily: "Inter",
            color: colors.mutedForeground,
          }}
        >
          {user?.emailAddresses[0]?.emailAddress}
        </Text>
      </View>

      {/* Health Targets card */}
      {loadingTargets ? (
        <View
          style={{
            backgroundColor: colors.card,
            borderRadius: 16,
            padding: 20,
            borderWidth: 1,
            borderColor: colors.border,
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      ) : targets ? (
        <HealthTargetsCard
          goalWeight={targets.goalWeight}
          proteinTarget={targets.proteinTarget}
          glucoseMin={targets.glucoseMin}
          glucoseMax={targets.glucoseMax}
          onUpdate={(data) => setTargets(data)}
        />
      ) : null}

      {/* Notification toggle */}
      <NotificationToggle />

      {/* Sign out button */}
      <Pressable
        onPress={handleSignOut}
        style={{
          backgroundColor: colors.card,
          borderRadius: 12,
          paddingVertical: 16,
          alignItems: "center",
          borderWidth: 1,
          borderColor: colors.destructive,
          marginTop: 16,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontFamily: "Inter-SemiBold",
            color: colors.destructive,
          }}
        >
          Sign Out
        </Text>
      </Pressable>
    </ScrollView>
  );
}
