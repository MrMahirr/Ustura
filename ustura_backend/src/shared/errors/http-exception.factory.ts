import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import type { AppErrorCode } from './error-codes';

interface ErrorPayload<TCode extends AppErrorCode> {
  message: string;
  code: TCode;
}

function createPayload<TCode extends AppErrorCode>(
  message: string,
  code: TCode,
): ErrorPayload<TCode> {
  return { message, code };
}

export function badRequestError<TCode extends AppErrorCode>(
  message: string,
  code: TCode,
) {
  return new BadRequestException(createPayload(message, code));
}

export function conflictError<TCode extends AppErrorCode>(
  message: string,
  code: TCode,
) {
  return new ConflictException(createPayload(message, code));
}

export function forbiddenError<TCode extends AppErrorCode>(
  message: string,
  code: TCode,
) {
  return new ForbiddenException(createPayload(message, code));
}

export function notFoundError<TCode extends AppErrorCode>(
  message: string,
  code: TCode,
) {
  return new NotFoundException(createPayload(message, code));
}

export function serviceUnavailableError<TCode extends AppErrorCode>(
  message: string,
  code: TCode,
) {
  return new ServiceUnavailableException(createPayload(message, code));
}

export function unauthorizedError<TCode extends AppErrorCode>(
  message: string,
  code: TCode,
) {
  return new UnauthorizedException(createPayload(message, code));
}
