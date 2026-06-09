/**
 * /api/notes/[id]/pin — toggle pin state.
 *
 * POST → toggle pin (pin if unpinned, unpin if pinned)
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
  container.exportNotes,
);

type RouteParams = { params: { id: string } };

export async function POST(request: NextRequest, { params }: RouteParams) {
  return controller.handleTogglePin(request, params.id);
}
