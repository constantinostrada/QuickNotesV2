"use client";

/**
 * NoteCard — displays a single note in the list view.
 *
 * Props receive a NoteDto (never a domain entity).
 * Layer: interfaces
 */

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import type { NoteDto } from "@/application/dtos/NoteDto";

interface NoteCardProps {
  note: NoteDto;
  /** Currently active tag filter, if any — highlights the matching badge. */
  activeTag?: string;
}

export function NoteCard({ note, activeTag }: NoteCardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [isDeleting, setIsDeleting] = useState(false);

  const openNote = () => router.push(`/notes/${note.id}`);

  const handleTagClick = (e: React.MouseEvent, tag: string) => {
    e.stopPropagation();
    // Preserve other params (e.g. ?sort=) while filtering by this tag.
    const params = new URLSearchParams(searchParams.toString());
    params.set("tags", tag);
    router.push(`/?${params.toString()}`);
  };

  const handleTogglePin = async (e: React.MouseEvent) => {
    e.stopPropagation();
    startTransition(async () => {
      await fetch(`/api/notes/${note.id}/pin`, { method: "POST" });
      router.refresh();
    });
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm(`Delete "${note.title}"?`)) return;
    setIsDeleting(true);
    await fetch(`/api/notes/${note.id}`, { method: "DELETE" });
    startTransition(() => router.refresh());
  };

  const handleDuplicate = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await fetch(`/api/notes/${note.id}/duplicate`, { method: "POST" });
    startTransition(() => router.refresh());
  };

  return (
    <article
      onClick={openNote}
      className={`card flex h-full cursor-pointer flex-col p-4 animate-slide-up ${isDeleting ? "opacity-50" : ""}`}
      aria-label={`Note: ${note.title}`}
    >
      {/* Title + pin button */}
      <div className="flex items-start justify-between gap-2">
        <a
          href={`/notes/${note.id}`}
          onClick={(e) => e.stopPropagation()}
          className="flex-1 text-sm font-semibold text-stone-900 hover:text-brand-600 transition-colors line-clamp-2"
        >
          {note.title}
        </a>

        <button
          onClick={handleTogglePin}
          disabled={isPending}
          aria-label={note.isPinned ? "Unpin note" : "Pin note"}
          title={note.isPinned ? "Unpin" : "Pin"}
          className={`shrink-0 rounded p-1 transition-colors ${
            note.isPinned
              ? "text-brand-500 hover:text-brand-700"
              : "text-stone-300 hover:text-stone-500"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {/* Content preview */}
      {note.contentPreview && (
        <p className="mt-2 flex-1 text-xs text-stone-500 line-clamp-3">{note.contentPreview}</p>
      )}

      {/* Tags — click to filter the list by that tag */}
      {note.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {note.tags.map((tag) => {
            const isActive = tag === activeTag;
            return (
              <button
                key={tag}
                type="button"
                onClick={(e) => handleTagClick(e, tag)}
                aria-label={`Filter by tag "${tag}"`}
                aria-pressed={isActive}
                title={`Filter by "${tag}"`}
                className={`tag-badge cursor-pointer transition-colors hover:bg-brand-100 hover:text-brand-700 ${
                  isActive ? "bg-brand-100 text-brand-700 ring-1 ring-brand-300" : ""
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      )}

      {/* Footer: date + actions */}
      <div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-3">
        <time
          dateTime={note.updatedAt}
          className="text-xs text-stone-400"
          title={new Date(note.updatedAt).toLocaleString()}
        >
          {new Date(note.updatedAt).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
          })}
        </time>

        <div className="flex items-center gap-1">
          <button
            onClick={handleDuplicate}
            disabled={isDeleting || isPending}
            aria-label={`Duplicate note "${note.title}"`}
            title="Duplicate"
            className="rounded p-1 text-stone-300 hover:text-brand-500 transition-colors disabled:opacity-40"
          >
            <span aria-hidden="true" className="text-sm leading-none">
              📋
            </span>
          </button>

          <button
            onClick={handleDelete}
            disabled={isDeleting || isPending}
            aria-label={`Delete note "${note.title}"`}
            className="rounded p-1 text-stone-300 hover:text-red-500 transition-colors disabled:opacity-40"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
}
