import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Pool, PoolClient, QueryConfig, QueryResult, QueryResultRow } from 'pg';
import { AppConfigService } from '../config/config.service';
import { DatabaseConfig } from '../config/config.types';
import {
  DatabaseConnectionError,
  DatabaseConstraintViolationError,
  DatabaseError,
  DatabaseQueryError,
  DatabaseTransactionError,
} from './database.errors';
import { DatabaseTransaction, SqlQuery } from './database.types';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);
  private pool?: Pool;

  constructor(private readonly configService: AppConfigService) {}

  get connectionConfig(): DatabaseConfig {
    return this.configService.database;
  }

  onModuleInit(): void {
    this.ensurePool();
  }

  async onModuleDestroy(): Promise<void> {
    if (!this.pool) {
      return;
    }

    await this.pool.end();
    this.pool = undefined;
  }

  async query<T extends QueryResultRow = QueryResultRow>(
    query: SqlQuery | string,
    values: readonly unknown[] = [],
  ): Promise<QueryResult<T>> {
    const pool = this.ensurePool();
    const queryConfig = this.toQueryConfig(query, values);

    try {
      return await pool.query<T>(queryConfig);
    } catch (error) {
      throw this.translateError(error, queryConfig);
    }
  }

  async transaction<T>(
    operation: (transaction: DatabaseTransaction) => Promise<T>,
  ): Promise<T> {
    const client = await this.acquireClient();
    const transaction = this.createTransaction(client);

    try {
      await client.query('BEGIN');
      const result = await operation(transaction);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      const normalizedError = this.normalizeTransactionError(error);

      try {
        await client.query('ROLLBACK');
      } catch (rollbackError) {
        throw new DatabaseTransactionError(
          'Database transaction failed and rollback was unsuccessful.',
          {
            cause: this.asError(rollbackError),
          },
        );
      }

      throw normalizedError;
    } finally {
      client.release();
    }
  }

  private ensurePool(): Pool {
    if (this.pool) {
      return this.pool;
    }

    this.pool = new Pool({
      host: this.connectionConfig.host,
      port: this.connectionConfig.port,
      database: this.connectionConfig.database,
      user: this.connectionConfig.user,
      password: this.connectionConfig.password,
      min: this.connectionConfig.poolMin,
      max: this.connectionConfig.poolMax,
      connectionTimeoutMillis: this.connectionConfig.connectionTimeoutMs,
      idleTimeoutMillis: this.connectionConfig.idleTimeoutMs,
    });

    this.pool.on('error', (error: Error) => {
      this.logger.error('Unexpected PostgreSQL pool error.', error.stack);
    });

    return this.pool;
  }

  private async acquireClient(): Promise<PoolClient> {
    try {
      return await this.ensurePool().connect();
    } catch (error) {
      throw this.translateConnectionError(error);
    }
  }

  private createTransaction(client: PoolClient): DatabaseTransaction {
    return {
      query: async <T extends QueryResultRow = QueryResultRow>(
        query: SqlQuery | string,
        values: readonly unknown[] = [],
      ) => {
        const queryConfig = this.toQueryConfig(query, values);

        try {
          return await client.query<T>(queryConfig);
        } catch (error) {
          throw this.translateError(error, queryConfig);
        }
      },
    };
  }

  private toQueryConfig(
    query: SqlQuery | string,
    values: readonly unknown[] = [],
  ): QueryConfig<unknown[]> {
    if (typeof query === 'string') {
      return {
        text: query,
        values: [...values] as unknown[],
      };
    }

    return {
      text: query.text,
      values: [...(query.values ?? [])] as unknown[],
      ...(query.name ? { name: query.name } : {}),
    };
  }

  private normalizeTransactionError(error: unknown): Error {
    if (error instanceof DatabaseError) {
      return error;
    }

    if (this.isPgError(error)) {
      return this.translateError(error);
    }

    return this.asError(error);
  }

  private translateConnectionError(error: unknown): DatabaseConnectionError {
    const normalizedError = this.asError(error);

    return new DatabaseConnectionError(
      'Unable to acquire a PostgreSQL connection.',
      {
        cause: normalizedError,
        code: this.getPgCode(error),
        detail: this.getPgDetail(error),
      },
    );
  }

  private translateError(
    error: unknown,
    query?: QueryConfig<unknown[]>,
  ): DatabaseError {
    const normalizedError = this.asError(error);
    const code = this.getPgCode(error);
    const metadata = {
      cause: normalizedError,
      code,
      constraint: this.getPgConstraint(error),
      detail: this.getPgDetail(error),
      queryName: query?.name,
      queryText: query?.text,
    };

    if (code === '23505' || code === '23503' || code === '23514') {
      return new DatabaseConstraintViolationError(
        'Database constraint violation detected.',
        metadata,
      );
    }

    if (
      code === '08000' ||
      code === '08003' ||
      code === '08006' ||
      code === '57P01' ||
      code === '53300'
    ) {
      return new DatabaseConnectionError(
        'PostgreSQL connection error.',
        metadata,
      );
    }

    return new DatabaseQueryError(
      'PostgreSQL query execution failed.',
      metadata,
    );
  }

  private isPgError(error: unknown): error is Error & {
    code: string;
    constraint?: string;
    detail?: string;
  } {
    return typeof this.getPgCode(error) === 'string';
  }

  private getPgCode(error: unknown): string | undefined {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      typeof error.code === 'string'
    ) {
      return error.code;
    }

    return undefined;
  }

  private getPgConstraint(error: unknown): string | undefined {
    if (
      typeof error === 'object' &&
      error !== null &&
      'constraint' in error &&
      typeof error.constraint === 'string'
    ) {
      return error.constraint;
    }

    return undefined;
  }

  private getPgDetail(error: unknown): string | undefined {
    if (
      typeof error === 'object' &&
      error !== null &&
      'detail' in error &&
      typeof error.detail === 'string'
    ) {
      return error.detail;
    }

    return undefined;
  }

  private asError(error: unknown): Error {
    if (error instanceof Error) {
      return error;
    }

    return new Error(String(error));
  }
}
