export enum ReservationStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
  NO_SHOW = 'no_show',
}

export const OPERATIONAL_RESERVATION_STATUSES = [
  ReservationStatus.CONFIRMED,
  ReservationStatus.COMPLETED,
  ReservationStatus.NO_SHOW,
] as const;

export type OperationalReservationStatus =
  (typeof OPERATIONAL_RESERVATION_STATUSES)[number];
