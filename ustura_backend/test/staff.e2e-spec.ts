import { INestApplication } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import request from 'supertest';
import { Role } from '../src/shared/auth/role.enum';
import type { JwtPayload } from '../src/shared/auth/jwt-payload.interface';
import { RolesGuard } from '../src/common/guards/roles.guard';
import { StaffController } from '../src/modules/staff/staff.controller';
import { staffAlreadyAssignedError } from '../src/modules/staff/errors/staff.errors';
import { StaffService } from '../src/modules/staff/staff.service';
import { createContractTestApp } from './helpers/create-contract-test-app';
import {
  TEST_JWT_SECRET,
  TestJwtStrategy,
} from './helpers/test-jwt.strategy';

describe('StaffController (e2e)', () => {
  let app: INestApplication;
  let staffService: {
    findBySalonId: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
  };

  const jwtService = new JwtService({ secret: TEST_JWT_SECRET });
  const staffResponse = {
    id: 'staff-1',
    userId: 'user-1',
    salonId: '11111111-1111-1111-1111-111111111111',
    role: Role.BARBER,
    bio: 'Senior barber',
    photoUrl: 'https://example.com/barber.jpg',
    isActive: true,
    createdAt: '2026-04-09T09:00:00.000Z',
    updatedAt: '2026-04-09T09:00:00.000Z',
  };

  beforeEach(async () => {
    staffService = {
      findBySalonId: jest.fn().mockResolvedValue([staffResponse]),
      create: jest.fn().mockResolvedValue(staffResponse),
      update: jest.fn().mockResolvedValue(staffResponse),
      delete: jest.fn().mockResolvedValue({
        ...staffResponse,
        isActive: false,
      }),
    };

    app = await createContractTestApp({
      imports: [
        PassportModule.register({
          defaultStrategy: 'jwt',
        }),
      ],
      controllers: [StaffController],
      providers: [
        {
          provide: StaffService,
          useValue: staffService,
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

  it('GET /api/salons/:salonId/staff returns the public active staff list', async () => {
    await request(app.getHttpServer())
      .get('/api/salons/11111111-1111-1111-1111-111111111111/staff')
      .expect(200)
      .expect([staffResponse]);

    expect(staffService.findBySalonId).toHaveBeenCalledWith(
      '11111111-1111-1111-1111-111111111111',
    );
  });

  it('POST /api/salons/:salonId/staff rejects invalid payloads with the production validation contract', async () => {
    await request(app.getHttpServer())
      .post('/api/salons/11111111-1111-1111-1111-111111111111/staff')
      .set(
        'Authorization',
        `Bearer ${createAccessToken({
          role: Role.OWNER,
        })}`,
      )
      .send({
        user_id: 'not-a-uuid',
        role: 'owner',
        photo_url: 'not-a-url',
        extra: 'not-allowed',
      })
      .expect(400)
      .expect(({ body }) => {
        expect(body.statusCode).toBe(400);
        expect(body.path).toBe(
          '/api/salons/11111111-1111-1111-1111-111111111111/staff',
        );
        expect(body.message).toContain('user_id must be a UUID');
        expect(body.message).toContain(
          'role must be one of the following values: barber, receptionist',
        );
        expect(body.message).toContain('photo_url must be a URL address');
        expect(body.message).toContain('property extra should not exist');
      });

    expect(staffService.create).not.toHaveBeenCalled();
  });

  it('POST /api/salons/:salonId/staff returns 403 for authenticated non-owner users', async () => {
    await request(app.getHttpServer())
      .post('/api/salons/11111111-1111-1111-1111-111111111111/staff')
      .set(
        'Authorization',
        `Bearer ${createAccessToken({
          role: Role.CUSTOMER,
        })}`,
      )
      .send({
        user_id: '22222222-2222-4222-8222-222222222222',
        role: Role.BARBER,
      })
      .expect(403)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          statusCode: 403,
          message: 'Forbidden resource',
          path: '/api/salons/11111111-1111-1111-1111-111111111111/staff',
        });
      });
  });

  it('POST /api/salons/:salonId/staff preserves the staff error code contract', async () => {
    staffService.create.mockRejectedValueOnce(staffAlreadyAssignedError());

    await request(app.getHttpServer())
      .post('/api/salons/11111111-1111-1111-1111-111111111111/staff')
      .set(
        'Authorization',
        `Bearer ${createAccessToken({
          role: Role.OWNER,
        })}`,
      )
      .send({
        user_id: '22222222-2222-4222-8222-222222222222',
        role: Role.BARBER,
      })
      .expect(409)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          statusCode: 409,
          message: 'This user is already assigned to the selected salon staff.',
          code: 'staff.already_assigned',
          path: '/api/salons/11111111-1111-1111-1111-111111111111/staff',
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
