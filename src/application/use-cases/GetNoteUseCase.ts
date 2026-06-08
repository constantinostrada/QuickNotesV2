/**
 * GetNoteUseCase — retrieves a single note by its ID.
 *
 * Input  : GetNoteDto
 * Output : NoteDto
 *
 * Layer: application
 */

import { NoteNotFoundError } from "@/domain/errors/NoteNotFoundError";
import type { INoteRepository } from "@/domain/repositories/INoteRepository";
import { NoteId } from "@/domain/value-objects/NoteId";

import type { NoteDto } from "../dtos/NoteDto";
import { NoteMapper } from "../mappers/NoteMapper";

export interface GetNoteDto {
  id: string;
}

export class GetNoteUseCase {
  constructor(private readonly noteRepository: INoteRepository) {}

  async execute(dto: GetNoteDto): Promise<NoteDto> {
    const noteId = NoteId.create(dto.id);
    const note = await this.noteRepository.findById(noteId);

    if (!note) {
      throw new NoteNotFoundError(dto.id);
    }

    return NoteMapper.toDto(note);
  }
}
