import {
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { DomainEventBus } from '../../events/domain-event-bus.service';
import { NotificationService } from './notification.service';

@Injectable()
export class NotificationEventsConsumer
  implements OnModuleInit, OnModuleDestroy
{
  private readonly unsubscribers: Array<() => void> = [];

  constructor(
    private readonly domainEventBus: DomainEventBus,
    private readonly notificationService: NotificationService,
  ) {}

  onModuleInit(): void {
    this.unsubscribers.push(
      this.domainEventBus.subscribe('reservation.created', (event) => {
        this.notificationService.sendReservationCreatedBestEffort({
          recipientEmail: event.payload.customerEmail,
          recipientName: event.payload.customerName,
          salonName: event.payload.salonName,
          staffDisplayName: event.payload.staffDisplayName,
          slotStart: new Date(event.payload.slotStart),
          slotEnd: new Date(event.payload.slotEnd),
        });
      }),
      this.domainEventBus.subscribe('reservation.cancelled', (event) => {
        if (
          !event.payload.customerEmail ||
          !event.payload.customerName ||
          !event.payload.staffDisplayName
        ) {
          return;
        }

        this.notificationService.sendReservationCancelledBestEffort({
          recipientEmail: event.payload.customerEmail,
          recipientName: event.payload.customerName,
          salonName: event.payload.salonName,
          staffDisplayName: event.payload.staffDisplayName,
          slotStart: new Date(event.payload.slotStart),
          slotEnd: new Date(event.payload.slotEnd),
          cancelledByRole: event.payload.actorRole,
        });
      }),
      this.domainEventBus.subscribe('owner.approved', (event) => {
        this.notificationService.sendOwnerApprovedBestEffort({
          recipientEmail: event.payload.applicantEmail,
          recipientName: event.payload.applicantName,
          salonName: event.payload.salonName,
          approvedAt: new Date(event.payload.approvedAt),
        });
      }),
      this.domainEventBus.subscribe('auth.logged_out', (event) => {
        if (
          event.payload.reason === 'manual_logout' ||
          !event.payload.userEmail
        ) {
          return;
        }

        this.notificationService.sendAuthSecurityBestEffort({
          recipientEmail: event.payload.userEmail,
          recipientName: event.payload.userName ?? null,
          reason: event.payload.reason,
          revokedSessionCount: event.payload.revokedSessionCount,
        });
      }),
    );
  }

  onModuleDestroy(): void {
    for (const unsubscribe of this.unsubscribers) {
      unsubscribe();
    }
  }
}
