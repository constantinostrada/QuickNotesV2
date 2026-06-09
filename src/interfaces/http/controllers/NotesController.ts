/**
 * NotesController — thin controller for the /api/notes resource.
 *
 * Responsibilities:
 *   1. Parse and validate incoming request data (shape, not business rules).
 *   2. Call the appropriate use case.
 *   3. Serialize and return the response.
 *
 * Business logic lives in use cases. Domain rules live in entities.
 *
 * Layer: interfaces
 */

import type { NextRequest } from "next/server";

import type { CreateNoteDto } from "@/application/use-cases/CreateNoteUseCase";
import type { ListNotesDto } from "@/application/use-cases/ListNotesUseCase";
import type { UpdateNoteDto } from "@/application/use-cases/UpdateNoteUseCase";
import type { CreateNoteUseCase } from "@/application/use-cases/CreateNoteUseCase";
import type { DeleteNoteUseCase } from "@/application/use-cases/DeleteNoteUseCase";
import type { DuplicateNoteUseCase } from "@/application/use-cases/DuplicateNoteUseCase";
import type { ExportNotesUseCase } from "@/application/use-cases/ExportNotesUseCase";
import type { GetNoteUseCase } from "@/application/use-cases/GetNoteUseCase";
import type { ListNotesUseCase } from "@/application/use-cases/ListNotesUseCase";
import type { TogglePinNoteUseCase } from "@/application/use-cases/TogglePinNoteUseCase";
import type { UpdateNoteUseCase } from "@/application/use-cases/UpdateNoteUseCase";

import { created, errorResponse, jsonDownload, noContent, ok } from "../helpers/apiResponse";

export class NotesController {
  constructor(
    private readonly createNote: CreateNoteUseCase,
    private readonly getNote: GetNoteUseCase,
    private readonly listNotes: ListNotesUseCase,
    private readonly updateNote: UpdateNoteUseCase,
    private readonly deleteNote: DeleteNoteUseCase,
    private readonly togglePinNote: TogglePinNoteUseCase,
    private readonly duplicateNote: DuplicateNoteUseCase,
    private readonly exportNotes: ExportNotesUseCase,
  ) {}

  // GET /api/notes?query=...&tags=...&pinnedOnly=true
  async handleList(request: NextRequest) {
    try {
      const { searchParams } = request.nextUrl;
      const dto: ListNotesDto = {
        query: searchParams.get("query") ?? undefined,
        tags: searchParams.getAll("tags").filter(Boolean),
        pinnedOnly: searchParams.get("pinnedOnly") === "true",
      };
      const notes = await this.listNotes.execute(dto);
      return ok(notes);
    } catch (err) {
      return errorResponse(err);
    }
  }

  // GET /api/notes/export
  async handleExport(_request: NextRequest) {
    try {
      const notes = await this.exportNotes.execute();
      return jsonDownload(notes, "quicknotes-export.json");
    } catch (err) {
      return errorResponse(err);
    }
  }

  // POST /api/notes
  async handleCreate(request: NextRequest) {
    try {
      const body = await request.json();
      const dto: CreateNoteDto = {
        title: String(body.title ?? ""),
        content: body.content !== undefined ? String(body.content) : undefined,
        tags: Array.isArray(body.tags) ? body.tags.map(String) : undefined,
      };
      const note = await this.createNote.execute(dto);
      return created(note);
    } catch (err) {
      return errorResponse(err);
    }
  }

  // GET /api/notes/[id]
  async handleGet(_request: NextRequest, id: string) {
    try {
      const note = await this.getNote.execute({ id });
      return ok(note);
    } catch (err) {
      return errorResponse(err);
    }
  }

  // PATCH /api/notes/[id]
  async handleUpdate(request: NextRequest, id: string) {
    try {
      const body = await request.json();
      const dto: UpdateNoteDto = {
        id,
        title: body.title !== undefined ? String(body.title) : undefined,
        content: body.content !== undefined ? String(body.content) : undefined,
        tags: Array.isArray(body.tags) ? body.tags.map(String) : undefined,
        isPinned: body.isPinned !== undefined ? Boolean(body.isPinned) : undefined,
      };
      const note = await this.updateNote.execute(dto);
      return ok(note);
    } catch (err) {
      return errorResponse(err);
    }
  }

  // DELETE /api/notes/[id]
  async handleDelete(_request: NextRequest, id: string) {
    try {
      await this.deleteNote.execute({ id });
      return noContent();
    } catch (err) {
      return errorResponse(err);
    }
  }

  // POST /api/notes/[id]/duplicate
  async handleDuplicate(_request: NextRequest, id: string) {
    try {
      const note = await this.duplicateNote.execute({ id });
      return created(note);
    } catch (err) {
      return errorResponse(err);
    }
  }

  // POST /api/notes/[id]/pin
  async handleTogglePin(_request: NextRequest, id: string) {
    try {
      const note = await this.togglePinNote.execute({ id });
      return ok(note);
    } catch (err) {
      return errorResponse(err);
    }
  }
}
