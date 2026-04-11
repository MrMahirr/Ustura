export type SalonStatus = 'Aktif' | 'Askiya Alindi';

export interface SalonListItem {
  id: string;
  reference: string;
  name: string;
  owner: string;
  ownerEmail: string;
  location: string;
  status: SalonStatus;
  imageUrl: string;
  mutedImage?: boolean;
  joinedAtLabel: string;
  updatedAtLabel: string;
}

export interface SalonOverview {
  totalRecords: number;
  activeSalons: number;
  inactiveSalons: number;
  cityCount: number;
  newSalonsLast30Days: number;
}
