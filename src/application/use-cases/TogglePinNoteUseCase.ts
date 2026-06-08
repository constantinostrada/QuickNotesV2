/**
 * TogglePinNoteUseCase — pins or unpins a note (flips current state).
 *
 * Input  : TogglePinNoteDto
 * Output : NoteDto
 *
 * Layer: application
 */

import { NoteNotFoundError } from "@/domain/errors/NoteNotFoundError";
import type { INoteRepository } from "@/domain/repositories/INoteRepository";
import { NoteId } from "@/domain/value-objects/NoteId";

import type { NoteDto } from "../dtos/NoteDto";
import { NoteMapper } from "../mappers/NoteMapper";

export interface TogglePinNoteDto {
  id: string;
}

export class TogglePinNoteUseCase {
  constructor(private readonly noteRepository: INoteRepository) {}

  async execute(dto: TogglePinNoteDto): Promise<NoteDto> {
    const noteId = NoteId.create(dto.id);
    const note = await this.noteRepository.findById(noteId);

    if (!note) {
      throw new NoteNotFoundError(dto.id);
    }

    note.isPinned ? note.unpin() : note.pin();

    await this.noteRepository.save(note);

    return NoteMapper.toDto(note);
  }
}
