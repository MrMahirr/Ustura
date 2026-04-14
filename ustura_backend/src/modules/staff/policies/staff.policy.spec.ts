import { ConflictException, ForbiddenException, HttpException } from '@nestjs/common';
import { ERROR_CODES } from '../../../shared/errors/error-codes';
import { Role } from '../../../shared/auth/role.enum';
import type { JwtPayload } from '../../../shared/auth/jwt-payload.interface';
import type { User } from '../../user/interfaces/user.types';
import type { StaffMember } from '../interfaces/staff.types';
import { StaffPolicy } from './staff.policy';

function createUserPayload(overrides: Partial<JwtPayload> = {}): JwtPayload {
  return {
    sub: 'owner-1',
    email: 'owner@example.com',
    role: Role.OWNER,
    tokenType: 'access',
    ...overrides,
  };
}

function createUser(overrides: Partial<User> = {}): User {
  return {
    id: 'user-1',
    name: 'Employee',
    email: 'employee@example.com',
    phone: '+905551112233',
    passwordHash: 'hashed-password',
    firebaseUid: null,
    role: Role.BARBER,
    isActive: true,
    mustChangePassword: false,
    createdAt: new Date('2026-04-09T00:00:00.000Z'),
    updatedAt: new Date('2026-04-09T00:00:00.000Z'),
    ...overrides,
  };
}

function createStaffMember(
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

describe('StaffPolicy', () => {
  let policy: StaffPolicy;

  beforeEach(() => {
    policy = new StaffPolicy();
  });

  it('rejects staff management outside the owner salon scope', () => {
    let capturedError: unknown;

    try {
      policy.assertCanManageSalonStaff(createUserPayload(), 'owner-2');
    } catch (error) {
      capturedError = error;
    }

    expect(capturedError).toBeInstanceOf(ForbiddenException);
    expect(getExceptionCode(capturedError)).toBe(
      ERROR_CODES.STAFF.MANAGEMENT_FORBIDDEN,
    );
  });

  it('rejects inactive user accounts for staff assignments', () => {
    let capturedError: unknown;

    try {
      policy.assertCanAssignUserToRole(
        createUser({
          isActive: false,
        }),
        Role.BARBER,
      );
    } catch (error) {
      capturedError = error;
    }

    expect(capturedError).toBeInstanceOf(ConflictException);
    expect(getExceptionCode(capturedError)).toBe(
      ERROR_CODES.STAFF.USER_INACTIVE,
    );
  });

  it('rejects user accounts whose role does not match the staff role', () => {
    let capturedError: unknown;

    try {
      policy.assertCanAssignUserToRole(
        createUser({
          role: Role.RECEPTIONIST,
        }),
        Role.BARBER,
      );
    } catch (error) {
      capturedError = error;
    }

    expect(capturedError).toBeInstanceOf(ConflictException);
    expect(getExceptionCode(capturedError)).toBe(
      ERROR_CODES.STAFF.INVALID_ACCOUNT_ROLE,
    );
  });

  it('rejects creating duplicate active staff assignments', () => {
    let capturedError: unknown;

    try {
      policy.assertCanCreate(createStaffMember());
    } catch (error) {
      capturedError = error;
    }

    expect(capturedError).toBeInstanceOf(ConflictException);
    expect(getExceptionCode(capturedError)).toBe(
      ERROR_CODES.STAFF.ALREADY_ASSIGNED,
    );
  });

  it('rejects ambiguous provisioning input when both user_id and employee payload exist', () => {
    let capturedError: unknown;

    try {
      policy.assertValidProvisioningSelection({
        userId: 'user-1',
        employee: {},
      });
    } catch (error) {
      capturedError = error;
    }

    expect(capturedError).toBeInstanceOf(HttpException);
    expect(getExceptionCode(capturedError)).toBe(
      ERROR_CODES.STAFF.PROVISIONING_MODE_INVALID,
    );
  });

  it('allows barber and receptionist roles to access staff self view only', () => {
    expect(() =>
      policy.assertCanViewOwnAssignments(
        createUserPayload({
          role: Role.BARBER,
        }),
      ),
    ).not.toThrow();

    expect(() =>
      policy.assertCanViewOwnAssignments(
        createUserPayload({
          role: Role.RECEPTIONIST,
        }),
      ),
    ).not.toThrow();

    let capturedError: unknown;

    try {
      policy.assertCanViewOwnAssignments(createUserPayload());
    } catch (error) {
      capturedError = error;
    }

    expect(capturedError).toBeInstanceOf(ForbiddenException);
    expect(getExceptionCode(capturedError)).toBe(
      ERROR_CODES.STAFF.SELF_VIEW_FORBIDDEN,
    );
  });
});
