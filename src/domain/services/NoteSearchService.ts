/**
 * NoteSearchService — domain service for in-memory note filtering.
 *
 * Encapsulates matching logic that doesn't belong to a single Note entity,
 * but is pure domain logic with no I/O dependency.
 *
 * Layer: domain
 */

import type { Note } from "../entities/Note";
import type { NoteSearchCriteria, NoteSortOrder } from "../repositories/INoteRepository";

export class NoteSearchService {
  /**
   * Filter a collection of notes in-memory against the given criteria.
   * Used by in-memory repository implementations and for client-side filtering.
   */
  filter(notes: Note[], criteria: NoteSearchCriteria): Note[] {
    let results = [...notes];

    if (criteria.pinnedOnly) {
      results = results.filter((n) => n.isPinned);
    }

    if (criteria.tags && criteria.tags.length > 0) {
      const requiredTags = criteria.tags.map((t) => t.toLowerCase());
      results = results.filter((note) => {
        const noteTags = note.tags.map((t) => t.value);
        return requiredTags.every((rt) => noteTags.includes(rt));
      });
    }

    if (criteria.query && criteria.query.trim().length > 0) {
      const needle = criteria.query.trim().toLowerCase();
      results = results.filter((note) => note.title.value.toLowerCase().includes(needle));
    }

    return results;
  }

  /**
   * Sort notes: pinned first, then by the requested order within each group.
   * - "recent" (default): most-recently-updated first
   * - "alphabetical": by title A→Z, case-insensitive
   */
  sort(notes: Note[], order: NoteSortOrder = "recent"): Note[] {
    return [...notes].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;

      if (order === "alphabetical") {
        return a.title.value.localeCompare(b.title.value, undefined, {
          sensitivity: "base",
        });
      }

      return b.updatedAt.getTime() - a.updatedAt.getTime();
    });
  }
}
