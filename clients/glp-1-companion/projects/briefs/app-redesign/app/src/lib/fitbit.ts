import { randomBytes, createHash } from "crypto";
import { db } from "@/lib/db";
import { encrypt, decrypt } from "@/lib/crypto";

// ─── Config ──────────────────────────────────────────────

const BASE_URL = "https://api.fitbit.com";
const AUTH_URL = "https://www.fitbit.com/oauth2/authorize";
const TOKEN_URL = "https://api.fitbit.com/oauth2/token";

function getClientId(): string {
  const id = process.env.FITBIT_CLIENT_ID;
  if (!id) throw new Error("FITBIT_CLIENT_ID is required");
  return id;
}

function getClientSecret(): string {
  const secret = process.env.FITBIT_CLIENT_SECRET;
  if (!secret) throw new Error("FITBIT_CLIENT_SECRET is required");
  return secret;
}

function getRedirectUri(): string {
  return process.env.FITBIT_REDIRECT_URI || "http://localhost:3000/api/sync/fitbit/callback";
}

// ─── PKCE ────────────────────────────────────────────────

/** Generate a PKCE code verifier (64 random bytes, base64url-encoded) */
export function generateCodeVerifier(): string {
  return randomBytes(64)
    .toString("base64url");
}

/** Derive the PKCE code challenge from a verifier (SHA-256, base64url) */
export function generateCodeChallenge(verifier: string): string {
  return createHash("sha256")
    .update(verifier)
    .digest("base64url");
}

// ─── OAuth ───────────────────────────────────────────────

/** Build the Fitbit OAuth authorization URL with PKCE */
export function getFitbitAuthUrl(state: string, codeVerifier: string): string {
  const codeChallenge = generateCodeChallenge(codeVerifier);

  const params = new URLSearchParams({
    client_id: getClientId(),
    redirect_uri: getRedirectUri(),
    response_type: "code",
    scope: "weight",
    state,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  });
  return `${AUTH_URL}?${params}`;
}

type TokenPair = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // seconds (Fitbit: 28800 = 8 hours)
};

/** Exchange an authorization code for tokens (HTTP Basic Auth + PKCE verifier) */
export async function exchangeCode(code: string, codeVerifier: string): Promise<TokenPair> {
  const basicAuth = Buffer.from(`${getClientId()}:${getClientSecret()}`).toString("base64");

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${basicAuth}`,
    },
    body: new URLSearchParams({
      code,
      grant_type: "authorization_code",
      redirect_uri: getRedirectUri(),
      code_verifier: codeVerifier,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Fitbit token exchange failed (${res.status}): ${text}`);
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
  const basicAuth = Buffer.from(`${getClientId()}:${getClientSecret()}`).toString("base64");

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${basicAuth}`,
    },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Fitbit token refresh failed (${res.status}): ${text}`);
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
    where: { userId_source: { userId, source: "fitbit" } },
  });

  if (!connection || connection.status === "disconnected") {
    throw new Error("Fitbit is not connected");
  }

  if (!connection.accessToken || !connection.refreshToken) {
    throw new Error("Fitbit tokens missing — reconnection needed");
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
        source: "fitbit",
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
        source: "fitbit",
        action: "refresh_token",
        status: "failed",
        error: err instanceof Error ? err.message : "Unknown error",
      },
    });

    throw new Error("Fitbit token expired — reconnection needed");
  }
}

// ─── Data Fetch ──────────────────────────────────────────

type FitbitWeightEntry = {
  bmi: number;
  date: string; // "yyyy-MM-dd"
  fat?: number;
  logId: number;
  source: string;
  time: string; // "HH:mm:ss"
  weight: number; // in user's unit preference (kg or lbs)
};

type FitbitWeightResponse = {
  weight: FitbitWeightEntry[];
};

/** Format a Date to yyyy-MM-dd for Fitbit API */
function formatDate(d: Date): string {
  return d.toISOString().split("T")[0];
}

/** Convert kg to lbs */
function kgToLbs(kg: number): number {
  return Math.round(kg * 2.20462 * 10) / 10; // 1 decimal place
}

/** Fetch weight time series from Fitbit for a date range (max 31 days) */
export async function fetchWeightTimeSeries(
  accessToken: string,
  startDate: Date,
  endDate: Date
): Promise<FitbitWeightEntry[]> {
  const start = formatDate(startDate);
  const end = formatDate(endDate);

  const res = await fetch(
    `${BASE_URL}/1/user/-/body/log/weight/date/${start}/${end}.json`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Fitbit weight fetch failed (${res.status}): ${text}`);
  }

  const data: FitbitWeightResponse = await res.json();
  return data.weight || [];
}

// ─── Sync Orchestration ──────────────────────────────────

export type SyncResult = {
  imported: number;
  skipped: number;
  dateFrom: Date;
  dateTo: Date;
  durationMs: number;
};

/** Pull weight data from Fitbit and store it */
export async function syncFitbitWeight(userId: string): Promise<SyncResult> {
  const startTime = Date.now();

  const accessToken = await getValidAccessToken(userId);

  // Determine date range: from last sync or 30 days back
  const connection = await db.dataSourceConnection.findUnique({
    where: { userId_source: { userId, source: "fitbit" } },
  });

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const startDate = connection?.lastSyncAt || thirtyDaysAgo;
  const endDate = now;

  // Fitbit API max 31 days per request — our range fits within that
  const entries = await fetchWeightTimeSeries(accessToken, startDate, endDate);

  // Detect unit: Fitbit returns values in the user's profile unit preference.
  // Weights > 150 are almost certainly in lbs already; weights < 150 could be either,
  // but a weight < 100 is almost certainly kg. Use a heuristic: if any value < 100,
  // treat all as kg. This is imperfect but covers the vast majority of cases.
  const likelyKg = entries.length > 0 && entries.some((e) => e.weight < 100);

  let imported = 0;
  let skipped = 0;

  for (const entry of entries) {
    const loggedAt = new Date(`${entry.date}T${entry.time}`);
    const weightLbs = likelyKg ? kgToLbs(entry.weight) : entry.weight;

    // Dedup: check if we already have a weight log for this user + date + source
    const existing = await db.weightLog.findFirst({
      where: {
        userId,
        loggedAt,
        source: "fitbit",
      },
    });

    if (existing) {
      skipped++;
      continue;
    }

    await db.weightLog.create({
      data: {
        userId,
        weight: weightLbs,
        source: "fitbit",
        loggedAt,
      },
    });

    imported++;
  }

  const durationMs = Date.now() - startTime;

  // Update connection status
  await db.dataSourceConnection.update({
    where: { userId_source: { userId, source: "fitbit" } },
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
      source: "fitbit",
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
export async function storeFitbitConnection(
  userId: string,
  tokens: TokenPair
): Promise<void> {
  const expiresAt = new Date(Date.now() + tokens.expiresIn * 1000);

  await db.dataSourceConnection.upsert({
    where: { userId_source: { userId, source: "fitbit" } },
    create: {
      userId,
      source: "fitbit",
      status: "connected",
      accessToken: encrypt(tokens.accessToken),
      refreshToken: encrypt(tokens.refreshToken),
      tokenExpiresAt: expiresAt,
      scopes: ["weight"],
    },
    update: {
      status: "connected",
      accessToken: encrypt(tokens.accessToken),
      refreshToken: encrypt(tokens.refreshToken),
      tokenExpiresAt: expiresAt,
      scopes: ["weight"],
      lastSyncError: null,
    },
  });

  await db.syncLog.create({
    data: {
      userId,
      source: "fitbit",
      action: "connect",
      status: "success",
    },
  });
}

/** Disconnect Fitbit — remove tokens but keep existing weight data */
export async function disconnectFitbit(userId: string): Promise<void> {
  await db.dataSourceConnection.update({
    where: { userId_source: { userId, source: "fitbit" } },
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
      source: "fitbit",
      action: "disconnect",
      status: "success",
    },
  });
}
