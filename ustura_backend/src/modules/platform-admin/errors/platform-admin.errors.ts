import { ERROR_CODES } from '../../../shared/errors/error-codes';
import {
  conflictError,
  forbiddenError,
  notFoundError,
} from '../../../shared/errors/http-exception.factory';
import { OwnerApplicationStatus } from '../enums/owner-application-status.enum';

export function platformAdminAccessForbiddenError() {
  return forbiddenError(
    'Only super admins can manage owner applications.',
    ERROR_CODES.PLATFORM_ADMIN.ACCESS_FORBIDDEN,
  );
}

export function ownerApplicationAlreadyExistsError() {
  return conflictError(
    'There is already a pending owner application for this email address.',
    ERROR_CODES.PLATFORM_ADMIN.OWNER_APPLICATION_ALREADY_EXISTS,
  );
}

export function ownerApplicationAlreadyReviewedError(
  status: OwnerApplicationStatus,
) {
  return conflictError(
    `Owner application is already ${status}.`,
    ERROR_CODES.PLATFORM_ADMIN.OWNER_APPLICATION_ALREADY_REVIEWED,
  );
}

export function ownerApplicationNotFoundError() {
  return notFoundError(
    'Owner application not found.',
    ERROR_CODES.PLATFORM_ADMIN.OWNER_APPLICATION_NOT_FOUND,
  );
}

export function ownerApplicationApplicantEmailUsedByStaffError() {
  return conflictError(
    'This email is already registered as salon personnel (not as an owner). Use another email or remove the staff account first.',
    ERROR_CODES.PLATFORM_ADMIN.OWNER_APPLICATION_APPLICANT_EMAIL_USED_BY_STAFF,
  );
}

export function ownerApplicationApplicantOwnerInactiveError() {
  return conflictError(
    'This email belongs to an inactive owner account. Reactivate the account or use a different email.',
    ERROR_CODES.PLATFORM_ADMIN.OWNER_APPLICATION_APPLICANT_OWNER_INACTIVE,
  );
}
