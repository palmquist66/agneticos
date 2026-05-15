"use client";

import { useEffect } from "react";

export default function OnboardingError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Onboarding error:", error);
  }, [error]);

  return (
    <div className="space-y-6 text-center">
      <div className="text-4xl">:(</div>
      <div>
        <h1 className="text-xl font-semibold">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We couldn&apos;t set up your account. This is usually a temporary
          issue.
        </p>
        {process.env.NODE_ENV === "development" && (
          <pre className="mt-4 max-w-md overflow-auto rounded bg-muted p-3 text-left text-xs">
            {error.message}
          </pre>
        )}
      </div>
      <div className="flex flex-col items-center gap-3">
        <button
          onClick={reset}
          className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Try again
        </button>
        <a href="/" className="text-sm text-muted-foreground hover:underline">
          Back to home
        </a>
      </div>
    </div>
  );
}
