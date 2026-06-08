/**
 * /api/notes — collection endpoint.
 *
 * GET  → list notes (with optional query/tags/pinnedOnly filters)
 * POST → create a new note
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
);

export async function GET(request: NextRequest) {
  return controller.handleList(request);
}

export async function POST(request: NextRequest) {
  return controller.handleCreate(request);
}
