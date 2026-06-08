/**
 * NoteNotFoundError — thrown when a requested note does not exist.
 *
 * Layer: domain
 */

import { DomainError } from "./DomainError";

export class NoteNotFoundError extends DomainError {
  constructor(noteId: string) {
    super(`Note with id "${noteId}" was not found.`);
    this.name = "NoteNotFoundError";
  }
}
