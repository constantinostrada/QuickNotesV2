/**
 * SeedData — populates an INoteRepository with demo notes on first load.
 *
 * Used only in development / demo mode (no real database).
 * Layer: infrastructure
 */

import { Note } from "@/domain/entities/Note";
import { NoteContent } from "@/domain/value-objects/NoteContent";
import { NoteId } from "@/domain/value-objects/NoteId";
import { NoteTag } from "@/domain/value-objects/NoteTag";
import { NoteTitle } from "@/domain/value-objects/NoteTitle";
import type { INoteRepository } from "@/domain/repositories/INoteRepository";

const SEED_NOTES: Array<{
  id: string;
  title: string;
  content: string;
  tags: string[];
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}> = [
  {
    id: "11111111-1111-4111-8111-111111111111",
    title: "Welcome to QuickNotes 👋",
    content:
      "QuickNotes is a fast, minimal note-taking app built with Next.js and Clean Architecture.\n\n" +
      "**Features:**\n" +
      "- Create, edit and delete notes\n" +
      "- Pin important notes to the top\n" +
      "- Organise with tags\n" +
      "- Search notes by title",
    tags: ["welcome", "getting-started"],
    isPinned: true,
    createdAt: new Date("2024-01-01T10:00:00.000Z"),
    updatedAt: new Date("2024-01-01T10:00:00.000Z"),
  },
  {
    id: "22222222-2222-4222-8222-222222222222",
    title: "Clean Architecture layers",
    content:
      "This project follows Clean Architecture with four layers:\n\n" +
      "1. **domain/** — Entities, Value Objects, Repository interfaces\n" +
      "2. **application/** — Use Cases, DTOs, Application Services\n" +
      "3. **infrastructure/** — DB/storage implementations\n" +
      "4. **interfaces/** — HTTP controllers, Next.js API routes, UI\n\n" +
      "Dependencies always point inward. Domain knows nothing about the outside world.",
    tags: ["architecture", "development"],
    isPinned: false,
    createdAt: new Date("2024-01-02T09:00:00.000Z"),
    updatedAt: new Date("2024-01-02T09:00:00.000Z"),
  },
  {
    id: "33333333-3333-4333-8333-333333333333",
    title: "Shopping list",
    content: "- Milk\n- Eggs\n- Bread\n- Coffee\n- Avocados",
    tags: ["personal"],
    isPinned: false,
    createdAt: new Date("2024-01-03T08:30:00.000Z"),
    updatedAt: new Date("2024-01-03T08:30:00.000Z"),
  },
];

export async function seedRepository(repository: INoteRepository): Promise<void> {
  const existingCount = await repository.count();
  if (existingCount > 0) return; // already seeded

  for (const data of SEED_NOTES) {
    const note = Note.reconstitute({
      id: NoteId.create(data.id),
      title: NoteTitle.create(data.title),
      content: NoteContent.create(data.content),
      tags: data.tags.map((t) => NoteTag.create(t)),
      isPinned: data.isPinned,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
    await repository.save(note);
  }
}
