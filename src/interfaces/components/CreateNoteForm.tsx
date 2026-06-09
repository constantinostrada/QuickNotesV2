"use client";

/**
 * CreateNoteForm — inline form for quickly creating a new note.
 *
 * Calls POST /api/notes and refreshes the router on success.
 * Layer: interfaces
 */

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";

export function CreateNoteForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isExpanded, setIsExpanded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const tagsRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const title = titleRef.current?.value.trim() ?? "";
    if (!title) {
      setError("Title is required.");
      titleRef.current?.focus();
      return;
    }

    const body = {
      title,
      content: contentRef.current?.value ?? "",
      tags: tagsRef.current?.value
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const json = (await res.json()) as { error?: string };
      setError(json.error ?? "Failed to create note.");
      return;
    }

    // Reset form
    if (titleRef.current) titleRef.current.value = "";
    if (contentRef.current) contentRef.current.value = "";
    if (tagsRef.current) tagsRef.current.value = "";
    setIsExpanded(false);

    startTransition(() => router.refresh());
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="card p-4"
      aria-label="Create new note"
      noValidate
    >
      <div className="space-y-3">
        {/* Title */}
        <div>
          <label htmlFor="new-note-title" className="sr-only">
            Note title
          </label>
          <input
            ref={titleRef}
            id="new-note-title"
            type="text"
            placeholder="Note title…"
            className="input text-sm font-medium"
            onFocus={() => setIsExpanded(true)}
            required
            maxLength={200}
            aria-describedby={error ? "create-note-error" : undefined}
          />
        </div>

        {/* Expandable fields */}
        {isExpanded && (
          <div className="space-y-3 animate-slide-up">
            <div>
              <label htmlFor="new-note-content" className="sr-only">
                Note content
              </label>
              <textarea
                ref={contentRef}
                id="new-note-content"
                placeholder="Write something…"
                rows={4}
                className="input resize-y text-sm"
                maxLength={50000}
              />
            </div>

            <div>
              <label htmlFor="new-note-tags" className="sr-only">
                Tags (comma-separated)
              </label>
              <input
                ref={tagsRef}
                id="new-note-tags"
                type="text"
                placeholder="Tags: work, ideas, personal…"
                className="input text-sm"
              />
              <p className="mt-1 text-xs text-stone-400 dark:text-stone-500">Separate tags with commas.</p>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <p id="create-note-error" role="alert" className="text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}

        {/* Actions */}
        {isExpanded && (
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              className="btn-secondary text-xs"
              onClick={() => {
                setIsExpanded(false);
                setError(null);
              }}
            >
              Cancel
            </button>
            <button type="submit" disabled={isPending} className="btn-primary text-xs">
              {isPending ? "Saving…" : "Save note"}
            </button>
          </div>
        )}
      </div>
    </form>
  );
}
