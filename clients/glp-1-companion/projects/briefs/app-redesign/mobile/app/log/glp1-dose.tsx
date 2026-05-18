import { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, useColorScheme, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { api } from "@/lib/api";
import { Colors } from "@/constants/colors";
import { InjectionSitePicker, type InjectionSiteValue } from "@/components/log/injection-site-picker";

type UserProfile = {
  glp1Med: string | null;
  glp1Dosage: string | null;
};

export default function LogGLP1DoseScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const router = useRouter();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [site, setSite] = useState<InjectionSiteValue | null>(null);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await api<UserProfile>("/api/user");
        setProfile(data);
      } catch {
        setError("Failed to load medication info");
      } finally {
        setProfileLoading(false);
      }
    })();
  }, []);

  const handleSave = async () => {
    if (!site) {
      setError("Please select an injection site");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await api("/api/log/glp1-dose", {
        method: "POST",
        body: JSON.stringify({ site, notes: notes || undefined }),
      });
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  if (profileLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  if (!profile?.glp1Med) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: "center", alignItems: "center", padding: 24 }}>
        <Text style={{ fontSize: 18, fontFamily: "Poppins-SemiBold", color: colors.foreground, textAlign: "center" }}>
          No GLP-1 Medication
        </Text>
        <Text style={{ fontSize: 14, fontFamily: "Inter", color: colors.mutedForeground, textAlign: "center", marginTop: 8 }}>
          Set up your GLP-1 medication in your Profile to log doses.
        </Text>
        <Pressable
          onPress={() => router.back()}
          style={{
            marginTop: 24,
            backgroundColor: colors.primary,
            borderRadius: 12,
            paddingVertical: 14,
            paddingHorizontal: 32,
          }}
        >
          <Text style={{ fontSize: 16, fontFamily: "Inter-SemiBold", color: colors.primaryForeground }}>
            Go Back
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, padding: 24, gap: 20 }}>
      <Text style={{ fontSize: 24, fontFamily: "Poppins-Bold", color: colors.foreground }}>
        Log GLP-1 Dose
      </Text>

      {/* Current medication info */}
      <View
        style={{
          backgroundColor: colors.secondary,
          borderRadius: 12,
          padding: 16,
          gap: 4,
        }}
      >
        <Text style={{ fontSize: 16, fontFamily: "Inter-SemiBold", color: colors.foreground }}>
          {profile.glp1Med}
        </Text>
        <Text style={{ fontSize: 14, fontFamily: "Inter", color: colors.mutedForeground }}>
          {profile.glp1Dosage || "Dosage not set"}
        </Text>
      </View>

      {/* Injection site picker */}
      <InjectionSitePicker
        value={site}
        onChange={setSite}
      />

      {/* Notes */}
      <View style={{ gap: 8 }}>
        <Text style={{ fontSize: 14, fontFamily: "Inter-Medium", color: colors.mutedForeground }}>
          Notes (optional)
        </Text>
        <TextInput
          value={notes}
          onChangeText={setNotes}
          placeholder="Any notes..."
          placeholderTextColor={colors.mutedForeground}
          multiline
          style={{
            backgroundColor: colors.card,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 12,
            fontSize: 16,
            fontFamily: "Inter",
            color: colors.foreground,
            minHeight: 80,
            textAlignVertical: "top",
          }}
        />
      </View>

      {error ? (
        <Text style={{ fontSize: 14, fontFamily: "Inter", color: colors.error, textAlign: "center" }}>
          {error}
        </Text>
      ) : null}

      <Pressable
        onPress={handleSave}
        disabled={loading || !site}
        style={{
          backgroundColor: colors.primary,
          borderRadius: 12,
          paddingVertical: 16,
          alignItems: "center",
          opacity: loading || !site ? 0.6 : 1,
          marginTop: "auto",
        }}
      >
        {loading ? (
          <ActivityIndicator color={colors.primaryForeground} />
        ) : (
          <Text style={{ fontSize: 16, fontFamily: "Inter-SemiBold", color: colors.primaryForeground }}>
            Save Dose
          </Text>
        )}
      </Pressable>
    </View>
  );
}
