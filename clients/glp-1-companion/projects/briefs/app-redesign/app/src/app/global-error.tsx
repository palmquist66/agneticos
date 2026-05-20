"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex items-center justify-center bg-[#FAF8F3] dark:bg-[#0D1F1E] px-6">
        <div className="text-center max-w-sm">
          <div className="text-4xl mb-4">:(</div>
          <h1 className="text-xl font-semibold text-[#1A3A36] dark:text-[#E8E2D6] mb-2">
            Something went wrong
          </h1>
          <p className="text-sm text-[#6B7C78] dark:text-[#8A9B97] mb-6">
            An unexpected error occurred. Your data is safe.
          </p>
          <button
            onClick={reset}
            className="px-6 py-2.5 rounded-full bg-[#2A9D8F] text-white text-sm font-medium hover:bg-[#238B7F] transition-colors"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
