import { INestApplication } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import request from 'supertest';
import { Role } from '../src/common/enums/role.enum';
import type { JwtPayload } from '../src/common/interfaces/jwt-payload.interface';
import { RolesGuard } from '../src/common/guards/roles.guard';
import { SalonController } from '../src/modules/salon/salon.controller';
import {
  salonManagementForbiddenError,
  salonNotFoundError,
} from '../src/modules/salon/errors/salon.errors';
import { SalonService } from '../src/modules/salon/salon.service';
import { createContractTestApp } from './helpers/create-contract-test-app';
import {
  TEST_JWT_SECRET,
  TestJwtStrategy,
} from './helpers/test-jwt.strategy';

describe('SalonController (e2e)', () => {
  let app: INestApplication;
  let salonService: {
    findAll: jest.Mock;
    findOwned: jest.Mock;
    findById: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
    remove: jest.Mock;
  };

  const jwtService = new JwtService({ secret: TEST_JWT_SECRET });
  const salonResponse = {
    id: '11111111-1111-4111-8111-111111111111',
    ownerId: 'owner-1',
    name: 'Ustura Barber',
    address: 'Istanbul Street 10',
    city: 'Istanbul',
    district: 'Besiktas',
    photoUrl: 'https://example.com/photo.jpg',
    workingHours: {
      monday: { open: '09:00', close: '19:00' },
      sunday: null,
    },
    isActive: true,
    createdAt: '2026-04-09T09:00:00.000Z',
    updatedAt: '2026-04-09T09:00:00.000Z',
  };

  beforeEach(async () => {
    salonService = {
      findAll: jest.fn().mockResolvedValue([salonResponse]),
      findOwned: jest.fn().mockResolvedValue([salonResponse]),
      findById: jest.fn().mockResolvedValue(salonResponse),
      create: jest.fn().mockResolvedValue(salonResponse),
      update: jest.fn().mockResolvedValue(salonResponse),
      remove: jest.fn().mockResolvedValue({
        ...salonResponse,
        isActive: false,
      }),
    };

    app = await createContractTestApp({
      imports: [
        PassportModule.register({
          defaultStrategy: 'jwt',
        }),
      ],
      controllers: [SalonController],
      providers: [
        {
          provide: SalonService,
          useValue: salonService,
        },
        RolesGuard,
        Reflector,
        TestJwtStrategy,
      ],
    });
  });

  afterEach(async () => {
    await app.close();
  });

  it('GET /api/salons/:salonId preserves the salon not found error contract', async () => {
    salonService.findById.mockRejectedValueOnce(salonNotFoundError());

    await request(app.getHttpServer())
      .get('/api/salons/11111111-1111-4111-8111-111111111111')
      .expect(404)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          statusCode: 404,
          message: 'Salon not found.',
          code: 'salon.not_found',
          path: '/api/salons/11111111-1111-4111-8111-111111111111',
        });
      });
  });

  it('POST /api/salons rejects invalid payloads with the production validation contract', async () => {
    await request(app.getHttpServer())
      .post('/api/salons')
      .set(
        'Authorization',
        `Bearer ${createAccessToken({
          role: Role.OWNER,
        })}`,
      )
      .send({
        name: 'A',
        address: 'abc',
        city: 'X',
        working_hours: 'not-an-object',
        extra: 'not-allowed',
      })
      .expect(400)
      .expect(({ body }) => {
        expect(body.statusCode).toBe(400);
        expect(body.path).toBe('/api/salons');
        expect(body.message).toContain(
          'name must be longer than or equal to 2 characters',
        );
        expect(body.message).toContain(
          'address must be longer than or equal to 5 characters',
        );
        expect(body.message).toContain(
          'city must be longer than or equal to 2 characters',
        );
        expect(body.message).toContain('working_hours must be an object');
        expect(body.message).toContain('property extra should not exist');
      });

    expect(salonService.create).not.toHaveBeenCalled();
  });

  it('PATCH /api/salons/:salonId preserves the salon management error contract', async () => {
    salonService.update.mockRejectedValueOnce(
      salonManagementForbiddenError(
        'You do not have permission to manage this salon.',
      ),
    );

    await request(app.getHttpServer())
      .patch('/api/salons/11111111-1111-4111-8111-111111111111')
      .set(
        'Authorization',
        `Bearer ${createAccessToken({
          role: Role.OWNER,
        })}`,
      )
      .send({
        city: 'Ankara',
      })
      .expect(403)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          statusCode: 403,
          message: 'You do not have permission to manage this salon.',
          code: 'salon.management_forbidden',
          path: '/api/salons/11111111-1111-4111-8111-111111111111',
        });
      });
  });

  function createAccessToken(
    overrides: Partial<JwtPayload> & Pick<JwtPayload, 'role'>,
  ): string {
    return jwtService.sign({
      sub: overrides.sub ?? 'owner-1',
      email: overrides.email ?? 'owner@example.com',
      role: overrides.role,
      tokenType: overrides.tokenType ?? 'access',
    });
  }
});
