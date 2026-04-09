import { ERROR_CODES } from '../../../common/errors/error-codes';
import {
  conflictError,
  forbiddenError,
  notFoundError,
} from '../../../common/errors/http-exception.factory';

export function staffAlreadyAssignedError() {
  return conflictError(
    'This user is already assigned to the selected salon staff.',
    ERROR_CODES.STAFF.ALREADY_ASSIGNED,
  );
}

export function staffInvalidAccountRoleError() {
  return conflictError(
    'The selected user account role must match the staff assignment role.',
    ERROR_CODES.STAFF.INVALID_ACCOUNT_ROLE,
  );
}

export function staffManagementForbiddenError() {
  return forbiddenError(
    'You do not have permission to manage staff for this salon.',
    ERROR_CODES.STAFF.MANAGEMENT_FORBIDDEN,
  );
}

export function staffNotFoundError() {
  return notFoundError('Staff member not found.', ERROR_CODES.STAFF.NOT_FOUND);
}

export function staffSalonNotFoundError() {
  return notFoundError('Salon not found.', ERROR_CODES.STAFF.SALON_NOT_FOUND);
}

export function staffUserInactiveError() {
  return conflictError(
    'The selected user account is inactive.',
    ERROR_CODES.STAFF.USER_INACTIVE,
  );
}

export function staffUserNotFoundError() {
  return notFoundError(
    'User account not found.',
    ERROR_CODES.STAFF.USER_NOT_FOUND,
  );
}
