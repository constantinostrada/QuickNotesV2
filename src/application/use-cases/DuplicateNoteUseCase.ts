/**
 * DuplicateNoteUseCase — creates an independent copy of an existing note.
 *
 * The copy is a brand-new note (own id, fresh timestamps, unpinned) whose
 * title is the original's title with " (copia)" appended. Content and tags
 * are carried over.
 *
 * Input  : DuplicateNoteDto
 * Output : NoteDto (the new copy)
 *
 * Layer: application
 */

import { Note } from "@/domain/entities/Note";
import { NoteNotFoundError } from "@/domain/errors/NoteNotFoundError";
import type { INoteRepository } from "@/domain/repositories/INoteRepository";
import { NoteId } from "@/domain/value-objects/NoteId";

import type { NoteDto } from "../dtos/NoteDto";
import { NoteMapper } from "../mappers/NoteMapper";
import type { IUuidGenerator } from "../ports/IUuidGenerator";

export interface DuplicateNoteDto {
  id: string;
}

export class DuplicateNoteUseCase {
  constructor(
    private readonly noteRepository: INoteRepository,
    private readonly uuidGenerator: IUuidGenerator,
  ) {}

  async execute(dto: DuplicateNoteDto): Promise<NoteDto> {
    const original = await this.noteRepository.findById(NoteId.create(dto.id));

    if (!original) {
      throw new NoteNotFoundError(dto.id);
    }

    const copy = Note.create({
      id: NoteId.create(this.uuidGenerator.generate()),
      title: original.title.duplicated(),
      content: original.content,
      tags: [...original.tags],
    });

    await this.noteRepository.save(copy);

    return NoteMapper.toDto(copy);
  }
}
