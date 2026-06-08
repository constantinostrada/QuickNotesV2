/**
 * ListNotesUseCase — retrieves all notes, optionally filtered.
 *
 * Input  : ListNotesDto
 * Output : NoteDto[]
 *
 * Layer: application
 */

import type { INoteRepository, NoteSearchCriteria } from "@/domain/repositories/INoteRepository";

import type { NoteDto } from "../dtos/NoteDto";
import { NoteMapper } from "../mappers/NoteMapper";

export interface ListNotesDto {
  query?: string;
  tags?: string[];
  pinnedOnly?: boolean;
}

export class ListNotesUseCase {
  constructor(private readonly noteRepository: INoteRepository) {}

  async execute(dto: ListNotesDto = {}): Promise<NoteDto[]> {
    const criteria: NoteSearchCriteria = {
      query: dto.query,
      tags: dto.tags,
      pinnedOnly: dto.pinnedOnly,
    };

    const hasFilter = criteria.query || criteria.tags?.length || criteria.pinnedOnly;
    const notes = hasFilter
      ? await this.noteRepository.search(criteria)
      : await this.noteRepository.findAll();

    return NoteMapper.toDtoList(notes);
  }
}
