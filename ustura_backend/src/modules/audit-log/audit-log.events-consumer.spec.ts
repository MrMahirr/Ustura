import { Role } from '../../shared/auth/role.enum';
import { ReservationStatus } from '../reservation/enums/reservation-status.enum';
import { DomainEventBus } from '../../events/domain-event-bus.service';
import { AuditLogAction } from './enums/audit-log-action.enum';
import { AuditLogEntityType } from './enums/audit-log-entity-type.enum';
import { AuditLogEventsConsumer } from './audit-log.events-consumer';
import { AuditLogService } from './audit-log.service';

describe('AuditLogEventsConsumer', () => {
  let consumer: AuditLogEventsConsumer;
  let domainEventBus: DomainEventBus;
  let auditLogService: jest.Mocked<Pick<AuditLogService, 'recordBestEffort'>>;

  beforeEach(() => {
    domainEventBus = new DomainEventBus();
    auditLogService = {
      recordBestEffort: jest.fn(),
    };
    consumer = new AuditLogEventsConsumer(
      domainEventBus,
      auditLogService as AuditLogService,
    );
    consumer.onModuleInit();
  });

  afterEach(() => {
    consumer.onModuleDestroy();
  });

  it('records audit logs for reservation created events', async () => {
    domainEventBus.publish({
      name: 'reservation.created',
      occurredAt: new Date('2026-04-10T09:00:00.000Z'),
      payload: {
        actorUserId: 'customer-1',
        actorRole: Role.CUSTOMER,
        reservationId: 'reservation-1',
        customerId: 'customer-1',
        customerName: 'Customer',
        customerEmail: 'customer@example.com',
        salonId: 'salon-1',
        salonName: 'Ustura Premium',
        staffId: 'staff-1',
        staffDisplayName: 'Barber One',
        status: ReservationStatus.PENDING,
        slotStart: '2026-04-10T10:00:00.000Z',
        slotEnd: '2026-04-10T10:30:00.000Z',
      },
    });

    await new Promise(process.nextTick);

    expect(auditLogService.recordBestEffort).toHaveBeenCalledWith({
      actorUserId: 'customer-1',
      actorRole: Role.CUSTOMER,
      action: AuditLogAction.RESERVATION_CREATED,
      entityType: AuditLogEntityType.RESERVATION,
      entityId: 'reservation-1',
      metadata: {
        customerId: 'customer-1',
        salonId: 'salon-1',
        staffId: 'staff-1',
        status: ReservationStatus.PENDING,
        slotStart: '2026-04-10T10:00:00.000Z',
        slotEnd: '2026-04-10T10:30:00.000Z',
      },
    });
  });

  it('records audit logs for logout events', async () => {
    domainEventBus.publish({
      name: 'auth.logged_out',
      occurredAt: new Date('2026-04-10T09:00:00.000Z'),
      payload: {
        userId: 'user-1',
        provider: 'refresh_token' as const,
      },
    });

    await new Promise(process.nextTick);

    expect(auditLogService.recordBestEffort).toHaveBeenCalledWith({
      actorUserId: 'user-1',
      action: AuditLogAction.AUTH_LOGGED_OUT,
      entityType: AuditLogEntityType.USER,
      entityId: 'user-1',
      metadata: {
        provider: 'refresh_token',
      },
    });
  });
});
