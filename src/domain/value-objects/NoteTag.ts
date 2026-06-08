/**
 * NoteTag — value object for a single tag label.
 *
 * Rules:
 *   - Must not be blank.
 *   - Max 30 characters.
 *   - Normalised to lowercase.
 *   - Only alphanumeric chars, hyphens, and underscores are allowed.
 *
 * Layer: domain
 */

import { DomainError } from "../errors/DomainError";

const MAX_LENGTH = 30;
const VALID_PATTERN = /^[a-z0-9_-]+$/;

export class NoteTag {
  private readonly _value: string;

  private constructor(value: string) {
    const normalised = value.trim().toLowerCase();
    if (normalised.length === 0) {
      throw new DomainError("NoteTag: tag must not be blank.");
    }
    if (normalised.length > MAX_LENGTH) {
      throw new DomainError(
        `NoteTag: tag must not exceed ${MAX_LENGTH} characters (got ${normalised.length}).`,
      );
    }
    if (!VALID_PATTERN.test(normalised)) {
      throw new DomainError(
        `NoteTag: tag "${normalised}" contains invalid characters. ` +
          "Only a-z, 0-9, hyphens, and underscores are allowed.",
      );
    }
    this._value = normalised;
  }

  static create(value: string): NoteTag {
    return new NoteTag(value);
  }

  get value(): string {
    return this._value;
  }

  equals(other: NoteTag): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
