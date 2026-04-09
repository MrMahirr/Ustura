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
        expect(body.status).toBe('ok');
        expect(typeof body.timestamp).toBe('string');
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
        ],
      })
      .mockResolvedValueOnce({
        rows: [
          { column_name: 'password_hash', is_nullable: 'YES' },
          { column_name: 'firebase_uid', is_nullable: 'YES' },
        ],
      });

    await request(app.getHttpServer())
      .get('/api/health/ready')
      .expect(200)
      .expect(({ body }) => {
        expect(body.status).toBe('ready');
        expect(body.checks.database.status).toBe('up');
        expect(body.checks.schemaMigrations.status).toBe('up');
        expect(body.checks.usersTableSchema.status).toBe('up');
        expect(body.checks.redis.status).toBe('up');
      });

    expect(databaseService.query).toHaveBeenCalledTimes(4);
    expect(redisService.connect).toHaveBeenCalledTimes(1);
    expect(redisPing).toHaveBeenCalledTimes(1);
  });

  it('GET /api/health/ready returns 503 when PostgreSQL is unavailable', async () => {
    databaseService.query.mockRejectedValueOnce(new Error('connect ECONNREFUSED'));

    await request(app.getHttpServer())
      .get('/api/health/ready')
      .expect(503)
      .expect(({ body }) => {
        expect(body.status).toBe('not_ready');
        expect(body.checks.database.status).toBe('down');
        expect(body.checks.database.message).toContain(
          'PostgreSQL connection failed.',
        );
        expect(body.checks.schemaMigrations.message).toBe(
          'Skipped because PostgreSQL is unavailable.',
        );
        expect(body.checks.usersTableSchema.message).toBe(
          'Skipped because PostgreSQL is unavailable.',
        );
        expect(body.checks.redis.status).toBe('up');
      });
  });
});
