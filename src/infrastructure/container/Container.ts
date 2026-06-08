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

const noteRepository = new InMemoryNoteRepository();
const uuidGenerator = new UuidGenerator();

// Seed demo data (resolves immediately if already seeded).
// We do not await here to avoid blocking module initialisation;
// the promise is fire-and-forget at startup.
seedRepository(noteRepository).catch(console.error);

// ─── Use case instances ──────────────────────────────────────────────────────

export const container = {
  createNote: new CreateNoteUseCase(noteRepository, uuidGenerator),
  getNote: new GetNoteUseCase(noteRepository),
  listNotes: new ListNotesUseCase(noteRepository),
  updateNote: new UpdateNoteUseCase(noteRepository),
  deleteNote: new DeleteNoteUseCase(noteRepository),
  togglePinNote: new TogglePinNoteUseCase(noteRepository),
} as const;
