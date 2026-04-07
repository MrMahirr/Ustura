import { ConflictException, NotFoundException } from '@nestjs/common';
import { Role } from '../../common/enums/role.enum';
import { CreateEmployeeInput, User } from './interfaces/user.types';
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
      findByFirebaseUid: jest.fn(),
      create: createUserMock,
      updateProfile: jest.fn(),
      deactivate: jest.fn(),
      linkFirebaseIdentity: jest.fn(),
    } as unknown as jest.Mocked<UserRepository>;

    userService = new UserService(userRepository);
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

    expect(findByEmailMock).toHaveBeenCalledWith('customer@example.com');
    expect(createUserMock).toHaveBeenCalledWith({
      name: 'Customer',
      email: 'customer@example.com',
      phone: '+905551112233',
      passwordHash: 'hashed-password',
      firebaseUid: null,
      role: Role.CUSTOMER,
    });
    expect(result.role).toBe(Role.CUSTOMER);
  });

  it('rejects duplicate emails before writing to the database', async () => {
    findByEmailMock.mockResolvedValue(createUser());

    await expect(
      userService.createCustomer({
        name: 'Customer',
        email: 'john@example.com',
        phone: '+905551112233',
        passwordHash: 'hashed-password',
      }),
    ).rejects.toBeInstanceOf(ConflictException);

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

    await expect(
      userService.createEmployee(invalidEmployeeInput),
    ).rejects.toBeInstanceOf(ConflictException);

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

    expect(createUserMock).toHaveBeenCalledWith({
      name: 'Google Customer',
      email: 'google@example.com',
      phone: '+905551110000',
      firebaseUid: 'firebase-user-1',
      passwordHash: null,
      role: Role.CUSTOMER,
    });
    expect(result.firebaseUid).toBe('firebase-user-1');
  });

  it('returns a sanitized profile without the password hash', async () => {
    userRepository.findById.mockResolvedValue(createUser());

    const profile = await userService.getProfileById('user-1');

    expect(profile).toEqual({
      id: 'user-1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+905551112233',
      role: Role.CUSTOMER,
      isActive: true,
      createdAt: new Date('2026-04-07T00:00:00.000Z'),
      updatedAt: new Date('2026-04-07T00:00:00.000Z'),
    });
  });

  it('throws when updating a missing user profile', async () => {
    userRepository.updateProfile.mockResolvedValue(null);

    await expect(
      userService.updateProfile('missing-user', {
        name: 'Updated Name',
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
