/**
 * DeleteNoteUseCase — permanently removes a note.
 *
 * Input  : DeleteNoteDto
 * Output : void
 *
 * Layer: application
 */

import { NoteNotFoundError } from "@/domain/errors/NoteNotFoundError";
import type { INoteRepository } from "@/domain/repositories/INoteRepository";
import { NoteId } from "@/domain/value-objects/NoteId";

export interface DeleteNoteDto {
  id: string;
}

export class DeleteNoteUseCase {
  constructor(private readonly noteRepository: INoteRepository) {}

  async execute(dto: DeleteNoteDto): Promise<void> {
    const noteId = NoteId.create(dto.id);
    const note = await this.noteRepository.findById(noteId);

    if (!note) {
      throw new NoteNotFoundError(dto.id);
    }

    await this.noteRepository.delete(noteId);
  }
}
