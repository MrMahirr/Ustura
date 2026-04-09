import { ForbiddenException, HttpException } from '@nestjs/common';
import { ERROR_CODES } from '../../../common/errors/error-codes';
import { Role } from '../../../common/enums/role.enum';
import type { JwtPayload } from '../../../common/interfaces/jwt-payload.interface';
import type { StaffMember } from '../../staff/interfaces/staff.types';
import type { ReservationRecord } from '../interfaces/reservation.types';
import { ReservationPolicy } from './reservation.policy';

function createUser(overrides: Partial<JwtPayload> = {}): JwtPayload {
  return {
    sub: 'user-1',
    email: 'user@example.com',
    role: Role.CUSTOMER,
    tokenType: 'access',
    ...overrides,
  };
}

function createMembership(
  overrides: Partial<StaffMember> = {},
): StaffMember {
  return {
    id: 'staff-1',
    userId: 'user-1',
    salonId: 'salon-1',
    role: Role.BARBER,
    bio: null,
    photoUrl: null,
    isActive: true,
    createdAt: new Date('2026-04-09T00:00:00.000Z'),
    updatedAt: new Date('2026-04-09T00:00:00.000Z'),
    ...overrides,
  };
}

function createReservation(
  overrides: Partial<ReservationRecord> = {},
): ReservationRecord {
  return {
    id: 'reservation-1',
    customerId: 'customer-1',
    salonId: 'salon-1',
    staffId: 'staff-1',
    slotStart: new Date('2026-04-10T10:00:00.000Z'),
    slotEnd: new Date('2026-04-10T10:30:00.000Z'),
    status: 'confirmed' as ReservationRecord['status'],
    notes: null,
    createdAt: new Date('2026-04-09T00:00:00.000Z'),
    updatedAt: new Date('2026-04-09T00:00:00.000Z'),
    ...overrides,
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

describe('ReservationPolicy', () => {
  let policy: ReservationPolicy;

  beforeEach(() => {
    policy = new ReservationPolicy();
  });

  it('rejects owners creating reservations outside their own salon', () => {
    let capturedError: unknown;

    try {
      policy.assertCanCreate({
        currentUser: createUser({
          sub: 'owner-1',
          role: Role.OWNER,
        }),
        salonOwnerId: 'owner-2',
        membership: null,
        targetStaffId: 'staff-1',
      });
    } catch (error) {
      capturedError = error;
    }

    expect(capturedError).toBeInstanceOf(ForbiddenException);
    expect(getExceptionCode(capturedError)).toBe(
      ERROR_CODES.RESERVATION.OWNER_SALON_ONLY,
    );
  });

  it('returns assigned_only scope for barbers with salon membership', () => {
    const scope = policy.determineSalonListScope({
      currentUser: createUser({
        role: Role.BARBER,
      }),
      salonOwnerId: 'owner-1',
      membership: createMembership(),
    });

    expect(scope).toBe('assigned_only');
  });

  it('rejects non-customers from accessing their own reservation list', () => {
    let capturedError: unknown;

    try {
      policy.assertCanViewOwnReservations(
        createUser({
          role: Role.RECEPTIONIST,
        }),
      );
    } catch (error) {
      capturedError = error;
    }

    expect(capturedError).toBeInstanceOf(ForbiddenException);
    expect(getExceptionCode(capturedError)).toBe(
      ERROR_CODES.RESERVATION.ONLY_CUSTOMERS_CAN_VIEW_OWN,
    );
  });

  it('restricts barbers to cancelling reservations on their own schedule', () => {
    let capturedError: unknown;

    try {
      policy.assertCanCancel({
        currentUser: createUser({
          role: Role.BARBER,
        }),
        reservation: createReservation({
          staffId: 'staff-2',
        }),
        salonOwnerId: 'owner-1',
        membership: createMembership({
          id: 'staff-1',
        }),
      });
    } catch (error) {
      capturedError = error;
    }

    expect(capturedError).toBeInstanceOf(ForbiddenException);
    expect(getExceptionCode(capturedError)).toBe(
      ERROR_CODES.RESERVATION.BARBER_SCHEDULE_ONLY,
    );
  });
});
