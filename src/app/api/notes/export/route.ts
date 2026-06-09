/**
 * /api/notes/export — download all notes as a .json file.
 *
 * GET → returns every note's title, text and tags as a JSON
 *       attachment (Content-Disposition: attachment).
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

export async function GET(request: NextRequest) {
  return controller.handleExport(request);
}
