---
name: daily-stats-sync
time: "07:00"
days: "daily"
model: "haiku"
active: "true"
notify: "on_finish"
timeout: "15m"
retry: 1
---

You are running as a scheduled job for Agentic OS.

## Task: Daily NBA/NHL/MLB Stats Sync

Run the daily stats sync script that pulls game data, player stats, and opening lines for NBA, NHL, and MLB into the BetBro database.

## Steps

1. **Check for lock file before running:**
   ```bash
   LOCKFILE="/tmp/betbro-stats-sync.lock"
   if [ -f "$LOCKFILE" ]; then
     AGE=$(( $(date +%s) - $(stat -f %m "$LOCKFILE") ))
     if [ "$AGE" -lt 900 ]; then
       echo "SKIP: sync already running (lock age: ${AGE}s)"
       exit 0
     else
       echo "WARN: stale lock (${AGE}s old), removing"
       rm "$LOCKFILE"
     fi
   fi
   echo $$ > "$LOCKFILE"
   ```
   If the lock is under 15 minutes old, skip this run. If stale (>15m), remove it and proceed.

2. **Run the sync script:**
   ```bash
   bash /Users/jamespalmquist/PycharmProjects/propread-web/sync-daily-stats.sh
   ```

3. **Remove lock file:**
   ```bash
   rm -f /tmp/betbro-stats-sync.lock
   ```

4. **Verify success:**
   - Check the exit code. If non-zero, report which step failed.
   - The script handles: new player discovery (NBA), NBA stat sync, game record creation, opening line seeding (NBA + NHL), database deployment to propread-web, MLB sync, and git commit/push.

5. **Report summary:**
   - Which sports synced successfully
   - Any errors or warnings from the script output
