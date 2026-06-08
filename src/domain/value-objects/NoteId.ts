/**
 * NoteId — value object wrapping the note's unique identifier (UUID v4).
 *
 * Equality is by value, not reference.
 * Layer: domain
 */

import { DomainError } from "../errors/DomainError";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export class NoteId {
  private readonly _value: string;

  private constructor(value: string) {
    if (!UUID_REGEX.test(value)) {
      throw new DomainError(`NoteId: "${value}" is not a valid UUID v4.`);
    }
    this._value = value;
  }

  static create(value: string): NoteId {
    return new NoteId(value);
  }

  get value(): string {
    return this._value;
  }

  equals(other: NoteId): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
