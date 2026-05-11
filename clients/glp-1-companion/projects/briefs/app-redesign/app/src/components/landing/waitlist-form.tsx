"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";

type FormStatus = "idle" | "submitting" | "success" | "duplicate" | "invalid" | "error";

export function WaitlistForm({ variant = "default" }: { variant?: "default" | "dark" }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("submitting");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();
      setStatus(data.status as FormStatus);
    } catch {
      setStatus("error");
    }
  }

  if (status === "success" || status === "duplicate") {
    return (
      <div className={`flex items-center gap-3 rounded-2xl px-5 py-4 ${
        variant === "dark"
          ? "bg-white/10 text-white"
          : "bg-[#EAF5F3] text-[#0F5F5A]"
      }`}>
        <div className={`flex size-8 shrink-0 items-center justify-center rounded-full ${
          variant === "dark" ? "bg-white/20" : "bg-[#0F5F5A]/10"
        }`}>
          <Check className="size-4" />
        </div>
        <p className="text-sm font-medium">
          {status === "success"
            ? "You\u2019re on the list. We\u2019ll email you when beta opens."
            : "You\u2019re already on the list. We\u2019ll be in touch."}
        </p>
      </div>
    );
  }

  const isDark = variant === "dark";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
      <div className="relative flex-1">
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === "invalid" || status === "error") setStatus("idle");
          }}
          placeholder="you@email.com"
          required
          className={`h-12 w-full rounded-xl px-4 text-[15px] outline-none transition-shadow placeholder:text-opacity-40 sm:h-14 sm:rounded-2xl sm:text-base ${
            isDark
              ? "bg-white/10 text-white placeholder:text-white/40 focus:ring-2 focus:ring-white/30"
              : "border border-[#0F5F5A]/12 bg-white text-[#07302E] shadow-sm placeholder:text-[#6F6A5C] focus:ring-2 focus:ring-[#0F5F5A]/20"
          } ${
            status === "invalid" || status === "error"
              ? isDark
                ? "ring-2 ring-[#FF8A6A]/60"
                : "ring-2 ring-[#C0392B]/30"
              : ""
          }`}
        />
        {(status === "invalid" || status === "error") && (
          <p className={`mt-1.5 text-xs ${isDark ? "text-[#FF8A6A]" : "text-[#C0392B]"}`}>
            {status === "invalid"
              ? "That doesn\u2019t look like an email address."
              : "Something went wrong. Try again."}
          </p>
        )}
      </div>
      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#FF8A6A] px-6 text-[15px] font-semibold text-white shadow-sm transition-all hover:bg-[#F56A48] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF8A6A]/50 focus-visible:ring-offset-2 disabled:opacity-70 sm:h-14 sm:rounded-2xl sm:px-8 sm:text-base"
      >
        {status === "submitting" ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <>
            Join the Beta
            <ArrowRight className="size-4" />
          </>
        )}
      </button>
    </form>
  );
}
