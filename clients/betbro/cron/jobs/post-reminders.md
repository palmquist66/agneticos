---
name: post-reminders
time: "11:50,15:50,17:50"
days: "daily"
model: "haiku"
active: "true"
notify: "on_finish"
timeout: "5m"
retry: 0
---

You are running as a scheduled job for Agentic OS.

## Task: Post Reminder

Send a notification reminding the user to post on social media.

## Steps

1. Check what time it is right now (use the system clock).
2. Read today's daily posts file at `projects/briefs/betbro-beta-growth/{YYYY-MM-DD}_daily-posts.md`.
3. Based on the current time, identify which post is coming up next:
   - 11:50 → the noon post
   - 15:50 → the 4-5pm post
   - 17:50 → the 5-6pm post
4. Output a short reminder with the post content ready to copy:

```
POSTING REMINDER — [Platform] post in 10 minutes

[The full post text, ready to copy-paste]

Post to: [X / Instagram]
```

Keep it short. Just the reminder and the content. Nothing else.
