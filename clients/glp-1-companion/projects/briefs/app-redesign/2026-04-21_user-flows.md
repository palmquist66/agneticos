# User Flow Diagrams: GLP-1 Companion

Five core journeys that cover 95% of what users do in the app.

---

## Flow 1: Onboarding (New User)

**Goal:** Connected data source within 2 minutes of first opening the app.

```
┌──────────────┐
│  App opened   │
│  (first time) │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Welcome    │  "GLP-1 Companion helps you see the
│   Screen     │   patterns in your health data."
│              │
│  [Get Started]
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Create      │  Email + password
│  Account     │  (or social auth via Clerk)
│              │
│  [Continue]  │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Your        │  • GLP-1 medication picker
│  Medication  │    (Ozempic, Mounjaro, Wegovy, Zepbound, etc.)
│              │  • Current dosage
│              │  • Other diabetes meds (optional)
│  [Next]      │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Your Goals  │  • Goal weight (optional, skip-friendly)
│  (optional)  │  • Daily protein target (smart default: 100g)
│              │  • Glucose target range (smart default: 70-180)
│              │
│  [Next]      │  [Skip for now →]
└──────┬───────┘
       │
       ▼
┌─────────────────────────────────────────────┐
│  Connect Your Data                          │
│                                             │
│  "The more data you connect, the better     │
│   your patterns get."                       │
│                                             │
│  ┌───────────────────┐                      │
│  │ 🍎 Apple Health   │  [Connect]           │
│  │ Weight, glucose,  │  → iOS permission    │
│  │ steps, heart rate │    modal appears     │
│  └───────────────────┘  → ✅ Connected!     │
│                                             │
│  ┌───────────────────┐                      │
│  │ 📊 Dexcom CGM     │  [Connect]           │
│  │ Continuous glucose │  → OAuth login       │
│  │ readings          │    in browser        │
│  └───────────────────┘  → ✅ Connected!     │
│                                             │
│  ┌───────────────────┐                      │
│  │ 💚 Google Fit     │  [Connect]           │
│  │ Weight, activity  │  → OAuth login       │
│  └───────────────────┘  → ✅ Connected!     │
│                                             │
│  [I'll enter data manually →]               │
│                                             │
│  At least 1 connection OR manual selected   │
│  to proceed                                 │
│                                             │
│  [Continue]                                 │
└──────────────┬──────────────────────────────┘
               │
               ▼
       ┌───────────────┐
       │  Initial Sync  │  If data source connected:
       │  (loading)     │  Pull last 30 days of data
       │                │  "Importing your data..."
       │  [2-5 seconds] │  Progress indicator
       └───────┬───────┘
               │
               ▼
┌──────────────────────┐
│  You're Ready!       │
│                      │  Shows what was imported:
│  "We found:          │  • "47 weight readings"
│   47 weight readings │  • "892 glucose readings from Dexcom"
│   892 glucose points │
│   from Dexcom"       │  3 quick tips:
│                      │  • Tap + to log a meal
│  [Go to Dashboard →] │  • Check Today for your med reminder
│                      │  • Visit Trends to see your patterns
└──────────┬───────────┘
           │
           ▼
    ┌──────────────┐
    │  Today Tab   │  Data already populated
    │  (home)      │  with synced readings
    └──────────────┘
```

**Critical path:** Welcome → Account → Medication → Connect Data → Today
**Minimum taps to first value:** 6 (account creation + one data source connection)
**Time estimate:** 90-120 seconds

---

## Flow 2: Daily Logging (Returning User)

**Goal:** Log any health data type in under 30 seconds.

### 2A: Log a Meal (Photo Path — Most Common)

```
┌──────────────┐
│  Open app    │  Lands on Today tab
│  (returning) │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Tap [+]     │  FAB button (always visible
│  button      │  on bottom nav bar)
└──────┬───────┘
       │
       ▼
┌──────────────────────┐
│  Action Sheet        │
│                      │
│  📸 Snap a Meal      │ ← tap
│  ✏️ Describe a Meal  │
│  🍳 Log a Recipe     │
│  ⚖️ Weight           │
│  🩸 Glucose          │
│  😣 Side Effect      │
│  💉 GLP-1 Dose       │
└──────┬───────────────┘
       │ tap "Snap a Meal"
       ▼
┌──────────────┐
│  Camera      │  Native camera opens immediately
│  opens       │  No toggle, no checkbox
│              │
│  [📷 Snap]   │
└──────┬───────┘
       │ photo taken
       ▼
┌──────────────────────┐
│  Analyzing...        │  Photo sent to Claude Vision
│  (2-3 sec)           │  Loading spinner
└──────┬───────────────┘
       │
       ▼
┌──────────────────────────────┐
│  Confirm & Edit              │
│                              │
│  [Photo thumbnail]           │
│                              │
│  Food: Grilled chicken salad │  ← AI-filled, editable
│  Calories: 420               │  ← AI-filled, editable
│  Protein: 38g                │  ← AI-filled, editable
│  Carbs: 22g                  │  ← AI-filled, editable
│  Fat: 18g                    │  ← AI-filled, editable
│  Meal: [Lunch ▾]             │  ← Auto-detected from time
│  Notes: ___________          │  ← Optional
│                              │
│  [Save]              [Redo]  │
└──────────┬───────────────────┘
           │ tap Save
           ▼
    ┌──────────────────┐
    │  ✅ Logged!       │  Brief confirmation toast
    │  → Back to Today │  Entry visible in Recent Activity
    └──────────────────┘
```

**Taps:** Open app → (+) → Snap a Meal → take photo → Save = **4 taps + 1 photo**
**Time:** ~15-20 seconds

### 2B: Log a Meal (Text Path)

```
       │ tap "Describe a Meal" from action sheet
       ▼
┌──────────────────────────────┐
│  What did you eat?           │
│                              │
│  ┌──────────────────────┐    │
│  │ "Two eggs, toast     │    │  Text input with large font
│  │  with butter, coffee │    │  (auto-focused, keyboard opens)
│  │  with cream"         │    │
│  └──────────────────────┘    │
│                              │
│  [Analyze →]                 │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│  Confirm & Edit              │  Same form as photo path
│                              │  AI estimates pre-filled
│  Food: 2 eggs, toast w/      │  All fields editable
│        butter, coffee w/cream│
│  Calories: 485               │  User who already knows macros
│  Protein: 22g                │  can just type numbers directly
│  ...                         │  and ignore AI estimates
│                              │
│  [Save]              [Redo]  │
└──────────────────────────────┘
```

**Taps:** (+) → Describe → type → Analyze → Save = **4 taps + typing**
**Note:** This path also handles "manual entry" — user types "chicken breast 6oz, 280 cal, 42g protein" and edits the form fields directly. No need for a separate manual entry screen.

### 2C: Log Weight

```
       │ tap "Weight" from action sheet
       ▼
┌──────────────────────────────┐
│  Log Weight                  │
│                              │
│  ┌────────────┐              │
│  │   218.4    │ lbs          │  Large number input
│  └────────────┘              │  Pre-filled with last weight
│                              │  +/- buttons for quick adjust
│  Notes: ___________          │
│                              │
│  [Save]                      │
└──────────────────────────────┘
```

**Taps:** (+) → Weight → adjust number → Save = **3 taps**
**Time:** ~5 seconds

### 2D: Log Glucose

```
       │ tap "Glucose" from action sheet
       ▼
┌──────────────────────────────┐
│  Log Glucose                 │
│                              │
│  ┌────────────┐              │
│  │    142     │ mg/dL        │  Large number input
│  └────────────┘              │
│                              │
│  Context:                    │
│  [Fasting] [Before] [After] [Bedtime]  ← Toggle chips
│                              │  Auto-suggest based on time:
│  Notes: ___________          │  6-9am → Fasting
│                              │  11am-1pm → Before Meal
│  [Save]                      │  1-3pm → After Meal
└──────────────────────────────┘    9-11pm → Bedtime
```

**Taps:** (+) → Glucose → enter number → (context auto-selected) → Save = **3 taps**

### 2E: Mark Daily Meds Taken (No FAB Needed)

```
┌──────────────────────────────┐
│  Today Tab                   │
│                              │
│  ┌──────────────────────┐    │
│  │ 💊 Medications       │    │
│  │                      │    │
│  │ ○ Metformin 500mg    │    │  Tap circle to toggle ✓
│  │   8:00 AM            │    │
│  │                      │    │
│  │ ✅ Metformin 500mg   │    │  Already taken
│  │   8:00 PM            │    │
│  │                      │    │
│  │ ○ Vitamin D 2000IU   │    │
│  │   8:00 AM            │    │
│  │                      │    │
│  │ [All taken ✓]        │    │  One-tap batch confirm
│  └──────────────────────┘    │
└──────────────────────────────┘
```

**Taps:** Open app → tap circles (or "All taken") = **1-2 taps**
**Time:** ~3 seconds
**This is on the Today screen — no navigation required.**

### 2F: Log GLP-1 Dose

```
       │ tap "GLP-1 Dose" from action sheet
       ▼
┌──────────────────────────────┐
│  Log GLP-1 Dose              │
│                              │
│  Ozempic 0.5mg               │  From profile
│  Last dose: April 14         │
│  Day 7 of 7 — due today      │
│                              │
│  Injection Site:             │
│  ┌─────┬─────┬─────┐        │
│  │     │     │     │        │
│  │ L   │     │ R   │  Arms  │
│  │     │     │     │        │
│  ├─────┤     ├─────┤        │
│  │ L ★ │     │ R   │  Belly │  ★ = Recommended
│  │     │     │     │        │     (least recent)
│  ├─────┤     ├─────┤        │
│  │ L   │     │ R   │  Thigh │
│  └─────┴─────┴─────┘        │
│                              │
│  Notes: ___________          │
│                              │
│  [Log Dose]                  │
└──────────────────────────────┘
```

**Taps:** (+) → GLP-1 Dose → tap site → Log Dose = **3 taps**

---

## Flow 3: Connect a Data Source (Existing User)

**Goal:** Add a new data source from Profile in under 60 seconds.

```
┌──────────────┐
│  Profile Tab │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────┐
│  Connected Data Sources      │
│                              │
│  ✅ Apple Health             │
│     Last sync: 2 hours ago   │
│     [Manage]                 │
│                              │
│  ⬚ Dexcom CGM               │
│     Not connected            │
│     [Connect →]  ← tap      │
│                              │
│  ⬚ Google Fit               │
│     Not connected            │
│     [Connect →]              │
└──────────┬───────────────────┘
           │ tap "Connect" on Dexcom
           ▼
┌──────────────────────────────┐
│  Connect Dexcom              │
│                              │
│  "Sign in to your Dexcom     │
│   account to sync your       │
│   CGM readings."             │
│                              │
│  • Reads: glucose readings   │
│  • Syncs: every time you     │
│    open the app              │
│  • You can disconnect        │
│    anytime                   │
│                              │
│  [Sign in to Dexcom →]       │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│  Dexcom OAuth                │  In-app browser / WebView
│  (dexcom.com)                │
│                              │
│  Email: __________           │
│  Password: _______           │
│                              │
│  [Authorize GLP-1 Companion] │
└──────────┬───────────────────┘
           │ authorized
           ▼
┌──────────────────────────────┐
│  Syncing...                  │  Pull last 30 days
│                              │  Progress bar
│  "Importing glucose          │
│   readings..."               │
│                              │
│  892 readings imported       │
│  Date range: Mar 22 - Apr 21│
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│  Connected Data Sources      │
│                              │
│  ✅ Apple Health             │
│     Last sync: 2 hours ago   │
│                              │
│  ✅ Dexcom CGM               │  ← Now connected
│     Last sync: just now      │
│     892 readings synced      │
│     [Manage] [Disconnect]    │
│                              │
│  ⬚ Google Fit               │
│     [Connect →]              │
└──────────────────────────────┘
```

**Apple Health path is simpler:**
```
Tap [Connect] → iOS permission modal appears → Toggle permissions → Done
```
No OAuth, no login. One system dialog.

**Taps:** Profile → Connect → OAuth login → authorize = **3 taps + login**
**Time:** 30-60 seconds

---

## Flow 4: Review Patterns & Ask AI

**Goal:** Understand trends and get answers about your health data.

```
┌──────────────┐
│  Trends Tab  │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────────────────┐
│  Trends                                  │
│                                          │
│  [7d] [14d] [●30d] [90d]  ← time range  │
│                                          │
│  ┌────────────────────────────────┐      │
│  │  Weight Trend                  │      │
│  │  ╭──╮                         │      │
│  │  │   ╲___╱╲                   │      │
│  │  │         ╲___               │      │  Interactive chart
│  │  │  ─ ─ ─ ─ ─ ─ goal: 210    │      │  Tap point for details
│  │  ╰────────────────────────────│      │
│  │                               │      │
│  │  📉 Down 4.2 lbs since dose  │      │  Contextual insight
│  │     increase on March 15      │      │  attached to chart
│  └────────────────────────────────┘      │
│                                          │
│  ┌────────────────────────────────┐      │
│  │  Glucose Trend                 │      │
│  │  ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈ 180       │      │  Target range band
│  │  ╭─╮ ╭╮  ╭─╮                  │      │  shaded on chart
│  │  │  ╲╯ ╲╱╯  ╲╱╲___           │      │
│  │  ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈ 70        │      │
│  │                               │      │
│  │  📊 Fasting avg: 128 mg/dL   │      │
│  │     Trending toward target     │      │
│  └────────────────────────────────┘      │
│                                          │
│  ── Patterns ──                          │
│                                          │
│  ┌────────────────────────────────┐      │
│  │ 📈 Weight ↔ Dose              │      │
│  │ Your weight dropped 3.1 lbs   │      │  Tap to expand
│  │ in the 14 days after your     │      │  with full chart
│  │ dose increase to 0.5mg        │      │
│  └────────────────────────────────┘      │
│                                          │
│  ┌────────────────────────────────┐      │
│  │ 💪 Protein ↔ Weight           │      │
│  │ Days with 80g+ protein show   │      │
│  │ 40% less weight regain        │      │
│  └────────────────────────────────┘      │
│                                          │
│  ┌────────────────────────────────┐      │
│  │ 😣 Side Effects ↔ Dose        │      │
│  │ Nausea peaks 2-3 days after   │      │
│  │ injection, resolves by day 5  │      │
│  └────────────────────────────────┘      │
│                                          │
│  ── Ask AI ──                            │
│                                          │
│  ┌────────────────────────────────┐      │
│  │ "Ask about your data..."      │      │
│  │                               │      │
│  │ Suggested:                    │      │
│  │ • Why did my weight stall?    │      │  Tap suggestion or
│  │ • Is nausea normal at 0.5mg?  │      │  type custom question
│  │ • How's my glucose trending?  │      │
│  └────────────────────────────────┘      │
└──────────────────────────────────────────┘
           │
           │ user taps "Why did my weight stall?"
           ▼
┌──────────────────────────────────────────┐
│  AI Response                             │
│                                          │
│  ┌────────────────────────────────┐      │
│  │ Looking at your last 30 days: │      │
│  │                               │      │
│  │ Your weight held at 218-219   │      │  Claude Sonnet response
│  │ for 12 days (Apr 8-20). This  │      │  with full data context
│  │ is common during the first    │      │
│  │ 2-3 weeks at a new dose.      │      │
│  │                               │      │
│  │ What I notice:                │      │
│  │ • Protein dipped to 55g avg   │      │
│  │   during the stall            │      │
│  │ • Your pre-stall average      │      │
│  │   was 82g protein/day         │      │
│  │ • Weight started moving       │      │
│  │   again when protein hit 75g+ │      │
│  │                               │      │
│  │ Try pushing protein back      │      │
│  │ toward 80-100g and give it    │      │
│  │ another week.                 │      │
│  └────────────────────────────────┘      │
│                                          │
│  ┌────────────────────────────────┐      │
│  │ "Follow up question..."       │      │
│  └────────────────────────────────┘      │
└──────────────────────────────────────────┘
```

**Deep Analysis (optional, on-demand):**
```
┌──────────────────────────────────────────┐
│  [Run Full Analysis]                     │
│                                          │  Button at bottom of Trends
│  → Claude generates comprehensive        │  Not auto-triggered
│    narrative covering all data types     │  (saves API costs)
│  → Cached until user refreshes           │
│  → Sections: Key Patterns, GLP-1         │
│    Insights, Food Insights, Side         │
│    Effect Patterns, Recommendations      │
└──────────────────────────────────────────┘
```

**Taps to first insight:** Open app → Trends tab = **1 tap**
**Taps to AI answer:** Trends → tap suggested question = **2 taps**

---

## Flow 5: Doctor Export

**Goal:** Generate a shareable PDF in under 30 seconds.

```
┌──────────────┐
│  Profile Tab │
└──────┬───────┘
       │ scroll to Doctor Export section
       ▼
┌──────────────────────────────────────────┐
│  Doctor Export                            │
│                                          │
│  Generate a PDF report to share with     │
│  your healthcare provider.               │
│                                          │
│  Date Range:                             │
│  [7d] [14d] [●30d] [60d] [90d]         │
│                                          │
│  Includes:                               │
│  ✓ Weight trend with goal               │
│  ✓ Glucose chart with target range      │
│  ✓ Medication log with dose changes     │
│  ✓ Side effects by severity             │
│  ✓ Pattern insights                     │
│  ✓ Daily nutrition summary              │
│                                          │
│  ⚠️ Missing: No glucose data in range    │  Warnings if data gaps
│     (connect Dexcom for automatic sync)  │
│                                          │
│  [Generate PDF →]                        │
└──────────┬───────────────────────────────┘
           │
           ▼
┌──────────────────────────────┐
│  Generating...               │
│                              │  Progress bar
│  Compiling 30 days of data   │  Charts render server-side
│  ████████████░░░ 75%         │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────────────────┐
│  Report Ready                            │
│                                          │
│  ┌──────────────────────────┐            │
│  │  📄 GLP-1 Companion     │            │
│  │     Health Report        │            │  PDF preview
│  │                          │            │  (first page)
│  │  Patient: James P.       │            │
│  │  Ozempic 0.5mg          │            │
│  │  Apr 21 - Mar 22, 2026  │            │
│  └──────────────────────────┘            │
│                                          │
│  Report Summary:                         │
│  • 30 weight readings                    │
│  • 892 glucose readings (Dexcom)         │
│  • 45 medication logs                    │
│  • 8 side effects                        │
│  • 5 pattern insights                    │
│                                          │
│  [📥 Download PDF]    [📤 Share]         │
│                                          │
│  Share opens native share sheet:         │
│  → Email to doctor                       │
│  → Save to Files                         │
│  → AirDrop                               │
│  → Print                                 │
└──────────────────────────────────────────┘
```

**Taps:** Profile → select range → Generate → Download/Share = **3-4 taps**
**Time:** ~15-30 seconds (including generation)

---

## Flow Summary

| Journey | Taps | Time | Current App |
|---------|------|------|-------------|
| **Onboarding → first data** | 6 + login | 90-120s | No onboarding exists |
| **Log a meal (photo)** | 4 + photo | 15-20s | 5+ taps (navigate tab → scroll → enable camera → photo → analyze → fill form → save) |
| **Log weight** | 3 | 5s | 4+ taps (navigate tab → scroll to weight section → enter → save) |
| **Log glucose** | 3 | 8s | 4+ taps (navigate tab → scroll → enter → save) |
| **Mark daily meds** | 1-2 | 3s | 3+ taps (navigate tab → scroll → check-in) |
| **Log GLP-1 dose** | 3 | 10s | 4+ taps (navigate tab → find cycle tracker → select site → log) |
| **Connect data source** | 3 + login | 30-60s | 6+ taps (navigate tab → scroll to bottom → find import → upload/connect) |
| **Review patterns** | 1 | instant | 3+ taps (navigate tab → scroll past chat → find insights) |
| **Ask AI** | 2 | depends on question | 3+ taps (navigate tab → type in chat that doesn't use AI) |
| **Doctor export** | 3-4 | 15-30s | 4+ taps (navigate tab → find export → generate → download) — and it exists in 2 different places |

**Every core action is faster.** Average tap reduction: 40-60%.
