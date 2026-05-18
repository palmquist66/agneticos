import { useRef, useCallback } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import type { AppColors } from "@/constants/colors";

interface Props {
  colors: AppColors;
}

const LOG_OPTIONS = [
  { label: "Weight", icon: "⚖️", route: "/log/weight" as const },
  { label: "Glucose", icon: "🩸", route: "/log/glucose" as const },
  { label: "GLP-1 Dose", icon: "💉", route: "/log/glp1-dose" as const },
  { label: "Meal (Photo)", icon: "📸", route: "/log/meal-photo" as const },
  { label: "Meal (Text)", icon: "🍽️", route: "/log/meal-text" as const },
  { label: "Recipe", icon: "📝", route: "/log/recipe" as const },
  { label: "Side Effect", icon: "⚠️", route: "/log/side-effect" as const },
];

export function FABSheet({ colors }: Props) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const router = useRouter();

  const handleOpen = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    bottomSheetRef.current?.expand();
  }, []);

  const handleSelect = useCallback(
    (route: string) => {
      bottomSheetRef.current?.close();
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      router.push(route as any);
    },
    [router]
  );

  return (
    <>
      {/* FAB Button */}
      <Pressable
        onPress={handleOpen}
        style={{
          position: "absolute",
          bottom: 100,
          right: 20,
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: colors.accent,
          justifyContent: "center",
          alignItems: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <Text style={{ fontSize: 28, color: colors.accentForeground, marginTop: -2 }}>
          +
        </Text>
      </Pressable>

      {/* Bottom Sheet */}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={["50%"]}
        enablePanDownToClose
        backgroundStyle={{
          backgroundColor: colors.card,
          borderRadius: 24,
        }}
        handleIndicatorStyle={{
          backgroundColor: colors.muted,
          width: 40,
        }}
      >
        <BottomSheetView style={{ padding: 20, gap: 8 }}>
          <Text
            style={{
              fontSize: 18,
              fontFamily: "Poppins-SemiBold",
              color: colors.foreground,
              marginBottom: 8,
            }}
          >
            Log Entry
          </Text>

          {LOG_OPTIONS.map((option) => (
            <Pressable
              key={option.route}
              onPress={() => handleSelect(option.route)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 14,
                paddingHorizontal: 12,
                borderRadius: 12,
                gap: 12,
              }}
            >
              <Text style={{ fontSize: 20 }}>{option.icon}</Text>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: "Inter-Medium",
                  color: colors.foreground,
                }}
              >
                {option.label}
              </Text>
            </Pressable>
          ))}
        </BottomSheetView>
      </BottomSheet>
    </>
  );
}
