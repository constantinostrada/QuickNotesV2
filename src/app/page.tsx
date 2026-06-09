/**
 * Home page — server component that fetches and displays all notes.
 *
 * Layer: interfaces (Next.js page — calls use cases via server-side import)
 *
 * NOTE: In a server component we can call use cases directly
 * (bypassing HTTP) because we are still within the interfaces layer.
 * The container wires everything; we never touch infrastructure directly.
 */

import { Suspense } from "react";
import Link from "next/link";

import type { NoteSortOrder } from "@/domain/repositories/INoteRepository";

import { container } from "@/infrastructure/container/Container";

import { CreateNoteForm } from "@/interfaces/components/CreateNoteForm";
import { NoteCard } from "@/interfaces/components/NoteCard";
import { SearchBar } from "@/interfaces/components/SearchBar";
import { SortControl } from "@/interfaces/components/SortControl";
import { ExportButton } from "@/interfaces/components/ExportButton";
import { EmptyState } from "@/interfaces/components/EmptyState";

interface HomePageProps {
  searchParams?: Record<string, string | string[] | undefined>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const query =
    typeof searchParams?.query === "string" ? searchParams.query : undefined;

  const sort: NoteSortOrder =
    searchParams?.sort === "alphabetical" ? "alphabetical" : "recent";

  const rawTags = searchParams?.tags;
  const activeTag =
    typeof rawTags === "string"
      ? rawTags
      : Array.isArray(rawTags)
        ? rawTags[0]
        : undefined;

  const notes = await container.listNotes.execute({
    query,
    sort,
    tags: activeTag ? [activeTag] : undefined,
  });

  const pinnedNotes = notes.filter((n) => n.isPinned);
  const unpinnedNotes = notes.filter((n) => !n.isPinned);

  // "Clear filter" returns to the full list while preserving search + sort.
  const clearParams = new URLSearchParams();
  if (query) clearParams.set("query", query);
  if (sort === "alphabetical") clearParams.set("sort", sort);
  const clearFilterHref = clearParams.toString() ? `/?${clearParams.toString()}` : "/";

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">My Notes</h1>
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
            {notes.length === 0
              ? "No notes yet — create your first one below."
              : `${notes.length} note${notes.length !== 1 ? "s" : ""} · ${pinnedNotes.length} pinned`}
          </p>
        </div>

        <ExportButton />
      </div>

      {/* Search + sort */}
      <Suspense>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex-1">
            <SearchBar defaultValue={query} />
          </div>
          <SortControl value={sort} />
        </div>
      </Suspense>

      {/* Active tag filter indicator */}
      {activeTag && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-stone-500 dark:text-stone-400">Filtering by</span>
          <span className="tag-badge bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300">
            {activeTag}
          </span>
          <Link
            href={clearFilterHref}
            className="font-medium text-brand-600 transition-colors hover:text-brand-700 hover:underline dark:text-brand-400 dark:hover:text-brand-300"
          >
            Clear filter
          </Link>
        </div>
      )}

      {/* Create note form */}
      <section aria-label="Create a new note">
        <CreateNoteForm />
      </section>

      {/* Notes grid */}
      {notes.length === 0 ? (
        <EmptyState
          title={query || activeTag ? "No matching notes" : "No notes yet"}
          description={
            activeTag
              ? `No notes tagged "${activeTag}".`
              : query
                ? `No notes matched "${query}". Try a different search.`
                : "Create your first note using the form above."
          }
        />
      ) : (
        <div className="space-y-6">
          {pinnedNotes.length > 0 && (
            <section aria-label="Pinned notes">
              <h2 className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-3.5 w-3.5"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                    clipRule="evenodd"
                  />
                </svg>
                Pinned
              </h2>
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" role="list">
                {pinnedNotes.map((note) => (
                  <li key={note.id}>
                    <NoteCard note={note} activeTag={activeTag} />
                  </li>
                ))}
              </ul>
            </section>
          )}

          {unpinnedNotes.length > 0 && (
            <section aria-label="All notes">
              {pinnedNotes.length > 0 && (
                <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500">
                  Other notes
                </h2>
              )}
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" role="list">
                {unpinnedNotes.map((note) => (
                  <li key={note.id}>
                    <NoteCard note={note} activeTag={activeTag} />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
