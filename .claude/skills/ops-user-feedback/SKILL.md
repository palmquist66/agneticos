---
name: ops-user-feedback
description: >
  Track and manage user feedback, bugs, and feature requests in a local markdown log.
  Use this skill whenever the user mentions feedback, bugs, feature requests, UX issues,
  or wants to see what's open. Triggers on: "log feedback", "bug:", "feature request:",
  "show feedback", "feedback status", "mark #N fixed", "sync feedback", "feedback stats",
  "what bugs are open", "user feedback", "log issue", "found a bug", "users are saying",
  "got a text about", "someone reported". Also triggers when the user describes a problem
  they found while using the app and wants to track it. Does NOT trigger for: general
  project management, sprint planning, or roadmap discussions.
---

# User Feedback Tracker

Centralizes feedback from all sources — self-discovered bugs, user texts, Google Sheet
entries, and in-session fixes — into a single markdown log. The log is the source of
truth. If it's not in the log, it didn't happen.

## Outcome

- `projects/ops-feedback/feedback-log.md` — running feedback log (markdown table)
- Quick capture with auto-assigned ID, timestamp, category, and priority
- Triage views filtered by status, category, or priority
- Status lifecycle: new → triaged → in-progress → fixed → verified → closed
- Stats on open vs closed, category breakdown, resolution trends

## Context Needs

| File | Load level | Purpose |
|------|-----------|---------|
| `projects/ops-feedback/feedback-log.md` | full | The feedback log itself — read before any operation |
| `context/learnings.md` | `## ops-user-feedback` section only | Past feedback on this skill's performance |

## Step 0: Initialize the Log

If `projects/ops-feedback/feedback-log.md` doesn't exist, create it:

```markdown
# Feedback Log

> Source of truth for all user feedback, bugs, and feature requests.
> Updated by the ops-user-feedback skill. Don't edit manually unless you know the format.

| ID | Date | Source | Category | Priority | Status | Description | Resolution |
|----|------|--------|----------|----------|--------|-------------|------------|
```

If it already exists, read it and parse the current state (highest ID, open item count).

## Step 1: Detect the Operation

Based on what the user said, route to the right action:

| User says | Action |
|-----------|--------|
| "log feedback: ...", "bug: ...", "feature request: ...", "found a bug", "users are saying...", "got a text about..." | **Capture** (Step 2) |
| "show feedback", "feedback status", "what's open", "what bugs are open" | **Triage View** (Step 3) |
| "mark #N fixed: ...", "mark #N closed", "#N is done" | **Status Update** (Step 4) |
| "sync from sheet", "import feedback" | **Google Sheet Bridge** (Step 5) |
| "feedback stats", "feedback trends" | **Stats** (Step 6) |

## Step 2: Capture Feedback

Parse the user's message and extract:

1. **Description** — the actual feedback text
2. **Source** — infer from context:
   - User says "I found..." or describes using the app → `self-discovered`
   - User says "got a text..." or "user said..." or "someone reported..." → `user-reported`
   - User says "from the sheet" or during sync → `google-sheet`
   - Default: `self-discovered` (most common for this user)
3. **Category** — infer from keywords:
   - Crashes, errors, broken, doesn't work → `bug`
   - Slow, loading, timeout, performance → `performance`
   - Confusing, hard to find, layout, flow → `ux`
   - "Would be nice if", "should be able to", "add a..." → `feature-request`
   - Text, copy, labels, wording → `content`
   - If ambiguous, pick the best fit — don't ask
4. **Priority** — auto-suggest based on signals:
   - Crashes, data loss, can't use the app → `critical`
   - Broken feature, wrong results → `high`
   - Annoyances, minor UX issues → `medium`
   - Nice-to-haves, cosmetic → `low`

**Auto-increment the ID** from the highest existing ID in the log. First item is #1.

**Append the row** to the feedback log table. Format:

```
| {ID} | {YYYY-MM-DD} | {source} | {category} | {priority} | new | {description} | — |
```

**Confirm to the user** with a one-liner:

> Logged #14 — bug (high): "Search results don't update when switching players"

Don't ask for confirmation before logging. Log it, show the summary, let the user
correct if needed. Speed matters more than ceremony here.

**Batch capture:** If the user dumps multiple items at once ("here's a few things..."),
parse each one as a separate entry. Assign sequential IDs. Show a summary table of
everything logged.

## Step 3: Triage View

Read the full log, then display a filtered view. Default: all open items (status is
not `fixed`, `verified`, or `closed`), sorted by priority (critical first).

**Default output format:**

```
## Open Feedback — {N} items

### Critical ({n})
- #3 [bug] Search crashes on special characters — new

### High ({n})
- #7 [bug] Player stats show yesterday's data — in-progress
- #12 [feature-request] Add prop comparison view — triaged

### Medium ({n})
- #1 [ux] Onboarding flow skips step 2 on mobile — new
- #9 [content] "Confidence score" label confuses users — new

### Low ({n})
- #5 [feature-request] Dark mode — new
```

**Filters** — if the user asks for specific views:
- "show bugs" → filter category = bug
- "what's in progress" → filter status = in-progress
- "high priority items" → filter priority = high
- "feedback from last week" → filter by date range
- Combine filters: "show open bugs" → status is open AND category is bug

## Step 4: Status Update

When the user says something like "mark #12 fixed: refactored the query component":

1. Find the row with that ID
2. Update the status column
3. If resolution notes provided, update the Resolution column
4. If no resolution notes and status is `fixed`, ask for a one-liner (but don't block on it)

**Status transitions:**
- `new` → `triaged` (acknowledged, will address)
- `triaged` → `in-progress` (actively working on it)
- `in-progress` → `fixed` (code change made)
- `fixed` → `verified` (confirmed working)
- `verified` → `closed` (done)
- Any status → `closed` (skip ahead — sometimes you just close things)
- Any status → `won't-fix` (decided not to address, add reason in Resolution)

**Shorthand:** The user can skip statuses. "Mark #5 fixed" jumps straight to fixed
regardless of current status. Don't enforce strict linear progression.

**Implicit updates:** If you're in a dev session and the user just fixed something that
matches an open feedback item, proactively say: "#7 looks like it's related to what you
just fixed — want me to mark it fixed?" Don't auto-close without asking.

## Step 5: Google Sheet Bridge

When the user says "sync from sheet" or provides a Google Sheet URL:

1. Use WebFetch to read the sheet (must be published or shared as "anyone with link")
2. Parse the rows — map columns to feedback fields as best as possible
3. Show a preview: "Found 8 items in the sheet. Here's how I'd import them: [table]"
4. Wait for confirmation before appending to the log
5. Assign new IDs continuing from the highest existing ID
6. Mark source as `google-sheet` for all imported items

If the sheet isn't accessible, explain: "I can't read that sheet — it needs to be
published to web or shared as 'anyone with link can view'. Want to try a different URL,
or paste the data directly?"

This is a bridge for existing data, not the ongoing workflow. After import, the local
log is the source of truth.

## Step 6: Stats and Trends

Read the full log and compute:

```
## Feedback Stats

**Overview:** {total} items total — {open} open, {closed} closed/verified/won't-fix

**By Category:**
- Bug: {n} ({n} open)
- Feature Request: {n} ({n} open)
- UX: {n} ({n} open)
- Performance: {n} ({n} open)
- Content: {n} ({n} open)

**By Priority:**
- Critical: {n} open
- High: {n} open
- Medium: {n} open
- Low: {n} open

**Resolution Rate:** {n}% of all items resolved
**Most Common Category:** {category} ({n} items)

**Recent Activity:**
- Last 7 days: {n} opened, {n} closed
- Last 30 days: {n} opened, {n} closed
```

If there's enough data (10+ items), add a **Themes** section that groups related items
and flags recurring patterns: "3 items mention search performance — might be worth a
dedicated fix sprint."

## Step 7: Session Integration

When this skill is invoked at session start (or the user asks "what's open"):

1. Read the feedback log
2. If there are critical or high-priority open items, surface them: "You have 2 high-priority bugs open: #7 (player stats stale) and #3 (search crash). Want to tackle any of these?"
3. If working on code that relates to an open item, mention it: "This area touches #9 (confusing confidence label) — want to address that while we're here?"

Don't be noisy. Only surface items when they're relevant to what's happening in the
session.

## Step 8: Save and Confirm

After any write operation (capture, update, import):

1. Save the updated `projects/ops-feedback/feedback-log.md`
2. Show the user what changed (the logged item, the updated row, the import summary)
3. Show the file path: "Updated `projects/ops-feedback/feedback-log.md`"

## Step 9: Collect Feedback

After the first few uses of this skill, ask: "Is this feedback workflow working for you?
Anything to adjust — too many fields, wrong priority defaults, missing a status?"

Log feedback to `context/learnings.md` under `## ops-user-feedback`.

## Rules

- Log first, ask questions later. Speed of capture beats perfection of categorization.
- Don't ask the user to confirm category or priority on every entry — infer and move on.
- The markdown table IS the database. Keep it parseable — no merged cells, no free-form rows.
- IDs are permanent. Never reuse or renumber IDs, even after deletion.
- Resolution column uses `—` (em dash) when empty, not blank (keeps table aligned).

## Self-Update

If the user flags an issue with the output — wrong category inference, bad priority
defaults, missing status transitions, noisy session integration — update the `## Rules`
section in this SKILL.md immediately with the correction. Don't just log it to learnings;
fix the skill so it doesn't repeat the mistake.
