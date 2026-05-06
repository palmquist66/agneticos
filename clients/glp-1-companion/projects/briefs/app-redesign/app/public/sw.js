/// <reference lib="webworker" />

// ─── Push Event ──────────────────────────────────────────

self.addEventListener("push", (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const { title, body, tag, icon, data: payload } = data;

  event.waitUntil(
    self.registration.showNotification(title || "GLP-1 Companion", {
      body: body || "Time to take your medication",
      tag: tag || "med-reminder",
      icon: icon || "/logo-mark.png",
      badge: "/logo-mark.png",
      renotify: true,
      data: payload || {},
      actions: [
        { action: "mark-taken", title: "Mark as Taken" },
        { action: "snooze", title: "Snooze 15min" },
      ],
    })
  );
});

// ─── Notification Click ──────────────────────────────────

self.addEventListener("notificationclick", (event) => {
  const notification = event.notification;
  const action = event.action;
  const payload = notification.data || {};

  notification.close();

  if (action === "mark-taken" && payload.actionToken) {
    event.waitUntil(
      fetch("/api/notifications/mark-taken", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: payload.actionToken }),
      })
        .then((res) => {
          if (res.ok) {
            return self.registration.showNotification("GLP-1 Companion", {
              body: `${payload.medName || "Medication"} marked as taken`,
              tag: "med-confirmed",
              icon: "/logo-mark.png",
              silent: true,
            });
          }
        })
        .catch(() => {
          // If fetch fails, open the app so user can log manually
          return self.clients.openWindow("/today");
        })
    );
    return;
  }

  if (action === "snooze" && payload.actionToken) {
    event.waitUntil(
      fetch("/api/notifications/snooze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: payload.actionToken }),
      }).catch(() => {
        // Snooze failed silently — notification will come on next cron cycle
      })
    );
    return;
  }

  // Default: tap notification body → open app
  event.waitUntil(
    self.clients.matchAll({ type: "window" }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes("/today") && "focus" in client) {
          return client.focus();
        }
      }
      return self.clients.openWindow("/today");
    })
  );
});
