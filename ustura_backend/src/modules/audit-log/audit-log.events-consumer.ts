import {
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { DomainEventBus } from '../../events/domain-event-bus.service';
import { AuditLogAction } from './enums/audit-log-action.enum';
import { AuditLogEntityType } from './enums/audit-log-entity-type.enum';
import { AuditLogService } from './audit-log.service';

@Injectable()
export class AuditLogEventsConsumer implements OnModuleInit, OnModuleDestroy {
  private readonly unsubscribers: Array<() => void> = [];

  constructor(
    private readonly domainEventBus: DomainEventBus,
    private readonly auditLogService: AuditLogService,
  ) {}

  onModuleInit(): void {
    this.unsubscribers.push(
      this.domainEventBus.subscribe('reservation.created', (event) => {
        this.auditLogService.recordBestEffort({
          actorUserId: event.payload.actorUserId,
          actorRole: event.payload.actorRole,
          action: AuditLogAction.RESERVATION_CREATED,
          entityType: AuditLogEntityType.RESERVATION,
          entityId: event.payload.reservationId,
          metadata: {
            customerId: event.payload.customerId,
            salonId: event.payload.salonId,
            staffId: event.payload.staffId,
            status: event.payload.status,
            slotStart: event.payload.slotStart,
            slotEnd: event.payload.slotEnd,
          },
        });
      }),
      this.domainEventBus.subscribe('reservation.cancelled', (event) => {
        this.auditLogService.recordBestEffort({
          actorUserId: event.payload.actorUserId,
          actorRole: event.payload.actorRole,
          action: AuditLogAction.RESERVATION_CANCELLED,
          entityType: AuditLogEntityType.RESERVATION,
          entityId: event.payload.reservationId,
          metadata: {
            customerId: event.payload.customerId,
            salonId: event.payload.salonId,
            staffId: event.payload.staffId,
            status: event.payload.status,
            previousStatus: event.payload.previousStatus,
            slotStart: event.payload.slotStart,
            slotEnd: event.payload.slotEnd,
          },
        });
      }),
      this.domainEventBus.subscribe('reservation.status_changed', (event) => {
        this.auditLogService.recordBestEffort({
          actorUserId: event.payload.actorUserId,
          actorRole: event.payload.actorRole,
          action: AuditLogAction.RESERVATION_STATUS_UPDATED,
          entityType: AuditLogEntityType.RESERVATION,
          entityId: event.payload.reservationId,
          metadata: {
            customerId: event.payload.customerId,
            salonId: event.payload.salonId,
            staffId: event.payload.staffId,
            previousStatus: event.payload.previousStatus,
            nextStatus: event.payload.nextStatus,
            slotStart: event.payload.slotStart,
            slotEnd: event.payload.slotEnd,
          },
        });
      }),
      this.domainEventBus.subscribe('staff.created', (event) => {
        this.auditLogService.recordBestEffort({
          actorUserId: event.payload.actorUserId,
          actorRole: event.payload.actorRole,
          action: AuditLogAction.STAFF_CREATED,
          entityType: AuditLogEntityType.STAFF,
          entityId: event.payload.staffId,
          metadata: {
            userId: event.payload.userId,
            salonId: event.payload.salonId,
            role: event.payload.staffRole,
          },
        });
      }),
      this.domainEventBus.subscribe('auth.logged_out', (event) => {
        this.auditLogService.recordBestEffort({
          actorUserId: event.payload.userId,
          action: AuditLogAction.AUTH_LOGGED_OUT,
          entityType: AuditLogEntityType.USER,
          entityId: event.payload.userId,
          metadata: {
            provider: event.payload.provider,
            reason: event.payload.reason,
            revokedSessionCount: event.payload.revokedSessionCount,
            sourceRefreshTokenId: event.payload.sourceRefreshTokenId ?? null,
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
