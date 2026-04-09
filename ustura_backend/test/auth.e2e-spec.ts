import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { Role } from '../src/common/enums/role.enum';
import { AuthController } from '../src/modules/auth/auth.controller';
import { AuthService } from '../src/modules/auth/auth.service';
import { googleWebNotConfiguredError } from '../src/modules/auth/errors/auth.errors';
import { createContractTestApp } from './helpers/create-contract-test-app';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let authService: {
    register: jest.Mock;
    login: jest.Mock;
    authenticateCustomerWithGoogle: jest.Mock;
    getGoogleCustomerWebConfiguration: jest.Mock;
    authenticateCustomerWithGoogleWeb: jest.Mock;
    refreshToken: jest.Mock;
    logout: jest.Mock;
  };

  const sessionResponse = {
    user: {
      id: '11111111-1111-1111-1111-111111111111',
      name: 'Test Customer',
      email: 'customer@example.com',
      phone: '+905551112233',
      role: Role.CUSTOMER,
      isActive: true,
      createdAt: '2026-04-09T09:00:00.000Z',
      updatedAt: '2026-04-09T09:00:00.000Z',
    },
    tokens: {
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      accessTokenExpiresIn: '15m',
      refreshTokenExpiresIn: '30d',
    },
  };

  beforeEach(async () => {
    authService = {
      register: jest.fn().mockResolvedValue(sessionResponse),
      login: jest.fn().mockResolvedValue(sessionResponse),
      authenticateCustomerWithGoogle: jest
        .fn()
        .mockResolvedValue(sessionResponse),
      getGoogleCustomerWebConfiguration: jest
        .fn()
        .mockReturnValue({ clientId: 'client-id.apps.googleusercontent.com' }),
      authenticateCustomerWithGoogleWeb: jest
        .fn()
        .mockResolvedValue(sessionResponse),
      refreshToken: jest.fn().mockResolvedValue(sessionResponse),
      logout: jest.fn().mockResolvedValue({ success: true }),
    };

    app = await createContractTestApp({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authService,
        },
      ],
    });
  });

  afterEach(async () => {
    await app.close();
  });

  it('GET /api/auth/google/customer/web/config returns the public Google web configuration', async () => {
    await request(app.getHttpServer())
      .get('/api/auth/google/customer/web/config')
      .expect(200)
      .expect({ clientId: 'client-id.apps.googleusercontent.com' });

    expect(authService.getGoogleCustomerWebConfiguration).toHaveBeenCalledTimes(
      1,
    );
  });

  it('POST /api/auth/register rejects invalid payloads with the production validation contract', async () => {
    await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        name: 'A',
        email: 'not-an-email',
        phone: '123456789012345678901',
        password: 'short',
        extra: 'not-allowed',
      })
      .expect(400)
      .expect(({ body }) => {
        expect(body.statusCode).toBe(400);
        expect(body.path).toBe('/api/auth/register');
        expect(body.message).toContain(
          'name must be longer than or equal to 2 characters',
        );
        expect(body.message).toContain('email must be an email');
        expect(body.message).toContain(
          'phone must be shorter than or equal to 20 characters',
        );
        expect(body.message).toContain(
          'password must be longer than or equal to 8 characters',
        );
        expect(body.message).toContain('property extra should not exist');
        expect(typeof body.timestamp).toBe('string');
      });

    expect(authService.register).not.toHaveBeenCalled();
  });

  it('POST /api/auth/login returns the session payload from the auth service', async () => {
    await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'customer@example.com',
        password: 'password123',
      })
      .expect(201)
      .expect(sessionResponse);

    expect(authService.login).toHaveBeenCalledWith({
      email: 'customer@example.com',
      password: 'password123',
    });
  });

  it('POST /api/auth/google/customer/web preserves the domain error code contract', async () => {
    authService.authenticateCustomerWithGoogleWeb.mockRejectedValueOnce(
      googleWebNotConfiguredError(),
    );

    await request(app.getHttpServer())
      .post('/api/auth/google/customer/web')
      .send({
        accessToken: 'x'.repeat(32),
      })
      .expect(503)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          statusCode: 503,
          message: 'Google web sign-in is not configured on the backend.',
          code: 'auth.google_web_not_configured',
          path: '/api/auth/google/customer/web',
        });
        expect(typeof body.timestamp).toBe('string');
      });
  });
});
