import { ConflictException, ForbiddenException, HttpException } from '@nestjs/common';
import { ERROR_CODES } from '../../shared/errors/error-codes';
import { Role } from '../../shared/auth/role.enum';
import { DatabaseConstraintViolationError } from '../../database/database.errors';
import { DatabaseService } from '../../database/database.service';
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

  if (typeof response !== 'object' || response == null || !('code' in response)) {
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
      findById: jest.fn(),
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

    service = new ReservationService(
      reservationRepository,
      userService,
      slotService,
      salonService as unknown as SalonService,
      staffService as unknown as StaffService,
      databaseService,
      new ReservationPolicy(),
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
    slotService.assertSlotReservable.mockResolvedValue({
      slotStart: new Date('2026-04-10T10:00:00.000Z'),
      slotEnd: new Date('2026-04-10T10:30:00.000Z'),
      date: '2026-04-10',
    });
    slotService.acquireReservationLock.mockResolvedValue(null);

    let capturedError: unknown;

    try {
      await service.create(createCustomerPayload(), {
        salon_id: 'salon-1',
        staff_id: 'staff-1',
        slot_start: '2026-04-10T10:00:00.000Z',
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
        salon_id: 'salon-1',
        staff_id: 'staff-1',
        slot_start: '2026-04-10T10:00:00.000Z',
        notes: 'test',
      });
    } catch (error) {
      capturedError = error;
    }

    expect(capturedError).toBeInstanceOf(ConflictException);
    expect(getExceptionCode(capturedError)).toBe(
      ERROR_CODES.RESERVATION.SLOT_ALREADY_RESERVED,
    );
    expect(slotService.releaseReservationLock).toHaveBeenCalledWith(
      'lock-key',
      'lock-token',
    );
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
});
