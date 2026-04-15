import { ERROR_CODES } from '../../../shared/errors/error-codes';
import {
  badRequestError,
  forbiddenError,
  notFoundError,
} from '../../../shared/errors/http-exception.factory';

export function salonServiceInvalidFieldError(fieldName: string) {
  return badRequestError(
    `${fieldName} is invalid for salon service.`,
    ERROR_CODES.SALON_SERVICE.INVALID_FIELD,
  );
}

export function salonServiceManagementForbiddenError() {
  return forbiddenError(
    'You do not have permission to manage services for this salon.',
    ERROR_CODES.SALON_SERVICE.MANAGEMENT_FORBIDDEN,
  );
}

export function salonServiceNotFoundError() {
  return notFoundError(
    'Salon service not found.',
    ERROR_CODES.SALON_SERVICE.NOT_FOUND,
  );
}

export function salonServiceSalonNotFoundError() {
  return notFoundError(
    'Salon not found.',
    ERROR_CODES.SALON_SERVICE.SALON_NOT_FOUND,
  );
}
