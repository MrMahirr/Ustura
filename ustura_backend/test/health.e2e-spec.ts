import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { DatabaseService } from '../src/database/database.service';
import { HealthController } from '../src/modules/health/health.controller';
import { HealthService } from '../src/modules/health/health.service';
import { RedisService } from '../src/redis/redis.service';
import { createContractTestApp } from './helpers/create-contract-test-app';

describe('HealthController (e2e)', () => {
  let app: INestApplication;
  let databaseService: {
    query: jest.Mock;
  };
  let redisPing: jest.Mock;
  let redisService: {
    connect: jest.Mock;
    getClient: jest.Mock;
    isUsingMemoryFallback: jest.Mock;
  };

  beforeEach(async () => {
    databaseService = {
      query: jest.fn(),
    };
    redisPing = jest.fn().mockResolvedValue('PONG');
    redisService = {
      connect: jest.fn().mockResolvedValue(undefined),
      getClient: jest.fn().mockReturnValue({
        ping: redisPing,
      }),
      isUsingMemoryFallback: jest.fn().mockReturnValue(false),
    };

    app = await createContractTestApp({
      controllers: [HealthController],
      providers: [
        HealthService,
        {
          provide: DatabaseService,
          useValue: databaseService,
        },
        {
          provide: RedisService,
          useValue: redisService,
        },
      ],
    });
  });

  afterEach(async () => {
    await app.close();
  });

  it('GET /api/health/live returns an ok liveness report', async () => {
    await request(app.getHttpServer())
      .get('/api/health/live')
      .expect(200)
      .expect(({ body }) => {
        expect(body.success).toBe(true);
        expect(body.data.status).toBe('ok');
        expect(typeof body.data.timestamp).toBe('string');
        expect(body.timestamp).toBeDefined();
      });
  });

  it('GET /api/health/ready returns 200 when PostgreSQL migrations, schema and Redis are healthy', async () => {
    databaseService.query
      .mockResolvedValueOnce({ rows: [{ ok: 1 }] })
      .mockResolvedValueOnce({ rows: [{ exists: true }] })
      .mockResolvedValueOnce({
        rows: [
          { filename: '001_init_tables.sql' },
          { filename: '002_add_customer_google_auth.sql' },
          { filename: '003_rework_reservation_schema.sql' },
          { filename: '004_create_owner_applications.sql' },
          { filename: '005_create_audit_logs.sql' },
          { filename: '006_harden_refresh_tokens.sql' },
          { filename: '007_enforce_user_phone_uniqueness.sql' },
        ],
      })
      .mockResolvedValueOnce({
        rows: [
          { column_name: 'password_hash', is_nullable: 'YES' },
          { column_name: 'firebase_uid', is_nullable: 'YES' },
        ],
      })
      .mockResolvedValueOnce({
        rows: [{ indexname: 'uq_users_phone_non_empty' }],
      })
      .mockResolvedValueOnce({
        rows: [
          { column_name: 'cancelled_at', is_nullable: 'YES' },
          { column_name: 'cancelled_by_user_id', is_nullable: 'YES' },
          { column_name: 'status_changed_at', is_nullable: 'YES' },
          { column_name: 'status_changed_by_user_id', is_nullable: 'YES' },
        ],
      })
      .mockResolvedValueOnce({
        rows: [
          { constraint_name: 'chk_reservations_status_lifecycle' },
          { constraint_name: 'chk_reservations_slot_duration' },
        ],
      })
      .mockResolvedValueOnce({
        rows: [{ indexname: 'uq_reservations_active_staff_slot' }],
      })
      .mockResolvedValueOnce({
        rows: [
          { column_name: 'revoked_at', is_nullable: 'YES' },
          { column_name: 'user_agent', is_nullable: 'YES' },
          { column_name: 'ip_address', is_nullable: 'YES' },
          { column_name: 'rotated_from', is_nullable: 'YES' },
        ],
      });

    await request(app.getHttpServer())
      .get('/api/health/ready')
      .expect(200)
      .expect(({ body }) => {
        expect(body.success).toBe(true);
        expect(body.data.status).toBe('ready');
        expect(body.data.checks.database.status).toBe('up');
        expect(body.data.checks.schemaMigrations.status).toBe('up');
        expect(body.data.checks.usersTableSchema.status).toBe('up');
        expect(body.data.checks.reservationsTableSchema.status).toBe('up');
        expect(body.data.checks.refreshTokensTableSchema.status).toBe('up');
        expect(body.data.checks.redis.status).toBe('up');
      });

    expect(databaseService.query).toHaveBeenCalledTimes(9);
    expect(redisService.connect).toHaveBeenCalledTimes(1);
    expect(redisPing).toHaveBeenCalledTimes(1);
  });

  it('GET /api/health/ready returns 503 when PostgreSQL is unavailable', async () => {
    databaseService.query.mockRejectedValueOnce(
      new Error('connect ECONNREFUSED'),
    );

    await request(app.getHttpServer())
      .get('/api/health/ready')
      .expect(503)
      .expect(({ body }) => {
        expect(body.success).toBe(true);
        expect(body.data.status).toBe('not_ready');
        expect(body.data.checks.database.status).toBe('down');
        expect(body.data.checks.database.message).toContain(
          'PostgreSQL connection failed.',
        );
        expect(body.data.checks.schemaMigrations.message).toBe(
          'Skipped because PostgreSQL is unavailable.',
        );
        expect(body.data.checks.usersTableSchema.message).toBe(
          'Skipped because PostgreSQL is unavailable.',
        );
        expect(body.data.checks.reservationsTableSchema.message).toBe(
          'Skipped because PostgreSQL is unavailable.',
        );
        expect(body.data.checks.redis.status).toBe('up');
      });
  });
});
