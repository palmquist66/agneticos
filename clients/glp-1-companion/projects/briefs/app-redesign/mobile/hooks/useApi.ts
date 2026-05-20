import { useState, useCallback } from "react";
import { api, ApiError, type RequestOptions } from "@/lib/api";

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiReturn<T> extends UseApiState<T> {
  execute: () => Promise<T | null>;
  reset: () => void;
}

export function useApi<T>(
  path: string,
  options?: RequestOptions
): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async () => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const data = await api<T>(path, options);
        setState({ data, loading: false, error: null });
        return data;
      } catch (err) {
        const message =
          err instanceof ApiError
            ? `${err.status}: ${err.body}`
            : err instanceof Error
            ? err.message
            : "Unknown error";
        setState((prev) => ({ ...prev, loading: false, error: message }));
        return null;
      }
    },
    [path, options]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return { ...state, execute, reset };
}

export function useMutation<TRequest, TResponse = { success: boolean; error?: string }>(
  path: string
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(
    async (body: TRequest): Promise<TResponse | null> => {
      setLoading(true);
      setError(null);
      try {
        const data = await api<TResponse>(path, {
          method: "POST",
          body: JSON.stringify(body),
        });
        setLoading(false);
        return data;
      } catch (err) {
        const message =
          err instanceof ApiError
            ? `${err.status}: ${err.body}`
            : err instanceof Error
            ? err.message
            : "Unknown error";
        setError(message);
        setLoading(false);
        return null;
      }
    },
    [path]
  );

  return { mutate, loading, error };
}
