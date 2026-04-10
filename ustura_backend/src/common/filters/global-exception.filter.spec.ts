import {
  BadRequestException,
  ConflictException,
  HttpStatus,
} from '@nestjs/common';
import type { ArgumentsHost } from '@nestjs/common';
import {
  DatabaseConnectionError,
  DatabaseConstraintViolationError,
  DatabaseQueryError,
} from '../../database/database.errors';
import { GlobalExceptionFilter } from './global-exception.filter';

type ResponseMock = {
  status: jest.Mock;
  json: jest.Mock;
};

type RequestMock = {
  method: string;
  originalUrl: string;
  url: string;
};

function createResponseMock(): ResponseMock {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
}

function createArgumentsHostMock(
  request: RequestMock,
  response: ResponseMock,
): ArgumentsHost {
  return {
    switchToHttp: () => ({
      getRequest: () => request,
      getResponse: () => response,
    }),
  } as ArgumentsHost;
}

describe('GlobalExceptionFilter', () => {
  let filter: GlobalExceptionFilter;
  let responseMock: ResponseMock;
  let requestMock: RequestMock;

  beforeEach(() => {
    filter = new GlobalExceptionFilter();
    responseMock = createResponseMock();
    requestMock = {
      method: 'POST',
      originalUrl: '/api/auth/register',
      url: '/api/auth/register',
    };
  });

  it('preserves HttpException messages and status codes', () => {
    const host = createArgumentsHostMock(requestMock, responseMock);

    filter.catch(new BadRequestException(['Email is invalid']), host);

    expect(responseMock.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(responseMock.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Email is invalid',
        path: '/api/auth/register',
      }),
    );
  });

  it('maps database connection errors to 503', () => {
    const host = createArgumentsHostMock(requestMock, responseMock);

    filter.catch(
      new DatabaseConnectionError('PostgreSQL connection error.'),
      host,
    );

    expect(responseMock.status).toHaveBeenCalledWith(
      HttpStatus.SERVICE_UNAVAILABLE,
    );
    expect(responseMock.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        statusCode: HttpStatus.SERVICE_UNAVAILABLE,
        message: 'Database is temporarily unavailable.',
        code: 'database_unavailable',
      }),
    );
  });

  it('maps database constraint errors to 409', () => {
    const host = createArgumentsHostMock(requestMock, responseMock);

    filter.catch(
      new DatabaseConstraintViolationError(
        'Database constraint violation detected.',
      ),
      host,
    );

    expect(responseMock.status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
    expect(responseMock.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        statusCode: HttpStatus.CONFLICT,
        message: 'Request conflicts with the current database state.',
        code: 'database_constraint_violation',
      }),
    );
  });

  it('maps database query errors to 500', () => {
    const host = createArgumentsHostMock(requestMock, responseMock);

    filter.catch(
      new DatabaseQueryError('PostgreSQL query execution failed.'),
      host,
    );

    expect(responseMock.status).toHaveBeenCalledWith(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    expect(responseMock.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'A database operation failed.',
        code: 'database_operation_failed',
      }),
    );
  });

  it('maps unknown errors to a safe 500 response', () => {
    const host = createArgumentsHostMock(requestMock, responseMock);

    filter.catch(new Error('socket hang up'), host);

    expect(responseMock.status).toHaveBeenCalledWith(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    expect(responseMock.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error.',
        code: 'internal_server_error',
      }),
    );
  });

  it('passes through explicit HttpException codes when present', () => {
    const host = createArgumentsHostMock(requestMock, responseMock);
    const exception = new ConflictException({
      message: 'User already exists.',
      code: 'user_conflict',
    });

    filter.catch(exception, host);

    expect(responseMock.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        statusCode: HttpStatus.CONFLICT,
        message: 'User already exists.',
        code: 'user_conflict',
      }),
    );
  });
});
