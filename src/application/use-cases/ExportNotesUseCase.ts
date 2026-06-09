/**
 * ExportNotesUseCase — returns every note in a minimal, serialisable
 * shape (title, text, tags) for download as a .json file.
 *
 * Input  : none
 * Output : ExportedNoteDto[]
 *
 * Layer: application
 */

import type { INoteRepository } from "@/domain/repositories/INoteRepository";

import type { ExportedNoteDto } from "../dtos/ExportedNoteDto";
import { NoteMapper } from "../mappers/NoteMapper";

export class ExportNotesUseCase {
  constructor(private readonly noteRepository: INoteRepository) {}

  async execute(): Promise<ExportedNoteDto[]> {
    const notes = await this.noteRepository.findAll();
    return NoteMapper.toExportedDtoList(notes);
  }
}
