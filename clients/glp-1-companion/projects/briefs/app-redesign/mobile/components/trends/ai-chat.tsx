import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
} from "react-native";
import { Colors } from "@/constants/colors";
import { apiStream } from "@/lib/api";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const SUGGESTED_QUESTIONS = [
  "How's my weight trend?",
  "Am I hitting my protein goals?",
  "When do my side effects peak?",
  "What should I focus on?",
];

const DISCLAIMER =
  "This AI assistant uses your logged data to provide insights. It is not a medical professional — always consult your healthcare provider for medical decisions.";

export function AIChat() {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const abortRef = useRef(false);

  useEffect(() => {
    return () => {
      abortRef.current = true;
    };
  }, []);

  const scrollToBottom = () => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || streaming) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: text.trim(),
    };

    const assistantMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: "",
    };

    const updatedMessages = [...messages, userMsg];
    setMessages([...updatedMessages, assistantMsg]);
    setInput("");
    setStreaming(true);
    scrollToBottom();

    abortRef.current = false;

    try {
      const apiMessages = updatedMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const stream = apiStream("/api/ai/chat", {
        method: "POST",
        body: JSON.stringify({ messages: apiMessages }),
      });

      let accumulated = "";

      for await (const chunk of stream) {
        if (abortRef.current) break;

        // Parse SSE lines
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const payload = line.slice(6).trim();
          if (payload === "[DONE]") continue;

          try {
            const parsed = JSON.parse(payload);
            if (parsed.text) {
              accumulated += parsed.text;
              setMessages((prev) => {
                const updated = [...prev];
                const last = updated[updated.length - 1];
                if (last?.role === "assistant") {
                  updated[updated.length - 1] = {
                    ...last,
                    content: accumulated,
                  };
                }
                return updated;
              });
              scrollToBottom();
            }
          } catch {
            // Skip malformed SSE lines
          }
        }
      }
    } catch (err) {
      setMessages((prev) => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        if (last?.role === "assistant" && !last.content) {
          updated[updated.length - 1] = {
            ...last,
            content: "Sorry, something went wrong. Please try again.",
          };
        }
        return updated;
      });
    } finally {
      setStreaming(false);
    }
  };

  const showSuggestions = messages.length === 0;

  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border,
        overflow: "hidden",
      }}
    >
      <View style={{ padding: 16, paddingBottom: 0 }}>
        <Text
          style={{
            fontSize: 16,
            fontFamily: "Poppins-SemiBold",
            color: colors.foreground,
          }}
        >
          AI Health Assistant
        </Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={100}
      >
        <ScrollView
          ref={scrollRef}
          style={{ maxHeight: 350, padding: 16 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Disclaimer */}
          <View
            style={{
              backgroundColor: colors.infoBg,
              borderRadius: 8,
              padding: 10,
              marginBottom: 12,
            }}
          >
            <Text
              style={{
                fontSize: 11,
                fontFamily: "Inter",
                color: colors.info,
                lineHeight: 16,
              }}
            >
              {DISCLAIMER}
            </Text>
          </View>

          {/* Suggested questions */}
          {showSuggestions && (
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
              {SUGGESTED_QUESTIONS.map((q) => (
                <Pressable
                  key={q}
                  onPress={() => sendMessage(q)}
                  style={{
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor: colors.border,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    backgroundColor: colors.muted,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: "Inter",
                      color: colors.foreground,
                    }}
                  >
                    {q}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}

          {/* Messages */}
          {messages.map((msg) => (
            <View
              key={msg.id}
              style={{
                alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                maxWidth: "85%",
                marginBottom: 8,
              }}
            >
              <View
                style={{
                  backgroundColor:
                    msg.role === "user" ? colors.primary : colors.muted,
                  borderRadius: 16,
                  borderBottomRightRadius: msg.role === "user" ? 4 : 16,
                  borderBottomLeftRadius: msg.role === "assistant" ? 4 : 16,
                  padding: 12,
                }}
              >
                {msg.content ? (
                  <Text
                    style={{
                      fontSize: 13,
                      fontFamily: "Inter",
                      color:
                        msg.role === "user"
                          ? colors.primaryForeground
                          : colors.foreground,
                      lineHeight: 19,
                    }}
                  >
                    {msg.content}
                  </Text>
                ) : (
                  <ActivityIndicator size="small" color={colors.mutedForeground} />
                )}
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Input */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 12,
            gap: 8,
            borderTopWidth: 1,
            borderTopColor: colors.border,
          }}
        >
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Ask about your data..."
            placeholderTextColor={colors.mutedForeground}
            editable={!streaming}
            onSubmitEditing={() => sendMessage(input)}
            returnKeyType="send"
            style={{
              flex: 1,
              backgroundColor: colors.muted,
              borderRadius: 20,
              paddingHorizontal: 16,
              paddingVertical: 10,
              fontSize: 14,
              fontFamily: "Inter",
              color: colors.foreground,
            }}
          />
          <Pressable
            onPress={() => sendMessage(input)}
            disabled={!input.trim() || streaming}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor:
                input.trim() && !streaming ? colors.primary : colors.muted,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 18,
                color:
                  input.trim() && !streaming
                    ? colors.primaryForeground
                    : colors.mutedForeground,
              }}
            >
              {"\u2191"}
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
