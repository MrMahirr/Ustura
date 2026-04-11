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

export async function createReservation(input: CreateReservationInput) {
  return apiRequest<ReservationRecord, CreateReservationPayload>({
    path: '/reservations',
    method: 'POST',
    auth: true,
    body: {
      salonId: input.salonId,
      staffId: input.staffId,
      slotStart: input.slotStart,
      notes: input.notes,
      customerId: input.customerId,
      customerName: input.customerName,
      customerEmail: input.customerEmail,
      customerPhone: input.customerPhone,
      selectionOwnerId: input.selectionOwnerId,
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
