import {
  BadRequestException,
  ConflictException,
  HttpException,
} from '@nestjs/common';
import { ERROR_CODES } from '../../../common/errors/error-codes';
import { Role } from '../../../common/enums/role.enum';
import type { User } from '../interfaces/user.types';
import { UserAccountPolicy } from './user-account.policy';

function createUser(overrides: Partial<User> = {}): User {
  return {
    id: 'user-1',
    name: 'Customer',
    email: 'customer@example.com',
    phone: '+905551112233',
    passwordHash: 'hashed-password',
    firebaseUid: null,
    role: Role.CUSTOMER,
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

describe('UserAccountPolicy', () => {
  let policy: UserAccountPolicy;

  beforeEach(() => {
    policy = new UserAccountPolicy();
  });

  it('requires customer credentials when neither password nor Google identity exists', () => {
    let capturedError: unknown;

    try {
      policy.assertCreateUserRequirements({
        role: Role.CUSTOMER,
        hasPassword: false,
        hasFirebaseIdentity: false,
        hasPhone: true,
      });
    } catch (error) {
      capturedError = error;
    }

    expect(capturedError).toBeInstanceOf(BadRequestException);
    expect(getExceptionCode(capturedError)).toBe(
      ERROR_CODES.USER.CUSTOMER_CREDENTIALS_REQUIRED,
    );
  });

  it('rejects invalid employee roles', () => {
    let capturedError: unknown;

    try {
      policy.assertValidEmployeeRole(Role.OWNER);
    } catch (error) {
      capturedError = error;
    }

    expect(capturedError).toBeInstanceOf(ConflictException);
    expect(getExceptionCode(capturedError)).toBe(
      ERROR_CODES.USER.INVALID_EMPLOYEE_ROLE,
    );
  });

  it('rejects inactive managed customers', () => {
    let capturedError: unknown;

    try {
      policy.assertCanReuseManagedCustomer(
        createUser({
          isActive: false,
        }),
      );
    } catch (error) {
      capturedError = error;
    }

    expect(capturedError).toBeInstanceOf(ConflictException);
    expect(getExceptionCode(capturedError)).toBe(
      ERROR_CODES.USER.CUSTOMER_INACTIVE,
    );
  });

  it('rejects linking Google identities to non-customer users', () => {
    let capturedError: unknown;

    try {
      policy.assertCanLinkFirebaseIdentity(
        createUser({
          role: Role.RECEPTIONIST,
        }),
        'firebase-user-1',
      );
    } catch (error) {
      capturedError = error;
    }

    expect(capturedError).toBeInstanceOf(ConflictException);
    expect(getExceptionCode(capturedError)).toBe(
      ERROR_CODES.USER.CUSTOMER_GOOGLE_ONLY,
    );
  });
});
