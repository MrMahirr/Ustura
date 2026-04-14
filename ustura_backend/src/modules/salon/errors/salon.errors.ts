import { ERROR_CODES } from '../../../shared/errors/error-codes';
import {
  badRequestError,
  forbiddenError,
  notFoundError,
} from '../../../shared/errors/http-exception.factory';

export function salonInvalidFieldError(fieldName: string) {
  return badRequestError(
    `${fieldName} cannot be empty.`,
    ERROR_CODES.SALON.INVALID_FIELD,
  );
}

export function salonInvalidMediaFileError(message: string) {
  return badRequestError(message, ERROR_CODES.SALON.INVALID_MEDIA_FILE);
}

export function salonInactiveUpdateForbiddenError() {
  return badRequestError(
    'Inactive salons can only be reactivated before other fields are updated.',
    ERROR_CODES.SALON.INACTIVE_UPDATE_FORBIDDEN,
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
