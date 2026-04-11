import { QueryResultRow } from 'pg';

export type PackageTier = 'baslangic' | 'profesyonel' | 'kurumsal';

export interface PackageFeature {
  label: string;
  included: boolean;
}

export interface Package {
  id: string;
  name: string;
  tier: PackageTier;
  tierLabel: string;
  pricePerMonth: number;
  features: PackageFeature[];
  isFeatured: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PackageRow extends QueryResultRow {
  id: string;
  name: string;
  tier: string;
  tier_label: string;
  price_per_month: string | number;
  features: PackageFeature[];
  is_featured: boolean;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export type SubscriptionStatus = 'active' | 'expired' | 'pending' | 'cancelled';

export interface Subscription {
  id: string;
  salonId: string;
  packageId: string;
  startDate: Date;
  endDate: Date | null;
  status: SubscriptionStatus;
  createdAt: Date;
  updatedAt: Date;
  // Joined data
  salonName?: string;
  packageName?: string;
  packageTier?: PackageTier;
}

export interface SubscriptionRow extends QueryResultRow {
  id: string;
  salon_id: string;
  package_id: string;
  start_date: Date;
  end_date: Date | null;
  status: SubscriptionStatus;
  created_at: Date;
  updated_at: Date;
  salon_name?: string;
  package_name?: string;
  package_tier?: string;
}

export interface CreatePackageInput {
  name: string;
  tier: PackageTier;
  tierLabel: string;
  pricePerMonth: number;
  features: PackageFeature[];
  isFeatured?: boolean;
}

export interface UpdatePackageInput {
  name?: string;
  tierLabel?: string;
  pricePerMonth?: number;
  features?: PackageFeature[];
  isFeatured?: boolean;
  isActive?: boolean;
}
