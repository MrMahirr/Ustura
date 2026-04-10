import type {
  SalonCatalogServiceContract,
  SalonOwnerProvisioningServiceContract,
} from './salon.types';

export const SALON_CATALOG_SERVICE = Symbol('SALON_CATALOG_SERVICE');
export const SALON_OWNER_PROVISIONING_SERVICE = Symbol(
  'SALON_OWNER_PROVISIONING_SERVICE',
);

export type {
  SalonCatalogServiceContract,
  SalonOwnerProvisioningServiceContract,
};
