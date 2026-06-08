/**
 * NoteMapper — converts between Note (domain entity) and NoteDto.
 *
 * Lives in application because it bridges domain ↔ DTO.
 * Layer: application
 */

import type { Note } from "@/domain/entities/Note";

import type { NoteDto } from "../dtos/NoteDto";

export class NoteMapper {
  static toDto(note: Note): NoteDto {
    return {
      id: note.id.value,
      title: note.title.value,
      content: note.content.value,
      contentPreview: note.content.preview(120),
      tags: note.tags.map((t) => t.value),
      isPinned: note.isPinned,
      createdAt: note.createdAt.toISOString(),
      updatedAt: note.updatedAt.toISOString(),
    };
  }

  static toDtoList(notes: Note[]): NoteDto[] {
    return notes.map(NoteMapper.toDto);
  }
}
