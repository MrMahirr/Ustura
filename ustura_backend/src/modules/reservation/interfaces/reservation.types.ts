import { ReservationStatus } from '../enums/reservation-status.enum';

export interface ReservationRecord {
  id: string;
  customerId: string;
  salonId: string;
  staffId: string;
  slotStart: Date;
  slotEnd: Date;
  status: ReservationStatus;
  notes: string | null;
  cancelledAt: Date | null;
  cancelledByUserId: string | null;
  statusChangedAt: Date | null;
  statusChangedByUserId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateReservationInput {
  customerId: string;
  salonId: string;
  staffId: string;
  slotStart: Date;
  slotEnd: Date;
  status?: ReservationStatus;
  notes?: string | null;
}
