/**
 * NoteContent — value object wrapping the note body.
 *
 * Rules:
 *   - Content may be empty (a blank note is valid).
 *   - Max 50 000 characters.
 *
 * Layer: domain
 */

import { DomainError } from "../errors/DomainError";

const MAX_LENGTH = 50_000;

export class NoteContent {
  private readonly _value: string;

  private constructor(value: string) {
    if (value.length > MAX_LENGTH) {
      throw new DomainError(
        `NoteContent: content must not exceed ${MAX_LENGTH} characters (got ${value.length}).`,
      );
    }
    this._value = value;
  }

  static create(value: string): NoteContent {
    return new NoteContent(value);
  }

  static empty(): NoteContent {
    return new NoteContent("");
  }

  get value(): string {
    return this._value;
  }

  get isEmpty(): boolean {
    return this._value.trim().length === 0;
  }

  /** Returns a truncated preview suitable for display in a list. */
  preview(maxChars = 120): string {
    const text = this._value.trim();
    if (text.length <= maxChars) return text;
    return `${text.slice(0, maxChars)}…`;
  }

  equals(other: NoteContent): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
