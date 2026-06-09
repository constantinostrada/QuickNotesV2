"use client";

/**
 * Global error boundary for the app.
 * Layer: interfaces
 */

import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <span className="text-6xl">⚡</span>
      <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100">Something went wrong</h2>
      <p className="max-w-sm text-stone-500 dark:text-stone-400">
        An unexpected error occurred. Please try again.
      </p>
      <button onClick={reset} className="btn-primary mt-2">
        Try again
      </button>
    </div>
  );
}
