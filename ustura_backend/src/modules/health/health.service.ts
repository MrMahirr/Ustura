import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { RedisService } from '../../redis/redis.service';
import type {
  HealthCheckResult,
  LivenessReport,
  ReadinessReport,
} from './interfaces/health.types';

const REQUIRED_MIGRATIONS = [
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
] as const;

const REQUIRED_IDENTITY_TABLES = [
  {
    table: 'customers',
    columns: [
      { name: 'password_hash', isNullable: 'YES' as const },
      { name: 'firebase_uid', isNullable: 'YES' as const },
    ],
    indexes: ['uq_customers_lower_email'],
  },
  {
    table: 'personnel',
    columns: [
      { name: 'password_hash', isNullable: 'YES' as const },
      { name: 'role', isNullable: 'NO' as const },
      { name: 'must_change_password', isNullable: 'NO' as const },
    ],
    indexes: ['uq_personnel_lower_email'],
  },
  {
    table: 'platform_admins',
    columns: [{ name: 'password_hash', isNullable: 'NO' as const }],
    indexes: ['uq_platform_admins_lower_email'],
  },
] as const;

const REQUIRED_RESERVATION_COLUMNS = [
  {
    name: 'cancelled_at',
    isNullable: 'YES',
  },
  {
    name: 'cancelled_by_user_id',
    isNullable: 'YES',
  },
  {
    name: 'status_changed_at',
    isNullable: 'YES',
  },
  {
    name: 'status_changed_by_user_id',
    isNullable: 'YES',
  },
] as const;

const REQUIRED_RESERVATION_CONSTRAINTS = [
  'chk_reservations_status_lifecycle',
  'chk_reservations_slot_duration',
] as const;

const REQUIRED_RESERVATION_INDEXES = [
  'uq_reservations_active_staff_slot',
] as const;

const DATABASE_UNAVAILABLE_CHECKS = {
  schemaMigrations: {
    status: 'down',
    message: 'Skipped because PostgreSQL is unavailable.',
  },
  usersTableSchema: {
    status: 'down',
    message: 'Skipped because PostgreSQL is unavailable.',
  },
  reservationsTableSchema: {
    status: 'down',
    message: 'Skipped because PostgreSQL is unavailable.',
  },
  refreshTokensTableSchema: {
    status: 'down',
    message: 'Skipped because PostgreSQL is unavailable.',
  },
} as const satisfies Pick<
  ReadinessReport['checks'],
  | 'schemaMigrations'
  | 'usersTableSchema'
  | 'reservationsTableSchema'
  | 'refreshTokensTableSchema'
>;

const REQUIRED_REFRESH_TOKEN_COLUMNS = [
  {
    name: 'principal_id',
    isNullable: 'NO',
  },
  {
    name: 'principal_kind',
    isNullable: 'NO',
  },
  {
    name: 'revoked_at',
    isNullable: 'YES',
  },
  {
    name: 'user_agent',
    isNullable: 'YES',
  },
  {
    name: 'ip_address',
    isNullable: 'YES',
  },
  {
    name: 'rotated_from',
    isNullable: 'YES',
  },
] as const;

const REQUIRED_REFRESH_TOKEN_INDEXES = [
  'idx_refresh_tokens_principal',
] as const;

@Injectable()
export class HealthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly redisService: RedisService,
  ) {}

  getLiveness(): LivenessReport {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  async getReadiness(): Promise<ReadinessReport> {
    const database = await this.checkDatabaseConnectivity();
    const schemaMigrations =
      database.status === 'up'
        ? await this.checkRequiredMigrations()
        : DATABASE_UNAVAILABLE_CHECKS.schemaMigrations;
    const usersTableSchema =
      database.status === 'up'
        ? await this.checkUsersTableSchema()
        : DATABASE_UNAVAILABLE_CHECKS.usersTableSchema;
    const reservationsTableSchema =
      database.status === 'up'
        ? await this.checkReservationsTableSchema()
        : DATABASE_UNAVAILABLE_CHECKS.reservationsTableSchema;
    const refreshTokensTableSchema =
      database.status === 'up'
        ? await this.checkRefreshTokensTableSchema()
        : DATABASE_UNAVAILABLE_CHECKS.refreshTokensTableSchema;
    const redis = await this.checkRedisConnectivity();

    return {
      status:
        [
          database,
          schemaMigrations,
          usersTableSchema,
          reservationsTableSchema,
          refreshTokensTableSchema,
          redis,
        ].every(
          (check) => check.status === 'up',
        )
          ? 'ready'
          : 'not_ready',
      timestamp: new Date().toISOString(),
      checks: {
        database,
        schemaMigrations,
        usersTableSchema,
        reservationsTableSchema,
        refreshTokensTableSchema,
        redis,
      },
    };
  }

  async assertReadyForStartup(): Promise<void> {
    const report = await this.getReadiness();

    if (report.status === 'ready') {
      return;
    }

    const failedChecks = Object.entries(report.checks)
      .filter(([, check]) => check.status === 'down')
      .map(([name, check]) => `${name}: ${check.message}`);

    throw new Error(
      `Startup validation failed: ${failedChecks.join(' | ')}`,
    );
  }

  private async checkDatabaseConnectivity(): Promise<HealthCheckResult> {
    try {
      await this.databaseService.query({
        name: 'health.database.select-one',
        text: 'SELECT 1 AS ok',
      });

      return {
        status: 'up',
        message: 'PostgreSQL connection is healthy.',
      };
    } catch (error) {
      return {
        status: 'down',
        message: this.appendCause(
          'PostgreSQL connection failed. Check DB_HOST, DB_PORT, DB_NAME, DB_USER and DB_PASSWORD.',
          error,
        ),
      };
    }
  }

  private async checkRequiredMigrations(): Promise<HealthCheckResult> {
    try {
      const schemaMigrationsTable = await this.databaseService.query<{
        exists: boolean;
      }>({
        name: 'health.schema-migrations-table',
        text: `
          SELECT EXISTS (
            SELECT 1
            FROM information_schema.tables
            WHERE table_schema = 'public'
              AND table_name = 'schema_migrations'
          ) AS exists
        `,
      });

      if (schemaMigrationsTable.rows[0]?.exists !== true) {
        return {
          status: 'down',
          message:
            'Database is missing schema_migrations. Run `npm run migrate` against the configured database.',
        };
      }

      const appliedMigrations = await this.databaseService.query<{
        filename: string;
      }>({
        name: 'health.applied-migrations',
        text: `
          SELECT filename
          FROM schema_migrations
          ORDER BY filename ASC
        `,
      });
      const appliedMigrationNames = appliedMigrations.rows.map(
        (row) => row.filename,
      );
      const missingMigrations = REQUIRED_MIGRATIONS.filter((migration) => {
        return !appliedMigrationNames.includes(migration);
      });

      if (missingMigrations.length > 0) {
        return {
          status: 'down',
          message: `Required schema migrations are missing: ${missingMigrations.join(', ')}. Run \`npm run migrate\`.`,
        };
      }

      return {
        status: 'up',
        message: 'Required schema migrations are applied.',
      };
    } catch (error) {
      return {
        status: 'down',
        message: this.appendCause(
          'Unable to inspect schema migrations. Check the configured PostgreSQL database.',
          error,
        ),
      };
    }
  }

  private async checkUsersTableSchema(): Promise<HealthCheckResult> {
    try {
      for (const spec of REQUIRED_IDENTITY_TABLES) {
        const result = await this.databaseService.query<InformationSchemaColumnRow>({
          name: `health.identity-table-columns-${spec.table}`,
          text: `
            SELECT
              column_name,
              is_nullable
            FROM information_schema.columns
            WHERE table_schema = 'public'
              AND table_name = $1
              AND column_name = ANY($2::text[])
          `,
          values: [spec.table, spec.columns.map((column) => column.name)],
        });
        const columnsByName = new Map(
          result.rows.map((row) => [row.column_name, row.is_nullable]),
        );
        const missingColumns = spec.columns
          .filter((column) => !columnsByName.has(column.name))
          .map((column) => column.name);

        if (missingColumns.length > 0) {
          return {
            status: 'down',
            message: `Table "${spec.table}" is missing required column(s): ${missingColumns.join(', ')}. Run \`npm run migrate\`.`,
          };
        }

        const invalidNullability = spec.columns
          .filter((column) => columnsByName.get(column.name) !== column.isNullable)
          .map((column) => `${spec.table}.${column.name} nullability mismatch`);

        if (invalidNullability.length > 0) {
          return {
            status: 'down',
            message: `Identity schema is outdated: ${invalidNullability.join(', ')}. Run \`npm run migrate\`.`,
          };
        }

        const indexesResult = await this.databaseService.query<PgIndexRow>({
          name: `health.identity-table-indexes-${spec.table}`,
          text: `
            SELECT indexname
            FROM pg_indexes
            WHERE schemaname = 'public'
              AND tablename = $1
          `,
          values: [spec.table],
        });
        const indexNames = new Set(indexesResult.rows.map((row) => row.indexname));
        const missingIndexes = spec.indexes.filter(
          (indexName) => !indexNames.has(indexName),
        );

        if (missingIndexes.length > 0) {
          return {
            status: 'down',
            message: `Table "${spec.table}" is missing required index(es): ${missingIndexes.join(', ')}. Run \`npm run migrate\`.`,
          };
        }
      }

      return {
        status: 'up',
        message: 'Identity tables (customers, personnel, platform_admins) are up to date.',
      };
    } catch (error) {
      return {
        status: 'down',
        message: this.appendCause(
          'Unable to inspect identity table schemas. Check the configured PostgreSQL database.',
          error,
        ),
      };
    }
  }

  private async checkReservationsTableSchema(): Promise<HealthCheckResult> {
    try {
      const columnsResult =
        await this.databaseService.query<InformationSchemaColumnRow>({
          name: 'health.reservations-table-columns',
          text: `
            SELECT
              column_name,
              is_nullable
            FROM information_schema.columns
            WHERE table_schema = 'public'
              AND table_name = 'reservations'
              AND column_name = ANY($1::text[])
          `,
          values: [REQUIRED_RESERVATION_COLUMNS.map((column) => column.name)],
        });
      const columnsByName = new Map(
        columnsResult.rows.map((row) => [row.column_name, row.is_nullable]),
      );
      const missingColumns = REQUIRED_RESERVATION_COLUMNS.filter((column) => {
        return !columnsByName.has(column.name);
      }).map((column) => column.name);

      if (missingColumns.length > 0) {
        return {
          status: 'down',
          message: `Reservations table is missing required column(s): ${missingColumns.join(', ')}. Run \`npm run migrate\`.`,
        };
      }

      const invalidNullability = REQUIRED_RESERVATION_COLUMNS.filter((column) => {
        return columnsByName.get(column.name) !== column.isNullable;
      }).map((column) => `${column.name} should be nullable`);

      if (invalidNullability.length > 0) {
        return {
          status: 'down',
          message: `Reservations table schema is outdated: ${invalidNullability.join(', ')}. Run \`npm run migrate\`.`,
        };
      }

      const constraintsResult =
        await this.databaseService.query<InformationSchemaConstraintRow>({
          name: 'health.reservations-table-constraints',
          text: `
            SELECT constraint_name
            FROM information_schema.table_constraints
            WHERE table_schema = 'public'
              AND table_name = 'reservations'
          `,
        });
      const constraintNames = new Set(
        constraintsResult.rows.map((row) => row.constraint_name),
      );
      const missingConstraints = REQUIRED_RESERVATION_CONSTRAINTS.filter(
        (constraintName) => !constraintNames.has(constraintName),
      );

      if (missingConstraints.length > 0) {
        return {
          status: 'down',
          message: `Reservations table is missing required constraint(s): ${missingConstraints.join(', ')}. Run \`npm run migrate\`.`,
        };
      }

      if (constraintNames.has('uq_reservation_staff_slot')) {
        return {
          status: 'down',
          message:
            'Reservations table still exposes the legacy slot uniqueness constraint. Run `npm run migrate`.',
        };
      }

      const indexesResult = await this.databaseService.query<PgIndexRow>({
        name: 'health.reservations-table-indexes',
        text: `
          SELECT indexname
          FROM pg_indexes
          WHERE schemaname = 'public'
            AND tablename = 'reservations'
        `,
      });
      const indexNames = new Set(indexesResult.rows.map((row) => row.indexname));
      const missingIndexes = REQUIRED_RESERVATION_INDEXES.filter(
        (indexName) => !indexNames.has(indexName),
      );

      if (missingIndexes.length > 0) {
        return {
          status: 'down',
          message: `Reservations table is missing required index(es): ${missingIndexes.join(', ')}. Run \`npm run migrate\`.`,
        };
      }

      return {
        status: 'up',
        message: 'Reservations table schema is up to date.',
      };
    } catch (error) {
      return {
        status: 'down',
        message: this.appendCause(
          'Unable to inspect the reservations table schema. Check the configured PostgreSQL database.',
          error,
        ),
      };
    }
  }

  private async checkRedisConnectivity(): Promise<HealthCheckResult> {
    try {
      await this.redisService.connect();
      const response = await this.redisService.getClient().ping();

      if (response !== 'PONG') {
        return {
          status: 'down',
          message: `Unexpected Redis ping response: ${response}`,
        };
      }

      return {
        status: 'up',
        message: this.redisService.isUsingMemoryFallback()
          ? 'Redis is unavailable; using the in-memory development fallback.'
          : 'Redis connection is healthy.',
      };
    } catch (error) {
      return {
        status: 'down',
        message: this.appendCause(
          'Redis connection failed. Check REDIS_HOST, REDIS_PORT and REDIS_PASSWORD.',
          error,
        ),
      };
    }
  }

  private async checkRefreshTokensTableSchema(): Promise<HealthCheckResult> {
    try {
      const result = await this.databaseService.query<InformationSchemaColumnRow>({
        name: 'health.refresh-tokens-table-columns',
        text: `
          SELECT
            column_name,
            is_nullable
          FROM information_schema.columns
          WHERE table_schema = 'public'
            AND table_name = 'refresh_tokens'
            AND column_name = ANY($1::text[])
        `,
        values: [REQUIRED_REFRESH_TOKEN_COLUMNS.map((column) => column.name)],
      });
      const columnsByName = new Map(
        result.rows.map((row) => [row.column_name, row.is_nullable]),
      );
      const missingColumns = REQUIRED_REFRESH_TOKEN_COLUMNS.filter((column) => {
        return !columnsByName.has(column.name);
      }).map((column) => column.name);

      if (missingColumns.length > 0) {
        return {
          status: 'down',
          message: `Refresh tokens table is missing required column(s): ${missingColumns.join(', ')}. Run \`npm run migrate\`.`,
        };
      }

      const invalidNullability = REQUIRED_REFRESH_TOKEN_COLUMNS.filter((column) => {
        return columnsByName.get(column.name) !== column.isNullable;
      }).map((column) => `${column.name} nullability mismatch`);

      if (invalidNullability.length > 0) {
        return {
          status: 'down',
          message: `Refresh tokens table schema is outdated: ${invalidNullability.join(', ')}. Run \`npm run migrate\`.`,
        };
      }

      const indexesResult = await this.databaseService.query<PgIndexRow>({
        name: 'health.refresh-tokens-table-indexes',
        text: `
          SELECT indexname
          FROM pg_indexes
          WHERE schemaname = 'public'
            AND tablename = 'refresh_tokens'
        `,
      });
      const indexNames = new Set(indexesResult.rows.map((row) => row.indexname));
      const missingIndexes = REQUIRED_REFRESH_TOKEN_INDEXES.filter(
        (indexName) => !indexNames.has(indexName),
      );

      if (missingIndexes.length > 0) {
        return {
          status: 'down',
          message: `Refresh tokens table is missing required index(es): ${missingIndexes.join(', ')}. Run \`npm run migrate\`.`,
        };
      }

      return {
        status: 'up',
        message: 'Refresh tokens table schema is up to date.',
      };
    } catch (error) {
      return {
        status: 'down',
        message: this.appendCause(
          'Unable to inspect the refresh_tokens table schema. Check the configured PostgreSQL database.',
          error,
        ),
      };
    }
  }

  private appendCause(message: string, cause: unknown): string {
    if (cause instanceof Error && cause.message.trim()) {
      return `${message} ${cause.message}`;
    }

    if (cause) {
      return `${message} ${String(cause)}`;
    }

    return message;
  }
}

interface InformationSchemaColumnRow {
  column_name: string;
  is_nullable: 'YES' | 'NO';
}

interface InformationSchemaConstraintRow {
  constraint_name: string;
}

interface PgIndexRow {
  indexname: string;
}
