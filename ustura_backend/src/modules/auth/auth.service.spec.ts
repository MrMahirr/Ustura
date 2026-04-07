import { createHmac } from 'node:crypto';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Role } from '../../common/enums/role.enum';
import { AppConfigService } from '../../config/config.service';
import { DatabaseService } from '../../database/database.service';
import type { DatabaseTransaction } from '../../database/database.types';
import type { User } from '../user/interfaces/user.types';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { FirebaseTokenVerifierService } from './firebase-token-verifier.service';
import { AuthRepository } from './repositories/auth.repository';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

function createUser(overrides: Partial<User> = {}): User {
  return {
    id: 'user-1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+905551112233',
    passwordHash: 'stored-password-hash',
    firebaseUid: null,
    role: Role.CUSTOMER,
    isActive: true,
    createdAt: new Date('2026-04-07T00:00:00.000Z'),
    updatedAt: new Date('2026-04-07T00:00:00.000Z'),
    ...overrides,
  };
}

describe('AuthService', () => {
  let authService: AuthService;
  let authRepository: jest.Mocked<AuthRepository>;
  let userService: jest.Mocked<UserService>;
  let jwtService: jest.Mocked<JwtService>;
  let databaseService: jest.Mocked<DatabaseService>;
  let firebaseTokenVerifierService: jest.Mocked<FirebaseTokenVerifierService>;
  let configService: AppConfigService;
  let transactionExecutor: DatabaseTransaction;
  let bcryptHashMock: jest.Mock;
  let bcryptCompareMock: jest.Mock;
  let createCustomerMock: jest.Mock;
  let linkFirebaseCustomerIdentityMock: jest.Mock;
  let saveRefreshTokenMock: jest.Mock;
  let revokeTokenMock: jest.Mock;
  let transactionMock: jest.Mock;

  beforeEach(() => {
    saveRefreshTokenMock = jest.fn();
    revokeTokenMock = jest.fn();
    authRepository = {
      saveRefreshToken: saveRefreshTokenMock,
      findByTokenHash: jest.fn(),
      revokeToken: revokeTokenMock,
      revokeAllUserTokens: jest.fn(),
    } as unknown as jest.Mocked<AuthRepository>;

    createCustomerMock = jest.fn();
    linkFirebaseCustomerIdentityMock = jest.fn();
    userService = {
      createCustomer: createCustomerMock,
      findByEmail: jest.fn(),
      findById: jest.fn(),
      findByFirebaseUid: jest.fn(),
      linkFirebaseCustomerIdentity: linkFirebaseCustomerIdentityMock,
    } as unknown as jest.Mocked<UserService>;

    jwtService = {
      signAsync: jest.fn(),
      verifyAsync: jest.fn(),
      decode: jest.fn(),
    } as unknown as jest.Mocked<JwtService>;

    transactionExecutor = {
      query: jest.fn(),
    };

    transactionMock = jest.fn(
      async (callback: (tx: DatabaseTransaction) => Promise<unknown>) =>
        callback(transactionExecutor),
    );
    databaseService = {
      transaction: transactionMock,
    } as unknown as jest.Mocked<DatabaseService>;

    firebaseTokenVerifierService = {
      verifyGoogleCustomerToken: jest.fn(),
    } as unknown as jest.Mocked<FirebaseTokenVerifierService>;

    configService = {
      jwt: {
        secret: 'test-secret',
        accessExpiresIn: '15m',
        refreshExpiresIn: '7d',
      },
      firebase: {
        projectId: 'ustura-test',
        certsUrl:
          'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com',
      },
    } as AppConfigService;

    authService = new AuthService(
      authRepository,
      userService,
      jwtService,
      configService,
      databaseService,
      firebaseTokenVerifierService,
    );

    bcryptHashMock = bcrypt.hash as jest.Mock;
    bcryptCompareMock = bcrypt.compare as jest.Mock;
    bcryptHashMock.mockResolvedValue('hashed-password');
    bcryptCompareMock.mockResolvedValue(true);
    jwtService.signAsync
      .mockResolvedValueOnce('access-token')
      .mockResolvedValueOnce('refresh-token');
    jwtService.decode.mockReturnValue({ exp: 1_800_000_000 });
    saveRefreshTokenMock.mockResolvedValue({
      id: 'refresh-1',
      userId: 'user-1',
      tokenHash: 'stored-token-hash',
      expiresAt: new Date('2027-01-15T08:00:00.000Z'),
      revoked: false,
      createdAt: new Date('2026-04-07T00:00:00.000Z'),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('registers a new customer and persists a hashed refresh token', async () => {
    const createdUser = createUser();
    const expectedRefreshHash = createHmac('sha256', 'test-secret')
      .update('refresh-token')
      .digest('hex');

    createCustomerMock.mockResolvedValue(createdUser);

    const result = await authService.register({
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+905551112233',
      password: 'secret123',
    });

    expect(bcryptHashMock).toHaveBeenCalledWith('secret123', 12);
    expect(createCustomerMock).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+905551112233',
      passwordHash: 'hashed-password',
    });
    expect(saveRefreshTokenMock).toHaveBeenCalledWith(
      {
        userId: 'user-1',
        tokenHash: expectedRefreshHash,
        expiresAt: new Date(1_800_000_000 * 1000),
      },
      databaseService,
    );
    expect(result.tokens).toEqual({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      accessTokenExpiresIn: '15m',
      refreshTokenExpiresIn: '7d',
    });
  });

  it('rejects login when the password is invalid', async () => {
    userService.findByEmail.mockResolvedValue(createUser());
    bcryptCompareMock.mockResolvedValue(false);

    await expect(
      authService.login({
        email: 'john@example.com',
        password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);

    expect(saveRefreshTokenMock).not.toHaveBeenCalled();
  });

  it('rotates refresh tokens inside a database transaction', async () => {
    const existingUser = createUser();
    const incomingRefreshToken = 'incoming-refresh-token';
    const currentTokenHash = createHmac('sha256', 'test-secret')
      .update(incomingRefreshToken)
      .digest('hex');
    const nextRefreshHash = createHmac('sha256', 'test-secret')
      .update('next-refresh-token')
      .digest('hex');

    jwtService.verifyAsync.mockResolvedValue({
      sub: 'user-1',
      email: 'john@example.com',
      role: Role.CUSTOMER,
      tokenType: 'refresh',
    });
    authRepository.findByTokenHash.mockResolvedValue({
      id: 'refresh-1',
      userId: 'user-1',
      tokenHash: currentTokenHash,
      expiresAt: new Date('2099-01-01T00:00:00.000Z'),
      revoked: false,
      createdAt: new Date('2026-04-07T00:00:00.000Z'),
    });
    userService.findById.mockResolvedValue(existingUser);
    revokeTokenMock.mockResolvedValue(true);
    jwtService.signAsync.mockReset();
    jwtService.signAsync
      .mockResolvedValueOnce('next-access-token')
      .mockResolvedValueOnce('next-refresh-token');

    const result = await authService.refreshToken({
      refreshToken: incomingRefreshToken,
    });

    expect(transactionMock).toHaveBeenCalledTimes(1);
    expect(revokeTokenMock).toHaveBeenCalledWith(
      currentTokenHash,
      'user-1',
      transactionExecutor,
    );
    expect(saveRefreshTokenMock).toHaveBeenCalledWith(
      {
        userId: 'user-1',
        tokenHash: nextRefreshHash,
        expiresAt: new Date(1_800_000_000 * 1000),
      },
      transactionExecutor,
    );
    expect(result.tokens.refreshToken).toBe('next-refresh-token');
  });

  it('creates a new customer from a verified Google token when the email is new', async () => {
    const googleCustomer = createUser({
      email: 'google@example.com',
      passwordHash: null,
      firebaseUid: 'firebase-uid-1',
    });

    firebaseTokenVerifierService.verifyGoogleCustomerToken.mockResolvedValue({
      firebaseUid: 'firebase-uid-1',
      email: 'google@example.com',
      name: 'Google Customer',
    });
    userService.findByFirebaseUid.mockResolvedValue(null);
    userService.findByEmail.mockResolvedValue(null);
    createCustomerMock.mockResolvedValue(googleCustomer);
    jwtService.signAsync.mockReset();
    jwtService.signAsync
      .mockResolvedValueOnce('google-access-token')
      .mockResolvedValueOnce('google-refresh-token');

    const result = await authService.authenticateCustomerWithGoogle({
      idToken: 'firebase-id-token',
      phone: '+905551119999',
    });

    expect(createCustomerMock).toHaveBeenCalledWith({
      name: 'Google Customer',
      email: 'google@example.com',
      phone: '+905551119999',
      firebaseUid: 'firebase-uid-1',
    });
    expect(result.tokens.accessToken).toBe('google-access-token');
  });

  it('links a verified Google identity to an existing customer email', async () => {
    const existingCustomer = createUser({
      email: 'linked@example.com',
      firebaseUid: null,
    });
    const linkedCustomer = createUser({
      email: 'linked@example.com',
      firebaseUid: 'firebase-uid-2',
    });

    firebaseTokenVerifierService.verifyGoogleCustomerToken.mockResolvedValue({
      firebaseUid: 'firebase-uid-2',
      email: 'linked@example.com',
      name: 'Linked Customer',
    });
    userService.findByFirebaseUid.mockResolvedValue(null);
    userService.findByEmail.mockResolvedValue(existingCustomer);
    linkFirebaseCustomerIdentityMock.mockResolvedValue(linkedCustomer);
    jwtService.signAsync.mockReset();
    jwtService.signAsync
      .mockResolvedValueOnce('linked-access-token')
      .mockResolvedValueOnce('linked-refresh-token');

    await authService.authenticateCustomerWithGoogle({
      idToken: 'firebase-id-token',
    });

    expect(linkFirebaseCustomerIdentityMock).toHaveBeenCalledWith(
      'user-1',
      'firebase-uid-2',
    );
  });

  it('rejects password login for a Google-only account', async () => {
    userService.findByEmail.mockResolvedValue(
      createUser({
        passwordHash: null,
        firebaseUid: 'firebase-uid-only',
      }),
    );

    await expect(
      authService.login({
        email: 'john@example.com',
        password: 'secret123',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);

    expect(bcryptCompareMock).not.toHaveBeenCalled();
  });

  it('revokes a refresh token on logout', async () => {
    const refreshToken = 'refresh-token';
    const refreshHash = createHmac('sha256', 'test-secret')
      .update(refreshToken)
      .digest('hex');

    revokeTokenMock.mockResolvedValue(true);

    await expect(authService.logout('user-1', refreshToken)).resolves.toEqual({
      success: true,
    });

    expect(revokeTokenMock).toHaveBeenCalledWith(refreshHash, 'user-1');
  });
});
