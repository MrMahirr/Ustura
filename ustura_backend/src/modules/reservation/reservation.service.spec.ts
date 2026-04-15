import {
  ConflictException,
  ForbiddenException,
  HttpException,
} from '@nestjs/common';
import { ERROR_CODES } from '../../shared/errors/error-codes';
import { Role } from '../../shared/auth/role.enum';
import { DatabaseConstraintViolationError } from '../../database/database.errors';
import { DatabaseService } from '../../database/database.service';
import { DomainEventBus } from '../../events/domain-event-bus.service';
import type { JwtPayload } from '../../shared/auth/jwt-payload.interface';
import { SalonService } from '../salon/salon.service';
import { StaffService } from '../staff/staff.service';
import { UserService } from '../user/user.service';
import { ReservationStatus } from './enums/reservation-status.enum';
import { ReservationPolicy } from './policies/reservation.policy';
import { ReservationRepository } from './repositories/reservation.repository';
import { ReservationService } from './reservation.service';
import { SlotService } from './slot/slot.service';

function createCustomerPayload(): JwtPayload {
  return {
    sub: 'customer-1',
    email: 'customer@example.com',
    role: Role.CUSTOMER,
    tokenType: 'access',
  };
}

function getExceptionCode(error: unknown): string | undefined {
  if (!(error instanceof HttpException)) {
    return undefined;
  }

  const response = error.getResponse();

  if (
    typeof response !== 'object' ||
    response == null ||
    !('code' in response)
  ) {
    return undefined;
  }

  return typeof response.code === 'string' ? response.code : undefined;
}

describe('ReservationService', () => {
  let service: ReservationService;
  let reservationRepository: jest.Mocked<ReservationRepository>;
  let userService: jest.Mocked<UserService>;
  let slotService: jest.Mocked<SlotService>;
  let salonService: jest.Mocked<Pick<SalonService, 'findActiveById'>>;
  let staffService: jest.Mocked<
    Pick<StaffService, 'findById' | 'findActiveByUserIdAndSalon'>
  >;
  let databaseService: jest.Mocked<DatabaseService>;
  let domainEventBus: jest.Mocked<Pick<DomainEventBus, 'publish'>>;

  beforeEach(() => {
    reservationRepository = {
      create: jest.fn(),
      findByCustomerId: jest.fn(),
      findBySalonId: jest.fn(),
      findById: jest.fn(),
      cancel: jest.fn(),
      updateStatus: jest.fn(),
    } as unknown as jest.Mocked<ReservationRepository>;
    userService = {
      findByPrincipal: jest.fn(),
      findOrCreateManagedCustomer: jest.fn(),
    } as unknown as jest.Mocked<UserService>;
    slotService = {
      assertSlotReservable: jest.fn(),
      acquireReservationLock: jest.fn(),
      releaseSelection: jest.fn(),
      releaseReservationLock: jest.fn(),
    } as unknown as jest.Mocked<SlotService>;
    salonService = {
      findActiveById: jest.fn(),
    } as jest.Mocked<Pick<SalonService, 'findActiveById'>>;
    staffService = {
      findById: jest.fn(),
      findActiveByUserIdAndSalon: jest.fn(),
    } as jest.Mocked<
      Pick<StaffService, 'findById' | 'findActiveByUserIdAndSalon'>
    >;
    databaseService = {
      transaction: jest.fn(),
    } as unknown as jest.Mocked<DatabaseService>;
    domainEventBus = {
      publish: jest.fn(),
    };

    service = new ReservationService(
      reservationRepository,
      userService,
      userService,
      slotService,
      salonService as unknown as SalonService,
      staffService as unknown as StaffService,
      databaseService,
      new ReservationPolicy(),
      domainEventBus as DomainEventBus,
    );
  });

  it('returns a stable code when a slot is already being reserved', async () => {
    salonService.findActiveById.mockResolvedValue({
      id: 'salon-1',
      ownerId: 'owner-1',
      isActive: true,
    } as any);
    staffService.findById.mockResolvedValue({
      id: 'staff-1',
      salonId: 'salon-1',
      role: Role.BARBER,
      isActive: true,
    } as any);
    userService.findByPrincipal.mockResolvedValue({
      id: 'customer-1',
      name: 'Customer',
      email: 'customer@example.com',
      role: Role.CUSTOMER,
      isActive: true,
    } as any);
    slotService.assertSlotReservable.mockResolvedValue({
      slotStart: new Date('2026-04-10T10:00:00.000Z'),
      slotEnd: new Date('2026-04-10T10:30:00.000Z'),
      date: '2026-04-10',
    });
    slotService.acquireReservationLock.mockResolvedValue(null);

    let capturedError: unknown;

    try {
      await service.create(createCustomerPayload(), {
        salonId: 'salon-1',
        staffId: 'staff-1',
        slotStart: '2026-04-10T10:00:00.000Z',
      });
    } catch (error) {
      capturedError = error;
    }

    expect(capturedError).toBeInstanceOf(ConflictException);
    expect(getExceptionCode(capturedError)).toBe(
      ERROR_CODES.RESERVATION.SLOT_BEING_RESERVED,
    );
  });

  it('returns a stable code when non-customers request my reservations', async () => {
    let capturedError: unknown;

    try {
      await service.findByCustomerId({
        ...createCustomerPayload(),
        role: Role.OWNER,
      });
    } catch (error) {
      capturedError = error;
    }

    expect(capturedError).toBeInstanceOf(ForbiddenException);
    expect(getExceptionCode(capturedError)).toBe(
      ERROR_CODES.RESERVATION.ONLY_CUSTOMERS_CAN_VIEW_OWN,
    );
  });

  it('denies salon reservation visibility for barbers without an active staff membership', async () => {
    salonService.findActiveById.mockResolvedValue({
      id: 'salon-1',
      ownerId: 'owner-1',
      isActive: true,
    } as any);
    staffService.findActiveByUserIdAndSalon.mockResolvedValue(null);

    let capturedError: unknown;

    try {
      await service.findBySalonId(
        {
          sub: 'user-1',
          email: 'barber@example.com',
          role: Role.BARBER,
          tokenType: 'access',
        },
        'salon-1',
      );
    } catch (error) {
      capturedError = error;
    }

    expect(capturedError).toBeInstanceOf(ForbiddenException);
    expect(getExceptionCode(capturedError)).toBe(
      ERROR_CODES.RESERVATION.LIST_ACCESS_DENIED,
    );
  });

  it('filters salon reservations down to the assigned barber when the membership is active', async () => {
    salonService.findActiveById.mockResolvedValue({
      id: 'salon-1',
      ownerId: 'owner-1',
      isActive: true,
    } as any);
    staffService.findActiveByUserIdAndSalon.mockResolvedValue({
      id: 'staff-1',
      salonId: 'salon-1',
      userId: 'user-1',
      role: Role.BARBER,
      isActive: true,
    } as any);
    reservationRepository.findBySalonId.mockResolvedValue([
      {
        id: 'reservation-1',
        staffId: 'staff-1',
      },
      {
        id: 'reservation-2',
        staffId: 'staff-2',
      },
    ] as any);

    const result = await service.findBySalonId(
      {
        sub: 'user-1',
        email: 'barber@example.com',
        role: Role.BARBER,
        tokenType: 'access',
      },
      'salon-1',
    );

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('reservation-1');
  });

  it('maps reservation uniqueness conflicts to a stable code', async () => {
    salonService.findActiveById.mockResolvedValue({
      id: 'salon-1',
      ownerId: 'owner-1',
      isActive: true,
    } as any);
    staffService.findById.mockResolvedValue({
      id: 'staff-1',
      salonId: 'salon-1',
      role: Role.BARBER,
      isActive: true,
    } as any);
    userService.findByPrincipal.mockResolvedValue({
      id: 'customer-1',
      name: 'Customer',
      email: 'customer@example.com',
      role: Role.CUSTOMER,
      isActive: true,
    } as any);
    slotService.assertSlotReservable.mockResolvedValue({
      slotStart: new Date('2026-04-10T10:00:00.000Z'),
      slotEnd: new Date('2026-04-10T10:30:00.000Z'),
      date: '2026-04-10',
    });
    slotService.acquireReservationLock.mockResolvedValue({
      key: 'lock-key',
      token: 'lock-token',
    } as any);
    databaseService.transaction.mockRejectedValue(
      new DatabaseConstraintViolationError('duplicate slot'),
    );
    slotService.releaseReservationLock.mockResolvedValue(undefined);

    let capturedError: unknown;

    try {
      await service.create(createCustomerPayload(), {
        salonId: 'salon-1',
        staffId: 'staff-1',
        slotStart: '2026-04-10T10:00:00.000Z',
        notes: 'test',
      });
    } catch (error) {
      capturedError = error;
    }

    expect(capturedError).toBeInstanceOf(ConflictException);
    expect(getExceptionCode(capturedError)).toBe(
      ERROR_CODES.RESERVATION.SLOT_ALREADY_RESERVED,
    );
    expect(domainEventBus.publish).not.toHaveBeenCalled();
    expect(slotService.releaseReservationLock).toHaveBeenCalledWith(
      'lock-key',
      'lock-token',
    );
  });

  it('publishes reservation.created after a reservation is created', async () => {
    salonService.findActiveById.mockResolvedValue({
      id: 'salon-1',
      ownerId: 'owner-1',
      name: 'Ustura Premium',
      isActive: true,
    } as any);
    staffService.findById.mockResolvedValue({
      id: 'staff-1',
      salonId: 'salon-1',
      role: Role.BARBER,
      displayName: 'Barber One',
      isActive: true,
    } as any);
    userService.findByPrincipal.mockResolvedValue({
      id: 'customer-1',
      name: 'Customer',
      email: 'customer@example.com',
      role: Role.CUSTOMER,
      isActive: true,
    } as any);
    slotService.assertSlotReservable.mockResolvedValue({
      slotStart: new Date('2026-04-10T10:00:00.000Z'),
      slotEnd: new Date('2026-04-10T10:30:00.000Z'),
      date: '2026-04-10',
    });
    slotService.acquireReservationLock.mockResolvedValue({
      key: 'lock-key',
      token: 'lock-token',
    } as any);
    databaseService.transaction.mockImplementation(async (operation) =>
      operation({ query: jest.fn() } as any),
    );
    reservationRepository.create.mockResolvedValue({
      id: 'reservation-1',
      customerId: 'customer-1',
      salonId: 'salon-1',
      staffId: 'staff-1',
      slotStart: new Date('2026-04-10T10:00:00.000Z'),
      slotEnd: new Date('2026-04-10T10:30:00.000Z'),
      status: ReservationStatus.PENDING,
      notes: null,
      cancelledAt: null,
      cancelledByUserId: null,
      statusChangedAt: null,
      statusChangedByUserId: null,
      createdAt: new Date('2026-04-09T10:00:00.000Z'),
      updatedAt: new Date('2026-04-09T10:00:00.000Z'),
    } as any);
    slotService.releaseReservationLock.mockResolvedValue(undefined);

    await service.create(createCustomerPayload(), {
      salonId: 'salon-1',
      staffId: 'staff-1',
      slotStart: '2026-04-10T10:00:00.000Z',
    });

    expect(domainEventBus.publish).toHaveBeenCalledWith({
      name: 'reservation.created',
      occurredAt: expect.any(Date),
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
  });

  it('updates reservation status when the transition is valid', async () => {
    reservationRepository.findById.mockResolvedValue({
      id: 'reservation-1',
      customerId: 'customer-1',
      salonId: 'salon-1',
      staffId: 'staff-1',
      slotStart: new Date('2026-04-10T10:00:00.000Z'),
      slotEnd: new Date('2026-04-10T10:30:00.000Z'),
      status: ReservationStatus.PENDING,
      notes: null,
      cancelledAt: null,
      cancelledByUserId: null,
      statusChangedAt: null,
      statusChangedByUserId: null,
      createdAt: new Date('2026-04-09T10:00:00.000Z'),
      updatedAt: new Date('2026-04-09T10:00:00.000Z'),
    } as any);
    salonService.findActiveById.mockResolvedValue({
      id: 'salon-1',
      ownerId: 'owner-1',
      isActive: true,
    } as any);
    reservationRepository.updateStatus.mockResolvedValue({
      id: 'reservation-1',
      customerId: 'customer-1',
      salonId: 'salon-1',
      staffId: 'staff-1',
      slotStart: new Date('2026-04-10T10:00:00.000Z'),
      slotEnd: new Date('2026-04-10T10:30:00.000Z'),
      status: ReservationStatus.CONFIRMED,
      notes: null,
      cancelledAt: null,
      cancelledByUserId: null,
      statusChangedAt: new Date('2026-04-09T10:05:00.000Z'),
      statusChangedByUserId: 'owner-1',
      createdAt: new Date('2026-04-09T10:00:00.000Z'),
      updatedAt: new Date('2026-04-09T10:05:00.000Z'),
    } as any);

    const result = await service.updateStatus(
      {
        sub: 'owner-1',
        email: 'owner@example.com',
        role: Role.OWNER,
        tokenType: 'access',
      },
      'reservation-1',
      {
        status: ReservationStatus.CONFIRMED,
      },
    );

    expect(result.status).toBe(ReservationStatus.CONFIRMED);
    expect(reservationRepository.updateStatus).toHaveBeenCalledWith(
      'reservation-1',
      ReservationStatus.CONFIRMED,
      'owner-1',
    );
    expect(domainEventBus.publish).toHaveBeenCalledWith({
      name: 'reservation.status_changed',
      occurredAt: expect.any(Date),
      payload: {
        actorUserId: 'owner-1',
        actorRole: Role.OWNER,
        reservationId: 'reservation-1',
        customerId: 'customer-1',
        salonId: 'salon-1',
        staffId: 'staff-1',
        previousStatus: ReservationStatus.PENDING,
        nextStatus: ReservationStatus.CONFIRMED,
        slotStart: '2026-04-10T10:00:00.000Z',
        slotEnd: '2026-04-10T10:30:00.000Z',
      },
    });
  });

  it('rejects invalid reservation status transitions with a stable code', async () => {
    reservationRepository.findById.mockResolvedValue({
      id: 'reservation-1',
      customerId: 'customer-1',
      salonId: 'salon-1',
      staffId: 'staff-1',
      slotStart: new Date('2026-04-10T10:00:00.000Z'),
      slotEnd: new Date('2026-04-10T10:30:00.000Z'),
      status: ReservationStatus.PENDING,
      notes: null,
      cancelledAt: null,
      cancelledByUserId: null,
      statusChangedAt: null,
      statusChangedByUserId: null,
      createdAt: new Date('2026-04-09T10:00:00.000Z'),
      updatedAt: new Date('2026-04-09T10:00:00.000Z'),
    } as any);
    salonService.findActiveById.mockResolvedValue({
      id: 'salon-1',
      ownerId: 'owner-1',
      isActive: true,
    } as any);

    let capturedError: unknown;

    try {
      await service.updateStatus(
        {
          sub: 'owner-1',
          email: 'owner@example.com',
          role: Role.OWNER,
          tokenType: 'access',
        },
        'reservation-1',
        {
          status: ReservationStatus.COMPLETED,
        },
      );
    } catch (error) {
      capturedError = error;
    }

    expect(capturedError).toBeInstanceOf(ConflictException);
    expect(getExceptionCode(capturedError)).toBe(
      ERROR_CODES.RESERVATION.INVALID_STATUS_TRANSITION,
    );
    expect(reservationRepository.updateStatus).not.toHaveBeenCalled();
  });

  it('publishes reservation.cancelled after a reservation is cancelled', async () => {
    reservationRepository.findById.mockResolvedValue({
      id: 'reservation-1',
      customerId: 'customer-1',
      salonId: 'salon-1',
      staffId: 'staff-1',
      slotStart: new Date('2026-04-10T10:00:00.000Z'),
      slotEnd: new Date('2026-04-10T10:30:00.000Z'),
      status: ReservationStatus.CONFIRMED,
      notes: null,
      cancelledAt: null,
      cancelledByUserId: null,
      statusChangedAt: null,
      statusChangedByUserId: null,
      createdAt: new Date('2026-04-09T10:00:00.000Z'),
      updatedAt: new Date('2026-04-09T10:00:00.000Z'),
    } as any);
    salonService.findActiveById.mockResolvedValue({
      id: 'salon-1',
      ownerId: 'owner-1',
      name: 'Ustura Premium',
      isActive: true,
    } as any);
    staffService.findById.mockResolvedValue({
      id: 'staff-1',
      displayName: 'Barber One',
      salonId: 'salon-1',
      role: Role.BARBER,
      isActive: true,
    } as any);
    userService.findByPrincipal.mockResolvedValue({
      id: 'customer-1',
      name: 'Customer',
      email: 'customer@example.com',
      role: Role.CUSTOMER,
      isActive: true,
    } as any);
    reservationRepository.cancel.mockResolvedValue({
      id: 'reservation-1',
      customerId: 'customer-1',
      salonId: 'salon-1',
      staffId: 'staff-1',
      slotStart: new Date('2026-04-10T10:00:00.000Z'),
      slotEnd: new Date('2026-04-10T10:30:00.000Z'),
      status: ReservationStatus.CANCELLED,
      notes: null,
      cancelledAt: new Date('2026-04-09T10:05:00.000Z'),
      cancelledByUserId: 'customer-1',
      statusChangedAt: new Date('2026-04-09T10:05:00.000Z'),
      statusChangedByUserId: 'customer-1',
      createdAt: new Date('2026-04-09T10:00:00.000Z'),
      updatedAt: new Date('2026-04-09T10:05:00.000Z'),
    } as any);

    await service.cancel(createCustomerPayload(), 'reservation-1');

    expect(domainEventBus.publish).toHaveBeenCalledWith({
      name: 'reservation.cancelled',
      occurredAt: expect.any(Date),
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
        status: ReservationStatus.CANCELLED,
        previousStatus: ReservationStatus.CONFIRMED,
        slotStart: '2026-04-10T10:00:00.000Z',
        slotEnd: '2026-04-10T10:30:00.000Z',
      },
    });
  });

  // -----------------------------------------------------------------------
  // Concurrency & Slot Safety
  // -----------------------------------------------------------------------

  describe('concurrency – slot booking race condition', () => {
    function setupCommonMocks() {
      salonService.findActiveById.mockResolvedValue({
        id: 'salon-1',
        ownerId: 'owner-1',
        name: 'Ustura Premium',
        isActive: true,
      } as any);
      staffService.findById.mockResolvedValue({
        id: 'staff-1',
        salonId: 'salon-1',
        role: Role.BARBER,
        displayName: 'Barber One',
        isActive: true,
      } as any);
      userService.findByPrincipal.mockResolvedValue({
        id: 'customer-1',
        name: 'Customer',
        email: 'customer@example.com',
        role: Role.CUSTOMER,
        isActive: true,
      } as any);
      slotService.assertSlotReservable.mockResolvedValue({
        slotStart: new Date('2026-04-10T10:00:00.000Z'),
        slotEnd: new Date('2026-04-10T10:30:00.000Z'),
        date: '2026-04-10',
      });
    }

    it('the second concurrent caller receives SLOT_BEING_RESERVED when the lock is already held', async () => {
      setupCommonMocks();

      // First caller holds the lock
      slotService.acquireReservationLock
        .mockResolvedValueOnce({ key: 'lock-key', token: 'token-1' })
        // Second caller gets null
        .mockResolvedValueOnce(null);

      databaseService.transaction.mockImplementation(async (operation) =>
        operation({ query: jest.fn() } as any),
      );
      reservationRepository.create.mockResolvedValue({
        id: 'reservation-1',
        customerId: 'customer-1',
        salonId: 'salon-1',
        staffId: 'staff-1',
        slotStart: new Date('2026-04-10T10:00:00.000Z'),
        slotEnd: new Date('2026-04-10T10:30:00.000Z'),
        status: ReservationStatus.PENDING,
        notes: null,
        cancelledAt: null,
        cancelledByUserId: null,
        statusChangedAt: null,
        statusChangedByUserId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);
      slotService.releaseReservationLock.mockResolvedValue(undefined);

      const dto = {
        salonId: 'salon-1',
        staffId: 'staff-1',
        slotStart: '2026-04-10T10:00:00.000Z',
      };

      // First call succeeds
      const firstResult = await service.create(createCustomerPayload(), dto);
      expect(firstResult.id).toBe('reservation-1');

      // Second call fails with SLOT_BEING_RESERVED
      let capturedError: unknown;

      try {
        await service.create(createCustomerPayload(), dto);
      } catch (error) {
        capturedError = error;
      }

      expect(capturedError).toBeInstanceOf(ConflictException);
      expect(getExceptionCode(capturedError)).toBe(
        ERROR_CODES.RESERVATION.SLOT_BEING_RESERVED,
      );
    });

    it('allows rebooking the same slot after the previous reservation is cancelled', async () => {
      setupCommonMocks();

      // Cancel flow setup
      const cancelledReservation = {
        id: 'reservation-1',
        customerId: 'customer-1',
        salonId: 'salon-1',
        staffId: 'staff-1',
        slotStart: new Date('2026-04-10T10:00:00.000Z'),
        slotEnd: new Date('2026-04-10T10:30:00.000Z'),
        status: ReservationStatus.CANCELLED,
        notes: null,
        cancelledAt: new Date(),
        cancelledByUserId: 'customer-1',
        statusChangedAt: new Date(),
        statusChangedByUserId: 'customer-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      reservationRepository.findById.mockResolvedValue({
        ...cancelledReservation,
        status: ReservationStatus.PENDING,
        cancelledAt: null,
        cancelledByUserId: null,
      } as any);
      reservationRepository.cancel.mockResolvedValue(
        cancelledReservation as any,
      );

      // Cancel the first reservation
      await service.cancel(createCustomerPayload(), 'reservation-1');

      // Now rebook the same slot
      slotService.acquireReservationLock.mockResolvedValue({
        key: 'lock-key',
        token: 'token-2',
      } as any);
      databaseService.transaction.mockImplementation(async (operation) =>
        operation({ query: jest.fn() } as any),
      );
      reservationRepository.create.mockResolvedValue({
        id: 'reservation-2',
        customerId: 'customer-1',
        salonId: 'salon-1',
        staffId: 'staff-1',
        slotStart: new Date('2026-04-10T10:00:00.000Z'),
        slotEnd: new Date('2026-04-10T10:30:00.000Z'),
        status: ReservationStatus.PENDING,
        notes: null,
        cancelledAt: null,
        cancelledByUserId: null,
        statusChangedAt: null,
        statusChangedByUserId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);
      slotService.releaseReservationLock.mockResolvedValue(undefined);

      const rebookedReservation = await service.create(
        createCustomerPayload(),
        {
          salonId: 'salon-1',
          staffId: 'staff-1',
          slotStart: '2026-04-10T10:00:00.000Z',
        },
      );

      expect(rebookedReservation.id).toBe('reservation-2');
      expect(rebookedReservation.status).toBe(ReservationStatus.PENDING);
    });

    it('always releases the reservation lock even when an unexpected error is thrown', async () => {
      setupCommonMocks();

      slotService.acquireReservationLock.mockResolvedValue({
        key: 'lock-key',
        token: 'token-1',
      } as any);

      const unexpectedError = new Error('Unexpected database connection lost');
      databaseService.transaction.mockRejectedValue(unexpectedError);
      slotService.releaseReservationLock.mockResolvedValue(undefined);

      let capturedError: unknown;

      try {
        await service.create(createCustomerPayload(), {
          salonId: 'salon-1',
          staffId: 'staff-1',
          slotStart: '2026-04-10T10:00:00.000Z',
        });
      } catch (error) {
        capturedError = error;
      }

      // The unexpected error should propagate
      expect(capturedError).toBe(unexpectedError);

      // But the lock must still be released
      expect(slotService.releaseReservationLock).toHaveBeenCalledWith(
        'lock-key',
        'token-1',
      );
    });
  });
});
