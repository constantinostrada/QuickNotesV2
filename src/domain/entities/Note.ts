/**
 * Note — core domain entity.
 *
 * Owns all invariants that define what a valid Note is.
 * Has identity (id), mutable state, and a lifecycle (created/updated).
 *
 * Layer: domain — imports NOTHING from outside itself.
 */

import { NoteId } from "../value-objects/NoteId";
import { NoteTitle } from "../value-objects/NoteTitle";
import { NoteContent } from "../value-objects/NoteContent";
import { NoteTag } from "../value-objects/NoteTag";
import { NoteCreatedEvent } from "../events/NoteCreatedEvent";
import { NoteUpdatedEvent } from "../events/NoteUpdatedEvent";
import type { DomainEvent } from "../events/DomainEvent";

export interface NoteProps {
  id: NoteId;
  title: NoteTitle;
  content: NoteContent;
  tags: NoteTag[];
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Reconstructed from persistence — bypasses domain event emission
 * because the note already exists.
 */
export interface ReconstitutedNoteProps extends NoteProps {
  _reconstituted: true;
}

export class Note {
  private readonly _id: NoteId;
  private _title: NoteTitle;
  private _content: NoteContent;
  private _tags: NoteTag[];
  private _isPinned: boolean;
  private readonly _createdAt: Date;
  private _updatedAt: Date;
  private _domainEvents: DomainEvent[] = [];

  private constructor(props: NoteProps, reconstituted = false) {
    this._id = props.id;
    this._title = props.title;
    this._content = props.content;
    this._tags = [...props.tags];
    this._isPinned = props.isPinned;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;

    if (!reconstituted) {
      this._domainEvents.push(new NoteCreatedEvent(this._id.value));
    }
  }

  // ─── Factory methods ────────────────────────────────────────────────────────

  static create(props: Omit<NoteProps, "isPinned" | "createdAt" | "updatedAt">): Note {
    const now = new Date();
    return new Note({
      ...props,
      isPinned: false,
      createdAt: now,
      updatedAt: now,
    });
  }

  static reconstitute(props: NoteProps): Note {
    return new Note(props, true);
  }

  // ─── Getters ────────────────────────────────────────────────────────────────

  get id(): NoteId {
    return this._id;
  }

  get title(): NoteTitle {
    return this._title;
  }

  get content(): NoteContent {
    return this._content;
  }

  get tags(): ReadonlyArray<NoteTag> {
    return this._tags;
  }

  get isPinned(): boolean {
    return this._isPinned;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // ─── Behaviour ──────────────────────────────────────────────────────────────

  updateTitle(title: NoteTitle): void {
    this._title = title;
    this._touch();
  }

  updateContent(content: NoteContent): void {
    this._content = content;
    this._touch();
  }

  setTags(tags: NoteTag[]): void {
    this._tags = [...tags];
    this._touch();
  }

  addTag(tag: NoteTag): void {
    const alreadyPresent = this._tags.some((t) => t.equals(tag));
    if (!alreadyPresent) {
      this._tags.push(tag);
      this._touch();
    }
  }

  removeTag(tag: NoteTag): void {
    const before = this._tags.length;
    this._tags = this._tags.filter((t) => !t.equals(tag));
    if (this._tags.length !== before) {
      this._touch();
    }
  }

  pin(): void {
    if (!this._isPinned) {
      this._isPinned = true;
      this._touch();
    }
  }

  unpin(): void {
    if (this._isPinned) {
      this._isPinned = false;
      this._touch();
    }
  }

  // ─── Domain events ──────────────────────────────────────────────────────────

  pullDomainEvents(): DomainEvent[] {
    const events = [...this._domainEvents];
    this._domainEvents = [];
    return events;
  }

  // ─── Helpers ────────────────────────────────────────────────────────────────

  private _touch(): void {
    this._updatedAt = new Date();
    this._domainEvents.push(new NoteUpdatedEvent(this._id.value));
  }
}
