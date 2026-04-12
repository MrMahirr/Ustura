import { ForbiddenException, HttpException } from '@nestjs/common';
import { ERROR_CODES } from '../../../shared/errors/error-codes';
import { Role } from '../../../shared/auth/role.enum';
import type { JwtPayload } from '../../../shared/auth/jwt-payload.interface';
import { SalonPolicy } from './salon.policy';

function createUser(overrides: Partial<JwtPayload> = {}): JwtPayload {
  return {
    sub: 'owner-1',
    email: 'owner@example.com',
    role: Role.OWNER,
    tokenType: 'access',
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

describe('SalonPolicy', () => {
  let policy: SalonPolicy;

  beforeEach(() => {
    policy = new SalonPolicy();
  });

  it('rejects non-owner users from salon management actions', () => {
    let capturedError: unknown;

    try {
      policy.assertCanManage(
        createUser({
          role: Role.CUSTOMER,
        }),
      );
    } catch (error) {
      capturedError = error;
    }

    expect(capturedError).toBeInstanceOf(ForbiddenException);
    expect(getExceptionCode(capturedError)).toBe(
      ERROR_CODES.SALON.MANAGEMENT_FORBIDDEN,
    );
  });

  it('rejects owners managing salons they do not own', () => {
    let capturedError: unknown;

    try {
      policy.assertCanManageSalon(createUser(), {
        ownerId: 'owner-2',
      });
    } catch (error) {
      capturedError = error;
    }

    expect(capturedError).toBeInstanceOf(ForbiddenException);
    expect(getExceptionCode(capturedError)).toBe(
      ERROR_CODES.SALON.MANAGEMENT_FORBIDDEN,
    );
  });

  it('allows owners to manage their own salons', () => {
    expect(() =>
      policy.assertCanManageSalon(createUser(), {
        ownerId: 'owner-1',
      }),
    ).not.toThrow();
  });
});
