import { ERROR_CODES } from '../../../shared/errors/error-codes';
import {
  badRequestError,
  conflictError,
  notFoundError,
} from '../../../shared/errors/http-exception.factory';

export function customerCredentialsRequiredError() {
  return badRequestError(
    'Customer accounts must have a password or a Firebase Google identity.',
    ERROR_CODES.USER.CUSTOMER_CREDENTIALS_REQUIRED,
  );
}

export function customerInactiveError() {
  return conflictError(
    'The selected customer account is inactive.',
    ERROR_CODES.USER.CUSTOMER_INACTIVE,
  );
}

export function customerOnlyManagedReservationError() {
  return conflictError(
    'Only customer accounts can be used for managed reservations.',
    ERROR_CODES.USER.CUSTOMER_ONLY_MANAGED_RESERVATION,
  );
}

export function customerGoogleOnlyError() {
  return conflictError(
    'Firebase Google sign-in is only available for customer accounts.',
    ERROR_CODES.USER.CUSTOMER_GOOGLE_ONLY,
  );
}

export function emailAlreadyExistsError() {
  return conflictError(
    'A user with this email already exists.',
    ERROR_CODES.USER.EMAIL_ALREADY_EXISTS,
  );
}

export function googleIdentityAlreadyLinkedError() {
  return conflictError(
    'Customer account is already linked to another Google identity.',
    ERROR_CODES.USER.GOOGLE_IDENTITY_ALREADY_LINKED,
  );
}

export function invalidEmployeeRoleError() {
  return conflictError(
    'Only barber and receptionist accounts can be created as employees.',
    ERROR_CODES.USER.INVALID_EMPLOYEE_ROLE,
  );
}

export function passwordRequiredError() {
  return badRequestError(
    'Password credentials are required for non-customer accounts.',
    ERROR_CODES.USER.PASSWORD_REQUIRED,
  );
}

export function phoneAlreadyExistsError() {
  return conflictError(
    'A user with this phone already exists.',
    ERROR_CODES.USER.PHONE_ALREADY_EXISTS,
  );
}

export function phoneRequiredError() {
  return badRequestError('Phone is required.', ERROR_CODES.USER.PHONE_REQUIRED);
}

export function userNotFoundError() {
  return notFoundError('User not found.', ERROR_CODES.USER.NOT_FOUND);
}
