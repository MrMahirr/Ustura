import { ERROR_CODES } from '../../../shared/errors/error-codes';
import {
  badRequestError,
  conflictError,
  forbiddenError,
  notFoundError,
} from '../../../shared/errors/http-exception.factory';

export function barberNotFoundError() {
  return notFoundError(
    'Barber not found.',
    ERROR_CODES.RESERVATION.BARBER_NOT_FOUND,
  );
}

export function barberScheduleOnlyError() {
  return forbiddenError(
    'Barbers can only create reservations for their own schedule.',
    ERROR_CODES.RESERVATION.BARBER_SCHEDULE_ONLY,
  );
}

export function cancellationForbiddenError() {
  return forbiddenError(
    'You do not have permission to cancel this reservation.',
    ERROR_CODES.RESERVATION.CANCELLATION_FORBIDDEN,
  );
}

export function invalidReservationStatusTransitionError(
  currentStatus: string,
  nextStatus: string,
) {
  return conflictError(
    `Reservation status cannot transition from ${currentStatus} to ${nextStatus}.`,
    ERROR_CODES.RESERVATION.INVALID_STATUS_TRANSITION,
  );
}

export function customerDetailsRequiredError() {
  return badRequestError(
    'customer_id or customer_name/customer_email/customer_phone is required.',
    ERROR_CODES.RESERVATION.CUSTOMER_DETAILS_REQUIRED,
  );
}

export function customerNotFoundError() {
  return notFoundError(
    'Customer not found.',
    ERROR_CODES.RESERVATION.CUSTOMER_NOT_FOUND,
  );
}

export function reservationListAccessDeniedError() {
  return forbiddenError(
    'You do not have access to this salon reservations list.',
    ERROR_CODES.RESERVATION.LIST_ACCESS_DENIED,
  );
}

export function onlyCustomersCanViewOwnReservationsError() {
  return forbiddenError(
    'Only customers can view my reservations.',
    ERROR_CODES.RESERVATION.ONLY_CUSTOMERS_CAN_VIEW_OWN,
  );
}

export function ownerSalonOnlyError() {
  return forbiddenError(
    'Owners can only create reservations for their own salon.',
    ERROR_CODES.RESERVATION.OWNER_SALON_ONLY,
  );
}

export function receptionistSalonOnlyError() {
  return forbiddenError(
    'Receptionists can only create reservations for salons they belong to.',
    ERROR_CODES.RESERVATION.RECEPTIONIST_SALON_ONLY,
  );
}

export function reservationStatusUpdateForbiddenError() {
  return forbiddenError(
    'You do not have permission to update this reservation status.',
    ERROR_CODES.RESERVATION.STATUS_UPDATE_FORBIDDEN,
  );
}

export function reservationNotFoundError() {
  return notFoundError(
    'Reservation not found.',
    ERROR_CODES.RESERVATION.RESERVATION_NOT_FOUND,
  );
}

export function reservationSalonNotFoundError() {
  return notFoundError(
    'Salon not found.',
    ERROR_CODES.RESERVATION.SALON_NOT_FOUND,
  );
}

export function slotAlreadyReservedError() {
  return conflictError(
    'The selected slot has already been reserved.',
    ERROR_CODES.RESERVATION.SLOT_ALREADY_RESERVED,
  );
}

export function slotBeingReservedError() {
  return conflictError(
    'The selected slot is being reserved by another request.',
    ERROR_CODES.RESERVATION.SLOT_BEING_RESERVED,
  );
}
