import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import {
  DatabaseConnectionError,
  DatabaseConstraintViolationError,
  DatabaseError,
  DatabaseQueryError,
  DatabaseTransactionError,
} from '../../database/database.errors';

interface ErrorResponseBody {
  success: boolean;
  statusCode: number;
  message: string;
  timestamp: string;
  path: string;
  code?: string;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const httpContext = host.switchToHttp();
    const response = httpContext.getResponse<Response>();
    const request = httpContext.getRequest<Request>();
    const normalizedError = this.normalizeException(exception);
    const responseBody: ErrorResponseBody = {
      success: false,
      statusCode: normalizedError.statusCode,
      message: normalizedError.message,
      timestamp: new Date().toISOString(),
      path: request.originalUrl || request.url || '',
      ...(normalizedError.code ? { code: normalizedError.code } : {}),
    };

    if (normalizedError.shouldLog) {
      this.logger.error(
        `${request.method} ${responseBody.path} ${normalizedError.statusCode} ${normalizedError.message}`,
        normalizedError.stack,
      );
    }

    response.status(normalizedError.statusCode).json(responseBody);
  }

  private normalizeException(exception: unknown): NormalizedException {
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      const statusCode = exception.getStatus();

      return {
        statusCode,
        message: this.resolveHttpExceptionMessage(response, exception.message),
        code: this.resolveHttpExceptionCode(response),
        stack: exception.stack,
        shouldLog: statusCode >= 500,
      };
    }

    if (exception instanceof DatabaseConnectionError) {
      return {
        statusCode: HttpStatus.SERVICE_UNAVAILABLE,
        message: 'Database is temporarily unavailable.',
        code: 'database_unavailable',
        stack: exception.stack,
        shouldLog: true,
      };
    }

    if (exception instanceof DatabaseConstraintViolationError) {
      return {
        statusCode: HttpStatus.CONFLICT,
        message: 'Request conflicts with the current database state.',
        code: 'database_constraint_violation',
        stack: exception.stack,
        shouldLog: true,
      };
    }

    if (
      exception instanceof DatabaseQueryError ||
      exception instanceof DatabaseTransactionError
    ) {
      const dbEx = exception as DatabaseError;
      const pgHint = dbEx.cause?.message ? ` (${dbEx.cause.message})` : '';
      if (pgHint) {
        this.logger.warn(
          `Database error detail:${pgHint} code=${dbEx.code ?? ''} query=${dbEx.queryName ?? ''}`,
        );
      }
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'A database operation failed.',
        code: 'database_operation_failed',
        stack: exception.stack,
        shouldLog: true,
      };
    }

    if (exception instanceof DatabaseError) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'A database error occurred.',
        code: 'database_error',
        stack: exception.stack,
        shouldLog: true,
      };
    }

    if (exception instanceof Error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error.',
        code: 'internal_server_error',
        stack: exception.stack,
        shouldLog: true,
      };
    }

    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error.',
      code: 'internal_server_error',
      shouldLog: true,
    };
  }

  private resolveHttpExceptionMessage(
    response: string | object,
    fallbackMessage: string,
  ): string {
    if (typeof response === 'string' && response.trim()) {
      return response;
    }

    if (typeof response !== 'object' || response == null) {
      return fallbackMessage;
    }

    const candidate = response as {
      message?: string | string[];
    };

    if (Array.isArray(candidate.message) && candidate.message.length > 0) {
      return candidate.message.join(', ');
    }

    if (typeof candidate.message === 'string' && candidate.message.trim()) {
      return candidate.message;
    }

    return fallbackMessage;
  }

  private resolveHttpExceptionCode(
    response: string | object,
  ): string | undefined {
    if (typeof response !== 'object' || response == null) {
      return undefined;
    }

    const candidate = response as {
      code?: string;
    };

    if (typeof candidate.code === 'string' && candidate.code.trim()) {
      return candidate.code;
    }

    return undefined;
  }
}

interface NormalizedException {
  statusCode: number;
  message: string;
  code?: string;
  stack?: string;
  shouldLog: boolean;
}
