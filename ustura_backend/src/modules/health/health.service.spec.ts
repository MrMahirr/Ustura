import { DatabaseService } from '../../database/database.service';
import { RedisService } from '../../redis/redis.service';
import { HealthService } from './health.service';

type DatabaseServiceMock = {
  query: jest.Mock;
};

type RedisClientMock = {
  ping: jest.Mock;
};

type RedisServiceMock = {
  connect: jest.Mock;
  getClient: jest.Mock<RedisClientMock, []>;
  isUsingMemoryFallback: jest.Mock<boolean, []>;
};

function createDatabaseServiceMock(): DatabaseServiceMock {
  return {
    query: jest.fn(),
  };
}

function createRedisClientMock(): RedisClientMock {
  return {
    ping: jest.fn(),
  };
}

function createRedisServiceMock(client: RedisClientMock): RedisServiceMock {
  return {
    connect: jest.fn(),
    getClient: jest.fn().mockReturnValue(client),
    isUsingMemoryFallback: jest.fn().mockReturnValue(false),
  };
}

describe('HealthService', () => {
  let service: HealthService;
  let databaseServiceMock: DatabaseServiceMock;
  let redisClientMock: RedisClientMock;
  let redisServiceMock: RedisServiceMock;

  beforeEach(() => {
    databaseServiceMock = createDatabaseServiceMock();
    redisClientMock = createRedisClientMock();
    redisServiceMock = createRedisServiceMock(redisClientMock);

    service = new HealthService(
      databaseServiceMock as unknown as DatabaseService,
      redisServiceMock as unknown as RedisService,
    );
  });

  it('returns ready when all dependencies are healthy', async () => {
    databaseServiceMock.query
      .mockResolvedValueOnce({ rows: [{ ok: 1 }] })
      .mockResolvedValueOnce({ rows: [{ exists: true }] })
      .mockResolvedValueOnce({
        rows: [
          { filename: '001_init_tables.sql' },
          { filename: '002_add_customer_google_auth.sql' },
          { filename: '003_rework_reservation_schema.sql' },
        ],
      })
      .mockResolvedValueOnce({
        rows: [
          { column_name: 'password_hash', is_nullable: 'YES' },
          { column_name: 'firebase_uid', is_nullable: 'YES' },
        ],
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
      });
    redisServiceMock.connect.mockResolvedValue(undefined);
    redisClientMock.ping.mockResolvedValue('PONG');

    const result = await service.getReadiness();

    expect(result.status).toBe('ready');
    expect(result.checks.database.status).toBe('up');
    expect(result.checks.schemaMigrations.status).toBe('up');
    expect(result.checks.usersTableSchema.status).toBe('up');
    expect(result.checks.reservationsTableSchema.status).toBe('up');
    expect(result.checks.redis.status).toBe('up');
  });

  it('marks readiness as not_ready when a required migration is missing', async () => {
    databaseServiceMock.query
      .mockResolvedValueOnce({ rows: [{ ok: 1 }] })
      .mockResolvedValueOnce({ rows: [{ exists: true }] })
      .mockResolvedValueOnce({
        rows: [{ filename: '001_init_tables.sql' }],
      })
      .mockResolvedValueOnce({
        rows: [
          { column_name: 'password_hash', is_nullable: 'YES' },
          { column_name: 'firebase_uid', is_nullable: 'YES' },
        ],
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
      });
    redisServiceMock.connect.mockResolvedValue(undefined);
    redisClientMock.ping.mockResolvedValue('PONG');

    const result = await service.getReadiness();

    expect(result.status).toBe('not_ready');
    expect(result.checks.schemaMigrations.status).toBe('down');
    expect(result.checks.schemaMigrations.message).toContain(
      '002_add_customer_google_auth.sql',
    );
  });

  it('marks readiness as not_ready when the reservation schema is outdated', async () => {
    databaseServiceMock.query
      .mockResolvedValueOnce({ rows: [{ ok: 1 }] })
      .mockResolvedValueOnce({ rows: [{ exists: true }] })
      .mockResolvedValueOnce({
        rows: [
          { filename: '001_init_tables.sql' },
          { filename: '002_add_customer_google_auth.sql' },
          { filename: '003_rework_reservation_schema.sql' },
        ],
      })
      .mockResolvedValueOnce({
        rows: [
          { column_name: 'password_hash', is_nullable: 'YES' },
          { column_name: 'firebase_uid', is_nullable: 'YES' },
        ],
      })
      .mockResolvedValueOnce({
        rows: [
          { column_name: 'cancelled_at', is_nullable: 'YES' },
          { column_name: 'status_changed_at', is_nullable: 'YES' },
          { column_name: 'status_changed_by_user_id', is_nullable: 'YES' },
        ],
      });
    redisServiceMock.connect.mockResolvedValue(undefined);
    redisClientMock.ping.mockResolvedValue('PONG');

    const result = await service.getReadiness();

    expect(result.status).toBe('not_ready');
    expect(result.checks.reservationsTableSchema.status).toBe('down');
    expect(result.checks.reservationsTableSchema.message).toContain(
      'cancelled_by_user_id',
    );
  });

  it('skips schema checks when PostgreSQL is unavailable', async () => {
    databaseServiceMock.query.mockRejectedValue(new Error('connect ECONNREFUSED'));
    redisServiceMock.connect.mockResolvedValue(undefined);
    redisClientMock.ping.mockResolvedValue('PONG');

    const result = await service.getReadiness();

    expect(result.status).toBe('not_ready');
    expect(result.checks.database.status).toBe('down');
    expect(result.checks.schemaMigrations.message).toContain(
      'Skipped because PostgreSQL is unavailable.',
    );
    expect(result.checks.usersTableSchema.message).toContain(
      'Skipped because PostgreSQL is unavailable.',
    );
    expect(result.checks.reservationsTableSchema.message).toContain(
      'Skipped because PostgreSQL is unavailable.',
    );
  });

  it('throws on startup readiness assertion when dependencies are down', async () => {
    databaseServiceMock.query.mockRejectedValue(new Error('connect ECONNREFUSED'));
    redisServiceMock.connect.mockResolvedValue(undefined);
    redisClientMock.ping.mockResolvedValue('PONG');

    await expect(service.assertReadyForStartup()).rejects.toThrow(
      'Startup validation failed: database:',
    );
  });
});
