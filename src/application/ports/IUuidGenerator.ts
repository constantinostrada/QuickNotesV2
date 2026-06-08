/**
 * IUuidGenerator — port interface for UUID generation.
 *
 * Defined in application so use cases can depend on the abstraction.
 * Implemented in infrastructure (e.g. using the `uuid` package).
 *
 * Layer: application
 */

export interface IUuidGenerator {
  generate(): string;
}
