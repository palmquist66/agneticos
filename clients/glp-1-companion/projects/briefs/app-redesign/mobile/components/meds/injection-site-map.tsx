import { View, Text } from "react-native";
import type { AppColors } from "@/constants/colors";

interface InjectionSiteEntry {
  id: string;
  site: string;
  loggedAt: string;
}

interface Props {
  sites: InjectionSiteEntry[];
  colors: AppColors;
}

const SITE_LABELS: Record<string, string> = {
  left_arm: "Left Arm",
  right_arm: "Right Arm",
  left_abdomen: "Left Abdomen",
  right_abdomen: "Right Abdomen",
  left_thigh: "Left Thigh",
  right_thigh: "Right Thigh",
};

const SITES = Object.keys(SITE_LABELS);

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(dateStr));
}

export function InjectionSiteMap({ sites, colors }: Props) {
  if (sites.length === 0) {
    return (
      <View
        style={{
          backgroundColor: colors.card,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: colors.border,
          padding: 16,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontFamily: "Poppins-SemiBold",
            color: colors.foreground,
            marginBottom: 8,
          }}
        >
          Injection Sites
        </Text>
        <Text
          style={{
            fontSize: 13,
            fontFamily: "Inter",
            color: colors.mutedForeground,
          }}
        >
          Track injection site rotation after logging your first GLP-1 dose.
        </Text>
      </View>
    );
  }

  // Count usage per site
  const siteCounts: Record<string, number> = {};
  for (const entry of sites) {
    siteCounts[entry.site] = (siteCounts[entry.site] || 0) + 1;
  }

  const lastUsed = sites[0]?.site;
  const suggestedSite = SITES.filter((s) => s !== lastUsed).sort(
    (a, b) => (siteCounts[a] || 0) - (siteCounts[b] || 0)
  )[0];

  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 16,
      }}
    >
      <Text
        style={{
          fontSize: 16,
          fontFamily: "Poppins-SemiBold",
          color: colors.foreground,
          marginBottom: 12,
        }}
      >
        Injection Sites
      </Text>

      {/* 2-column grid of sites */}
      <View style={{ gap: 8 }}>
        {[0, 1, 2].map((row) => (
          <View key={row} style={{ flexDirection: "row", gap: 8 }}>
            {SITES.slice(row * 2, row * 2 + 2).map((site) => {
              const count = siteCounts[site] || 0;
              const isLast = site === lastUsed;
              const isSuggested = site === suggestedSite;

              return (
                <View
                  key={site}
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                    borderRadius: 10,
                    padding: 10,
                    gap: 8,
                    backgroundColor: isLast
                      ? colors.secondary
                      : isSuggested
                      ? colors.successBg
                      : colors.muted,
                    borderWidth: isLast || isSuggested ? 1 : 0,
                    borderColor: isLast
                      ? colors.primary
                      : isSuggested
                      ? colors.success
                      : "transparent",
                  }}
                >
                  <View
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 6,
                      backgroundColor: isLast
                        ? colors.primary
                        : isSuggested
                        ? colors.success
                        : count > 0
                        ? colors.mutedForeground
                        : "transparent",
                      borderWidth: count === 0 && !isLast && !isSuggested ? 1 : 0,
                      borderColor: colors.mutedForeground,
                    }}
                  />
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 12,
                        fontFamily: "Inter-Medium",
                        color: colors.foreground,
                      }}
                    >
                      {SITE_LABELS[site]}
                    </Text>
                    <Text
                      style={{
                        fontSize: 11,
                        fontFamily: "Inter",
                        color: colors.mutedForeground,
                      }}
                    >
                      {count} {count === 1 ? "use" : "uses"}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        ))}
      </View>

      {/* Legend */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          gap: 16,
          marginTop: 12,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: colors.primary,
            }}
          />
          <Text
            style={{
              fontSize: 11,
              fontFamily: "Inter",
              color: colors.mutedForeground,
            }}
          >
            Last
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: colors.success,
            }}
          />
          <Text
            style={{
              fontSize: 11,
              fontFamily: "Inter",
              color: colors.mutedForeground,
            }}
          >
            Suggested
          </Text>
        </View>
      </View>

      {/* Recent entries */}
      <View style={{ marginTop: 12, gap: 6 }}>
        <Text
          style={{
            fontSize: 12,
            fontFamily: "Inter-Medium",
            color: colors.mutedForeground,
          }}
        >
          Recent
        </Text>
        {sites.slice(0, 5).map((entry) => (
          <View
            key={entry.id}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                fontSize: 13,
                fontFamily: "Inter",
                color: colors.foreground,
              }}
            >
              {SITE_LABELS[entry.site] || entry.site}
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontFamily: "Inter",
                color: colors.mutedForeground,
              }}
            >
              {formatDate(entry.loggedAt)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
