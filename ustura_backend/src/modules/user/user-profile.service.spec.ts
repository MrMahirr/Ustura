import { BadRequestException, ConflictException, HttpException, NotFoundException } from '@nestjs/common';
import { ERROR_CODES } from '../../shared/errors/error-codes';
import { PrincipalKind } from '../../shared/auth/principal-kind.enum';
import { Role } from '../../shared/auth/role.enum';
import { UserAccountPolicy } from './policies/user-account.policy';
import { UserRepository } from './repositories/user.repository';
import { UserProfileService } from './user-profile.service';
import type { User } from './interfaces/user.types';

function createUser(overrides: Partial<User> = {}): User {
  return {
    id: 'user-1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+905551112233',
    passwordHash: 'hashed-password',
    firebaseUid: null,
    role: Role.CUSTOMER,
    isActive: true,
    createdAt: new Date('2026-04-10T00:00:00.000Z'),
    updatedAt: new Date('2026-04-10T00:00:00.000Z'),
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

describe('UserProfileService', () => {
  let service: UserProfileService;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    userRepository = {
      findByPrincipal: jest.fn(),
      findByEmailForPrincipal: jest.fn(),
      findByFirebaseUid: jest.fn(),
      findByPhoneForPrincipal: jest.fn(),
      create: jest.fn(),
      updateProfile: jest.fn(),
      deactivate: jest.fn(),
      linkFirebaseIdentity: jest.fn(),
    } as unknown as jest.Mocked<UserRepository>;

    service = new UserProfileService(userRepository, new UserAccountPolicy());
  });

  it('returns not found when the profile owner does not exist', async () => {
    userRepository.findByPrincipal.mockResolvedValue(null);

    await expect(
      service.getProfileByPrincipal(PrincipalKind.CUSTOMER, 'missing-user'),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('rejects profile updates when another user already owns the requested phone', async () => {
    userRepository.findByPrincipal.mockResolvedValue(createUser());
    userRepository.findByPhoneForPrincipal.mockResolvedValue(
      createUser({
        id: 'user-2',
        phone: '+905559998877',
      }),
    );

    let capturedError: unknown;

    try {
      await service.updateProfile(PrincipalKind.CUSTOMER, 'user-1', {
        phone: ' +905559998877 ',
      });
    } catch (error) {
      capturedError = error;
    }

    expect(capturedError).toBeInstanceOf(ConflictException);
    expect(getExceptionCode(capturedError)).toBe(
      ERROR_CODES.USER.PHONE_ALREADY_EXISTS,
    );
    expect(userRepository.updateProfile).not.toHaveBeenCalled();
  });

  it('rejects blank phone updates before writing to the database', async () => {
    userRepository.findByPrincipal.mockResolvedValue(createUser());

    let capturedError: unknown;

    try {
      await service.updateProfile(PrincipalKind.CUSTOMER, 'user-1', {
        phone: '   ',
      });
    } catch (error) {
      capturedError = error;
    }

    expect(capturedError).toBeInstanceOf(BadRequestException);
    expect(getExceptionCode(capturedError)).toBe(ERROR_CODES.USER.PHONE_REQUIRED);
    expect(userRepository.findByPhoneForPrincipal).not.toHaveBeenCalled();
    expect(userRepository.updateProfile).not.toHaveBeenCalled();
  });
});
