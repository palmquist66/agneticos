import Constants from "expo-constants";

const API_BASE_URL =
  Constants.expoConfig?.extra?.apiBaseUrl ||
  process.env.EXPO_PUBLIC_API_URL ||
  "https://glp1companion.vercel.app";

export type RequestOptions = Omit<RequestInit, "headers"> & {
  headers?: Record<string, string>;
};

let getTokenFn: (() => Promise<string | null>) | null = null;

export function setAuthTokenGetter(fn: () => Promise<string | null>) {
  getTokenFn = fn;
}

export async function api<T = unknown>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const token = getTokenFn ? await getTokenFn() : null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "Unknown error");
    throw new ApiError(response.status, errorBody, path);
  }

  // Handle empty responses (204, etc.)
  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export function apiStream(path: string, options: RequestOptions = {}) {
  return {
    async *[Symbol.asyncIterator]() {
      const token = getTokenFn ? await getTokenFn() : null;

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...options.headers,
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;

      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorBody = await response.text().catch(() => "Unknown error");
        throw new ApiError(response.status, errorBody, path);
      }

      const reader = response.body?.getReader();
      if (!reader) return;

      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        yield decoder.decode(value, { stream: true });
      }
    },
  };
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public body: string,
    public path: string
  ) {
    super(`API Error ${status} on ${path}: ${body}`);
    this.name = "ApiError";
  }
}
