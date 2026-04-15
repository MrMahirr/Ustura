import type { SqlQueryExecutor } from '../../../database/database.types';

export interface SalonServiceItem {
  id: string;
  salonId: string;
  name: string;
  description: string | null;
  durationMinutes: number;
  priceAmount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSalonServiceInput {
  salonId: string;
  name: string;
  description?: string | null;
  durationMinutes: number;
  priceAmount: number;
  isActive?: boolean;
}

export interface UpdateSalonServiceInput {
  name?: string;
  description?: string | null;
  durationMinutes?: number;
  priceAmount?: number;
  isActive?: boolean;
}

export interface SalonServiceCatalogServiceContract {
  findActiveBySalonId(salonId: string): Promise<SalonServiceItem[]>;
}

export const SALON_SERVICE_CATALOG_SERVICE = Symbol(
  'SALON_SERVICE_CATALOG_SERVICE',
);

export interface SalonServiceProvisioningServiceContract {
  createOwnedSalonService(
    salonId: string,
    input: Omit<CreateSalonServiceInput, 'salonId'>,
    executor?: SqlQueryExecutor,
  ): Promise<SalonServiceItem>;
}

export const SALON_SERVICE_PROVISIONING_SERVICE = Symbol(
  'SALON_SERVICE_PROVISIONING_SERVICE',
);
