export interface WorkingHoursEntry {
  open: string;
  close: string;
}

export type WorkingHours = Record<string, WorkingHoursEntry | null>;

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

export interface UpdateSalonInput {
  name?: string;
  address?: string;
  city?: string;
  district?: string | null;
  photoUrl?: string | null;
  workingHours?: WorkingHours;
  isActive?: boolean;
}
