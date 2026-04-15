import { Role } from '../../shared/auth/role.enum';
import { DomainEventBus } from '../../events/domain-event-bus.service';
import { ReservationStatus } from '../reservation/enums/reservation-status.enum';
import { NotificationEventsConsumer } from './notification.events-consumer';
import { NotificationService } from './notification.service';

describe('NotificationEventsConsumer', () => {
  let consumer: NotificationEventsConsumer;
  let domainEventBus: DomainEventBus;
  let notificationService: jest.Mocked<
    Pick<
      NotificationService,
      | 'sendReservationCreatedBestEffort'
      | 'sendReservationCancelledBestEffort'
      | 'sendOwnerApprovedBestEffort'
      | 'sendAuthSecurityBestEffort'
      | 'persistBestEffort'
    >
  >;

  beforeEach(() => {
    domainEventBus = new DomainEventBus();
    notificationService = {
      sendReservationCreatedBestEffort: jest.fn(),
      sendReservationCancelledBestEffort: jest.fn(),
      sendOwnerApprovedBestEffort: jest.fn(),
      sendAuthSecurityBestEffort: jest.fn(),
      persistBestEffort: jest.fn(),
    };
    consumer = new NotificationEventsConsumer(
      domainEventBus,
      notificationService as NotificationService,
    );
    consumer.onModuleInit();
  });

  afterEach(() => {
    consumer.onModuleDestroy();
  });

  it('forwards reservation created events to the notification service', async () => {
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

    expect(
      notificationService.sendReservationCreatedBestEffort,
    ).toHaveBeenCalledWith({
      recipientEmail: 'customer@example.com',
      recipientName: 'Customer',
      salonName: 'Ustura Premium',
      staffDisplayName: 'Barber One',
      slotStart: new Date('2026-04-10T10:00:00.000Z'),
      slotEnd: new Date('2026-04-10T10:30:00.000Z'),
    });
  });

  it('forwards owner approved events to the notification service', async () => {
    domainEventBus.publish({
      name: 'owner.approved',
      occurredAt: new Date('2026-04-10T09:00:00.000Z'),
      payload: {
        applicationId: 'application-1',
        applicantName: 'Owner',
        applicantEmail: 'owner@example.com',
        salonName: 'Ustura Premium',
        approvedAt: '2026-04-10T12:00:00.000Z',
        reviewedByUserId: 'super-admin-1',
        approvedOwnerUserId: 'owner-1',
        approvedSalonId: 'salon-1',
      },
    });

    await new Promise(process.nextTick);

    expect(
      notificationService.sendOwnerApprovedBestEffort,
    ).toHaveBeenCalledWith({
      recipientEmail: 'owner@example.com',
      recipientName: 'Owner',
      salonName: 'Ustura Premium',
      approvedAt: new Date('2026-04-10T12:00:00.000Z'),
    });
  });

  it('forwards non-manual auth logout events to the notification service', async () => {
    domainEventBus.publish({
      name: 'auth.logged_out',
      occurredAt: new Date('2026-04-10T09:00:00.000Z'),
      payload: {
        userId: 'user-1',
        userEmail: 'user@example.com',
        userName: 'User',
        provider: 'refresh_token' as const,
        reason: 'logout_all' as const,
        revokedSessionCount: 2,
        sourceRefreshTokenId: null,
      },
    });

    await new Promise(process.nextTick);

    expect(notificationService.sendAuthSecurityBestEffort).toHaveBeenCalledWith(
      {
        recipientEmail: 'user@example.com',
        recipientName: 'User',
        reason: 'logout_all',
        revokedSessionCount: 2,
      },
    );
  });
});
