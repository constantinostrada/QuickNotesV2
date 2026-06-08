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
