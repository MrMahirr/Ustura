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

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedSalonResponse {
  items: SalonRecord[];
  pagination: PaginationMeta;
}

export interface SalonFilters {
  city?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

export async function getSalons(filters: SalonFilters = {}) {
  return apiRequest<PaginatedSalonResponse>({
    path: '/salons',
    query: {
      city: filters.city,
      search: filters.search,
      page: filters.page,
      pageSize: filters.pageSize,
    },
  });
}

export async function getSalonCities() {
  return apiRequest<string[]>({
    path: '/salons/cities',
  });
}

export async function getSalonById(salonId: string) {
  return apiRequest<SalonRecord>({
    path: `/salons/${salonId}`,
  });
}
