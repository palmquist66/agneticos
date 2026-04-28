# Data Sync Hub Spec

Central system for managing all health data connections. Lives in Profile tab (S14, section 3) and powers the onboarding connect step (S5).

---

## What the Sync Hub Is

A single place where users see every connected data source, its status, what it's syncing, and controls to manage it. This replaces:
- Dexcom CSV import buried at the bottom of the Health tab
- Google Fit OAuth hidden behind a scroll
- No Apple Health integration at all
- No visibility into sync status or what data is being pulled

---

## Architecture Overview

```
┌────────────────────────────────┐
│          Frontend UI           │
│  (Profile → Connected Sources) │
└──────────────┬─────────────────┘
               │
               ▼
┌────────────────────────────────┐
│         API Routes             │
│  /api/sync/[source]/connect    │
│  /api/sync/[source]/disconnect │
│  /api/sync/[source]/pull       │
│  /api/sync/status              │
└──────────────┬─────────────────┘
               │
               ▼
┌────────────────────────────────┐
│        Sync Service            │
│  Token management              │
│  Data mapping                  │
│  Pagination / rate limiting    │
│  Error handling                │
└──────────┬──────────┬──────────┘
           │          │
     ┌─────▼─────┐ ┌─▼──────────┐
     │  Dexcom   │ │ Google Fit  │  ... (Apple Health via Capacitor)
     │  API v3   │ │ REST API    │
     └───────────┘ └─────────────┘
```

---

## Supported Data Sources

| Source | Data Types | Auth Method | Platform | Sync Model |
|--------|-----------|------------|----------|------------|
| Apple Health | Weight, glucose, steps, heart rate, active energy | HealthKit permissions (on-device) | iOS native (Capacitor) | On-demand pull + background delivery |
| Dexcom CGM | EGV (glucose readings), events (carbs, insulin, exercise) | OAuth 2.0 | All (API-based) | On-demand pull |
| Google Fit | Weight, steps, activity sessions | OAuth 2.0 (Google) | All (API-based) | On-demand pull |

### Future sources (not in v1, but schema supports them)
- Fitbit (weight, steps, heart rate)
- Withings (weight via smart scale)
- MyFitnessPal (food log import)
- Manual CSV import (any structured data)

---

## Database Schema

### DataSourceConnection table

```prisma
model DataSourceConnection {
  id              String   @id @default(cuid())
  userId          String
  source          String   // 'dexcom' | 'google_fit' | 'apple_health'
  status          String   // 'connected' | 'disconnected' | 'error' | 'expired'
  accessToken     String?  // encrypted
  refreshToken    String?  // encrypted
  tokenExpiresAt  DateTime?
  scopes          String[] // what data types are authorized
  lastSyncAt      DateTime?
  lastSyncStatus  String?  // 'success' | 'partial' | 'failed'
  lastSyncRecords Int?     // count of records pulled in last sync
  lastSyncError   String?  // error message if failed
  metadata        Json?    // source-specific data (e.g., Dexcom device type)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  user User @relation(fields: [userId], references: [id])

  @@unique([userId, source])
}
```

### SyncLog table (audit trail)

```prisma
model SyncLog {
  id          String   @id @default(cuid())
  userId      String
  source      String
  action      String   // 'pull' | 'connect' | 'disconnect' | 'refresh_token'
  status      String   // 'success' | 'partial' | 'failed'
  recordCount Int?
  dateFrom    DateTime?
  dateTo      DateTime?
  error       String?
  durationMs  Int?
  createdAt   DateTime @default(now())
}
```

---

## UI: Connected Data Sources (Profile Tab)

### Default state (mixed connections)

```
┌────────────────────────────────────┐
│ 🔗 Data Sources                    │
│                                    │
│ ┌──────────────────────────────┐   │
│ │ ✅ Dexcom CGM                │   │
│ │ Last sync: 30 min ago        │   │
│ │ 892 glucose readings (30d)   │   │
│ │                              │   │
│ │ [Sync Now]    [Manage ▾]     │   │
│ └──────────────────────────────┘   │
│                                    │
│ ┌──────────────────────────────┐   │
│ │ 💚 Google Fit                │   │
│ │ Connected · Last sync: 2 hrs │   │
│ │ Syncing: Weight, Steps       │   │
│ │                              │   │
│ │ [Sync Now]    [Manage ▾]     │   │
│ └──────────────────────────────┘   │
│                                    │
│ ┌──────────────────────────────┐   │
│ │ 🍎 Apple Health              │   │
│ │ Not connected                │   │
│ │ Weight, glucose, steps,      │   │
│ │ heart rate                   │   │
│ │                              │   │
│ │ [Connect →]                  │   │
│ └──────────────────────────────┘   │
│                                    │
└────────────────────────────────────┘
```

### Card states

Each source card has one of these states:

**Connected (healthy)**
- Green checkmark icon
- "Last sync: {relative time}"
- Record count for the period
- [Sync Now] and [Manage] buttons

**Connected (stale sync)**
- Yellow warning icon
- "Last sync: 3 days ago"
- [Sync Now] button is highlighted/prominent
- Subtle nudge: "Tap Sync Now to pull latest data"

**Connected (error)**
- Red warning icon
- "Sync failed: {error summary}"
- [Retry] button
- [Manage] to see details or disconnect

**Connected (token expired)**
- Orange warning icon
- "Reconnection needed"
- [Reconnect →] button (re-runs OAuth)
- Existing data is preserved

**Not connected**
- Gray/dimmed card
- Description of what the source provides
- [Connect →] button

**Not available (platform)**
- Apple Health on web: "Available in the iOS app"
- Dimmed, no connect button

---

## Connection Flows (Per Source)

### Dexcom CGM

**Connect flow:**
1. User taps [Connect] on Dexcom card
2. Confirmation sheet:
   ```
   Connect Dexcom CGM

   Sign in to your Dexcom account to sync
   continuous glucose readings.

   What we'll access:
   • Glucose readings (EGV data)
   • Device events (carbs, exercise)

   You can disconnect anytime.

   [Sign in to Dexcom →]    [Cancel]
   ```
3. In-app browser opens Dexcom OAuth URL:
   ```
   https://sandbox-api.dexcom.com/v3/oauth2/login
   ?client_id={CLIENT_ID}
   &redirect_uri=http://localhost:3000/auth/dexcom/callback
   &response_type=code
   &scope=offline_access
   ```
   (Production: `api.dexcom.com` instead of `sandbox-api`)
4. User signs in on Dexcom's page, authorizes the app
5. Redirect to callback URL with `code` parameter
6. Backend exchanges code for access + refresh tokens:
   ```
   POST /v3/oauth2/token
   grant_type=authorization_code
   code={code}
   redirect_uri={redirect_uri}
   ```
7. Store tokens encrypted in DataSourceConnection
8. Trigger initial sync (last 30 days)
9. UI updates: card shows ✅, sync progress, then record count

**Token management:**
- Access token expires in 7200 seconds (2 hours)
- Refresh token used to get new access token before expiry
- Refresh happens automatically on any sync request
- If refresh fails (user revoked access on Dexcom side), status → 'expired', prompt reconnection

**Data mapping (Dexcom → app):**
| Dexcom Field | App Table | App Field | Notes |
|-------------|-----------|-----------|-------|
| egv.value | GlucoseLog | value | mg/dL, no conversion needed |
| egv.systemTime | GlucoseLog | logged_at | UTC timestamp |
| egv.trend | GlucoseLog | context | Map to 'flat', 'rising', 'falling', etc. |
| egv.trendRate | GlucoseLog | metadata.trendRate | mg/dL/min, stored for pattern engine |
| event.eventType='carbs' | FoodLog | (optional enrichment) | Can correlate with user's food logs |
| event.eventType='exercise' | (future) | — | Not mapped in v1 |

**Sync pagination:**
- Dexcom API has 30-day max per request
- For initial sync: 1 request (last 30 days)
- For historical backfill (if needed): chunk into 30-day windows, working backwards
- Each request returns up to ~8,640 readings (1 every 5 min × 30 days)

**Rate limits:**
- Dexcom API: no published rate limits for user-scoped data
- Self-imposed: max 1 sync per source per 5 minutes (prevent button mashing)

**Deduplication:**
- EGV readings have unique `systemTime` per user
- Before insert: check if GlucoseLog exists for that user + timestamp
- Skip duplicates, only insert new readings
- Log dedup count in SyncLog

---

### Google Fit

**Connect flow:**
1. Tap [Connect] on Google Fit card
2. Confirmation sheet (same pattern as Dexcom)
3. Google OAuth consent screen:
   ```
   https://accounts.google.com/o/oauth2/v2/auth
   ?client_id={CLIENT_ID}
   &redirect_uri={REDIRECT_URI}
   &response_type=code
   &scope=https://www.googleapis.com/auth/fitness.body.read
          https://www.googleapis.com/auth/fitness.activity.read
   &access_type=offline
   ```
4. User authorizes
5. Backend exchanges code for tokens
6. Initial sync (last 30 days)

**Data mapping (Google Fit → app):**
| Google Fit DataType | App Table | App Field | Notes |
|--------------------|-----------|-----------|-------|
| com.google.weight | WeightLog | weight | Convert kg → lbs if user preference |
| com.google.step_count.delta | (future) | — | Steps tracking not in v1 schema |
| com.google.heart_rate.bpm | (future) | — | Not in v1 |

**Note:** Google Fit primarily provides weight data for our current use case. Steps and heart rate are pulled but not displayed until those features are built.

**Token management:**
- Google access tokens expire in 1 hour
- Refresh token is long-lived
- Same auto-refresh pattern as Dexcom

**Deduplication:**
- Weight readings: check WeightLog for same user + date (round to date, keep latest if multiple)
- Google Fit timestamps may differ slightly from manual entries — use 1-hour window for dedup

---

### Apple Health (Capacitor — Phase 2, spec for reference)

**Connect flow:**
1. Tap [Connect] on Apple Health card
2. iOS HealthKit authorization sheet appears (system UI):
   ```
   "GLP-1 Companion" Would Like to Access Your Health Data

   [Categories listed with toggles]
   ✓ Weight
   ✓ Blood Glucose
   ✓ Steps
   ✓ Heart Rate
   ✓ Active Energy

   [Don't Allow]    [Allow]
   ```
3. No OAuth — this is an on-device permission
4. On grant: start reading historical data + register for background delivery

**Data mapping (HealthKit → app):**
| HealthKit Type | App Table | App Field |
|---------------|-----------|-----------|
| HKQuantityType.bodyMass | WeightLog | weight |
| HKQuantityType.bloodGlucose | GlucoseLog | value |
| HKQuantityType.stepCount | (future) | — |
| HKQuantityType.heartRate | (future) | — |

**Background delivery:**
- Register for `HKObserverQuery` on each granted type
- When new samples arrive in HealthKit (from any app/device), our app is woken to process them
- This enables "auto-sync" without user intervention
- Battery impact: minimal — Apple batches observer deliveries

**Permissions note:**
- User can revoke individual types in iOS Settings > Privacy > Health
- Check permissions on each sync attempt — gracefully handle partial revocation
- Cannot programmatically check if user has Apple Health data without requesting permission first

---

## Sync Triggers

| Trigger | When | Sources |
|---------|------|---------|
| **Manual (Sync Now button)** | User taps button in Profile | Any connected source |
| **App open** | User opens the app | All connected sources, if last sync > 15 min ago |
| **Onboarding** | Step 5 of first-time flow | All sources just connected |
| **Background (Apple Health only)** | New data arrives in HealthKit | Apple Health |
| **Scheduled (future)** | Every 4 hours if app is installed | API-based sources (requires background fetch capability) |

**Sync-on-open behavior:**
```
App opens
  → Check each connected source's lastSyncAt
  → If any source is >15 min stale:
    → Show subtle sync indicator in header (spinning icon, not blocking)
    → Pull new data since lastSyncAt
    → Update lastSyncAt on completion
    → Today screen updates reactively (no manual refresh needed)
```

**UI during sync:**
- Non-blocking — user can interact with the app while sync runs
- Small spinner next to source name in header or on Today screen
- Toast on completion: "Synced 12 new glucose readings from Dexcom"
- No toast if no new data (silent success)

---

## Manage Source (Expanded Card)

Tapping [Manage] on a connected source expands the card or opens a bottom sheet:

```
┌────────────────────────────────────┐
│ 📊 Dexcom CGM                     │
│                                    │
│ Status: Connected ✅               │
│ Connected since: April 21, 2026    │
│ Last sync: 30 minutes ago          │
│                                    │
│ Sync history:                      │
│ Apr 28 — 14 readings, success      │
│ Apr 27 — 287 readings, success     │
│ Apr 26 — 288 readings, success     │
│ Apr 25 — failed (network)          │
│                                    │
│ Data synced this month: 892        │
│ Total readings: 1,847              │
│                                    │
│ ──────────────────────────────     │
│                                    │
│ [Sync Now]                         │
│ [Disconnect]                       │
│                                    │
└────────────────────────────────────┘
```

**Disconnect flow:**
1. Tap [Disconnect]
2. Confirmation dialog:
   ```
   Disconnect Dexcom?

   Your existing glucose data will be kept.
   New readings won't sync until you reconnect.

   [Disconnect]    [Cancel]
   ```
3. On confirm:
   - Delete access + refresh tokens from DataSourceConnection
   - Set status to 'disconnected'
   - Existing data in GlucoseLog/WeightLog is NOT deleted
   - Log disconnect in SyncLog
4. Card reverts to "Not connected" with [Connect →]

**Data retention on disconnect:**
- Synced data stays in the database
- User explicitly owns their data — we don't delete it when they disconnect a source
- If they reconnect later, deduplication prevents doubles

---

## Error Handling

### Error types and UI responses

| Error | Cause | UI | Recovery |
|-------|-------|-----|---------|
| **Token expired** | Access token expired, refresh failed | Orange badge: "Reconnection needed" + [Reconnect →] | Re-run OAuth |
| **Rate limited** | Too many sync requests | "Try again in a few minutes" | Auto-retry with backoff |
| **Network error** | No connection during sync | "Sync failed — check your connection" + [Retry] | Retry button |
| **Partial sync** | Some data pulled, then error | "Synced 45 of ~288 readings" | Auto-complete on next sync |
| **Source revoked** | User revoked access on Dexcom/Google side | "Access revoked — reconnect to resume syncing" + [Reconnect →] | Re-run OAuth |
| **No data** | Source connected but empty | "Connected, but no data found for the last 30 days" | No action needed — will sync when data exists |
| **Schema mismatch** | API response doesn't match expected format | "Sync error — we're looking into it" (log for debugging) | Backend fix |

### Retry strategy

```
Attempt 1: immediate
Attempt 2: wait 5 seconds
Attempt 3: wait 30 seconds
Attempt 4: wait 5 minutes
Then: give up, show error with manual retry
```

### Sync health check

On app open, if any source has `status: 'error'` and `lastSyncAt` is >24 hours ago, surface in Today screen:

```
┌────────────────────────────────────┐
│ ⚠️ Dexcom hasn't synced in 2 days  │
│    [Fix in Profile →]              │
└────────────────────────────────────┘
```

---

## Security

### Token storage
- Access and refresh tokens are encrypted at rest in the database
- Encryption: AES-256-GCM with a key from environment variable (`ENCRYPTION_KEY`)
- Tokens are never sent to the frontend — sync operations happen server-side
- Tokens are never logged (redact in any logging)

### OAuth security
- State parameter used in all OAuth flows (CSRF prevention)
- PKCE (Proof Key for Code Exchange) where supported
- Redirect URIs are exact-match (no wildcards)
- Tokens are exchanged server-side only (code → token exchange never happens in browser)

### Data in transit
- All API calls to Dexcom/Google over HTTPS
- App ↔ backend communication over HTTPS
- No health data stored in localStorage or cookies

---

## Sync Status API

### GET /api/sync/status

Returns current state of all sources for the authenticated user.

```json
{
  "sources": [
    {
      "source": "dexcom",
      "status": "connected",
      "lastSyncAt": "2026-04-28T14:30:00Z",
      "lastSyncStatus": "success",
      "lastSyncRecords": 14,
      "totalRecords": 1847
    },
    {
      "source": "google_fit",
      "status": "connected",
      "lastSyncAt": "2026-04-28T12:15:00Z",
      "lastSyncStatus": "success",
      "lastSyncRecords": 1,
      "totalRecords": 47
    },
    {
      "source": "apple_health",
      "status": "not_connected",
      "available": false,
      "reason": "Requires iOS app"
    }
  ]
}
```

### POST /api/sync/[source]/pull

Triggers a manual sync for a specific source. Returns immediately with sync job ID; client polls for completion.

```json
// Request
POST /api/sync/dexcom/pull

// Response (202 Accepted)
{
  "syncId": "sync_abc123",
  "status": "in_progress"
}

// Poll: GET /api/sync/job/sync_abc123
{
  "syncId": "sync_abc123",
  "status": "completed",
  "recordsImported": 14,
  "recordsSkipped": 2,
  "dateRange": {
    "from": "2026-04-28T00:00:00Z",
    "to": "2026-04-28T14:30:00Z"
  }
}
```

---

## Implementation Notes

### Phase 6 tasks (from implementation plan) mapped to this spec

| Task | This spec section |
|------|------------------|
| Dexcom OAuth integration | Connection Flows → Dexcom |
| Dexcom sync UI | UI: Connected Data Sources + Card states |
| Google Fit OAuth integration | Connection Flows → Google Fit |
| Google Fit sync UI | UI: Connected Data Sources + Card states |
| Apple Health placeholder | Card states → Not available |
| Sync-on-open | Sync Triggers → App open |
| Manage connections | Manage Source + Disconnect flow |

### What to build first

1. **DataSourceConnection + SyncLog schema** — Prisma migration
2. **Dexcom OAuth flow** — already validated in sandbox (April 21 session)
3. **Dexcom data pull + mapping** — EGV endpoint proven in sandbox
4. **Sync status API** — frontend needs this to display cards
5. **Profile UI cards** — display states, connect/disconnect/sync buttons
6. **Google Fit OAuth** — same pattern as Dexcom, different API
7. **Sync-on-open** — background sync trigger
8. **Apple Health placeholder** — card with "available in mobile app"

### Shared code

Both Dexcom and Google Fit follow the same pattern. Extract a base sync service:

```typescript
interface SyncProvider {
  name: string
  getAuthUrl(state: string): string
  exchangeCode(code: string): Promise<TokenPair>
  refreshToken(refreshToken: string): Promise<TokenPair>
  pullData(accessToken: string, since: Date): Promise<SyncResult>
  mapToSchema(rawData: any): HealthRecord[]
}
```

Each source implements this interface. The sync service orchestrates: check tokens → refresh if needed → pull data → deduplicate → insert → update status.
