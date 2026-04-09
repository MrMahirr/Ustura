import { ERROR_CODES } from '../../../common/errors/error-codes';
import {
  badRequestError,
  forbiddenError,
  notFoundError,
} from '../../../common/errors/http-exception.factory';

export function salonInvalidFieldError(fieldName: string) {
  return badRequestError(
    `${fieldName} cannot be empty.`,
    ERROR_CODES.SALON.INVALID_FIELD,
  );
}

export function salonInvalidWorkingHoursError(message: string) {
  return badRequestError(message, ERROR_CODES.SALON.INVALID_WORKING_HOURS);
}

export function salonManagementForbiddenError(message: string) {
  return forbiddenError(message, ERROR_CODES.SALON.MANAGEMENT_FORBIDDEN);
}

export function salonNotFoundError() {
  return notFoundError('Salon not found.', ERROR_CODES.SALON.NOT_FOUND);
}
