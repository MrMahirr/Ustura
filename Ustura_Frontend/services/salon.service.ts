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

export interface AdminSalonRecord {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  name: string;
  address: string;
  city: string;
  district: string | null;
  photoUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminSalonOverview {
  total: number;
  active: number;
  inactive: number;
  cityCount: number;
  newLast30Days: number;
}

export interface PaginatedAdminSalonResponse {
  items: AdminSalonRecord[];
  pagination: PaginationMeta;
  overview: AdminSalonOverview;
}

export interface SalonFilters {
  city?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface AdminSalonFilters {
  city?: string;
  search?: string;
  status?: 'active' | 'inactive';
  sort?: 'newest' | 'name_asc' | 'name_desc' | 'updated_desc';
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

export async function getAdminSalons(filters: AdminSalonFilters = {}) {
  return apiRequest<PaginatedAdminSalonResponse>({
    path: '/salons/admin',
    auth: true,
    query: {
      city: filters.city,
      search: filters.search,
      status: filters.status,
      sort: filters.sort,
      page: filters.page,
      pageSize: filters.pageSize,
    },
  });
}

export async function getAdminSalonCities() {
  return apiRequest<string[]>({
    path: '/salons/admin/cities',
    auth: true,
  });
}

export async function getSalonById(salonId: string) {
  return apiRequest<SalonRecord>({
    path: `/salons/${salonId}`,
  });
}

export interface OwnedSalonSummary {
  id: string;
  name: string;
  city: string;
  district: string | null;
  photoUrl: string | null;
  isActive: boolean;
  updatedAt: string;
}

export async function getOwnedSalons() {
  return apiRequest<OwnedSalonSummary[]>({
    path: '/salons/owned',
    auth: true,
  });
}
