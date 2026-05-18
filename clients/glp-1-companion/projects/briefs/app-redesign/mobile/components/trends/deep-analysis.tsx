import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  useColorScheme,
} from "react-native";
import { Colors } from "@/constants/colors";
import { apiStream } from "@/lib/api";

export function DeepAnalysis() {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const [result, setResult] = useState("");
  const [expanded, setExpanded] = useState(true);
  const abortRef = useRef(false);

  useEffect(() => {
    return () => {
      abortRef.current = true;
    };
  }, []);

  const runAnalysis = async () => {
    setStatus("loading");
    setResult("");
    setExpanded(true);
    abortRef.current = false;

    try {
      const stream = apiStream("/api/ai/deep-analysis", {
        method: "POST",
      });

      let accumulated = "";

      for await (const chunk of stream) {
        if (abortRef.current) break;

        const lines = chunk.split("\n");
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const payload = line.slice(6).trim();
          if (payload === "[DONE]") continue;

          try {
            const parsed = JSON.parse(payload);
            if (parsed.text) {
              accumulated += parsed.text;
              setResult(accumulated);
            }
          } catch {
            // Skip malformed SSE lines
          }
        }
      }
    } catch {
      setResult("Sorry, an error occurred during analysis. Please try again.");
    } finally {
      setStatus("done");
    }
  };

  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: colors.border,
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
        Deep Analysis
      </Text>

      {status === "idle" && (
        <>
          <Text
            style={{
              fontSize: 13,
              fontFamily: "Inter",
              color: colors.mutedForeground,
              marginBottom: 12,
              lineHeight: 19,
            }}
          >
            Get a comprehensive AI analysis of your weight trends, glucose
            patterns, nutrition, medication effects, and personalized
            recommendations.
          </Text>
          <Pressable
            onPress={runAnalysis}
            style={{
              backgroundColor: colors.primary,
              borderRadius: 12,
              paddingVertical: 12,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Inter-Medium",
                color: colors.primaryForeground,
              }}
            >
              Run Full Analysis
            </Text>
          </Pressable>
        </>
      )}

      {status === "loading" && (
        <View style={{ alignItems: "center", paddingVertical: 24, gap: 12 }}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text
            style={{
              fontSize: 13,
              fontFamily: "Inter",
              color: colors.mutedForeground,
            }}
          >
            Analyzing your data...
          </Text>
        </View>
      )}

      {status === "done" && result && (
        <>
          <Pressable
            onPress={() => setExpanded(!expanded)}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: expanded ? 8 : 0,
            }}
          >
            <Text
              style={{
                fontSize: 13,
                fontFamily: "Inter-Medium",
                color: colors.foreground,
              }}
            >
              Analysis Results
            </Text>
            <Text
              style={{ fontSize: 14, color: colors.mutedForeground }}
            >
              {expanded ? "\u25B2" : "\u25BC"}
            </Text>
          </Pressable>

          {expanded && (
            <View
              style={{
                backgroundColor: colors.muted,
                borderRadius: 8,
                padding: 12,
                marginBottom: 12,
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: "Inter",
                  color: colors.foreground,
                  lineHeight: 20,
                }}
              >
                {result}
              </Text>
            </View>
          )}

          <Pressable
            onPress={runAnalysis}
            style={{
              backgroundColor: colors.muted,
              borderRadius: 12,
              paddingVertical: 10,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 13,
                fontFamily: "Inter-Medium",
                color: colors.foreground,
              }}
            >
              Re-analyze
            </Text>
          </Pressable>
        </>
      )}
    </View>
  );
}
