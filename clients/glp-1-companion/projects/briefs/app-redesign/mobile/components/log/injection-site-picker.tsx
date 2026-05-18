import { View, Text, Pressable, useColorScheme } from "react-native";
import * as Haptics from "expo-haptics";
import { Colors } from "@/constants/colors";

const SITES = [
  { value: "left_arm", label: "L Arm" },
  { value: "right_arm", label: "R Arm" },
  { value: "left_abdomen", label: "L Abdomen" },
  { value: "right_abdomen", label: "R Abdomen" },
  { value: "left_thigh", label: "L Thigh" },
  { value: "right_thigh", label: "R Thigh" },
] as const;

export type InjectionSiteValue = (typeof SITES)[number]["value"];

function formatTimeAgo(date: Date): string {
  const days = Math.floor(
    (Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24)
  );
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  return `${days}d ago`;
}

export function InjectionSitePicker({
  value,
  onChange,
  recommended,
  recentSites,
}: {
  value: InjectionSiteValue | null;
  onChange: (site: InjectionSiteValue) => void;
  recommended?: InjectionSiteValue | null;
  recentSites?: { site: string; loggedAt: Date }[];
}) {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  const lastUsedMap = new Map<string, Date>();
  recentSites?.forEach((s) => {
    if (!lastUsedMap.has(s.site)) lastUsedMap.set(s.site, s.loggedAt);
  });

  // Render as 2-column grid using rows
  const rows = [SITES.slice(0, 2), SITES.slice(2, 4), SITES.slice(4, 6)];

  return (
    <View>
      <Text
        style={{
          fontSize: 14,
          fontFamily: "Inter-Medium",
          color: colors.mutedForeground,
          marginBottom: 8,
        }}
      >
        Injection site
      </Text>
      <View style={{ gap: 8 }}>
        {rows.map((row, rowIndex) => (
          <View key={rowIndex} style={{ flexDirection: "row", gap: 8 }}>
            {row.map((site) => {
              const isSelected = value === site.value;
              const isRecommended = recommended === site.value;
              const lastUsed = lastUsedMap.get(site.value);

              return (
                <Pressable
                  key={site.value}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    onChange(site.value);
                  }}
                  style={{
                    flex: 1,
                    alignItems: "center",
                    gap: 2,
                    borderRadius: 12,
                    borderWidth: isSelected ? 2 : 1,
                    borderColor: isSelected ? colors.primary : colors.border,
                    backgroundColor: isSelected ? colors.secondary : colors.card,
                    padding: 12,
                  }}
                >
                  {isRecommended && !isSelected && (
                    <View
                      style={{
                        position: "absolute",
                        top: -8,
                        right: 8,
                        backgroundColor: colors.successBg,
                        borderRadius: 10,
                        paddingHorizontal: 6,
                        paddingVertical: 2,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 10,
                          fontFamily: "Inter-Medium",
                          color: colors.success,
                        }}
                      >
                        Next
                      </Text>
                    </View>
                  )}
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: "Inter-Medium",
                      color: colors.foreground,
                    }}
                  >
                    {site.label}
                  </Text>
                  {lastUsed && (
                    <Text
                      style={{
                        fontSize: 11,
                        fontFamily: "Inter",
                        color: colors.mutedForeground,
                      }}
                    >
                      {formatTimeAgo(lastUsed)}
                    </Text>
                  )}
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}
