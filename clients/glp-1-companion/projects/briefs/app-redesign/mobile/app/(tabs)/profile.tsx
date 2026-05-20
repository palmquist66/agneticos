import { View, Text, Pressable, useColorScheme } from "react-native";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/colors";

export default function ProfileScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const { signOut } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.replace("/sign-in");
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        padding: 16,
        gap: 16,
      }}
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

      {/* Placeholder sections */}
      <View
        style={{
          backgroundColor: colors.card,
          borderRadius: 16,
          padding: 20,
          borderWidth: 1,
          borderColor: colors.border,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontFamily: "Poppins-SemiBold",
            color: colors.foreground,
          }}
        >
          Health Targets
        </Text>
        <Text
          style={{
            fontSize: 14,
            fontFamily: "Inter",
            color: colors.mutedForeground,
            marginTop: 4,
          }}
        >
          Goal weight, glucose targets, and more — coming in Phase 7
        </Text>
      </View>

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
          marginTop: "auto",
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
    </View>
  );
}
