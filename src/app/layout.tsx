import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "QuickNotes",
    template: "%s | QuickNotes",
  },
  description: "A fast, minimal note-taking app built with Next.js and Clean Architecture.",
  keywords: ["notes", "note-taking", "quicknotes"],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-stone-50">
        <header className="border-b border-stone-200 bg-white">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
            <a href="/" className="flex items-center gap-2 text-lg font-bold text-stone-900">
              {/* Lightning-bolt icon (inline SVG — no icon library dependency) */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-6 w-6 text-brand-500"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.818a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .845-.143Z"
                  clipRule="evenodd"
                />
              </svg>
              QuickNotes
            </a>
            <span className="rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-medium text-brand-700">
              Beta
            </span>
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>

        <footer className="border-t border-stone-200 bg-white mt-16">
          <div className="mx-auto max-w-5xl px-4 py-4 text-center text-xs text-stone-400">
            QuickNotes — built with Next.js, Tailwind CSS &amp; Clean Architecture
          </div>
        </footer>
      </body>
    </html>
  );
}
