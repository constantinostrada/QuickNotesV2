/**
 * ExportedNoteDto — minimal note shape for the export file.
 *
 * Intentionally narrower than NoteDto: an export captures the
 * user-authored content (title, text, tags) without internal
 * identifiers, timestamps, or UI-only fields.
 *
 * Plain data — safe to serialise to JSON.
 * Layer: application
 */

export interface ExportedNoteDto {
  title: string;
  content: string;
  tags: string[];
}
