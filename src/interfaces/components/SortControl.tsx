"use client";

/**
 * SortControl — client component for choosing the note list order.
 *
 * Mirrors SearchBar: writes the chosen order to the URL's ?sort= param,
 * preserving any existing params (e.g. ?query=), which triggers a
 * server-side re-fetch so the cards re-order instantly.
 * Layer: interfaces
 */

import { useCallback, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

import type { NoteSortOrder } from "@/domain/repositories/INoteRepository";

interface SortControlProps {
  value?: NoteSortOrder;
}

const OPTIONS: { value: NoteSortOrder; label: string }[] = [
  { value: "recent", label: "Recent" },
  { value: "alphabetical", label: "A–Z" },
];

export function SortControl({ value = "recent" }: SortControlProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleSelect = useCallback(
    (order: NoteSortOrder) => {
      const params = new URLSearchParams(searchParams.toString());
      if (order === "recent") {
        // "recent" is the default — keep the URL clean.
        params.delete("sort");
      } else {
        params.set("sort", order);
      }

      const queryString = params.toString();
      startTransition(() => {
        router.replace(queryString ? `${pathname}?${queryString}` : pathname);
      });
    },
    [router, pathname, searchParams],
  );

  return (
    <div
      className="inline-flex shrink-0 rounded-lg border border-stone-300 bg-white p-0.5 dark:border-stone-600 dark:bg-stone-800"
      role="group"
      aria-label="Sort notes"
      aria-busy={isPending}
    >
      {OPTIONS.map((option) => {
        const isActive = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => handleSelect(option.value)}
            aria-pressed={isActive}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
              isActive
                ? "bg-brand-500 text-white"
                : "text-stone-600 hover:bg-stone-50 dark:text-stone-300 dark:hover:bg-stone-700"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
