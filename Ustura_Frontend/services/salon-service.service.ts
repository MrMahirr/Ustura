import { apiRequest } from '@/services/api';

export interface SalonServiceRecord {
  id: string;
  salonId: string;
  name: string;
  description: string | null;
  durationMinutes: number;
  priceAmount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSalonServicePayload {
  name: string;
  description?: string | null;
  durationMinutes: number;
  priceAmount: number;
  isActive?: boolean;
}

export interface UpdateSalonServicePayload {
  name?: string;
  description?: string | null;
  durationMinutes?: number;
  priceAmount?: number;
  isActive?: boolean;
}

export async function getSalonServices(salonId: string) {
  return apiRequest<SalonServiceRecord[]>({
    path: `/salons/${salonId}/services`,
  });
}

export async function getOwnedSalonServices(salonId: string) {
  return apiRequest<SalonServiceRecord[]>({
    path: `/salons/${salonId}/services/owned`,
    auth: true,
  });
}

export async function createOwnedSalonService(
  salonId: string,
  body: CreateSalonServicePayload,
) {
  return apiRequest<SalonServiceRecord>({
    path: `/salons/${salonId}/services`,
    method: 'POST',
    auth: true,
    body,
  });
}

export async function updateOwnedSalonService(
  salonId: string,
  serviceId: string,
  body: UpdateSalonServicePayload,
) {
  return apiRequest<SalonServiceRecord>({
    path: `/salons/${salonId}/services/${serviceId}`,
    method: 'PATCH',
    auth: true,
    body,
  });
}

export async function deleteOwnedSalonService(
  salonId: string,
  serviceId: string,
) {
  return apiRequest<{ deleted: true }>({
    path: `/salons/${salonId}/services/${serviceId}`,
    method: 'DELETE',
    auth: true,
  });
}
