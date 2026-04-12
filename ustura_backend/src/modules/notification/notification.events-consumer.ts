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

        this.notificationService.persistBestEffort({
          recipientId: event.payload.customerId ?? null,
          key: 'reservation.created',
          title: `${event.payload.salonName} rezervasyonu olusturuldu`,
          body: `${event.payload.customerName}, ${event.payload.staffDisplayName} ile randevu olusturdu.`,
          tone: 'success',
          metadata: {
            salonName: event.payload.salonName,
            staffDisplayName: event.payload.staffDisplayName,
            slotStart: event.payload.slotStart,
            slotEnd: event.payload.slotEnd,
          },
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

        this.notificationService.persistBestEffort({
          recipientId: event.payload.customerId ?? null,
          key: 'reservation.cancelled',
          title: `${event.payload.salonName} rezervasyonu iptal edildi`,
          body: `${event.payload.customerName} randevusu ${event.payload.actorRole} tarafindan iptal edildi.`,
          tone: 'error',
          metadata: {
            salonName: event.payload.salonName,
            cancelledByRole: event.payload.actorRole,
            slotStart: event.payload.slotStart,
          },
        });
      }),
      this.domainEventBus.subscribe('owner.approved', (event) => {
        this.notificationService.sendOwnerApprovedBestEffort({
          recipientEmail: event.payload.applicantEmail,
          recipientName: event.payload.applicantName,
          salonName: event.payload.salonName,
          approvedAt: new Date(event.payload.approvedAt),
        });

        this.notificationService.persistBestEffort({
          recipientId: event.payload.approvedOwnerUserId ?? null,
          key: 'owner.approved',
          title: `${event.payload.salonName} basvurusu onaylandi`,
          body: `${event.payload.applicantName} salon sahibi basvurusu onaylandi.`,
          tone: 'success',
          metadata: {
            salonName: event.payload.salonName,
            approvedAt: event.payload.approvedAt,
          },
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

        this.notificationService.persistBestEffort({
          recipientId: event.payload.userId ?? null,
          key: 'auth.security',
          title: 'Oturum guvenligi bildirimi',
          body: `Hesabiniz icin guvenlik olayi tespit edildi. Etkilenen oturum: ${event.payload.revokedSessionCount}.`,
          tone: 'warning',
          metadata: {
            reason: event.payload.reason,
            revokedSessionCount: event.payload.revokedSessionCount,
          },
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
