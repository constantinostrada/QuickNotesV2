/**
 * NoteDto — output contract for note data crossing layer boundaries.
 *
 * Plain data — no domain types — safe to serialise to JSON.
 * Layer: application
 */

export interface NoteDto {
  id: string;
  title: string;
  content: string;
  contentPreview: string;
  tags: string[];
  isPinned: boolean;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}
