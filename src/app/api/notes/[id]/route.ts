/**
 * /api/notes/[id] — single note endpoint.
 *
 * GET    → retrieve a note by ID
 * PATCH  → partial update
 * DELETE → remove a note
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

type RouteParams = { params: { id: string } };

export async function GET(request: NextRequest, { params }: RouteParams) {
  return controller.handleGet(request, params.id);
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  return controller.handleUpdate(request, params.id);
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  return controller.handleDelete(request, params.id);
}
