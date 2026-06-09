/**
 * Container — simple dependency-injection container (manual DI).
 *
 * Wires infrastructure implementations to application use cases.
 * This is the only place where concrete classes are referenced together.
 *
 * Layer: infrastructure (it knows about implementations)
 *
 * Usage in Next.js API routes (interfaces layer):
 *   import { container } from "@/infrastructure/container/Container";
 *   const result = await container.createNote.execute({ title: "..." });
 */

import { CreateNoteUseCase } from "@/application/use-cases/CreateNoteUseCase";
import { DeleteNoteUseCase } from "@/application/use-cases/DeleteNoteUseCase";
import { GetNoteUseCase } from "@/application/use-cases/GetNoteUseCase";
import { ListNotesUseCase } from "@/application/use-cases/ListNotesUseCase";
import { TogglePinNoteUseCase } from "@/application/use-cases/TogglePinNoteUseCase";
import { UpdateNoteUseCase } from "@/application/use-cases/UpdateNoteUseCase";

import { InMemoryNoteRepository } from "../repositories/InMemoryNoteRepository";
import { UuidGenerator } from "../uuid/UuidGenerator";
import { seedRepository } from "../persistence/SeedData";

// ─── Singleton instances ─────────────────────────────────────────────────────
// In a real app with a DB, these would be scoped per-request where appropriate.
//
// IMPORTANT: Next.js evaluates this module in separate bundles for React Server
// Components and for route handlers, so a plain module-level singleton would
// yield two distinct in-memory repositories. A note created through the API
// route would then be invisible to the page server component (and vice-versa).
// We cache the wired container on `globalThis` so every module graph in the
// same process shares a single repository instance — making a freshly created
// note appear in the listing immediately on refresh.

function buildContainer() {
  const noteRepository = new InMemoryNoteRepository();
  const uuidGenerator = new UuidGenerator();

  // Seed demo data (resolves immediately if already seeded).
  // Fire-and-forget so we don't block module initialisation.
  seedRepository(noteRepository).catch(console.error);

  return {
    createNote: new CreateNoteUseCase(noteRepository, uuidGenerator),
    getNote: new GetNoteUseCase(noteRepository),
    listNotes: new ListNotesUseCase(noteRepository),
    updateNote: new UpdateNoteUseCase(noteRepository),
    deleteNote: new DeleteNoteUseCase(noteRepository),
    togglePinNote: new TogglePinNoteUseCase(noteRepository),
  } as const;
}

const globalForContainer = globalThis as typeof globalThis & {
  __quicknotesContainer?: ReturnType<typeof buildContainer>;
};

export const container =
  globalForContainer.__quicknotesContainer ??
  (globalForContainer.__quicknotesContainer = buildContainer());
