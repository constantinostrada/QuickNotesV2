/**
 * NoteUpdatedEvent — fired when an existing Note is mutated.
 *
 * Layer: domain
 */

import type { DomainEvent } from "./DomainEvent";

export class NoteUpdatedEvent implements DomainEvent {
  readonly eventName = "note.updated";
  readonly occurredAt: Date;

  constructor(readonly noteId: string) {
    this.occurredAt = new Date();
  }
}
