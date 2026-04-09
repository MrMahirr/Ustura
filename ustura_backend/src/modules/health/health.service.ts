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
] as const;

const REQUIRED_USER_COLUMNS = [
  {
    name: 'password_hash',
    isNullable: 'YES',
  },
  {
    name: 'firebase_uid',
    isNullable: 'YES',
  },
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
} as const satisfies Pick<ReadinessReport['checks'], 'schemaMigrations' | 'usersTableSchema'>;

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
    const redis = await this.checkRedisConnectivity();

    return {
      status:
        [database, schemaMigrations, usersTableSchema, redis].every(
          (check) => check.status === 'up',
        )
          ? 'ready'
          : 'not_ready',
      timestamp: new Date().toISOString(),
      checks: {
        database,
        schemaMigrations,
        usersTableSchema,
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
      const result = await this.databaseService.query<UserColumnRow>({
        name: 'health.users-table-columns',
        text: `
          SELECT
            column_name,
            is_nullable
          FROM information_schema.columns
          WHERE table_schema = 'public'
            AND table_name = 'users'
            AND column_name = ANY($1::text[])
        `,
        values: [REQUIRED_USER_COLUMNS.map((column) => column.name)],
      });
      const columnsByName = new Map(
        result.rows.map((row) => [row.column_name, row.is_nullable]),
      );
      const missingColumns = REQUIRED_USER_COLUMNS.filter((column) => {
        return !columnsByName.has(column.name);
      }).map((column) => column.name);

      if (missingColumns.length > 0) {
        return {
          status: 'down',
          message: `Users table is missing required column(s): ${missingColumns.join(', ')}. Run \`npm run migrate\`.`,
        };
      }

      const invalidNullability = REQUIRED_USER_COLUMNS.filter((column) => {
        return columnsByName.get(column.name) !== column.isNullable;
      }).map((column) => `${column.name} should be nullable`);

      if (invalidNullability.length > 0) {
        return {
          status: 'down',
          message: `Users table schema is outdated: ${invalidNullability.join(', ')}. Run \`npm run migrate\`.`,
        };
      }

      return {
        status: 'up',
        message: 'Users table schema is up to date.',
      };
    } catch (error) {
      return {
        status: 'down',
        message: this.appendCause(
          'Unable to inspect the users table schema. Check the configured PostgreSQL database.',
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
        message: 'Redis connection is healthy.',
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

interface UserColumnRow {
  column_name: string;
  is_nullable: 'YES' | 'NO';
}
