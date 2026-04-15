import { ERROR_CODES } from '../../../shared/errors/error-codes';
import {
  badRequestError,
  conflictError,
  forbiddenError,
  notFoundError,
} from '../../../shared/errors/http-exception.factory';

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

export function staffInvalidMediaFileError(message: string) {
  return badRequestError(message, ERROR_CODES.STAFF.INVALID_MEDIA_FILE);
}

export function staffProvisioningModeInvalidError() {
  return badRequestError(
    'Provide either user_id or employee details when creating staff, but not both.',
    ERROR_CODES.STAFF.PROVISIONING_MODE_INVALID,
  );
}

export function staffNotFoundError() {
  return notFoundError('Staff member not found.', ERROR_CODES.STAFF.NOT_FOUND);
}

export function staffSalonNotFoundError() {
  return notFoundError('Salon not found.', ERROR_CODES.STAFF.SALON_NOT_FOUND);
}

export function staffSelfViewForbiddenError() {
  return forbiddenError(
    'Only barber and receptionist accounts can access staff self view.',
    ERROR_CODES.STAFF.SELF_VIEW_FORBIDDEN,
  );
}

export function staffSelfManagementForbiddenError() {
  return forbiddenError(
    'You do not have permission to manage this staff profile.',
    ERROR_CODES.STAFF.SELF_MANAGEMENT_FORBIDDEN,
  );
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
