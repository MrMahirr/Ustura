import { INestApplication } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import request from 'supertest';
import { Role } from '../src/shared/auth/role.enum';
import type { JwtPayload } from '../src/shared/auth/jwt-payload.interface';
import { RolesGuard } from '../src/common/guards/roles.guard';
import { SalonController } from '../src/modules/salon/salon.controller';
import {
  salonManagementForbiddenError,
  salonNotFoundError,
} from '../src/modules/salon/errors/salon.errors';
import { SalonManagementService } from '../src/modules/salon/salon-management.service';
import { SalonQueryService } from '../src/modules/salon/salon-query.service';
import { createContractTestApp } from './helpers/create-contract-test-app';
import {
  TEST_JWT_SECRET,
  TestJwtStrategy,
} from './helpers/test-jwt.strategy';

describe('SalonController (e2e)', () => {
  let app: INestApplication;
  let salonQueryService: {
    findPublicList: jest.Mock;
    findOwned: jest.Mock;
    findPublicById: jest.Mock;
  };
  let salonManagementService: {
    create: jest.Mock;
    update: jest.Mock;
    remove: jest.Mock;
  };

  const jwtService = new JwtService({ secret: TEST_JWT_SECRET });
  const publicSalonSummary = {
    id: '11111111-1111-4111-8111-111111111111',
    name: 'Ustura Barber',
    city: 'Istanbul',
    district: 'Besiktas',
    photoUrl: 'https://example.com/photo.jpg',
  };
  const publicSalonDetail = {
    ...publicSalonSummary,
    address: 'Istanbul Street 10',
    workingHours: {
      monday: { open: '09:00', close: '19:00' },
      sunday: null,
    },
  };
  const ownedSalonSummary = {
    ...publicSalonSummary,
    isActive: true,
    updatedAt: '2026-04-09T09:00:00.000Z',
  };
  const ownedSalonDetail = {
    ...ownedSalonSummary,
    address: 'Istanbul Street 10',
    workingHours: publicSalonDetail.workingHours,
    createdAt: '2026-04-09T09:00:00.000Z',
  };

  beforeEach(async () => {
    salonQueryService = {
      findPublicList: jest.fn().mockResolvedValue([publicSalonSummary]),
      findOwned: jest.fn().mockResolvedValue([ownedSalonSummary]),
      findPublicById: jest.fn().mockResolvedValue(publicSalonDetail),
    };
    salonManagementService = {
      create: jest.fn().mockResolvedValue(ownedSalonDetail),
      update: jest.fn().mockResolvedValue(ownedSalonDetail),
      remove: jest.fn().mockResolvedValue({
        ...ownedSalonDetail,
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
          provide: SalonQueryService,
          useValue: salonQueryService,
        },
        {
          provide: SalonManagementService,
          useValue: salonManagementService,
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

  it('GET /api/salons returns the simplified public catalog projection', async () => {
    await request(app.getHttpServer())
      .get('/api/salons')
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual([publicSalonSummary]);
      });

    expect(salonQueryService.findPublicList).toHaveBeenCalledWith(
      expect.objectContaining({}),
    );
  });

  it('GET /api/salons/owned returns the owner-facing salon summary projection', async () => {
    await request(app.getHttpServer())
      .get('/api/salons/owned')
      .set(
        'Authorization',
        `Bearer ${createAccessToken({
          role: Role.OWNER,
        })}`,
      )
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual([ownedSalonSummary]);
      });

    expect(salonQueryService.findOwned).toHaveBeenCalledWith(
      expect.objectContaining({
        sub: 'owner-1',
        role: Role.OWNER,
      }),
    );
  });

  it('GET /api/salons/:salonId preserves the salon not found error contract', async () => {
    salonQueryService.findPublicById.mockRejectedValueOnce(salonNotFoundError());

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

    expect(salonManagementService.create).not.toHaveBeenCalled();
  });

  it('PATCH /api/salons/:salonId preserves the salon management error contract', async () => {
    salonManagementService.update.mockRejectedValueOnce(
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
