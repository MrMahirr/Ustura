import { INestApplication } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import request from 'supertest';
import { RolesGuard } from '../src/common/guards/roles.guard';
import { PlatformAdminController } from '../src/modules/platform-admin/platform-admin.controller';
import { ownerApplicationAlreadyReviewedError } from '../src/modules/platform-admin/errors/platform-admin.errors';
import { OwnerApplicationStatus } from '../src/modules/platform-admin/enums/owner-application-status.enum';
import { PlatformAdminService } from '../src/modules/platform-admin/platform-admin.service';
import { Role } from '../src/shared/auth/role.enum';
import type { JwtPayload } from '../src/shared/auth/jwt-payload.interface';
import { createContractTestApp } from './helpers/create-contract-test-app';
import {
  TEST_JWT_SECRET,
  TestJwtStrategy,
} from './helpers/test-jwt.strategy';

describe('PlatformAdminController (e2e)', () => {
  let app: INestApplication;
  let platformAdminService: {
    createOwnerApplication: jest.Mock;
    listOwnerApplications: jest.Mock;
    approveOwnerApplication: jest.Mock;
    rejectOwnerApplication: jest.Mock;
  };

  const jwtService = new JwtService({ secret: TEST_JWT_SECRET });
  const ownerApplicationResponse = {
    id: '11111111-1111-1111-1111-111111111111',
    applicantName: 'Jane Owner',
    applicantEmail: 'owner@example.com',
    applicantPhone: '+905551112233',
    salonName: 'Ustura Premium',
    salonAddress: 'Istanbul Street 10',
    salonCity: 'Istanbul',
    salonDistrict: 'Besiktas',
    salonPhotoUrl: 'https://example.com/salon.jpg',
    salonWorkingHours: {
      monday: { open: '09:00', close: '19:00' },
      sunday: null,
    },
    status: OwnerApplicationStatus.PENDING,
    notes: 'First branch',
    reviewedAt: null,
    reviewedByUserId: null,
    rejectionReason: null,
    approvedOwnerUserId: null,
    approvedSalonId: null,
    createdAt: '2026-04-09T09:00:00.000Z',
    updatedAt: '2026-04-09T09:00:00.000Z',
  };

  beforeEach(async () => {
    platformAdminService = {
      createOwnerApplication: jest
        .fn()
        .mockResolvedValue(ownerApplicationResponse),
      listOwnerApplications: jest
        .fn()
        .mockResolvedValue([ownerApplicationResponse]),
      approveOwnerApplication: jest.fn().mockResolvedValue({
        ...ownerApplicationResponse,
        status: OwnerApplicationStatus.APPROVED,
        reviewedAt: '2026-04-09T10:00:00.000Z',
        reviewedByUserId: 'super-admin-1',
        approvedOwnerUserId: 'owner-1',
        approvedSalonId: 'salon-1',
      }),
      rejectOwnerApplication: jest.fn().mockResolvedValue({
        ...ownerApplicationResponse,
        status: OwnerApplicationStatus.REJECTED,
        reviewedAt: '2026-04-09T10:00:00.000Z',
        reviewedByUserId: 'super-admin-1',
        rejectionReason: 'Missing documents',
      }),
    };

    app = await createContractTestApp({
      imports: [
        PassportModule.register({
          defaultStrategy: 'jwt',
        }),
      ],
      controllers: [PlatformAdminController],
      providers: [
        {
          provide: PlatformAdminService,
          useValue: platformAdminService,
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

  it('POST /api/owner-applications rejects invalid payloads with the production validation contract', async () => {
    await request(app.getHttpServer())
      .post('/api/owner-applications')
      .send({
        applicantName: 'A',
        applicantEmail: 'not-an-email',
        applicantPhone: '123',
        password: 'short',
        salonName: 'A',
        salonAddress: 'bad',
        salonCity: 'I',
        salonWorkingHours: [],
        extra: 'not-allowed',
      })
      .expect(400)
      .expect(({ body }) => {
        expect(body.success).toBe(false);
        expect(body.statusCode).toBe(400);
        expect(body.path).toBe('/api/owner-applications');
        expect(body.message).toContain('applicantEmail must be an email');
        expect(body.message).toContain(
          'applicantPhone must be longer than or equal to 8 characters',
        );
        expect(body.message).toContain(
          'password must be longer than or equal to 8 characters',
        );
        expect(body.message).toContain(
          'salonAddress must be longer than or equal to 5 characters',
        );
        expect(body.message).toContain('salonWorkingHours must be an object');
        expect(body.message).toContain('property extra should not exist');
      });
  });

  it('GET /api/admin/owner-applications returns 403 for authenticated non-super-admin users', async () => {
    await request(app.getHttpServer())
      .get('/api/admin/owner-applications')
      .set(
        'Authorization',
        `Bearer ${createAccessToken({
          role: Role.OWNER,
        })}`,
      )
      .expect(403);
  });

  it('POST /api/admin/owner-applications/:applicationId/approve returns the approved owner application', async () => {
    await request(app.getHttpServer())
      .post(
        '/api/admin/owner-applications/11111111-1111-1111-1111-111111111111/approve',
      )
      .set(
        'Authorization',
        `Bearer ${createAccessToken({
          role: Role.SUPER_ADMIN,
          sub: 'super-admin-1',
        })}`,
      )
      .expect(201)
      .expect(({ body }) => {
        expect(body.success).toBe(true);
        expect(body.data).toMatchObject({
          status: OwnerApplicationStatus.APPROVED,
          reviewedByUserId: 'super-admin-1',
          approvedOwnerUserId: expect.any(String),
          approvedSalonId: expect.any(String),
        });
      });
  });

  it('POST /api/admin/owner-applications/:applicationId/reject preserves the domain error code contract', async () => {
    platformAdminService.rejectOwnerApplication.mockRejectedValueOnce(
      ownerApplicationAlreadyReviewedError(OwnerApplicationStatus.APPROVED),
    );

    await request(app.getHttpServer())
      .post(
        '/api/admin/owner-applications/11111111-1111-1111-1111-111111111111/reject',
      )
      .set(
        'Authorization',
        `Bearer ${createAccessToken({
          role: Role.SUPER_ADMIN,
          sub: 'super-admin-1',
        })}`,
      )
      .send({
        reason: 'Duplicate request',
      })
      .expect(409)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          statusCode: 409,
          message: 'Owner application is already approved.',
          code: 'platform_admin.owner_application_already_reviewed',
        });
      });
  });

  function createAccessToken(
    overrides: Partial<JwtPayload> & Pick<JwtPayload, 'role'>,
  ): string {
    return jwtService.sign({
      sub: overrides.sub ?? 'user-1',
      email: overrides.email ?? 'user@example.com',
      role: overrides.role,
      tokenType: overrides.tokenType ?? 'access',
    });
  }
});
