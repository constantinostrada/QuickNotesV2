"use client";

/**
 * EditNoteForm — form for editing an existing note.
 *
 * Receives a NoteDto from the server component.
 * Calls PATCH /api/notes/[id] and refreshes on success.
 * Layer: interfaces
 */

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import type { NoteDto } from "@/application/dtos/NoteDto";

interface EditNoteFormProps {
  note: NoteDto;
}

export function EditNoteForm({ note }: EditNoteFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [tagsInput, setTagsInput] = useState(note.tags.join(", "));
  const [isDirty, setIsDirty] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const markDirty = () => {
    setIsDirty(true);
    setSuccessMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const res = await fetch(`/api/notes/${note.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title.trim(), content, tags }),
    });

    if (!res.ok) {
      const json = (await res.json()) as { error?: string };
      setError(json.error ?? "Failed to update note.");
      return;
    }

    setIsDirty(false);
    setSuccessMessage("Note saved!");

    startTransition(() => router.refresh());
  };

  const handleTogglePin = async () => {
    await fetch(`/api/notes/${note.id}/pin`, { method: "POST" });
    startTransition(() => router.refresh());
  };

  const handleDelete = async () => {
    if (!window.confirm(`Permanently delete "${note.title}"?`)) return;
    await fetch(`/api/notes/${note.id}`, { method: "DELETE" });
    router.push("/");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {/* Title */}
      <div>
        <label htmlFor="edit-title" className="mb-1 block text-xs font-medium text-stone-500">
          Title
        </label>
        <input
          id="edit-title"
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            markDirty();
          }}
          className="input font-semibold"
          maxLength={200}
          required
        />
      </div>

      {/* Content */}
      <div>
        <label htmlFor="edit-content" className="mb-1 block text-xs font-medium text-stone-500">
          Content
        </label>
        <textarea
          id="edit-content"
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            markDirty();
          }}
          rows={12}
          className="input resize-y font-mono text-sm leading-relaxed"
          maxLength={50000}
        />
      </div>

      {/* Tags */}
      <div>
        <label htmlFor="edit-tags" className="mb-1 block text-xs font-medium text-stone-500">
          Tags
        </label>
        <input
          id="edit-tags"
          type="text"
          value={tagsInput}
          onChange={(e) => {
            setTagsInput(e.target.value);
            markDirty();
          }}
          className="input text-sm"
          placeholder="work, ideas, personal…"
        />
        <p className="mt-1 text-xs text-stone-400">Separate tags with commas.</p>
      </div>

      {/* Feedback */}
      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
      {successMessage && (
        <p role="status" className="text-sm text-green-600">
          {successMessage}
        </p>
      )}

      {/* Action bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-stone-100 pt-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleTogglePin}
            className={`btn-secondary text-xs ${note.isPinned ? "text-brand-600 border-brand-300" : ""}`}
          >
            {note.isPinned ? "⭐ Unpin" : "☆ Pin"}
          </button>

          <button type="button" onClick={handleDelete} className="btn-ghost text-xs text-red-500">
            Delete
          </button>
        </div>

        <button
          type="submit"
          disabled={isPending || !isDirty}
          className="btn-primary text-xs"
        >
          {isPending ? "Saving…" : "Save changes"}
        </button>
      </div>
    </form>
  );
}
