/**
 * Global 404 page.
 * Layer: interfaces
 */

import type { Metadata } from "next";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <span className="text-6xl">🗒️</span>
      <h2 className="text-2xl font-bold text-stone-900">Page not found</h2>
      <p className="text-stone-500">The page you were looking for doesn&apos;t exist.</p>
      <a href="/" className="btn-primary mt-2">
        Go home
      </a>
    </div>
  );
}
