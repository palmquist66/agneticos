"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Send, Loader2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/lib/types/trends";

const SUGGESTED_QUESTIONS = [
  "How is my weight trending this week?",
  "Am I hitting my protein goals?",
  "When do I usually get side effects?",
  "What patterns do you see in my data?",
];

export function AIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Abort any in-flight stream on unmount
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  async function sendMessage(text: string) {
    if (!text.trim() || isStreaming) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text.trim(),
    };
    const assistantMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "",
    };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setInput("");
    setIsStreaming(true);
    setShowDisclaimer(false);

    try {
      // Abort previous stream if still running
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      const history = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
        signal: controller.signal,
      });

      if (!res.ok) {
        throw new Error("Failed to get response");
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                accumulated += parsed.text;
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    ...updated[updated.length - 1],
                    content: accumulated,
                  };
                  return updated;
                });
              }
            } catch {
              // Skip malformed chunks
            }
          }
        }
      }
    } catch (err) {
      // Don't show error if we intentionally aborted
      if (err instanceof DOMException && err.name === "AbortError") return;
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          content: "Sorry, I couldn't process that request. Please try again.",
        };
        return updated;
      });
    } finally {
      abortRef.current = null;
      setIsStreaming(false);
      inputRef.current?.focus();
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
          Ask AI
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Medical disclaimer */}
        {showDisclaimer && messages.length === 0 && (
          <div className="mb-3 flex gap-2 rounded-lg bg-warning-bg p-2.5 text-[10px] text-warning">
            <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
            <span>
              AI responses are for informational purposes only and do not
              constitute medical advice. Always consult your healthcare provider.
            </span>
          </div>
        )}

        {/* Chat messages */}
        <div
          ref={scrollRef}
          className={cn(
            "space-y-3 overflow-y-auto",
            messages.length > 0 ? "mb-3 max-h-64" : ""
          )}
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "text-xs",
                msg.role === "user"
                  ? "ml-8 rounded-lg bg-primary px-3 py-2 text-primary-foreground"
                  : "mr-8 rounded-lg bg-muted px-3 py-2"
              )}
            >
              {msg.content || (
                <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
              )}
            </div>
          ))}
        </div>

        {/* Suggested questions (only when no messages) */}
        {messages.length === 0 && (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {SUGGESTED_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                className="rounded-full bg-muted px-2.5 py-1 text-[10px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(input);
          }}
          className="flex gap-2"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your data..."
            disabled={isStreaming}
            className="flex-1 rounded-lg border bg-background px-3 py-1.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || isStreaming}
          >
            {isStreaming ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
