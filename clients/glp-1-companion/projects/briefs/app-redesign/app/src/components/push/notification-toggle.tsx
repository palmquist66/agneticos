"use client";

import { useEffect, useState, useTransition } from "react";
import { Bell, BellOff, Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  isPushSupported,
  getPermissionState,
  registerServiceWorker,
  subscribeToPush,
  unsubscribeFromPush,
} from "@/lib/push";
import { savePushSubscription, removePushSubscription } from "@/app/(app)/profile/push-actions";

export function NotificationToggle() {
  const [supported, setSupported] = useState(true);
  const [enabled, setEnabled] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">("default");
  const [mounted, setMounted] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setMounted(true);
    if (!isPushSupported()) {
      setSupported(false);
      return;
    }
    setPermission(getPermissionState());

    // Check if already subscribed
    navigator.serviceWorker.ready.then((reg) => {
      reg.pushManager.getSubscription().then((sub) => {
        setEnabled(!!sub);
      });
    });
  }, []);

  if (!mounted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Medication Reminders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-10 animate-pulse rounded-lg bg-muted" />
        </CardContent>
      </Card>
    );
  }

  if (!supported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Medication Reminders</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Push notifications are not supported in this browser. On iOS, add this app to your home
            screen first.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (permission === "denied") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Medication Reminders</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Notifications are blocked. Enable them in your browser settings to receive medication
            reminders.
          </p>
        </CardContent>
      </Card>
    );
  }

  async function handleToggle() {
    startTransition(async () => {
      const registration = await registerServiceWorker();
      if (!registration) return;

      if (enabled) {
        // Disable
        const sub = await registration.pushManager.getSubscription();
        if (sub) {
          await removePushSubscription(sub.endpoint);
          await unsubscribeFromPush(registration);
        }
        setEnabled(false);
      } else {
        // Enable
        const sub = await subscribeToPush(registration);
        if (!sub) return;

        const keys = sub.toJSON().keys!;
        await savePushSubscription({
          endpoint: sub.endpoint,
          p256dh: keys.p256dh!,
          auth: keys.auth!,
          userAgent: navigator.userAgent,
        });
        setEnabled(true);
        setPermission(getPermissionState());
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Medication Reminders</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-3 text-sm text-muted-foreground">
          Get push notifications when it&apos;s time to take your scheduled medications.
        </p>
        <button
          onClick={handleToggle}
          disabled={isPending}
          className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
            enabled
              ? "bg-muted text-muted-foreground hover:bg-muted/80"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          }`}
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : enabled ? (
            <BellOff className="h-4 w-4" />
          ) : (
            <Bell className="h-4 w-4" />
          )}
          {isPending ? "Updating..." : enabled ? "Disable Reminders" : "Enable Reminders"}
        </button>
      </CardContent>
    </Card>
  );
}
