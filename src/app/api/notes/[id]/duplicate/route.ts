/**
 * /api/notes/[id]/duplicate — duplicate a note.
 *
 * POST → create an independent copy of the note (own id, title + " (copia)")
 *
 * Layer: interfaces (Next.js App Router route handler)
 */

import type { NextRequest } from "next/server";

import { container } from "@/infrastructure/container/Container";
import { NotesController } from "@/interfaces/http/controllers/NotesController";

const controller = new NotesController(
  container.createNote,
  container.getNote,
  container.listNotes,
  container.updateNote,
  container.deleteNote,
  container.togglePinNote,
  container.duplicateNote,
);

type RouteParams = { params: { id: string } };

export async function POST(request: NextRequest, { params }: RouteParams) {
  return controller.handleDuplicate(request, params.id);
}
