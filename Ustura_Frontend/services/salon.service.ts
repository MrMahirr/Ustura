import { apiRequest } from '@/services/api';

export interface WorkingHoursEntry {
  open: string;
  close: string;
}

export interface SalonRecord {
  id: string;
  ownerId: string;
  name: string;
  address: string;
  city: string;
  district: string | null;
  photoUrl: string | null;
  workingHours: Record<string, WorkingHoursEntry | null>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SalonFilters {
  city?: string;
  search?: string;
}

export async function getSalons(filters: SalonFilters = {}) {
  return apiRequest<SalonRecord[]>({
    path: '/salons',
    query: {
      city: filters.city,
      search: filters.search,
    },
  });
}

export async function getSalonById(salonId: string) {
  return apiRequest<SalonRecord>({
    path: `/salons/${salonId}`,
  });
}
