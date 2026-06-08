/**
 * INoteRepository — repository interface for Note persistence.
 *
 * Describes WHAT operations are available, not HOW they are implemented.
 * All implementations live in infrastructure/.
 *
 * Layer: domain
 */

import type { Note } from "../entities/Note";
import type { NoteId } from "../value-objects/NoteId";

export interface NoteSearchCriteria {
  /** Free-text search against title and content. */
  query?: string;
  /** Filter by one or more tag values (AND semantics). */
  tags?: string[];
  /** Return only pinned notes when true. */
  pinnedOnly?: boolean;
}

export interface INoteRepository {
  /** Persist a new note or overwrite an existing one. */
  save(note: Note): Promise<void>;

  /** Find a single note by its identity. Returns null if not found. */
  findById(id: NoteId): Promise<Note | null>;

  /** Return all notes, most-recently-updated first. */
  findAll(): Promise<Note[]>;

  /** Return notes matching the given criteria. */
  search(criteria: NoteSearchCriteria): Promise<Note[]>;

  /** Permanently remove a note. Resolves silently if it does not exist. */
  delete(id: NoteId): Promise<void>;

  /** Return the total number of stored notes. */
  count(): Promise<number>;
}
