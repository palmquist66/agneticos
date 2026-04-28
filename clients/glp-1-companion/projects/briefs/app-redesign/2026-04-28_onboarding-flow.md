# Onboarding Flow Spec

Guided first-time experience. Goal: connected data source within 2 minutes of signup.

---

## Entry Conditions

**Who sees onboarding:** Any authenticated user whose `onboarding_completed` flag is `false` (default on account creation).

**Detection logic:**
```
if (user.isAuthenticated && !user.onboardingCompleted) {
  redirect('/onboarding/medication')
}
```

**Where it runs:** After Clerk auth (sign-up or first sign-in). Onboarding is an app-level flow, not part of Clerk's auth UI.

**Re-entry:** If user closes the app mid-onboarding, they resume where they left off (last completed step tracked in `onboarding_step` field). They don't restart from scratch.

---

## Step Progression

```
Account Created (Clerk)
    │
    ▼
Step 1: Welcome (interstitial, no data)
    │
    ▼
Step 2: Your Medication
    │ skippable
    ▼
Step 3: Your Goals
    │ skippable
    ▼
Step 4: Connect Your Data ← critical step
    │ requires 1 selection (connection OR manual)
    ▼
Step 5: Initial Sync (conditional — only if data source connected)
    │
    ▼
Step 6: You're Ready
    │
    ▼
Today (home screen)
```

Progress indicator: horizontal step dots at top of each screen (filled = complete, outlined = remaining). Tapping a completed dot lets you go back and edit.

---

## Step 1: Welcome

**Purpose:** Set expectations and build excitement. 3-second screen.

**Content:**
```
┌────────────────────────────────────┐
│                                    │
│         [App Icon / Logo]          │
│                                    │
│   Stop tracking. Start seeing.     │
│                                    │
│   GLP-1 Companion connects your    │
│   health data and finds the        │
│   patterns your doctor wants       │
│   to see.                          │
│                                    │
│         [Get Started]              │
│                                    │
└────────────────────────────────────┘
```

**Interactions:**
- [Get Started] → Step 2
- No skip, no back (first screen)

**State saved:** `onboarding_step: 'welcome_completed'`

---

## Step 2: Your Medication

**Purpose:** Capture GLP-1 info to personalize the entire app experience (status card on Today, titration timeline, injection site tracking, pattern engine).

**Content:**
```
┌────────────────────────────────────┐
│  ● ○ ○ ○                          │
│                                    │
│  What GLP-1 are you taking?        │
│                                    │
│  ┌──────────────────────────────┐  │
│  │ Select medication        ▾   │  │
│  └──────────────────────────────┘  │
│                                    │
│  Ozempic (semaglutide)             │
│  Mounjaro (tirzepatide)            │
│  Wegovy (semaglutide)              │
│  Zepbound (tirzepatide)            │
│  Saxenda (liraglutide)             │
│  Trulicity (dulaglutide)           │
│  Victoza (liraglutide)             │
│  Rybelsus (oral semaglutide)       │
│  Other                             │
│  I'm not on a GLP-1 yet           │
│                                    │
│  Current dosage:                   │
│  ┌──────────────────────────────┐  │
│  │ e.g., 0.5mg             ▾   │  │
│  └──────────────────────────────┘  │
│  (Dosage options update based on   │
│   selected medication)             │
│                                    │
│  Taking other diabetes meds?       │
│  ┌──────────────────────────────┐  │
│  │ + Add medication              │  │
│  └──────────────────────────────┘  │
│  (Multi-select: Metformin,         │
│   Jardiance, Farxiga, Insulin,     │
│   Other)                           │
│                                    │
│         [Next]                     │
│     [Skip for now →]               │
└────────────────────────────────────┘
```

**Interactions:**
- Medication picker is a scrollable list, not a dropdown (better for mobile)
- Selecting a medication reveals its common dosages as chips (e.g., Ozempic: 0.25mg, 0.5mg, 1mg, 2mg)
- "Other" opens a text field for medication name + free-text dosage
- "I'm not on a GLP-1 yet" selects cleanly — still allows tracking weight, glucose, food
- Other meds section is collapsed by default, [+ Add medication] expands it
- [Next] saves data and advances
- [Skip for now →] advances without saving (fields fillable later in Profile)

**Validation:**
- If [Next] is tapped with a medication selected but no dosage → prompt: "What's your current dose?"
- No hard validation — everything is optional, skip always works

**Dosage options per medication:**
| Medication | Dosages |
|-----------|---------|
| Ozempic | 0.25mg, 0.5mg, 1mg, 2mg |
| Mounjaro | 2.5mg, 5mg, 7.5mg, 10mg, 12.5mg, 15mg |
| Wegovy | 0.25mg, 0.5mg, 1mg, 1.7mg, 2.4mg |
| Zepbound | 2.5mg, 5mg, 7.5mg, 10mg, 12.5mg, 15mg |
| Saxenda | 0.6mg, 1.2mg, 1.8mg, 2.4mg, 3mg |
| Trulicity | 0.75mg, 1.5mg, 3mg, 4.5mg |
| Rybelsus | 3mg, 7mg, 14mg |
| Other | Free text |

**State saved:** `onboarding_step: 'medication_completed'`, writes to User + MedicationSchedule tables

---

## Step 3: Your Goals

**Purpose:** Set health targets used by charts (goal lines), pattern engine (protein thresholds), and glucose trend coloring.

**Content:**
```
┌────────────────────────────────────┐
│  ● ● ○ ○                          │
│                                    │
│  What are you working toward?      │
│                                    │
│  Goal weight (optional)            │
│  ┌────────────┐                    │
│  │    210     │ lbs                │
│  └────────────┘                    │
│  [Leave blank if you'd rather not  │
│   set a target]                    │
│                                    │
│  Daily protein target              │
│  ┌────────────┐                    │
│  │    100     │ g                  │
│  └────────────┘                    │
│  ──────────●────── (slider)        │
│  50g              200g             │
│  Recommended for GLP-1: 80-120g    │
│                                    │
│  Glucose target range              │
│  ┌────┐  to  ┌────┐               │
│  │ 70 │      │ 180│ mg/dL         │
│  └────┘      └────┘               │
│  (Standard range pre-filled.       │
│   Adjust based on your doctor's    │
│   guidance.)                       │
│                                    │
│         [Next]                     │
│     [Skip for now →]               │
└────────────────────────────────────┘
```

**Interactions:**
- All fields have smart defaults:
  - Goal weight: empty (optional, no default — too personal)
  - Protein: 100g (slider, range 50-200g)
  - Glucose: 70-180 mg/dL (standard)
- Protein slider includes educational text about GLP-1 + protein importance
- [Next] saves whatever is filled in
- [Skip for now →] saves the smart defaults (not blank — user gets value even if they skip)

**State saved:** `onboarding_step: 'goals_completed'`, writes to User.healthTargets (JSONB)

---

## Step 4: Connect Your Data

**Purpose:** This is the money step. Getting one data source connected is the single biggest predictor of retention.

**Content:**
```
┌────────────────────────────────────┐
│  ● ● ● ○                          │
│                                    │
│  Connect your health data          │
│                                    │
│  The more data you connect, the    │
│  better your patterns get.         │
│                                    │
│  ┌──────────────────────────────┐  │
│  │ 🍎 Apple Health              │  │
│  │                              │  │
│  │ Weight, glucose, steps,      │  │
│  │ heart rate                   │  │
│  │                              │  │
│  │ [Connect]                    │  │
│  └──────────────────────────────┘  │
│                                    │
│  ┌──────────────────────────────┐  │
│  │ 📊 Dexcom CGM                │  │
│  │                              │  │
│  │ Continuous glucose readings   │  │
│  │ every 5 minutes              │  │
│  │                              │  │
│  │ [Connect]                    │  │
│  └──────────────────────────────┘  │
│                                    │
│  ┌──────────────────────────────┐  │
│  │ 💚 Google Fit                 │  │
│  │                              │  │
│  │ Weight, steps, activity      │  │
│  │                              │  │
│  │ [Connect]                    │  │
│  └──────────────────────────────┘  │
│                                    │
│  [I'll enter data manually]        │
│                                    │
│         [Continue]                 │
│  (connect at least one source      │
│   or choose manual)               │
└────────────────────────────────────┘
```

**Interactions per source:**

### Apple Health
1. Tap [Connect]
2. iOS HealthKit permission sheet appears (system modal — we don't control its design)
3. User selects which data types to share
4. Permission granted → card updates to ✅
5. Permission denied → card shows "Permission denied. You can enable this in Settings > Privacy > Health."

**Platform note:** Apple Health only appears on iOS. On Android and web, this card is hidden. On web PWA, show it dimmed with "Available in the mobile app."

### Dexcom CGM
1. Tap [Connect]
2. In-app browser opens Dexcom OAuth consent page
3. User signs in to Dexcom account
4. User authorizes GLP-1 Companion
5. Redirect back to app with auth code
6. Backend exchanges code for tokens, stores encrypted
7. Card updates to ✅

**Error states:**
- User cancels OAuth → card stays at [Connect], no error shown
- Dexcom login fails → Dexcom handles error UI in their OAuth page
- Network error during token exchange → "Connection failed. Tap to try again." with retry button
- Dexcom account not found / no CGM data → "Connected, but no CGM data found. Make sure your Dexcom app is syncing."

### Google Fit
1. Tap [Connect]
2. Google OAuth consent page opens
3. User signs in and grants permissions
4. Redirect back with auth code
5. Backend exchanges for tokens, stores encrypted
6. Card updates to ✅

**Error states:** Same pattern as Dexcom.

### Manual entry
- Tapping "I'll enter data manually" doesn't connect anything — it just satisfies the "at least one selection" requirement
- The card changes to a ✅ with "Manual entry selected"
- User can still connect sources AND select manual (they're not exclusive)

**Gate logic:**
- [Continue] button is disabled until at least one of:
  - A data source shows ✅
  - Manual entry is selected
- Subtle hint text below disabled button: "Connect at least one source or choose manual entry"

**Multiple sources:** User can connect all three. Each operates independently.

**State saved:** `onboarding_step: 'connect_completed'`, writes to DataSourceConnection table (one row per source with status, tokens, permissions)

---

## Step 5: Initial Sync (Conditional)

**Purpose:** Pull historical data from connected sources. Only shows if at least one source was connected (skipped if manual-only).

**Content:**
```
┌────────────────────────────────────┐
│                                    │
│  Importing your data...            │
│                                    │
│  ┌──────────────────────────────┐  │
│  │ 🍎 Apple Health              │  │
│  │ ████████████░░░░ 75%         │  │
│  │ Found 47 weight readings     │  │
│  │ Found 12 glucose readings    │  │
│  └──────────────────────────────┘  │
│                                    │
│  ┌──────────────────────────────┐  │
│  │ 📊 Dexcom                    │  │
│  │ ████████████████ 100%        │  │
│  │ ✅ 892 glucose readings      │  │
│  └──────────────────────────────┘  │
│                                    │
│  (Auto-advances when all           │
│   sources complete)                │
│                                    │
│  [Continue anyway →]               │
│  (visible after 10 seconds)        │
└────────────────────────────────────┘
```

**Sync behavior:**
- Each connected source syncs in parallel
- Default: pull last 30 days of data
- Dexcom: 30-day max per API call (matches their API limit, no pagination needed for initial sync)
- Apple Health: read all available data types granted
- Google Fit: last 30 days of weight + activity
- Per-source progress bar (determinate if possible, indeterminate if source doesn't report progress)
- Each source shows count of records found as they arrive
- Auto-advances to Step 6 when all sources report done

**Timeouts:**
- If a source takes >30 seconds, show "Taking longer than expected..." with option to skip
- "Continue anyway" button appears after 10 seconds regardless (don't trap the user)
- Any data pulled before skip is kept — sync continues in background

**Error handling:**
- Source fails mid-sync → "Apple Health sync incomplete. We imported what we could — you can re-sync from Profile later."
- No data found → "Connected to Dexcom, but no readings in the last 30 days. New readings will sync automatically."
- Network error → "Sync failed — check your connection. You can sync from Profile anytime."

**State saved:** `onboarding_step: 'sync_completed'`, data written to respective log tables

---

## Step 6: You're Ready

**Purpose:** Confirm what was imported. Orient user to the app.

**Content:**
```
┌────────────────────────────────────┐
│                                    │
│  ✅ You're all set!                │
│                                    │
│  ┌──────────────────────────────┐  │
│  │ Here's what we imported:     │  │
│  │                              │  │
│  │ 47 weight readings           │  │
│  │ 904 glucose readings         │  │
│  │ 156 activity sessions        │  │
│  └──────────────────────────────┘  │
│                                    │
│  Quick tips:                       │
│                                    │
│  📸 Tap + to snap a meal           │
│     AI estimates your macros       │
│                                    │
│  💊 Check Today for your meds      │
│     One-tap to mark taken          │
│                                    │
│  📊 Visit Trends for patterns      │
│     The more you log, the          │
│     smarter they get               │
│                                    │
│       [Go to Today →]             │
│                                    │
└────────────────────────────────────┘
```

**Variations:**
- If no data was imported (manual-only): Skip the import summary, show: "Start logging to build your patterns. The more data, the better your insights."
- If only one source connected: Show only that source's count
- If medication was set: Add personalized touch: "Your Ozempic 0.5mg schedule is set up — we'll track your cycle on the Today screen."

**State saved:** `onboarding_completed: true`, `onboarding_step: 'complete'`

**After tapping [Go to Today]:** Navigate to `/today`. Standard bottom nav is visible. Onboarding never shows again unless reset from Profile.

---

## State Management

### Database fields (User table)

| Field | Type | Default | Purpose |
|-------|------|---------|---------|
| `onboarding_completed` | boolean | false | Gate for onboarding redirect |
| `onboarding_step` | string | null | Resume position if interrupted |
| `onboarding_started_at` | timestamp | null | Analytics |
| `onboarding_completed_at` | timestamp | null | Analytics |

### Resume logic

```
switch (user.onboarding_step) {
  case null:
  case 'welcome_completed':     → redirect to /onboarding/medication
  case 'medication_completed':  → redirect to /onboarding/goals
  case 'goals_completed':       → redirect to /onboarding/connect
  case 'connect_completed':     → redirect to /onboarding/sync (or /onboarding/ready if manual)
  case 'sync_completed':        → redirect to /onboarding/ready
  case 'complete':              → redirect to /today (shouldn't happen — onboarding_completed should be true)
}
```

### Back navigation

- User can tap back arrow or completed step dots to revisit previous steps
- Going back doesn't erase saved data — fields show previously entered values
- [Next] from a revisited step saves any changes and returns to where they left off

---

## Edge Cases

| Scenario | Behavior |
|----------|----------|
| User signs up on web, opens mobile app later | Onboarding state syncs via database. If completed on web, skip on mobile. If incomplete, resume where they left off. |
| User signs up via social auth (Google/Apple) | Clerk handles social auth. Name is pre-filled from social profile. Otherwise same flow. |
| User selects "I'm not on a GLP-1 yet" | App works without GLP-1 set. Today screen hides GLP-1 Status Card and injection-related features. Profile shows prompt to add medication when ready. |
| User connects a source, then disconnects during onboarding | Source card reverts to [Connect]. Imported data from that source is kept (don't delete on disconnect during onboarding — ask on disconnect from Profile). |
| User has no health data in any source | Step 5 shows "Connected, but no data found yet. New data will appear as you log or as your devices sync." Proceed to Step 6 normally. |
| User closes app during Step 5 (sync) | Sync continues server-side if possible. On re-open, check sync status — if complete, skip to Step 6. If still running, show progress. If failed, show what was imported. |
| OAuth token expired between onboarding steps | Re-prompt OAuth if user goes back to connect step. Don't fail silently. |
| User already has data (signed up on old Streamlit app) | After migration, user signs into new app with existing credentials. Detect existing data → skip Step 5 sync. Step 6 shows "We found your existing data: X weight readings, Y glucose readings." |
| Android user sees Apple Health card | Don't show it. Only render Apple Health card on iOS (detect via user agent or Capacitor platform check). |

---

## Re-Onboarding

Accessible from Profile → Account → "Re-run setup wizard"

**When useful:**
- User skipped steps and wants to go back
- User got a new CGM or switched medications
- User wants to reconnect a data source they disconnected

**Behavior:** Same flow, but fields are pre-filled with current values. Completing re-onboarding doesn't create duplicate data — it updates existing records.

---

## Analytics Events

| Event | When | Properties |
|-------|------|-----------|
| `onboarding_started` | Step 1 shown | `source` (signup vs re-run) |
| `onboarding_step_completed` | Each step's [Next] tapped | `step`, `skipped` (boolean) |
| `onboarding_step_skipped` | [Skip for now] tapped | `step` |
| `onboarding_source_connected` | Data source ✅ | `source` (apple_health, dexcom, google_fit) |
| `onboarding_source_failed` | Connection error | `source`, `error_type` |
| `onboarding_sync_completed` | All sources done syncing | `sources`, `total_records`, `duration_ms` |
| `onboarding_completed` | [Go to Today] tapped | `duration_ms`, `steps_skipped`, `sources_connected` |
| `onboarding_abandoned` | User closes app during onboarding | `last_step`, `duration_ms` |

**Key metric:** % of users who connect at least one data source during onboarding. Target: 60%+.
