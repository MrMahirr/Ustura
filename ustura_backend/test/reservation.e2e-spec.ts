import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import request from 'supertest';
import { Role } from '../src/shared/auth/role.enum';
import type { JwtPayload } from '../src/shared/auth/jwt-payload.interface';
import { RolesGuard } from '../src/common/guards/roles.guard';
import { ReservationController } from '../src/modules/reservation/reservation.controller';
import { cancellationForbiddenError } from '../src/modules/reservation/errors/reservation.errors';
import { ReservationStatus } from '../src/modules/reservation/enums/reservation-status.enum';
import { ReservationService } from '../src/modules/reservation/reservation.service';
import { createContractTestApp } from './helpers/create-contract-test-app';
import {
  TEST_JWT_SECRET,
  TestJwtStrategy,
} from './helpers/test-jwt.strategy';

describe('ReservationController (e2e)', () => {
  let app: INestApplication;
  let reservationService: {
    create: jest.Mock;
    findByCustomerId: jest.Mock;
    findBySalonId: jest.Mock;
    cancel: jest.Mock;
    updateStatus: jest.Mock;
  };

  const reservationResponse = {
    id: '44444444-4444-4444-4444-444444444444',
    salon_id: '11111111-1111-1111-1111-111111111111',
    staff_id: '22222222-2222-2222-2222-222222222222',
    customer_id: '33333333-3333-3333-3333-333333333333',
    slot_start: '2026-04-10T10:00:00.000Z',
    notes: 'Window seat',
    status: 'confirmed',
    created_at: '2026-04-09T09:00:00.000Z',
    updated_at: '2026-04-09T09:00:00.000Z',
  };
  const jwtService = new JwtService({ secret: TEST_JWT_SECRET });

  beforeEach(async () => {
    reservationService = {
      create: jest.fn().mockResolvedValue(reservationResponse),
      findByCustomerId: jest.fn().mockResolvedValue([reservationResponse]),
      findBySalonId: jest.fn().mockResolvedValue([reservationResponse]),
      cancel: jest.fn().mockResolvedValue({
        ...reservationResponse,
        status: 'cancelled',
      }),
      updateStatus: jest.fn().mockResolvedValue({
        ...reservationResponse,
        status: 'completed',
      }),
    };

    app = await createContractTestApp({
      imports: [
        PassportModule.register({
          defaultStrategy: 'jwt',
        }),
      ],
      controllers: [ReservationController],
      providers: [
        {
          provide: ReservationService,
          useValue: reservationService,
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

  it('GET /api/reservations/my returns the authenticated customer reservations', async () => {
    await request(app.getHttpServer())
      .get('/api/reservations/my')
      .set(
        'Authorization',
        `Bearer ${createAccessToken({
          sub: '33333333-3333-3333-3333-333333333333',
          role: Role.CUSTOMER,
        })}`,
      )
      .expect(200)
      .expect((res) => {
        expect(res.body.success).toBe(true);
        expect(res.body.data).toEqual([reservationResponse]);
      });

    expect(reservationService.findByCustomerId).toHaveBeenCalledWith(
      expect.objectContaining({
        sub: '33333333-3333-3333-3333-333333333333',
        role: Role.CUSTOMER,
        tokenType: 'access',
      }),
    );
  });

  it('GET /api/reservations/my returns 403 for authenticated non-customer users', async () => {
    await request(app.getHttpServer())
      .get('/api/reservations/my')
      .set(
        'Authorization',
        `Bearer ${createAccessToken({
          role: Role.OWNER,
        })}`,
      )
      .expect(403)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          statusCode: 403,
          message: 'Forbidden resource',
          path: '/api/reservations/my',
        });
        expect(typeof body.timestamp).toBe('string');
      });

    expect(reservationService.findByCustomerId).not.toHaveBeenCalled();
  });

  it('POST /api/reservations rejects invalid bodies with the production validation contract', async () => {
    await request(app.getHttpServer())
      .post('/api/reservations')
      .set(
        'Authorization',
        `Bearer ${createAccessToken({
          role: Role.CUSTOMER,
        })}`,
      )
      .send({
        salon_id: 'not-a-uuid',
        staff_id: 'still-not-a-uuid',
        slot_start: 'not-a-date',
        extra: 'not-allowed',
      })
      .expect(400)
      .expect(({ body }) => {
        expect(body.success).toBe(false);
        expect(body.statusCode).toBe(400);
        expect(body.path).toBe('/api/reservations');
        expect(body.message).toContain('salonId must be a UUID');
        expect(body.message).toContain('staffId must be a UUID');
        expect(body.message).toContain('slotStart must be a valid ISO 8601 date string');
        expect(body.message).toContain('property extra should not exist');
      });

    expect(reservationService.create).not.toHaveBeenCalled();
  });

  it('DELETE /api/reservations/:reservationId preserves domain error codes from the service layer', async () => {
    reservationService.cancel.mockRejectedValueOnce(cancellationForbiddenError());

    await request(app.getHttpServer())
      .delete('/api/reservations/55555555-5555-5555-5555-555555555555')
      .set(
        'Authorization',
        `Bearer ${createAccessToken({
          role: Role.CUSTOMER,
        })}`,
      )
      .expect(403)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          statusCode: 403,
          message: 'You do not have permission to cancel this reservation.',
          code: 'reservation.cancellation_forbidden',
          path: '/api/reservations/55555555-5555-5555-5555-555555555555',
        });
        expect(typeof body.timestamp).toBe('string');
      });
  });

  it('PATCH /api/reservations/:reservationId/status validates operational status updates', async () => {
    await request(app.getHttpServer())
      .patch('/api/reservations/55555555-5555-5555-5555-555555555555/status')
      .set(
        'Authorization',
        `Bearer ${createAccessToken({
          role: Role.OWNER,
        })}`,
      )
      .send({
        status: 'cancelled',
      })
      .expect(400)
      .expect(({ body }) => {
        expect(body.success).toBe(false);
        expect(body.statusCode).toBe(400);
        expect(body.path).toBe(
          '/api/reservations/55555555-5555-5555-5555-555555555555/status',
        );
        expect(body.message).toContain(
          'status must be one of the following values: confirmed, completed, no_show',
        );
      });

    expect(reservationService.updateStatus).not.toHaveBeenCalled();
  });

  it('PATCH /api/reservations/:reservationId/status forwards valid updates to the service', async () => {
    await request(app.getHttpServer())
      .patch('/api/reservations/55555555-5555-5555-5555-555555555555/status')
      .set(
        'Authorization',
        `Bearer ${createAccessToken({
          sub: 'owner-1',
          role: Role.OWNER,
        })}`,
      )
      .send({
        status: ReservationStatus.COMPLETED,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.success).toBe(true);
        expect(res.body.data).toEqual({
          ...reservationResponse,
          status: 'completed',
        });
      });

    expect(reservationService.updateStatus).toHaveBeenCalledWith(
      expect.objectContaining({
        sub: 'owner-1',
        role: Role.OWNER,
        tokenType: 'access',
      }),
      '55555555-5555-5555-5555-555555555555',
      {
        status: ReservationStatus.COMPLETED,
      },
    );
  });

  function createAccessToken(
    overrides: Partial<JwtPayload> & Pick<JwtPayload, 'role'>,
  ): string {
    return jwtService.sign({
      sub: overrides.sub ?? 'user-1',
      email: overrides.email ?? 'customer@example.com',
      role: overrides.role,
      tokenType: overrides.tokenType ?? 'access',
    });
  }
});
