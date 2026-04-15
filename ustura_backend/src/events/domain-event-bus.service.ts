import { EventEmitter } from 'node:events';
import { Injectable, Logger } from '@nestjs/common';
import type {
  AppDomainEvent,
  AppDomainEventName,
  DomainEventHandler,
} from './interfaces/domain-event.types';

@Injectable()
export class DomainEventBus {
  private readonly logger = new Logger(DomainEventBus.name);
  private readonly eventEmitter = new EventEmitter();

  constructor() {
    this.eventEmitter.setMaxListeners(50);
  }

  publish<TEvent extends AppDomainEvent>(event: TEvent): void {
    this.eventEmitter.emit(event.name, event);
  }

  subscribe<TEventName extends AppDomainEventName>(
    eventName: TEventName,
    handler: DomainEventHandler<TEventName>,
  ): () => void {
    const wrappedHandler = (
      event: Extract<AppDomainEvent, { name: TEventName }>,
    ) => {
      void Promise.resolve(handler(event)).catch((error: unknown) => {
        const message =
          error instanceof Error
            ? error.message
            : 'Unknown domain event error.';

        this.logger.warn(
          `Domain event handler failed for ${eventName}: ${message}`,
        );
      });
    };

    this.eventEmitter.on(eventName, wrappedHandler);

    return () => {
      this.eventEmitter.off(eventName, wrappedHandler);
    };
  }
}
