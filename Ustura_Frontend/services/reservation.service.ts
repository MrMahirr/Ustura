import { apiRequest } from '@/services/api';

export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled';

export interface ReservationRecord {
  id: string;
  customerId: string;
  salonId: string;
  staffId: string;
  slotStart: string;
  slotEnd: string;
  status: ReservationStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReservationInput {
  salonId: string;
  staffId: string;
  slotStart: string;
  notes?: string;
  customerId?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  selectionOwnerId?: string;
}

interface CreateReservationPayload {
  salon_id: string;
  staff_id: string;
  slot_start: string;
  notes?: string;
  customer_id?: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  selection_owner_id?: string;
}

export async function createReservation(input: CreateReservationInput) {
  return apiRequest<ReservationRecord, CreateReservationPayload>({
    path: '/reservations',
    method: 'POST',
    auth: true,
    body: {
      salon_id: input.salonId,
      staff_id: input.staffId,
      slot_start: input.slotStart,
      notes: input.notes,
      customer_id: input.customerId,
      customer_name: input.customerName,
      customer_email: input.customerEmail,
      customer_phone: input.customerPhone,
      selection_owner_id: input.selectionOwnerId,
    },
  });
}

export async function getMyReservations() {
  return apiRequest<ReservationRecord[]>({
    path: '/reservations/my',
    auth: true,
  });
}

export async function getSalonReservations(salonId: string) {
  return apiRequest<ReservationRecord[]>({
    path: `/reservations/salon/${salonId}`,
    auth: true,
  });
}

export async function cancelReservation(reservationId: string) {
  return apiRequest<ReservationRecord>({
    path: `/reservations/${reservationId}`,
    method: 'DELETE',
    auth: true,
  });
}
