/**
 * UpdateNoteUseCase — updates an existing note's fields.
 *
 * Only the fields present in the DTO are updated (partial update).
 * Input  : UpdateNoteDto
 * Output : NoteDto
 *
 * Layer: application
 */

import { NoteNotFoundError } from "@/domain/errors/NoteNotFoundError";
import type { INoteRepository } from "@/domain/repositories/INoteRepository";
import { NoteContent } from "@/domain/value-objects/NoteContent";
import { NoteId } from "@/domain/value-objects/NoteId";
import { NoteTag } from "@/domain/value-objects/NoteTag";
import { NoteTitle } from "@/domain/value-objects/NoteTitle";

import type { NoteDto } from "../dtos/NoteDto";
import { NoteMapper } from "../mappers/NoteMapper";

export interface UpdateNoteDto {
  id: string;
  title?: string;
  content?: string;
  tags?: string[];
  isPinned?: boolean;
}

export class UpdateNoteUseCase {
  constructor(private readonly noteRepository: INoteRepository) {}

  async execute(dto: UpdateNoteDto): Promise<NoteDto> {
    const noteId = NoteId.create(dto.id);
    const note = await this.noteRepository.findById(noteId);

    if (!note) {
      throw new NoteNotFoundError(dto.id);
    }

    if (dto.title !== undefined) {
      note.updateTitle(NoteTitle.create(dto.title));
    }

    if (dto.content !== undefined) {
      note.updateContent(NoteContent.create(dto.content));
    }

    if (dto.tags !== undefined) {
      note.setTags(dto.tags.map((t) => NoteTag.create(t)));
    }

    if (dto.isPinned !== undefined) {
      dto.isPinned ? note.pin() : note.unpin();
    }

    await this.noteRepository.save(note);

    return NoteMapper.toDto(note);
  }
}
