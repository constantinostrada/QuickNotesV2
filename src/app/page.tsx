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

import { container } from "@/infrastructure/container/Container";

import { CreateNoteForm } from "@/interfaces/components/CreateNoteForm";
import { NoteCard } from "@/interfaces/components/NoteCard";
import { SearchBar } from "@/interfaces/components/SearchBar";
import { EmptyState } from "@/interfaces/components/EmptyState";

interface HomePageProps {
  searchParams?: Record<string, string | string[] | undefined>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const query =
    typeof searchParams?.query === "string" ? searchParams.query : undefined;

  const notes = await container.listNotes.execute({ query });

  const pinnedNotes = notes.filter((n) => n.isPinned);
  const unpinnedNotes = notes.filter((n) => !n.isPinned);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">My Notes</h1>
          <p className="mt-1 text-sm text-stone-500">
            {notes.length === 0
              ? "No notes yet — create your first one below."
              : `${notes.length} note${notes.length !== 1 ? "s" : ""}`}
          </p>
        </div>
      </div>

      {/* Search */}
      <Suspense>
        <SearchBar defaultValue={query} />
      </Suspense>

      {/* Create note form */}
      <section aria-label="Create a new note">
        <CreateNoteForm />
      </section>

      {/* Notes grid */}
      {notes.length === 0 ? (
        <EmptyState
          title={query ? "No matching notes" : "Nothing here yet"}
          description={
            query
              ? `No notes matched "${query}". Try a different search.`
              : "Create your first note using the form above."
          }
        />
      ) : (
        <div className="space-y-6">
          {pinnedNotes.length > 0 && (
            <section aria-label="Pinned notes">
              <h2 className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-stone-400">
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
                    <NoteCard note={note} />
                  </li>
                ))}
              </ul>
            </section>
          )}

          {unpinnedNotes.length > 0 && (
            <section aria-label="All notes">
              {pinnedNotes.length > 0 && (
                <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-stone-400">
                  Other notes
                </h2>
              )}
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" role="list">
                {unpinnedNotes.map((note) => (
                  <li key={note.id}>
                    <NoteCard note={note} />
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
