/**
 * DomainError — base class for all domain-level exceptions.
 *
 * Thrown when a business invariant is violated.
 * Layer: domain
 */

export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DomainError";
    // Maintains proper prototype chain in transpiled ES5
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
