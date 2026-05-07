import { db } from "@/lib/db";
import { encrypt, decrypt } from "@/lib/crypto";

// ─── Config ──────────────────────────────────────────────

const SANDBOX = process.env.DEXCOM_USE_SANDBOX === "true";
const BASE_URL = SANDBOX
  ? "https://sandbox-api.dexcom.com"
  : "https://api.dexcom.com";

function getClientId(): string {
  const id = process.env.DEXCOM_CLIENT_ID;
  if (!id) throw new Error("DEXCOM_CLIENT_ID is required");
  return id;
}

function getClientSecret(): string {
  const secret = process.env.DEXCOM_CLIENT_SECRET;
  if (!secret) throw new Error("DEXCOM_CLIENT_SECRET is required");
  return secret;
}

function getRedirectUri(): string {
  return process.env.DEXCOM_REDIRECT_URI || "http://localhost:3000/api/sync/dexcom/callback";
}

// ─── OAuth ───────────────────────────────────────────────

/** Build the Dexcom OAuth authorization URL */
export function getDexcomAuthUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: getClientId(),
    redirect_uri: getRedirectUri(),
    response_type: "code",
    scope: "offline_access",
    state,
  });
  return `${BASE_URL}/v3/oauth2/login?${params}`;
}

type TokenPair = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // seconds
};

/** Exchange an authorization code for tokens */
export async function exchangeCode(code: string): Promise<TokenPair> {
  const res = await fetch(`${BASE_URL}/v3/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: getClientId(),
      client_secret: getClientSecret(),
      code,
      grant_type: "authorization_code",
      redirect_uri: getRedirectUri(),
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Dexcom token exchange failed (${res.status}): ${text}`);
  }

  const data = await res.json();
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in,
  };
}

/** Refresh an expired access token */
export async function refreshAccessToken(encryptedRefreshToken: string): Promise<TokenPair> {
  const refreshToken = decrypt(encryptedRefreshToken);

  const res = await fetch(`${BASE_URL}/v3/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: getClientId(),
      client_secret: getClientSecret(),
      refresh_token: refreshToken,
      grant_type: "refresh_token",
      redirect_uri: getRedirectUri(),
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Dexcom token refresh failed (${res.status}): ${text}`);
  }

  const data = await res.json();
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in,
  };
}

// ─── Token Management ────────────────────────────────────

/** Get a valid access token for the user, refreshing if needed */
export async function getValidAccessToken(userId: string): Promise<string> {
  const connection = await db.dataSourceConnection.findUnique({
    where: { userId_source: { userId, source: "dexcom" } },
  });

  if (!connection || connection.status === "disconnected") {
    throw new Error("Dexcom is not connected");
  }

  if (!connection.accessToken || !connection.refreshToken) {
    throw new Error("Dexcom tokens missing — reconnection needed");
  }

  // Check if token is still valid (with 5-min buffer)
  const bufferMs = 5 * 60 * 1000;
  if (connection.tokenExpiresAt && connection.tokenExpiresAt.getTime() > Date.now() + bufferMs) {
    return decrypt(connection.accessToken);
  }

  // Token expired — refresh it
  try {
    const tokens = await refreshAccessToken(connection.refreshToken);
    const expiresAt = new Date(Date.now() + tokens.expiresIn * 1000);

    await db.dataSourceConnection.update({
      where: { id: connection.id },
      data: {
        accessToken: encrypt(tokens.accessToken),
        refreshToken: encrypt(tokens.refreshToken),
        tokenExpiresAt: expiresAt,
        status: "connected",
      },
    });

    await db.syncLog.create({
      data: {
        userId,
        source: "dexcom",
        action: "refresh_token",
        status: "success",
      },
    });

    return tokens.accessToken;
  } catch (err) {
    // Refresh failed — mark as expired
    await db.dataSourceConnection.update({
      where: { id: connection.id },
      data: { status: "expired", lastSyncError: "Token refresh failed" },
    });

    await db.syncLog.create({
      data: {
        userId,
        source: "dexcom",
        action: "refresh_token",
        status: "failed",
        error: err instanceof Error ? err.message : "Unknown error",
      },
    });

    throw new Error("Dexcom token expired — reconnection needed");
  }
}

// ─── Data Fetch ──────────────────────────────────────────

type DexcomEgv = {
  recordId: string;
  systemTime: string;
  displayTime: string;
  value: number;
  trend: string;
  trendRate: number | null;
  unit: string;
};

type DexcomEgvResponse = {
  records: DexcomEgv[];
};

/** Map Dexcom trend strings to context labels */
function mapTrend(trend: string): string {
  const map: Record<string, string> = {
    doubleUp: "rising_fast",
    singleUp: "rising",
    fortyFiveUp: "rising_slightly",
    flat: "flat",
    fortyFiveDown: "falling_slightly",
    singleDown: "falling",
    doubleDown: "falling_fast",
    none: "unknown",
    notComputable: "unknown",
    rateOutOfRange: "unknown",
  };
  return map[trend] || "unknown";
}

/** Fetch EGV (glucose) readings from Dexcom for a date range */
async function fetchEgvReadings(
  accessToken: string,
  startDate: Date,
  endDate: Date
): Promise<DexcomEgv[]> {
  const params = new URLSearchParams({
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  });

  const res = await fetch(`${BASE_URL}/v3/users/self/egvs?${params}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Dexcom EGV fetch failed (${res.status}): ${text}`);
  }

  const data: DexcomEgvResponse = await res.json();
  return data.records || [];
}

// ─── Sync Orchestration ──────────────────────────────────

export type SyncResult = {
  imported: number;
  skipped: number;
  dateFrom: Date;
  dateTo: Date;
  durationMs: number;
};

/** Pull glucose readings from Dexcom and store them */
export async function syncDexcomGlucose(userId: string): Promise<SyncResult> {
  const startTime = Date.now();

  const accessToken = await getValidAccessToken(userId);

  // Determine date range: from last sync or 30 days back
  const connection = await db.dataSourceConnection.findUnique({
    where: { userId_source: { userId, source: "dexcom" } },
  });

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const startDate = connection?.lastSyncAt || thirtyDaysAgo;
  const endDate = now;

  // Dexcom API has 90-day max per request, but we cap at 30 days
  const readings = await fetchEgvReadings(accessToken, startDate, endDate);

  let imported = 0;
  let skipped = 0;

  for (const egv of readings) {
    const loggedAt = new Date(egv.systemTime);

    // Dedup: check if we already have this reading
    const existing = await db.glucoseLog.findFirst({
      where: {
        userId,
        loggedAt,
        source: "dexcom",
      },
    });

    if (existing) {
      skipped++;
      continue;
    }

    await db.glucoseLog.create({
      data: {
        userId,
        value: egv.value,
        context: mapTrend(egv.trend),
        source: "dexcom",
        loggedAt,
        metadata: {
          trendRate: egv.trendRate,
          recordId: egv.recordId,
          unit: egv.unit,
          displayTime: egv.displayTime,
        },
      },
    });

    imported++;
  }

  const durationMs = Date.now() - startTime;

  // Update connection status
  await db.dataSourceConnection.update({
    where: { userId_source: { userId, source: "dexcom" } },
    data: {
      lastSyncAt: now,
      lastSyncStatus: "success",
      lastSyncRecords: imported,
      lastSyncError: null,
    },
  });

  // Log the sync
  await db.syncLog.create({
    data: {
      userId,
      source: "dexcom",
      action: "pull",
      status: "success",
      recordCount: imported,
      dateFrom: startDate,
      dateTo: endDate,
      durationMs,
    },
  });

  return { imported, skipped, dateFrom: startDate, dateTo: endDate, durationMs };
}

/** Store initial tokens after OAuth callback */
export async function storeDexcomConnection(
  userId: string,
  tokens: TokenPair
): Promise<void> {
  const expiresAt = new Date(Date.now() + tokens.expiresIn * 1000);

  await db.dataSourceConnection.upsert({
    where: { userId_source: { userId, source: "dexcom" } },
    create: {
      userId,
      source: "dexcom",
      status: "connected",
      accessToken: encrypt(tokens.accessToken),
      refreshToken: encrypt(tokens.refreshToken),
      tokenExpiresAt: expiresAt,
      scopes: ["offline_access"],
    },
    update: {
      status: "connected",
      accessToken: encrypt(tokens.accessToken),
      refreshToken: encrypt(tokens.refreshToken),
      tokenExpiresAt: expiresAt,
      scopes: ["offline_access"],
      lastSyncError: null,
    },
  });

  await db.syncLog.create({
    data: {
      userId,
      source: "dexcom",
      action: "connect",
      status: "success",
    },
  });
}

/** Disconnect Dexcom — remove tokens but keep existing data */
export async function disconnectDexcom(userId: string): Promise<void> {
  await db.dataSourceConnection.update({
    where: { userId_source: { userId, source: "dexcom" } },
    data: {
      status: "disconnected",
      accessToken: null,
      refreshToken: null,
      tokenExpiresAt: null,
      lastSyncError: null,
    },
  });

  await db.syncLog.create({
    data: {
      userId,
      source: "dexcom",
      action: "disconnect",
      status: "success",
    },
  });
}
