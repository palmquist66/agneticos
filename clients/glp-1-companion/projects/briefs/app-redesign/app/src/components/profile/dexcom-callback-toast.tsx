"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";

export function DexcomCallbackToast() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dexcomStatus = searchParams.get("dexcom");

  useEffect(() => {
    if (!dexcomStatus) return;

    switch (dexcomStatus) {
      case "connected":
        toast.success("Dexcom connected!", {
          description: "Syncing your glucose readings now. This may take a moment.",
        });
        break;
      case "denied":
        toast.info("Dexcom connection cancelled", {
          description: "You can connect anytime from this page.",
        });
        break;
      case "error": {
        const reason = searchParams.get("reason");
        const messages: Record<string, string> = {
          missing_params: "OAuth response was incomplete. Please try again.",
          invalid_state: "Security check failed. Please try connecting again.",
          exchange_failed: "Could not complete sign-in. Please try again.",
        };
        toast.error("Connection failed", {
          description: messages[reason || ""] || "Something went wrong. Please try again.",
        });
        break;
      }
    }

    // Clean up URL params
    router.replace("/profile", { scroll: false });
  }, [dexcomStatus, searchParams, router]);

  return null;
}
