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

export interface PackageApproval {
  id: string;
  salonId: string;
  salonName: string;
  salonCity: string;
  salonPhotoUrl: string | null;
  salonCreatedAt: Date;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  packageId: string;
  packageName: string;
  packageTier: PackageTier;
  packagePricePerMonth: number;
  subscriptionStatus: SubscriptionStatus;
  subscriptionStartDate: Date;
  subscriptionEndDate: Date | null;
  submittedAt: Date;
  updatedAt: Date;
  staffCount: number;
  reservationCount: number;
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

export interface SalonSubscriptionDetail {
  packageId: string | null;
  packageName: string | null;
  packageTier: PackageTier | null;
  pricePerMonth: number | null;
  status: SubscriptionStatus | null;
  startDate: Date | null;
  endDate: Date | null;
  reservationCount: number;
  reservationLimit: number | null;
  staffCount: number;
  staffLimit: number | null;
  salonCount: number;
  salonLimit: number | null;
}

export interface PackageApprovalRow extends QueryResultRow {
  id: string;
  salon_id: string;
  salon_name: string;
  salon_city: string;
  salon_photo_url: string | null;
  salon_created_at: Date;
  owner_id: string;
  owner_name: string;
  owner_email: string;
  package_id: string;
  package_name: string;
  package_tier: string;
  package_price_per_month: string | number;
  subscription_status: SubscriptionStatus;
  subscription_start_date: Date;
  subscription_end_date: Date | null;
  submitted_at: Date;
  updated_at: Date;
  staff_count: number;
  reservation_count: number;
}
