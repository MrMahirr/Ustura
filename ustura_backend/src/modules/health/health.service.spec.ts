import { DatabaseService } from '../../database/database.service';
import { RedisService } from '../../redis/redis.service';
import { HealthService } from './health.service';

type DatabaseServiceMock = {
  query: jest.MockedFunction<(query: unknown) => Promise<{ rows: unknown[] }>>;
};

type RedisClientMock = {
  ping: jest.MockedFunction<() => Promise<string>>;
};

type RedisServiceMock = {
  connect: jest.MockedFunction<() => Promise<void>>;
  getClient: jest.MockedFunction<() => RedisClientMock>;
  isUsingMemoryFallback: jest.MockedFunction<() => boolean>;
};

function createDatabaseServiceMock(): DatabaseServiceMock {
  return {
    query: jest.fn<(query: unknown) => Promise<{ rows: unknown[] }>>(),
  };
}

function createRedisClientMock(): RedisClientMock {
  return {
    ping: jest.fn<() => Promise<string>>(),
  };
}

function createRedisServiceMock(client: RedisClientMock): RedisServiceMock {
  return {
    connect: jest.fn<() => Promise<void>>(),
    getClient: jest.fn<() => RedisClientMock>().mockReturnValue(client),
    isUsingMemoryFallback: jest.fn<() => boolean>().mockReturnValue(false),
  };
}

const ALL_MIGRATION_ROWS = [
  '001_init_tables.sql',
  '002_add_customer_google_auth.sql',
  '003_rework_reservation_schema.sql',
  '004_create_owner_applications.sql',
  '005_create_audit_logs.sql',
  '006_harden_refresh_tokens.sql',
  '007_enforce_user_phone_uniqueness.sql',
  '008_seed_default_super_admin.sql',
  '009_create_packages_schema.sql',
  '010_seed_test_staff_accounts.sql',
  '011_create_notifications.sql',
  '012_split_identity_tables.sql',
  '013_seed_demo_identity.sql',
  '014_ensure_packages_tier_label.sql',
  '015_ensure_salons_is_active.sql',
  '016_owner_applications_review_state_allow_null_salon.sql',
  '017_personnel_must_change_password.sql',
  '018_fix_seed_uuid_format.sql',
  '019_add_salon_gallery_urls.sql',
  '020_create_salon_services.sql',
].map((filename) => ({ filename }));

const IDENTITY_HEALTHY_SEQUENCE: unknown[] = [
  {
    rows: [
      { column_name: 'password_hash', is_nullable: 'YES' },
      { column_name: 'firebase_uid', is_nullable: 'YES' },
    ],
  },
  { rows: [{ indexname: 'uq_customers_lower_email' }] },
  {
    rows: [
      { column_name: 'password_hash', is_nullable: 'YES' },
      { column_name: 'role', is_nullable: 'NO' },
      { column_name: 'must_change_password', is_nullable: 'NO' },
    ],
  },
  { rows: [{ indexname: 'uq_personnel_lower_email' }] },
  {
    rows: [{ column_name: 'password_hash', is_nullable: 'NO' }],
  },
  { rows: [{ indexname: 'uq_platform_admins_lower_email' }] },
];

const RESERVATION_HEALTHY_SEQUENCE: unknown[] = [
  {
    rows: [
      { column_name: 'cancelled_at', is_nullable: 'YES' },
      { column_name: 'cancelled_by_user_id', is_nullable: 'YES' },
      { column_name: 'status_changed_at', is_nullable: 'YES' },
      { column_name: 'status_changed_by_user_id', is_nullable: 'YES' },
    ],
  },
  {
    rows: [
      { constraint_name: 'chk_reservations_status_lifecycle' },
      { constraint_name: 'chk_reservations_slot_duration' },
    ],
  },
  { rows: [{ indexname: 'uq_reservations_active_staff_slot' }] },
];

const REFRESH_TOKEN_HEALTHY_SEQUENCE: unknown[] = [
  {
    rows: [
      { column_name: 'principal_id', is_nullable: 'NO' },
      { column_name: 'principal_kind', is_nullable: 'NO' },
      { column_name: 'revoked_at', is_nullable: 'YES' },
      { column_name: 'user_agent', is_nullable: 'YES' },
      { column_name: 'ip_address', is_nullable: 'YES' },
      { column_name: 'rotated_from', is_nullable: 'YES' },
    ],
  },
  { rows: [{ indexname: 'idx_refresh_tokens_principal' }] },
];

function chainReadinessMocks(
  mock: jest.Mock,
  options: {
    migrations?: { filename: string }[];
    identity?: unknown[];
    reservations?: unknown[];
    refreshTokens?: unknown[];
  } = {},
) {
  const migrations = options.migrations ?? ALL_MIGRATION_ROWS;
  const identity = options.identity ?? IDENTITY_HEALTHY_SEQUENCE;
  const reservations = options.reservations ?? RESERVATION_HEALTHY_SEQUENCE;
  const refreshTokens = options.refreshTokens ?? REFRESH_TOKEN_HEALTHY_SEQUENCE;

  mock
    .mockResolvedValueOnce({ rows: [{ ok: 1 }] })
    .mockResolvedValueOnce({ rows: [{ exists: true }] })
    .mockResolvedValueOnce({ rows: migrations });

  for (const row of identity) {
    mock.mockResolvedValueOnce(row);
  }
  for (const row of reservations) {
    mock.mockResolvedValueOnce(row);
  }
  for (const row of refreshTokens) {
    mock.mockResolvedValueOnce(row);
  }
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
    chainReadinessMocks(databaseServiceMock.query);
    redisServiceMock.connect.mockResolvedValue(undefined);
    redisClientMock.ping.mockResolvedValue('PONG');

    const result = await service.getReadiness();

    expect(result.status).toBe('ready');
    expect(result.checks.database.status).toBe('up');
    expect(result.checks.schemaMigrations.status).toBe('up');
    expect(result.checks.usersTableSchema.status).toBe('up');
    expect(result.checks.reservationsTableSchema.status).toBe('up');
    expect(result.checks.refreshTokensTableSchema.status).toBe('up');
    expect(result.checks.redis.status).toBe('up');
  });

  it('marks readiness as not_ready when a required migration is missing', async () => {
    chainReadinessMocks(databaseServiceMock.query, {
      migrations: [{ filename: '001_init_tables.sql' }],
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
    chainReadinessMocks(databaseServiceMock.query, {
      reservations: [
        {
          rows: [
            { column_name: 'cancelled_at', is_nullable: 'YES' },
            { column_name: 'status_changed_at', is_nullable: 'YES' },
            { column_name: 'status_changed_by_user_id', is_nullable: 'YES' },
          ],
        },
        ...RESERVATION_HEALTHY_SEQUENCE.slice(1),
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

  it('marks readiness as not_ready when the refresh token schema is outdated', async () => {
    chainReadinessMocks(databaseServiceMock.query, {
      refreshTokens: [
        {
          rows: [
            { column_name: 'revoked_at', is_nullable: 'YES' },
            { column_name: 'user_agent', is_nullable: 'YES' },
            { column_name: 'rotated_from', is_nullable: 'YES' },
          ],
        },
        REFRESH_TOKEN_HEALTHY_SEQUENCE[1],
      ],
    });
    redisServiceMock.connect.mockResolvedValue(undefined);
    redisClientMock.ping.mockResolvedValue('PONG');

    const result = await service.getReadiness();

    expect(result.status).toBe('not_ready');
    expect(result.checks.refreshTokensTableSchema.status).toBe('down');
    expect(result.checks.refreshTokensTableSchema.message).toContain(
      'ip_address',
    );
  });

  it('skips schema checks when PostgreSQL is unavailable', async () => {
    databaseServiceMock.query.mockRejectedValue(
      new Error('connect ECONNREFUSED'),
    );
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
    expect(result.checks.refreshTokensTableSchema.message).toContain(
      'Skipped because PostgreSQL is unavailable.',
    );
  });

  it('throws on startup readiness assertion when dependencies are down', async () => {
    databaseServiceMock.query.mockRejectedValue(
      new Error('connect ECONNREFUSED'),
    );
    redisServiceMock.connect.mockResolvedValue(undefined);
    redisClientMock.ping.mockResolvedValue('PONG');

    await expect(service.assertReadyForStartup()).rejects.toThrow(
      'Startup validation failed: database:',
    );
  });

  it('marks readiness as not_ready when customers table is missing the email uniqueness index', async () => {
    const identityWithMissingCustomerEmailIndex = [
      IDENTITY_HEALTHY_SEQUENCE[0],
      { rows: [] },
      ...IDENTITY_HEALTHY_SEQUENCE.slice(2),
    ];
    chainReadinessMocks(databaseServiceMock.query, {
      identity: identityWithMissingCustomerEmailIndex,
    });
    redisServiceMock.connect.mockResolvedValue(undefined);
    redisClientMock.ping.mockResolvedValue('PONG');

    const result = await service.getReadiness();

    expect(result.status).toBe('not_ready');
    expect(result.checks.usersTableSchema.status).toBe('down');
    expect(result.checks.usersTableSchema.message).toContain(
      'uq_customers_lower_email',
    );
  });
});
