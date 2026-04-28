# Information Architecture: GLP-1 Companion Redesign

## What's Wrong With the Current Structure

### The Layout
```
Current: 6 flat tabs, everything stacked vertically within each tab

Dashboard     AI Chat          Health              Food              Medication           Settings
├─ Metrics    ├─ Chat (fake)   ├─ Weight log       ├─ Photo AI log   ├─ Daily Check-In     ├─ Profile
├─ Quick Log  ├─ Alerts        ├─ Glucose log      ├─ Text AI log    ├─ GLP-1 Cycle        ├─ Export PDF
│  (broken)   ├─ Insights      ├─ Side effects     ├─ Recipe calc    ├─ Scheduled Meds     ├─ Upgrade
├─ Patterns   └─ Deep AI       ├─ Dexcom import    ├─ Manual entry   ├─ Quick Log           ├─ Logout
├─ Export PDF                  ├─ Google Fit sync   └─ Today's food   ├─ Titration           └─ Admin (2x,
└─ Activity                    │  (buried)                            ├─ Injection Sites        no auth)
                               └─ (scroll to find)                    ├─ Reminders (fake)
                                                                      └─ History
```

### Top Problems

1. **Data sync is buried.** Dexcom import and Google Fit are at the bottom of the Health tab, below 3 logging forms. The #1 value prop (sync your data) is the hardest thing to find.

2. **No clear home.** Dashboard has 5 unrelated sections. Quick Log doesn't work. Pattern Insights appear in 2 places with different engines.

3. **Medication page has 4 ways to log the same thing.** Daily Check-In, GLP-1 Cycle Tracker, Scheduled Meds inline buttons, and Quick Log all write to the same table.

4. **Food page has 4 input methods stacked vertically.** Photo AI, Text AI, Recipe Calculator, Manual Entry — user has to scroll to find their preferred method.

5. **AI Chat isn't AI.** It's keyword matching returning canned responses. Real AI analysis is hidden below it behind a scroll.

6. **Doctor export is in 2 places** with different capabilities (Dashboard = 30 days fixed, Settings = date range picker).

7. **Fake features.** Medication reminders are stored but never fire. Quick Log on Dashboard just says "go to another tab."

8. **Security holes.** Admin panel visible to all users. Password reset has no verification. OAuth creds hardcoded.

---

## Design Principles for the Redesign

1. **One screen, one job.** Every screen has a single primary action.
2. **Data in first.** Connecting data sources and logging should be the easiest things in the app.
3. **Show patterns everywhere.** Don't hide insights on a separate page — surface them contextually where they matter.
4. **Eliminate duplicates.** One way to do each thing. One place to find it.
5. **Remove what's fake.** No features that don't actually work.

---

## New Structure

### Bottom Navigation (4 tabs + center FAB)

```
┌─────────────────────────────────────────────┐
│                                             │
│              [Screen Content]               │
│                                             │
├─────────────────────────────────────────────┤
│  Today    Trends    [+]    Meds    Profile  │
│   🏠       📊       ➕     💊       👤      │
└─────────────────────────────────────────────┘
```

---

### Tab 1: Today (Home)

**Job:** Show what matters right now. What happened today, what's due, what's interesting.

```
Today
├─ GLP-1 Status Card
│  └─ "Day 4 of 7 · Ozempic 0.5mg · Next dose Thursday"
│     └─ Tap → GLP-1 detail (cycle tracker + titration history)
│
├─ Medication Check-In Card
│  └─ "2 of 3 meds taken today"
│     └─ Tap each med to mark taken (inline toggle)
│     └─ One-tap "All taken" button
│
├─ Today's Numbers (compact row)
│  ├─ Weight: 218.4 lbs (↓0.6)
│  ├─ Glucose: 142 mg/dL (fasting)
│  └─ Protein: 67g / 100g target
│
├─ Pattern Spotlight (1 insight, rotates daily)
│  └─ "Your weight drops faster on days you hit 80g+ protein"
│     └─ Tap → Trends tab with that pattern expanded
│
└─ Recent Activity (last 3-5 items)
   └─ Compact timeline of today's logs
```

**What moved out:**
- Quick Log buttons → replaced by the FAB
- PDF export → moved to Profile
- Full Pattern Insights list → moved to Trends
- "Welcome, {name}" header → replaced with functional content

**What's new:**
- GLP-1 status card (consolidated from 3 places into 1)
- Medication check-in is front and center (was in a tab you had to navigate to)
- Single spotlight insight instead of full list (drives curiosity toward Trends)

---

### Tab 2: Trends

**Job:** Understand your data over time. Charts, patterns, AI analysis.

```
Trends
├─ Time Range Selector (7d / 14d / 30d / 90d)
│
├─ Weight Trend
│  └─ Line chart with goal line + 7-day moving average
│  └─ Contextual insight below chart: "Down 4.2 lbs since dose increase on March 15"
│
├─ Glucose Trend
│  └─ Line chart with target range band
│  └─ Contextual insight: "Fasting glucose averaging 128 — trending toward target"
│
├─ Pattern Cards (scrollable)
│  ├─ Weight ↔ Dose correlation
│  ├─ Side Effects ↔ Dose timing
│  ├─ Protein ↔ Weight correlation
│  └─ Low protein warning (if applicable)
│
├─ Ask AI (inline, not a separate page)
│  └─ "Ask about your data..." input
│  └─ Claude Sonnet with full data context (replaces fake keyword chat)
│  └─ Suggested questions based on current data
│
└─ Deep Analysis
   └─ "Run Full Analysis" button → Claude generates narrative report
   └─ Cached, refreshable
```

**What moved out:**
- Basic threshold alerts → eliminated (patterns are more valuable)
- Fake keyword-matching chat → replaced with real Claude integration

**What's new:**
- Contextual insights attached to their charts (not on a separate page)
- AI chat is inline below the data it's analyzing (not a standalone tab)
- Single pattern engine (eliminate the duplicate threshold system)

---

### Center: + FAB (Floating Action Button)

**Job:** Quick-log anything in 2 taps.

```
Tap [+] → Action sheet slides up:

┌─────────────────────────┐
│  What are you logging?  │
│                         │
│  📸  Snap a Meal        │  → Camera opens immediately
│  ✏️  Describe a Meal    │  → Text input + AI analysis
│  🍳  Log a Recipe       │  → Recipe calculator flow
│  ⚖️  Weight             │  → Number input, one tap save
│  🩸  Glucose            │  → Number + context, save
│  😣  Side Effect        │  → Symptom + severity, save
│  💉  GLP-1 Dose         │  → Injection site picker, save
│                         │
└─────────────────────────┘
```

**Design rules:**
- Most common actions at the top (food logging first — it's the most frequent)
- Each action opens a focused single-screen form
- After logging, return to Today (with the new entry visible in Recent Activity)
- No "manual entry" as a separate option — the "Describe a Meal" path handles free text, and the confirmation form allows manual override of any field

**What was eliminated:**
- 4 separate food logging sections on one page → 3 clear paths (Photo, Text, Recipe)
- Manual entry as a standalone form → merged into text path (type "chicken breast 6oz" and edit the AI's estimate, or just fill in the fields yourself)
- 4 medication logging paths → 1 path for GLP-1 doses (with injection site), daily meds handled by check-in on Today

---

### Tab 3: Meds

**Job:** Manage your medication regimen. Schedule, titration, history.

```
Meds
├─ Active Medications (card list)
│  ├─ Ozempic 0.5mg — Weekly (Thursdays)
│  │  └─ Tap → Detail: schedule, titration timeline, dose history
│  ├─ Metformin 500mg — Daily (8am, 8pm)
│  │  └─ Tap → Detail: schedule, adherence %, history
│  └─ [+ Add Medication] button
│
├─ Titration Timeline (for GLP-1)
│  └─ Visual step chart: 0.25mg → 0.5mg → 1mg
│  └─ Current step highlighted, planned steps shown
│  └─ "Auto-built from your log history" or manual edit
│
├─ Injection Site Map
│  └─ Body diagram with color-coded recency
│  └─ "Next recommended: Left Thigh"
│  └─ Read-only — injection site is logged when you log a dose via FAB
│
└─ History
   └─ Filterable log: all med entries with date, name, dosage, taken/missed
```

**What moved out:**
- Daily check-in → moved to Today tab (it's a daily action, not a management action)
- Quick Log buttons → eliminated (FAB handles this)
- Medication reminders → removed until push notifications exist (Phase 2 with Capacitor)
- 4 duplicate logging paths → consolidated to FAB + Today check-in

**What's new:**
- Card-based medication list with detail drill-down
- Injection site map is read-only here (writes happen through the FAB dose logging flow)
- Titration timeline is more prominent

---

### Tab 4: Profile

**Job:** Your account, your settings, your data connections, your exports.

```
Profile
├─ Your Info
│  └─ Name, GLP-1 medication, dosage, other meds
│  └─ Tap to edit
│
├─ Health Targets
│  └─ Glucose range, weight goal, protein target
│  └─ Tap to edit
│
├─ Connected Data Sources ← THIS IS THE KEY SECTION
│  ├─ Apple Health: Connected ✓ (last sync: 2 hours ago)
│  │  └─ Syncing: Weight, Glucose, Steps
│  │  └─ [Manage] [Disconnect]
│  ├─ Dexcom: Connected ✓ (last sync: 30 min ago)
│  │  └─ [Manage] [Disconnect]
│  ├─ Google Fit: Not connected
│  │  └─ [Connect]
│  └─ [+ Add Data Source]
│
├─ Doctor Export
│  └─ Date range picker (7/14/30/60/90 days)
│  └─ Preview of what's included
│  └─ "Generate PDF" button
│  └─ One place, one version (eliminated the Dashboard duplicate)
│
└─ Account
   └─ Email
   └─ Change password (with proper verification)
   └─ Log out
   └─ Delete account
```

**What moved out:**
- Upgrade to Pro → removed for now (Stripe link was test mode, features were already free)
- Admin dashboard → moved to a separate admin route with auth gate (not inside user settings)

**What's new:**
- Connected Data Sources section is prominent and clear
- Each source shows connection status, last sync time, and what's being synced
- Doctor Export is the single canonical version (date range picker, one location)
- Proper account management (change password with verification, delete account)

---

## Onboarding Flow (New Users)

**Goal:** Connect your first data source within 2 minutes of signup.

```
Step 1: Welcome
└─ "GLP-1 Companion helps you see the patterns in your health data."
   └─ [Get Started]

Step 2: Your Medication
└─ "What GLP-1 are you taking?"
   └─ Medication picker (Ozempic, Mounjaro, Wegovy, etc.)
   └─ Current dosage
   └─ [Next]

Step 3: Your Goals
└─ "What are you working toward?"
   └─ Goal weight (optional)
   └─ Protein target (optional, with smart default)
   └─ [Next] or [Skip for now]

Step 4: Connect Your Data ← THE CRITICAL STEP
└─ "The more data you connect, the better your patterns."
   └─ Apple Health card → [Connect] (one tap, permission modal)
   └─ Dexcom card → [Connect] (OAuth flow)
   └─ Google Fit card → [Connect] (OAuth flow)
   └─ "I'll enter data manually" → [Skip]
   └─ Each connection shows ✓ when complete

Step 5: You're Ready
└─ "Here's what you can do:" (3 quick tips)
   └─ [Go to your Dashboard]
```

**Rules:**
- Steps 2 and 3 can be skipped (filled in later via Profile)
- Step 4 cannot be skipped but "manual entry" is always an option
- After onboarding, the user lands on Today with any synced data already visible
- If they connected Apple Health, their recent weight/glucose readings are already populated

---

## What Gets Removed Entirely

| Feature | Why |
|---------|-----|
| Fake AI Chat (keyword matching) | Replace with real Claude integration in Trends |
| Medication Reminders UI | Reminders don't work without push notifications. Bring back in Phase 2 with Capacitor |
| Dashboard Quick Log (non-functional) | Replaced by FAB |
| Duplicate PDF Export (Dashboard) | Single version in Profile with date range picker |
| Duplicate Pattern Insights (Insights page) | Single pattern engine, shown in Trends + spotlight on Today |
| Admin Dashboard (in Settings) | Separate admin route with auth gate |
| Upgrade to Pro (test Stripe link) | Remove until real billing is implemented |
| Manual Food Entry (standalone) | Merged into "Describe a Meal" flow with editable confirmation form |
| Debug output in food photo analysis | Remove |

---

## Migration Map: Current → New

| Current Location | Content | New Location |
|-----------------|---------|-------------|
| Dashboard → Metrics | Today's numbers | **Today** → Today's Numbers row |
| Dashboard → Quick Log | Broken buttons | **Removed** (FAB replaces) |
| Dashboard → Patterns | Pattern insights | **Trends** → Pattern Cards |
| Dashboard → Export PDF | 30-day export | **Profile** → Doctor Export (with date range) |
| Dashboard → Recent Activity | Activity feed | **Today** → Recent Activity |
| AI Chat → Chat | Keyword matching | **Removed** → replaced by real AI in Trends |
| AI Chat → Alerts | Threshold warnings | **Removed** (patterns are better) |
| AI Chat → Insights | Basic insights | **Removed** (consolidated into Trends patterns) |
| AI Chat → Deep AI | Claude analysis | **Trends** → Deep Analysis |
| Health → Weight | Weight logging | **FAB** → Weight + **Trends** → Weight chart |
| Health → Glucose | Glucose logging | **FAB** → Glucose + **Trends** → Glucose chart |
| Health → Side Effects | Side effect logging | **FAB** → Side Effect |
| Health → Dexcom Import | CSV upload | **Profile** → Connected Data Sources → Dexcom |
| Health → Google Fit | OAuth sync | **Profile** → Connected Data Sources → Google Fit |
| Food → Photo AI | Camera food logging | **FAB** → Snap a Meal |
| Food → Text AI | Text food logging | **FAB** → Describe a Meal |
| Food → Recipe Calc | Recipe calculator | **FAB** → Log a Recipe |
| Food → Manual Entry | Manual food form | **Merged** into Describe a Meal (editable form) |
| Food → Today's Food | Edit/delete entries | **Today** → tap food entry to edit/delete |
| Medication → Check-In | Daily med confirmation | **Today** → Medication Check-In Card |
| Medication → GLP-1 Cycle | Weekly dose tracker | **Today** → GLP-1 Status Card (summary) + **FAB** → GLP-1 Dose (logging) |
| Medication → Scheduled Meds | Med schedule management | **Meds** → Active Medications |
| Medication → Quick Log | One-tap med logging | **Removed** (Today check-in + FAB cover this) |
| Medication → Titration | Dose escalation timeline | **Meds** → Titration Timeline |
| Medication → Injection Sites | Site rotation tracking | **Meds** → Injection Site Map (read-only) |
| Medication → Reminders | Reminder settings | **Removed** until Phase 2 (push notifications) |
| Medication → History | Med log history | **Meds** → History |
| Settings → Profile | User settings | **Profile** → Your Info + Health Targets |
| Settings → Export PDF | PDF with date range | **Profile** → Doctor Export |
| Settings → Upgrade | Stripe link | **Removed** |
| Settings → Logout | Logout button | **Profile** → Account |
| Settings → Admin | All-user stats | **Separate admin route** (auth-gated) |

---

## Screen Count Comparison

| | Current | New |
|---|---|---|
| **Top-level sections** | 6 tabs (flat) | 4 tabs + FAB |
| **Total distinct screens** | ~20 sections on 6 pages | 4 main screens + 7 FAB flows + onboarding |
| **Ways to log food** | 4 | 3 (Photo, Text, Recipe) |
| **Ways to log medication** | 4 | 2 (Today check-in, FAB for GLP-1 dose) |
| **Places to find patterns** | 3 (Dashboard, Insights, Deep AI) | 1 (Trends, with spotlight on Today) |
| **Places to export PDF** | 2 | 1 |
| **GLP-1 next dose shown** | 3 places | 1 (Today card) |
| **Fake/broken features** | 4 | 0 |
