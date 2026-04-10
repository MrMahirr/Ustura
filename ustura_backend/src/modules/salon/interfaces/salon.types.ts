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

export interface CreateSalonInput {
  ownerId: string;
  name: string;
  address: string;
  city: string;
  district?: string | null;
  photoUrl?: string | null;
  workingHours: WorkingHours;
}

export interface CreateOwnedSalonDraft {
  name: string;
  address: string;
  city: string;
  district?: string | null;
  photoUrl?: string | null;
  workingHours: Record<string, unknown>;
}

export interface PreparedOwnedSalonInput
  extends Omit<CreateSalonInput, 'ownerId'> {}

export interface UpdateSalonInput {
  name?: string;
  address?: string;
  city?: string;
  district?: string | null;
  photoUrl?: string | null;
  workingHours?: WorkingHours;
  isActive?: boolean;
}

export interface SalonPublicSummary {
  id: string;
  name: string;
  city: string;
  district: string | null;
  photoUrl: string | null;
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
