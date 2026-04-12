import { ConflictException, HttpException, NotFoundException } from '@nestjs/common';
import { DatabaseConstraintViolationError } from '../../database/database.errors';
import { ERROR_CODES } from '../../shared/errors/error-codes';
import { Role } from '../../shared/auth/role.enum';
import { CreateEmployeeInput, User } from './interfaces/user.types';
import { UserAccountPolicy } from './policies/user-account.policy';
import { UserRepository } from './repositories/user.repository';
import { UserService } from './user.service';

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
    createdAt: new Date('2026-04-07T00:00:00.000Z'),
    updatedAt: new Date('2026-04-07T00:00:00.000Z'),
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

describe('UserService', () => {
  let userService: UserService;
  let userRepository: jest.Mocked<UserRepository>;
  let findByEmailMock: jest.Mock;
  let createUserMock: jest.Mock;

  beforeEach(() => {
    findByEmailMock = jest.fn();
    createUserMock = jest.fn();
    userRepository = {
      findById: jest.fn(),
      findByEmail: findByEmailMock,
      findByEmailWithExecutor: findByEmailMock,
      findByFirebaseUid: jest.fn(),
      findByPhone: jest.fn(),
      findByPhoneWithExecutor: jest.fn(),
      create: createUserMock,
      updateProfile: jest.fn(),
      deactivate: jest.fn(),
      linkFirebaseIdentity: jest.fn(),
    } as unknown as jest.Mocked<UserRepository>;

    userService = new UserService(userRepository, new UserAccountPolicy());
  });

  it('creates a customer with normalized email and reserved customer role', async () => {
    const createdUser = createUser({
      email: 'customer@example.com',
      role: Role.CUSTOMER,
    });

    findByEmailMock.mockResolvedValue(null);
    createUserMock.mockResolvedValue(createdUser);

    const result = await userService.createCustomer({
      name: ' Customer ',
      email: ' CUSTOMER@EXAMPLE.COM ',
      phone: ' +905551112233 ',
      passwordHash: 'hashed-password',
    });

    expect(findByEmailMock).toHaveBeenCalledWith(
      'customer@example.com',
      undefined,
    );
    expect(createUserMock).toHaveBeenCalledWith(
      {
        name: 'Customer',
        email: 'customer@example.com',
        phone: '+905551112233',
        passwordHash: 'hashed-password',
        firebaseUid: null,
        role: Role.CUSTOMER,
      },
      undefined,
    );
    expect(result.role).toBe(Role.CUSTOMER);
  });

  it('rejects duplicate emails before writing to the database', async () => {
    findByEmailMock.mockResolvedValue(createUser());

    let capturedError: unknown;

    try {
      await userService.createCustomer({
        name: 'Customer',
        email: 'john@example.com',
        phone: '+905551112233',
        passwordHash: 'hashed-password',
      });
    } catch (error) {
      capturedError = error;
    }

    expect(capturedError).toBeInstanceOf(ConflictException);
    expect(getExceptionCode(capturedError)).toBe(
      ERROR_CODES.USER.EMAIL_ALREADY_EXISTS,
    );

    expect(createUserMock).not.toHaveBeenCalled();
  });

  it('rejects duplicate phones before writing to the database', async () => {
    findByEmailMock.mockResolvedValue(null);
    userRepository.findByPhoneWithExecutor.mockResolvedValue(
      createUser({
        id: 'user-2',
        phone: '+905559998877',
      }),
    );

    let capturedError: unknown;

    try {
      await userService.createCustomer({
        name: 'Customer',
        email: 'new@example.com',
        phone: '+905559998877',
        passwordHash: 'hashed-password',
      });
    } catch (error) {
      capturedError = error;
    }

    expect(capturedError).toBeInstanceOf(ConflictException);
    expect(getExceptionCode(capturedError)).toBe(
      ERROR_CODES.USER.PHONE_ALREADY_EXISTS,
    );
    expect(createUserMock).not.toHaveBeenCalled();
  });

  it('rejects employee roles outside barber and receptionist', async () => {
    const invalidEmployeeInput = {
      name: 'Owner Candidate',
      email: 'owner@example.com',
      phone: '+905551112233',
      passwordHash: 'hashed-password',
      role: Role.OWNER,
    } as CreateEmployeeInput;

    let capturedError: unknown;

    try {
      await userService.createEmployee(invalidEmployeeInput);
    } catch (error) {
      capturedError = error;
    }

    expect(capturedError).toBeInstanceOf(ConflictException);
    expect(getExceptionCode(capturedError)).toBe(
      ERROR_CODES.USER.INVALID_EMPLOYEE_ROLE,
    );

    expect(findByEmailMock).not.toHaveBeenCalled();
  });

  it('creates a customer with firebase identity and no password hash', async () => {
    const createdUser = createUser({
      email: 'google@example.com',
      passwordHash: null,
      firebaseUid: 'firebase-user-1',
    });

    findByEmailMock.mockResolvedValue(null);
    createUserMock.mockResolvedValue(createdUser);

    const result = await userService.createCustomer({
      name: 'Google Customer',
      email: 'google@example.com',
      phone: '+905551110000',
      firebaseUid: ' firebase-user-1 ',
    });

    expect(createUserMock).toHaveBeenCalledWith(
      {
        name: 'Google Customer',
        email: 'google@example.com',
        phone: '+905551110000',
        firebaseUid: 'firebase-user-1',
        passwordHash: null,
        role: Role.CUSTOMER,
      },
      undefined,
    );
    expect(result.firebaseUid).toBe('firebase-user-1');
  });

  it('creates an owner account with the reserved owner role', async () => {
    const createdOwner = createUser({
      email: 'owner@example.com',
      role: Role.OWNER,
    });

    findByEmailMock.mockResolvedValue(null);
    createUserMock.mockResolvedValue(createdOwner);

    const result = await userService.createOwner({
      name: ' Owner Candidate ',
      email: ' OWNER@EXAMPLE.COM ',
      phone: ' +905551112233 ',
      passwordHash: 'hashed-password',
    });

    expect(findByEmailMock).toHaveBeenCalledWith('owner@example.com', undefined);
    expect(createUserMock).toHaveBeenCalledWith(
      {
        name: 'Owner Candidate',
        email: 'owner@example.com',
        phone: '+905551112233',
        passwordHash: 'hashed-password',
        firebaseUid: null,
        role: Role.OWNER,
      },
      undefined,
    );
    expect(result.role).toBe(Role.OWNER);
  });

  it('maps the phone uniqueness index to a stable user error code', async () => {
    findByEmailMock.mockResolvedValue(null);
    userRepository.findByPhoneWithExecutor.mockResolvedValue(null);
    createUserMock.mockRejectedValue(
      new DatabaseConstraintViolationError('duplicate phone', {
        constraint: 'uq_users_phone_non_empty',
      }),
    );

    let capturedError: unknown;

    try {
      await userService.createCustomer({
        name: 'Customer',
        email: 'new@example.com',
        phone: '+905559998877',
        passwordHash: 'hashed-password',
      });
    } catch (error) {
      capturedError = error;
    }

    expect(capturedError).toBeInstanceOf(ConflictException);
    expect(getExceptionCode(capturedError)).toBe(
      ERROR_CODES.USER.PHONE_ALREADY_EXISTS,
    );
  });
});
