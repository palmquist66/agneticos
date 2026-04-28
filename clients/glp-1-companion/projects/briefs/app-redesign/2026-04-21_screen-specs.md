# Screen-by-Screen Redesign Specs

Every screen in the redesigned app. For each: purpose, content, interactions, and what changed from current.

---

## Global Elements

### Bottom Navigation Bar
```
┌─────────────────────────────────────────┐
│  Today    Trends    [+]    Meds   Profile│
│   🏠       📊       ➕     💊      👤    │
└─────────────────────────────────────────┘
```
- Fixed at bottom, always visible
- Active tab highlighted with filled icon + label
- [+] FAB is elevated, larger, accent color
- Badge on Today tab when meds are due
- Badge on Trends tab when new pattern detected

### Status Bar / Header
- App name left-aligned: "GLP-1 Companion"
- No hamburger menu (eliminated sidebar)
- Notification bell (Phase 2, when push notifications exist)

---

## Pre-Auth Screens

### S0: Landing Page

**Purpose:** Convert visitors to signups.

**Content:**
- Hero: "Stop tracking. Start seeing." + subhead + [Get Started Free] CTA
- Problem section: fragmented tracking pain
- Solution section: unified timeline + pattern recognition
- 3 feature cards (not 6): Pattern Detection, Food AI, Doctor Export
- Social proof (real testimonials when available, remove fabricated ones for now)
- Final CTA

**What changed:**
- Reduced from 6 feature sections to 3 (focused on differentiators)
- Removed fabricated testimonials (placeholder until real ones exist)
- Removed duplicate CTA buttons (one top, one bottom is enough)
- Same landing page copy framework, tighter execution

### S1: Create Account

**Purpose:** Get user into the app with minimum friction.

**Content:**
- Email + password (or social auth via Clerk)
- Name field
- [Create Account] button
- "Already have an account? [Log in]"

**What changed:**
- Removed medication/dosage fields from signup — moved to onboarding step 2
- Signup is now just credentials + name (3 fields, not 7)
- Auth handled by Clerk (proper session management, social login, secure password reset)

### S2: Login

**Purpose:** Return user to their account.

**Content:**
- Email + password
- [Log In] button
- "Forgot password?" → Clerk's secure reset flow
- "Don't have an account? [Sign up]"

**What changed:**
- Password reset now uses Clerk's email verification (fixes the "anyone can reset any account" security hole)

---

## Onboarding (First-Time Only)

### S3: Onboarding — Your Medication

**Purpose:** Capture GLP-1 info to personalize the experience.

**Content:**
- "What GLP-1 are you taking?"
- Medication picker: Ozempic, Mounjaro, Wegovy, Zepbound, Saxenda, Trulicity, Victoza, Byetta, Bydureon, Other
- Dosage input (text, e.g. "0.5mg")
- Other diabetes medications (optional multi-select)
- [Next] button
- [Skip for now →] link

**What changed:**
- Was part of the 7-field signup form — now a dedicated focused step
- Skip option (can fill in Profile later)

### S4: Onboarding — Your Goals

**Purpose:** Set health targets for charts and insights.

**Content:**
- Goal weight input (lbs, optional)
- Daily protein target (slider, default 100g, range 50-200g)
- Glucose target range (min/max, default 70-180 mg/dL)
- [Next] button
- [Skip for now →] link

**What changed:**
- New screen. Currently these are only in Settings — most users never find them.
- Smart defaults mean users can skip and still get value.

### S5: Onboarding — Connect Your Data

**Purpose:** Get at least one data source connected.

**Content:**
- "The more data you connect, the better your patterns."
- Three cards:
  - Apple Health: what it syncs (weight, glucose, steps, heart rate), [Connect] button → iOS permission modal
  - Dexcom CGM: what it syncs (continuous glucose readings), [Connect] button → OAuth flow
  - Google Fit: what it syncs (weight, activity), [Connect] button → OAuth flow
- Each card shows ✅ after successful connection
- "I'll enter data manually" option at bottom
- [Continue] button (enabled after 1+ connection or manual selected)

**What changed:**
- Entirely new. Currently there's no onboarding — users land on the dashboard with no data and no guidance on how to connect anything.
- Data sources were buried at the bottom of the Health tab.

### S6: Onboarding — You're Ready

**Purpose:** Confirm what was imported, orient user to the app.

**Content:**
- Summary of imported data ("We found 47 weight readings, 892 glucose points from Dexcom")
- 3 quick tips:
  - "Tap + to log a meal"
  - "Check Today for your daily med reminder"
  - "Visit Trends to see your patterns"
- [Go to Dashboard →] button

**What changed:**
- New screen. Provides immediate feedback that connecting data sources worked.

---

## Main App Screens

### S7: Today (Home Tab)

**Purpose:** Show what matters right now. What's due, what's logged, what's interesting.

**Layout (top to bottom):**

**1. GLP-1 Status Card**
```
┌────────────────────────────────────┐
│ 💉 Ozempic 0.5mg                  │
│ Day 4 of 7 · Next dose: Thursday  │
│ ████████░░░░ 57%                   │
└────────────────────────────────────┘
```
- Tap → GLP-1 Detail Screen (S12)
- Shows overdue warning if past day 7
- Hidden if no GLP-1 medication set

**2. Medication Check-In Card**
```
┌────────────────────────────────────┐
│ 💊 Today's Medications            │
│                                    │
│ ○ Metformin 500mg · 8:00 AM       │
│ ✅ Metformin 500mg · 8:00 PM      │
│ ○ Vitamin D 2000IU · 8:00 AM      │
│                                    │
│ [All taken ✓]                      │
└────────────────────────────────────┘
```
- Tap circle to toggle individual med
- "All taken" batch confirms remaining
- Shows only today's scheduled meds
- Green checkmark animation on completion
- Card collapses to "All meds taken ✅" when complete
- Hidden if no medications scheduled

**3. Today's Numbers (compact row)**
```
┌──────────┬──────────┬──────────┐
│  ⚖️ 218.4 │ 🩸 142   │ 💪 67g   │
│  ↓0.6 lbs│  fasting │  / 100g  │
└──────────┴──────────┴──────────┘
```
- Shows latest reading for each metric today
- Dash (—) if no reading today
- Tap any metric → Trends tab filtered to that metric
- Protein shows progress bar toward daily target

**4. Pattern Spotlight**
```
┌────────────────────────────────────┐
│ 💡 Your weight drops faster on     │
│    days you hit 80g+ protein       │
│                              See → │
└────────────────────────────────────┘
```
- Shows 1 insight, rotates if multiple available
- Tap → Trends tab scrolled to that pattern
- Only shows if pattern engine has findings
- Hidden gracefully if no patterns yet (new users)

**5. Recent Activity**
```
12:30 PM  🍎 Grilled chicken salad · 420 cal
 9:15 AM  💊 Metformin 500mg
 8:02 AM  ⚖️ 218.4 lbs
 7:45 AM  🩸 142 mg/dL (fasting)
```
- Last 5 entries from today, newest first
- Tap entry → edit/delete sheet
- Shows empty state with FAB prompt if nothing logged today

**What moved OUT:**
- Quick Log buttons (non-functional) → removed, FAB replaces
- Full Pattern Insights list → Trends tab
- PDF Export button → Profile tab
- Welcome greeting → replaced with functional content

**What's NEW:**
- GLP-1 status card (consolidated from 3 locations)
- Med check-in is front and center (was hidden in Medication tab)
- Pattern spotlight (drives engagement with Trends)
- Tappable metrics that link to Trends

---

### S8: Trends Tab

**Purpose:** Understand your data over time. Charts, patterns, AI.

**Layout (top to bottom):**

**1. Time Range Selector**
```
[7d] [14d] [●30d] [60d] [90d]
```
- Pill-style toggle, default 30d
- Changes all charts and patterns on the page

**2. Weight Trend Chart**
```
┌────────────────────────────────────┐
│  Weight Trend                      │
│  ╭──╮                              │
│  │   ╲___╱╲                        │
│  │         ╲___                    │
│  │  ─ ─ ─ ─ ─ ─ goal: 210        │
│  ╰────────────────────────────────│
│                                    │
│  📉 Down 4.2 lbs since dose       │
│     increase on March 15           │
└────────────────────────────────────┘
```
- Interactive: tap data point for exact value + date
- Goal weight as dashed horizontal line
- 7-day moving average as smoothed overlay
- Contextual insight sentence below chart (from pattern engine)
- Hidden if no weight data in range

**3. Glucose Trend Chart**
```
┌────────────────────────────────────┐
│  Glucose Trend                     │
│  ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈ 180 target max │
│  ╭─╮ ╭╮  ╭─╮                      │
│  │  ╲╯ ╲╱╯  ╲╱╲___               │
│  ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈ 70 target min  │
│                                    │
│  📊 Fasting avg: 128 mg/dL        │
│     72% of readings in range       │
└────────────────────────────────────┘
```
- Target range band shaded (green zone)
- Color-coded points: green (in range), yellow (borderline), red (out of range)
- Context chips to filter: [All] [Fasting] [Before Meal] [After Meal] [Bedtime]
- Contextual insight below
- Hidden if no glucose data in range

**4. Pattern Cards (scrollable section)**
```
── Patterns ──

┌────────────────────────────────────┐
│ 📈 Weight ↔ Dose                   │
│ Weight dropped 3.1 lbs in 14 days  │
│ after dose increase to 0.5mg       │
│                             Expand →│
└────────────────────────────────────┘

┌────────────────────────────────────┐
│ 💪 Protein ↔ Weight                │
│ High protein days (80g+) correlate │
│ with 40% less weight regain        │
└────────────────────────────────────┘

┌────────────────────────────────────┐
│ 😣 Side Effects ↔ Dose             │
│ Nausea peaks 2-3 days after        │
│ injection, resolves by day 5       │
└────────────────────────────────────┘
```
- Each card expandable for detail chart
- Single pattern engine (remove duplicate threshold system)
- Empty state: "Keep logging — patterns appear after 7+ days of data"

**5. Ask AI (inline)**
```
── Ask AI ──

┌────────────────────────────────────┐
│ "Ask about your data..."           │
│                                    │
│ Suggested:                         │
│ • Why did my weight stall?         │
│ • Is nausea normal at 0.5mg?       │
│ • How's my glucose trending?       │
└────────────────────────────────────┘
```
- Real Claude Sonnet integration (replaces fake keyword chat)
- Full user data context sent with each question
- Suggested questions generated from current data state
- Conversation persists during session (clears on app close)
- Medical disclaimer shown once, dismissible

**6. Deep Analysis Button**
```
[Run Full Analysis]
```
- On-demand (not auto-triggered — saves API costs)
- Claude generates comprehensive narrative
- Cached, "Re-analyze" button to refresh
- Sections: Key Patterns, GLP-1 Insights, Food Insights, Side Effects, Recommendations

**What moved OUT:**
- Basic threshold alerts → removed (pattern cards are more valuable)
- Fake keyword-matching chat → removed

**What's NEW:**
- Contextual insights attached to their charts
- AI is inline below data (not a separate tab)
- Suggested questions based on current data
- Single unified pattern engine

---

### S9: FAB Action Sheet

**Purpose:** Quick-log anything in 2 taps.

**Behavior:** Tap [+] → bottom sheet slides up with options.

```
┌─────────────────────────────┐
│  What are you logging?      │
│                             │
│  📸  Snap a Meal            │
│  ✏️  Describe a Meal        │
│  🍳  Log a Recipe           │
│  ─────────────────────────  │
│  ⚖️  Weight                 │
│  🩸  Glucose                │
│  😣  Side Effect            │
│  💉  GLP-1 Dose             │
│                             │
│  [Cancel]                   │
└─────────────────────────────┘
```

- Divider separates food (most common) from health metrics
- Tap outside to dismiss
- Each option opens its own focused screen (S9a-S9g below)

---

### S9a: Snap a Meal (Photo)

**Purpose:** Log food via camera photo + AI.

**Flow:** Camera opens immediately → photo → AI analysis → confirm form → save

**Content:**
1. Camera viewfinder (full screen)
2. After capture: photo preview + "Analyzing..." spinner (2-3s)
3. Confirmation form:
   - Photo thumbnail
   - Food name (AI-filled, editable)
   - Calories (AI-filled, editable)
   - Protein (AI-filled, editable)
   - Carbs (AI-filled, editable)
   - Fat (AI-filled, editable)
   - Meal type (auto-selected from time of day, editable dropdown)
   - Notes (optional)
   - [Save] [Retake Photo]

**After save:** Toast confirmation → return to Today (entry in Recent Activity)

**What changed:**
- Camera opens immediately (no checkbox toggle to enable it)
- Remove debug output (`st.write("Debug AI response:", ai_text)`)
- Use Claude Sonnet for analysis (not Haiku — better accuracy worth the cost)
- Meal type auto-detected from time

---

### S9b: Describe a Meal (Text)

**Purpose:** Log food via text description + AI.

**Content:**
1. Text input (auto-focused, keyboard opens): "What did you eat?"
2. [Analyze] button
3. Same confirmation form as S9a (AI-filled, all editable)
4. [Save] [Clear]

**What changed:**
- This also covers "manual entry" — user can type structured info like "chicken breast 300 cal 45g protein" and edit the form directly
- Separate Manual Entry screen eliminated

---

### S9c: Log a Recipe

**Purpose:** Calculate per-serving nutrition for a recipe.

**Content:**
1. Two input methods:
   - Photo of recipe/ingredient list → AI extraction
   - Text area for ingredient list
2. Servings input (number)
3. [Calculate] button
4. Results: total nutrition + per-serving nutrition
5. "How many servings did you eat?" input
6. Calculated nutrition for servings eaten
7. [Save] [Clear]

**What changed:**
- Same core flow, cleaner presentation
- Combined into the FAB flow instead of being a section on the Food page

---

### S9d: Log Weight

**Purpose:** Record a weight reading.

**Content:**
- Large number input (pre-filled with last weight)
- +/- 0.1 buttons for quick adjustment
- Unit label (lbs)
- Notes (optional)
- [Save]

**After save:** Toast → return to Today (Today's Numbers updates)

**What changed:**
- Dedicated screen instead of a form within a tab section
- Pre-filled with last weight (one adjustment + save)
- No chart on this screen (charts live in Trends)

---

### S9e: Log Glucose

**Purpose:** Record a glucose reading.

**Content:**
- Large number input (mg/dL)
- Context chips: [Fasting] [Before Meal] [After Meal] [Bedtime]
  - Auto-suggested from time of day (6-9am → Fasting, etc.)
- Notes (optional)
- [Save]

**What changed:**
- Context auto-suggested from time (fewer decisions)
- Chip selector instead of dropdown (one tap vs tap → scroll → tap)

---

### S9f: Log Side Effect

**Purpose:** Record a side effect.

**Content:**
- Symptom chips (tap to select): Nausea, Diarrhea, Constipation, Stomach Pain, Headache, Fatigue, Dizziness, Reduced Appetite, Injection Site Reaction, Other
- Severity: [Mild] [Moderate] [Severe] toggle
- Notes (optional)
- [Save]

**What changed:**
- Chip selector instead of dropdown for symptom (scan all options at once)
- Severity as 3-option toggle instead of slider

---

### S9g: Log GLP-1 Dose

**Purpose:** Record weekly GLP-1 injection with site.

**Content:**
- Medication + dosage display (from profile)
- Last dose info: "Last dose: April 14 (7 days ago)"
- Injection site body map:
  ```
  ┌─────┬─────┐
  │ L   │ R   │  Arms
  ├─────┼─────┤
  │ L ★ │ R   │  Abdomen  (★ = recommended)
  ├─────┼─────┤
  │ L   │ R   │  Thighs
  └─────┴─────┘
  ```
- Recommended site highlighted (least recently used)
- Tap to select site
- Notes (optional)
- [Log Dose]

**What changed:**
- Single location for GLP-1 dose logging (was in 2 places)
- Body map with visual site selection (was a dropdown)
- Shows recommendation based on rotation history

---

### S10: Meds Tab

**Purpose:** Manage medication regimen. Schedules, titration, history.

**Layout (top to bottom):**

**1. Active Medications (card list)**
```
┌────────────────────────────────────┐
│ 💉 Ozempic 0.5mg                  │
│ Weekly · Thursdays                 │
│ 12 doses at this level             │
│                            Detail →│
└────────────────────────────────────┘

┌────────────────────────────────────┐
│ 💊 Metformin 500mg                 │
│ Daily · 8:00 AM, 8:00 PM          │
│ 94% adherence (30d)                │
│                            Detail →│
└────────────────────────────────────┘

┌────────────────────────────────────┐
│ 💊 Vitamin D 2000IU                │
│ Daily · 8:00 AM                    │
│                            Detail →│
└────────────────────────────────────┘

[+ Add Medication]
```
- Tap card → Medication Detail screen (S11)
- Adherence % calculated from logs vs schedule
- [+ Add Medication] → Add Medication flow (S13)

**2. Titration Timeline**
```
── Titration: Ozempic ──

 0.25mg          0.5mg           1.0mg
  ✅───────────── ●──────────── ○ ─ ─ ─
 Jan 15-Feb 12   Feb 12-now     planned
 (4 weeks)       (10 weeks)
```
- Visual step chart for GLP-1 dose progression
- Completed steps (✅), current step (●), planned steps (○)
- Auto-built from medication log history
- Tap step for details (dates, notes, side effects during that period)
- [Edit Timeline] for manual adjustments

**3. Injection Site Map**
```
── Injection Sites ──

  ┌─────┬─────┐
  │ 21d │ 7d  │  Arms
  ├─────┼─────┤
  │ 3d  │ 14d │  Abdomen
  ├─────┼─────┤
  │ 28d │ ★   │  Thighs     ★ = next recommended
  └─────┴─────┘
```
- Color-coded: green (7d), yellow (14-21d), gray (28d+)
- Read-only on this screen (logging happens via FAB → S9g)
- Shows days since last use for each site

**4. Medication History**
```
── History ──

Filter: [All ▾]

Apr 21  ✅ Metformin 500mg (8am)
Apr 21  ✅ Metformin 500mg (8pm)
Apr 20  ✅ Ozempic 0.5mg · Left Abdomen
Apr 20  ✅ Metformin 500mg (8am)
Apr 20  ❌ Metformin 500mg (8pm) — missed
...

[Load more]
```
- Filter by medication name
- Taken (✅) vs missed (❌)
- Paginated (30 entries initially, load more)

**What moved OUT:**
- Daily Check-In → Today tab (S7)
- Quick Log buttons → FAB
- Medication Reminders → removed until Phase 2
- Duplicate injection site logging → FAB only

**What's NEW:**
- Adherence % on medication cards
- Visual titration timeline (more prominent)
- Clean card-based layout vs collapsed expanders

---

### S11: Medication Detail (drill-down from S10)

**Purpose:** Full detail view for one medication.

**Content:**
- Medication name, dosage, schedule
- Adherence stats (30d, 60d, 90d)
- Log history for this med (filterable by date range)
- Edit schedule (change time, days)
- [Delete Medication] (with confirmation)

**What changed:**
- New screen. Currently medication details are scattered across expanders.

---

### S12: GLP-1 Detail (drill-down from Today card)

**Purpose:** Deep view into GLP-1 medication journey.

**Content:**
- Current medication + dosage
- Cycle tracker (day X of 7, progress bar)
- Next dose date
- Titration timeline (same as S10 section 2)
- Injection site map (same as S10 section 3)
- Dose history (all GLP-1 logs)
- Side effects correlated to dose timing

**What changed:**
- Consolidates the 3 places GLP-1 info was scattered (Daily Check-In, Cycle Tracker, Reminders)
- Accessible from the Today card with one tap

---

### S13: Add Medication (from S10)

**Purpose:** Set up a new medication schedule.

**Flow:**
1. Medication name (text input or select from common list)
2. Dosage (text input)
3. Frequency: [Daily] [Specific Days] [Weekly]
4. If Daily/Specific Days: time picker(s), day checkboxes
5. If Weekly: day of week picker, time
6. [Save]

**What changed:**
- Dedicated screen instead of form within an expander
- Clearer frequency selection

---

### S14: Profile Tab

**Purpose:** Account settings, data connections, doctor export.

**Layout (top to bottom):**

**1. Your Info**
```
┌────────────────────────────────────┐
│ 👤 James P.                       │
│ james@email.com                    │
│                            Edit → │
└────────────────────────────────────┘
```
- Tap Edit → inline edit: name, GLP-1 medication, dosage, other meds

**2. Health Targets**
```
┌────────────────────────────────────┐
│ 🎯 Health Targets                  │
│                                    │
│ Glucose range: 70-180 mg/dL        │
│ Goal weight: 210 lbs               │
│ Protein target: 100g/day           │
│                            Edit → │
└────────────────────────────────────┘
```
- Tap Edit → inline edit with number inputs

**3. Connected Data Sources** (KEY SECTION)
```
┌────────────────────────────────────┐
│ 🔗 Connected Data Sources          │
│                                    │
│ ✅ Apple Health                    │
│    Last sync: 2 hours ago          │
│    Syncing: Weight, Glucose, Steps │
│    [Manage] [Disconnect]           │
│                                    │
│ ✅ Dexcom CGM                      │
│    Last sync: 30 min ago           │
│    892 readings this month         │
│    [Manage] [Disconnect]           │
│                                    │
│ ⬜ Google Fit                      │
│    Not connected                   │
│    [Connect →]                     │
│                                    │
│ [+ Add Data Source]                │
└────────────────────────────────────┘
```
- Connection status with last sync time
- What data each source is syncing
- One-tap connect for unconnected sources
- Manage → choose which data types to sync
- Disconnect with confirmation

**4. Doctor Export**
```
┌────────────────────────────────────┐
│ 📄 Doctor Export                   │
│                                    │
│ Date range:                        │
│ [7d] [14d] [●30d] [60d] [90d]    │
│                                    │
│ Includes: weight trend, glucose    │
│ chart, medication log, side        │
│ effects, patterns, nutrition       │
│                                    │
│ ⚠️ No side effects logged in range │
│                                    │
│ [Generate PDF →]                   │
└────────────────────────────────────┘
```
- Single canonical location (removed Dashboard duplicate)
- Date range picker
- Data warnings if gaps exist
- Generate → loading → preview → [Download] [Share]

**5. Account**
```
┌────────────────────────────────────┐
│ ⚙️ Account                         │
│                                    │
│ Change password                    │
│ App version: 2.0.0                 │
│ Privacy policy                     │
│ Terms of service                   │
│                                    │
│ [Log out]                          │
│ [Delete account]                   │
└────────────────────────────────────┘
```
- Secure password change (via Clerk)
- Delete account with confirmation + data deletion

**What moved OUT:**
- Upgrade to Pro → removed (Stripe was test mode)
- Admin dashboard → separate admin route (S15)

**What's NEW:**
- Connected Data Sources section (prominent, with sync status)
- Data gap warnings on Doctor Export
- Delete account option
- Privacy policy / terms links

---

### S15: Admin Dashboard (Separate Route, Auth-Gated)

**Purpose:** System stats for admin users only.

**Access:** `/admin` route, requires admin flag on user record. Not visible in normal navigation.

**Content:**
- Total user count
- Aggregate stats (total logs by type)
- User table (email, medication, activity counts)
- Does NOT render twice (current bug fixed)

**What changed:**
- Moved out of Settings (was visible to all users — privacy violation)
- Auth-gated (only admin users can access)
- Rendered once (current code calls `admin_page()` twice)

---

### S16: Edit Entry (Sheet/Modal)

**Purpose:** Edit or delete any logged entry.

**Trigger:** Tap any entry in Recent Activity (Today) or History views.

**Content:**
- Entry type header (Food / Weight / Glucose / Side Effect / Medication)
- All fields for that entry type, pre-filled with current values
- [Save Changes] [Delete] [Cancel]
- Delete has confirmation: "Delete this entry?"

**What changed:**
- Unified edit experience (currently food edit is missing protein/fat/calories fields)
- Accessible from Today's Recent Activity (currently only from Food tab's "Today's Food" section)
- All fields editable (current food edit only allows name, carbs, meal type, notes)

---

## Screen Count Summary

| Category | Screens |
|----------|---------|
| Pre-auth | 3 (Landing, Login, Create Account) |
| Onboarding | 4 (Medication, Goals, Connect Data, Ready) |
| Main tabs | 4 (Today, Trends, Meds, Profile) |
| FAB flows | 7 (Snap Meal, Describe Meal, Recipe, Weight, Glucose, Side Effect, GLP-1 Dose) |
| Detail views | 3 (Medication Detail, GLP-1 Detail, Add Medication) |
| Utility | 2 (Edit Entry, Admin) |
| **Total** | **23 screens** |

vs. Current: ~20 sections crammed into 6 tabs with scroll-to-find navigation

**The difference:** 23 focused screens (one job each) vs. 20 sections stacked vertically in flat tabs. Same feature coverage, dramatically better discoverability.
