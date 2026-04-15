import type { SqlQueryExecutor } from '../../../database/database.types';

export const SALON_DAY_KEYS = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const;

export type SalonDayKey = (typeof SALON_DAY_KEYS)[number];

export interface WorkingHoursEntry {
  open: string;
  close: string;
}

export type WorkingHours = Record<SalonDayKey, WorkingHoursEntry | null>;

export interface Salon {
  id: string;
  ownerId: string;
  name: string;
  address: string;
  city: string;
  district: string | null;
  photoUrl: string | null;
  galleryUrls: string[];
  workingHours: WorkingHours;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface FindSalonsFilters {
  city?: string;
  search?: string;
  ownerId?: string;
  includeInactive?: boolean;
}

export interface FindPaginatedSalonsFilters extends FindSalonsFilters {
  page: number;
  pageSize: number;
}

export type AdminSalonStatusFilter = 'active' | 'inactive';
export type AdminSalonSort =
  | 'newest'
  | 'name_asc'
  | 'name_desc'
  | 'updated_desc';

export interface FindAdminSalonsFilters {
  search?: string;
  city?: string;
  status?: AdminSalonStatusFilter;
  sort: AdminSalonSort;
  page: number;
  pageSize: number;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResult<TItem> {
  items: TItem[];
  pagination: PaginationMeta;
}

export interface AdminSalonSummary {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  name: string;
  address: string;
  city: string;
  district: string | null;
  photoUrl: string | null;
  galleryUrls: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminSalonDetail extends AdminSalonSummary {
  workingHours: WorkingHours;
}

export interface AdminSalonOverview {
  total: number;
  active: number;
  inactive: number;
  cityCount: number;
  newLast30Days: number;
}

export interface PaginatedAdminSalonResult {
  items: AdminSalonSummary[];
  pagination: PaginationMeta;
  overview: AdminSalonOverview;
}

export interface CreateSalonInput {
  ownerId: string;
  name: string;
  address: string;
  city: string;
  district?: string | null;
  photoUrl?: string | null;
  galleryUrls?: string[];
  workingHours: WorkingHours;
}

export interface CreateOwnedSalonDraft {
  name: string;
  address: string;
  city: string;
  district?: string | null;
  photoUrl?: string | null;
  galleryUrls?: string[];
  workingHours: Record<string, unknown>;
}

export type PreparedOwnedSalonInput = Omit<CreateSalonInput, 'ownerId'>;

export interface UpdateSalonInput {
  name?: string;
  address?: string;
  city?: string;
  district?: string | null;
  photoUrl?: string | null;
  galleryUrls?: string[];
  workingHours?: WorkingHours;
  isActive?: boolean;
}

export interface SalonPublicSummary {
  id: string;
  name: string;
  city: string;
  district: string | null;
  photoUrl: string | null;
  galleryUrls: string[];
}

export interface SalonPublicDetail extends SalonPublicSummary {
  address: string;
  workingHours: WorkingHours;
}

export interface OwnedSalonSummary {
  id: string;
  name: string;
  city: string;
  district: string | null;
  photoUrl: string | null;
  galleryUrls: string[];
  isActive: boolean;
  updatedAt: Date;
}

export interface OwnedSalonDetail extends OwnedSalonSummary {
  address: string;
  workingHours: WorkingHours;
  createdAt: Date;
}

export interface SalonCatalogServiceContract {
  findActiveById(id: string): Promise<Salon | null>;
}

export interface SalonOwnerProvisioningServiceContract {
  prepareOwnedSalonInput(input: CreateOwnedSalonDraft): PreparedOwnedSalonInput;
  createOwnedSalon(
    ownerId: string,
    input: CreateOwnedSalonDraft,
    executor?: SqlQueryExecutor,
  ): Promise<Salon>;
}
