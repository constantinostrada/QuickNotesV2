/**
 * NoteTitle — value object enforcing title constraints.
 *
 * Rules:
 *   - Must not be blank.
 *   - Max 200 characters.
 *   - Leading/trailing whitespace is stripped.
 *
 * Layer: domain
 */

import { DomainError } from "../errors/DomainError";

const MAX_LENGTH = 200;
const COPY_SUFFIX = " (copia)";

export class NoteTitle {
  private readonly _value: string;

  private constructor(value: string) {
    const trimmed = value.trim();
    if (trimmed.length === 0) {
      throw new DomainError("NoteTitle: title must not be blank.");
    }
    if (trimmed.length > MAX_LENGTH) {
      throw new DomainError(
        `NoteTitle: title must not exceed ${MAX_LENGTH} characters (got ${trimmed.length}).`,
      );
    }
    this._value = trimmed;
  }

  static create(value: string): NoteTitle {
    return new NoteTitle(value);
  }

  /**
   * Derives the title for a duplicated note by appending " (copia)".
   * The base is truncated when necessary so the result respects MAX_LENGTH.
   */
  duplicated(): NoteTitle {
    const maxBaseLength = MAX_LENGTH - COPY_SUFFIX.length;
    const base =
      this._value.length > maxBaseLength ? this._value.slice(0, maxBaseLength) : this._value;
    return new NoteTitle(base + COPY_SUFFIX);
  }

  get value(): string {
    return this._value;
  }

  equals(other: NoteTitle): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
