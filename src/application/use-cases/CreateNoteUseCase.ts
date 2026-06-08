/**
 * CreateNoteUseCase — creates a new Note and persists it.
 *
 * Input  : CreateNoteDto
 * Output : NoteDto
 *
 * Layer: application
 */

import { Note } from "@/domain/entities/Note";
import { NoteContent } from "@/domain/value-objects/NoteContent";
import { NoteId } from "@/domain/value-objects/NoteId";
import { NoteTag } from "@/domain/value-objects/NoteTag";
import { NoteTitle } from "@/domain/value-objects/NoteTitle";
import type { INoteRepository } from "@/domain/repositories/INoteRepository";

import type { NoteDto } from "../dtos/NoteDto";
import { NoteMapper } from "../mappers/NoteMapper";
import type { IUuidGenerator } from "../ports/IUuidGenerator";

export interface CreateNoteDto {
  title: string;
  content?: string;
  tags?: string[];
}

export class CreateNoteUseCase {
  constructor(
    private readonly noteRepository: INoteRepository,
    private readonly uuidGenerator: IUuidGenerator,
  ) {}

  async execute(dto: CreateNoteDto): Promise<NoteDto> {
    const id = NoteId.create(this.uuidGenerator.generate());
    const title = NoteTitle.create(dto.title);
    const content = NoteContent.create(dto.content ?? "");
    const tags = (dto.tags ?? []).map((t) => NoteTag.create(t));

    const note = Note.create({ id, title, content, tags });

    await this.noteRepository.save(note);

    return NoteMapper.toDto(note);
  }
}
