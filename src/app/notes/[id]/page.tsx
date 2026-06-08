/**
 * Note detail page — server component.
 *
 * Shows a single note with full content and an inline edit form.
 * Layer: interfaces
 */

import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { container } from "@/infrastructure/container/Container";
import { NoteNotFoundError } from "@/domain/errors/NoteNotFoundError";

import { EditNoteForm } from "@/interfaces/components/EditNoteForm";

interface NotePageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: NotePageProps): Promise<Metadata> {
  try {
    const note = await container.getNote.execute({ id: params.id });
    return { title: note.title };
  } catch {
    return { title: "Note not found" };
  }
}

export default async function NotePage({ params }: NotePageProps) {
  try {
    const note = await container.getNote.execute({ id: params.id });

    return (
      <div className="mx-auto max-w-2xl animate-fade-in">
        {/* Back link */}
        <a
          href="/"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-700 transition-colors"
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
              d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z"
              clipRule="evenodd"
            />
          </svg>
          Back to notes
        </a>

        <div className="card p-6">
          <EditNoteForm note={note} />
        </div>

        {/* Metadata footer */}
        <p className="mt-4 text-center text-xs text-stone-400">
          Created{" "}
          {new Date(note.createdAt).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
          {note.updatedAt !== note.createdAt && (
            <>
              {" · "}Updated{" "}
              {new Date(note.updatedAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </>
          )}
        </p>
      </div>
    );
  } catch (err) {
    if (err instanceof NoteNotFoundError) {
      notFound();
    }
    throw err;
  }
}
