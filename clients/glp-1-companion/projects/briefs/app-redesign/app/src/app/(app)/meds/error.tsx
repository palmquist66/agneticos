"use client";

import { useEffect } from "react";

export default function MedsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Meds page error:", error);
  }, [error]);

  return (
    <div className="flex-1 flex items-center justify-center px-6 py-20">
      <div className="text-center max-w-sm">
        <div className="w-12 h-12 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-6 h-6 text-violet-500"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m4.5 12.75 6 6 9-13.5"
            />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-foreground mb-1">
          Couldn&apos;t load Medications
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          There was a problem loading your medication list. Your schedules are still saved.
        </p>
        <button
          onClick={reset}
          className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Reload
        </button>
      </div>
    </div>
  );
}
