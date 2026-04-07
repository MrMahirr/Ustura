import { Pool } from 'pg';
import { AppConfigService } from '../config/config.service';
import {
  DatabaseConstraintViolationError,
  DatabaseTransactionError,
} from './database.errors';
import { DatabaseService } from './database.service';

type MockPool = {
  query: jest.Mock;
  connect: jest.Mock;
  end: jest.Mock;
  on: jest.Mock;
};

type MockPoolClient = {
  query: jest.Mock;
  release: jest.Mock;
};

let poolMock: MockPool;

jest.mock('pg', () => ({
  Pool: jest.fn().mockImplementation(() => poolMock),
}));

function createPoolMock(): MockPool {
  return {
    query: jest.fn(),
    connect: jest.fn(),
    end: jest.fn().mockResolvedValue(undefined),
    on: jest.fn(),
  };
}

function createPoolClientMock(): MockPoolClient {
  return {
    query: jest.fn(),
    release: jest.fn(),
  };
}

describe('DatabaseService', () => {
  let service: DatabaseService;

  beforeEach(() => {
    poolMock = createPoolMock();

    service = new DatabaseService({
      database: {
        host: 'localhost',
        port: 5432,
        database: 'ustura',
        user: 'postgres',
        password: '',
        poolMin: 2,
        poolMax: 10,
        connectionTimeoutMs: 5000,
        idleTimeoutMs: 30000,
      },
    } as AppConfigService);
  });

  afterEach(async () => {
    await service.onModuleDestroy();
    jest.clearAllMocks();
  });

  it('executes a typed query through the pool', async () => {
    poolMock.query.mockResolvedValue({
      rows: [{ id: 'user-1' }],
      rowCount: 1,
    });

    const result = await service.query<{ id: string }>({
      name: 'find-user-by-id',
      text: 'SELECT id FROM users WHERE id = $1',
      values: ['user-1'],
    });

    expect(Pool).toHaveBeenCalledWith({
      host: 'localhost',
      port: 5432,
      database: 'ustura',
      user: 'postgres',
      password: '',
      min: 2,
      max: 10,
      connectionTimeoutMillis: 5000,
      idleTimeoutMillis: 30000,
    });
    expect(poolMock.query).toHaveBeenCalledWith({
      name: 'find-user-by-id',
      text: 'SELECT id FROM users WHERE id = $1',
      values: ['user-1'],
    });
    expect(result.rows).toEqual([{ id: 'user-1' }]);
  });

  it('wraps a successful transaction with begin and commit', async () => {
    const clientMock = createPoolClientMock();
    poolMock.connect.mockResolvedValue(clientMock);
    clientMock.query
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce({ rows: [{ value: 1 }], rowCount: 1 })
      .mockResolvedValueOnce(undefined);

    const result = await service.transaction(async (transaction) => {
      return transaction.query<{ value: number }>({
        name: 'select-one',
        text: 'SELECT 1 AS value',
      });
    });

    expect(clientMock.query).toHaveBeenNthCalledWith(1, 'BEGIN');
    expect(clientMock.query).toHaveBeenNthCalledWith(2, {
      name: 'select-one',
      text: 'SELECT 1 AS value',
      values: [],
    });
    expect(clientMock.query).toHaveBeenNthCalledWith(3, 'COMMIT');
    expect(clientMock.release).toHaveBeenCalledTimes(1);
    expect(result.rows[0].value).toBe(1);
  });

  it('rolls back and translates postgres constraint errors', async () => {
    const clientMock = createPoolClientMock();
    const postgresError = Object.assign(new Error('duplicate key'), {
      code: '23505',
      constraint: 'uq_users_email',
      detail: 'Key (email)=(foo@bar.com) already exists.',
    });

    poolMock.connect.mockResolvedValue(clientMock);
    clientMock.query
      .mockResolvedValueOnce(undefined)
      .mockRejectedValueOnce(postgresError)
      .mockResolvedValueOnce(undefined);

    await expect(
      service.transaction(async (transaction) => {
        await transaction.query({
          name: 'insert-user',
          text: 'INSERT INTO users (email) VALUES ($1)',
          values: ['foo@bar.com'],
        });
      }),
    ).rejects.toEqual(
      expect.objectContaining({
        name: DatabaseConstraintViolationError.name,
        constraint: 'uq_users_email',
        code: '23505',
      }),
    );

    expect(clientMock.query).toHaveBeenNthCalledWith(1, 'BEGIN');
    expect(clientMock.query).toHaveBeenNthCalledWith(3, 'ROLLBACK');
    expect(clientMock.release).toHaveBeenCalledTimes(1);
  });

  it('raises a dedicated transaction error when rollback fails', async () => {
    const clientMock = createPoolClientMock();
    const postgresError = Object.assign(new Error('duplicate key'), {
      code: '23505',
    });

    poolMock.connect.mockResolvedValue(clientMock);
    clientMock.query
      .mockResolvedValueOnce(undefined)
      .mockRejectedValueOnce(postgresError)
      .mockRejectedValueOnce(new Error('rollback failed'));

    await expect(
      service.transaction(async (transaction) => {
        await transaction.query({
          text: 'INSERT INTO users (email) VALUES ($1)',
          values: ['foo@bar.com'],
        });
      }),
    ).rejects.toBeInstanceOf(DatabaseTransactionError);

    expect(clientMock.release).toHaveBeenCalledTimes(1);
  });
});
