import { ReservationStatus } from '../../../common/enums/reservation-status.enum';

export interface ReservationRecord {
  id: string;
  customerId: string;
  salonId: string;
  staffId: string;
  slotStart: Date;
  slotEnd: Date;
  status: ReservationStatus;
  notes: string | null;
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
