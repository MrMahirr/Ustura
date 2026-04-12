import { ERROR_CODES } from '../../../shared/errors/error-codes';
import {
  badRequestError,
  conflictError,
  notFoundError,
} from '../../../shared/errors/http-exception.factory';

export function invalidSlotStartError() {
  return badRequestError(
    'slot_start must be a valid ISO datetime.',
    ERROR_CODES.SLOT.INVALID_SLOT_START,
  );
}

export function liveSelectionStaffRequiredError() {
  return badRequestError(
    'Live slot selection requires staffId.',
    ERROR_CODES.SLOT.LIVE_SELECTION_STAFF_REQUIRED,
  );
}

export function slotSalonNotFoundError() {
  return notFoundError('Salon not found.', ERROR_CODES.SLOT.SALON_NOT_FOUND);
}

export function slotHeldByOtherError() {
  return conflictError(
    'This slot is temporarily selected by another visitor.',
    ERROR_CODES.SLOT.SLOT_HELD_BY_OTHER,
  );
}

export function slotOutsideWorkingHoursError() {
  return badRequestError(
    'The selected slot is outside the salon working hours.',
    ERROR_CODES.SLOT.SLOT_OUTSIDE_WORKING_HOURS,
  );
}

export function slotUnavailableError() {
  return conflictError(
    'The selected slot is already reserved or temporarily held.',
    ERROR_CODES.SLOT.SLOT_UNAVAILABLE,
  );
}

export function slotStaffNotFoundError() {
  return notFoundError(
    'Staff member not found.',
    ERROR_CODES.SLOT.STAFF_NOT_FOUND,
  );
}
