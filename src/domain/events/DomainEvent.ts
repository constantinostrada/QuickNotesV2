/**
 * DomainEvent — base interface for all domain events.
 *
 * Layer: domain
 */

export interface DomainEvent {
  readonly eventName: string;
  readonly occurredAt: Date;
}
