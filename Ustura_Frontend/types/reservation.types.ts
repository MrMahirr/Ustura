export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled';

export interface Reservation {
  id: string;
  customer_id: string;
  salon_id: string;
  staff_id: string;
  slot_start: string;
  slot_end: string;
  status: ReservationStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface TimeSlot {
  start: string;       // ISO 8601
  end: string;         // ISO 8601
  available: boolean;
}
