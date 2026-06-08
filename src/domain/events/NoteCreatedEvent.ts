/**
 * NoteCreatedEvent — fired when a new Note is created.
 *
 * Layer: domain
 */

import type { DomainEvent } from "./DomainEvent";

export class NoteCreatedEvent implements DomainEvent {
  readonly eventName = "note.created";
  readonly occurredAt: Date;

  constructor(readonly noteId: string) {
    this.occurredAt = new Date();
  }
}
