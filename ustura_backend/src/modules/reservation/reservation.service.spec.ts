import { ConflictException, ForbiddenException, HttpException } from '@nestjs/common';
import { ERROR_CODES } from '../../common/errors/error-codes';
import { ReservationStatus } from '../../common/enums/reservation-status.enum';
import { Role } from '../../common/enums/role.enum';
import { DatabaseConstraintViolationError } from '../../database/database.errors';
import { DatabaseService } from '../../database/database.service';
import type { JwtPayload } from '../../common/interfaces/jwt-payload.interface';
import { SalonRepository } from '../salon/repositories/salon.repository';
import { StaffRepository } from '../staff/repositories/staff.repository';
import { UserService } from '../user/user.service';
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
  let salonRepository: jest.Mocked<SalonRepository>;
  let staffRepository: jest.Mocked<StaffRepository>;
  let databaseService: jest.Mocked<DatabaseService>;

  beforeEach(() => {
    reservationRepository = {
      create: jest.fn(),
      findByCustomerId: jest.fn(),
      findBySalonId: jest.fn(),
      findById: jest.fn(),
      cancel: jest.fn(),
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
    salonRepository = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<SalonRepository>;
    staffRepository = {
      findById: jest.fn(),
      findActiveByUserIdAndSalon: jest.fn(),
    } as unknown as jest.Mocked<StaffRepository>;
    databaseService = {
      transaction: jest.fn(),
    } as unknown as jest.Mocked<DatabaseService>;

    service = new ReservationService(
      reservationRepository,
      userService,
      slotService,
      salonRepository,
      staffRepository,
      databaseService,
    );
  });

  it('returns a stable code when a slot is already being reserved', async () => {
    salonRepository.findById.mockResolvedValue({
      id: 'salon-1',
      ownerId: 'owner-1',
      isActive: true,
    } as any);
    staffRepository.findById.mockResolvedValue({
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
    salonRepository.findById.mockResolvedValue({
      id: 'salon-1',
      ownerId: 'owner-1',
      isActive: true,
    } as any);
    staffRepository.findById.mockResolvedValue({
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
});
