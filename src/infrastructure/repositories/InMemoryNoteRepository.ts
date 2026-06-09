/**
 * InMemoryNoteRepository — volatile in-memory implementation of INoteRepository.
 *
 * Suitable for development, testing, and the default demo experience.
 * Replace with a database-backed implementation for production persistence.
 *
 * Layer: infrastructure
 */

import { NoteNotFoundError } from "@/domain/errors/NoteNotFoundError";
import type { Note } from "@/domain/entities/Note";
import type {
  INoteRepository,
  NoteSearchCriteria,
  NoteSortOrder,
} from "@/domain/repositories/INoteRepository";
import { NoteSearchService } from "@/domain/services/NoteSearchService";
import type { NoteId } from "@/domain/value-objects/NoteId";

export class InMemoryNoteRepository implements INoteRepository {
  private readonly store = new Map<string, Note>();
  private readonly searchService = new NoteSearchService();

  async save(note: Note): Promise<void> {
    this.store.set(note.id.value, note);
  }

  async findById(id: NoteId): Promise<Note | null> {
    return this.store.get(id.value) ?? null;
  }

  async findAll(sort?: NoteSortOrder): Promise<Note[]> {
    const all = Array.from(this.store.values());
    return this.searchService.sort(all, sort);
  }

  async search(criteria: NoteSearchCriteria): Promise<Note[]> {
    const all = Array.from(this.store.values());
    const filtered = this.searchService.filter(all, criteria);
    return this.searchService.sort(filtered, criteria.sort);
  }

  async delete(id: NoteId): Promise<void> {
    if (!this.store.has(id.value)) {
      throw new NoteNotFoundError(id.value);
    }
    this.store.delete(id.value);
  }

  async count(): Promise<number> {
    return this.store.size;
  }
}
