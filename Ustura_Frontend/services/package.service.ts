import { apiRequest } from './api';

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
  createdAt: string;
  updatedAt: string;
}

export type SubscriptionStatus = 'active' | 'expired' | 'pending' | 'cancelled';

export interface Subscription {
  id: string;
  salonId: string;
  packageId: string;
  salonName: string;
  salonInitial?: string;
  packageName: string;
  packageTier: PackageTier;
  startDate: string;
  endDate: string | null;
  status: SubscriptionStatus;
}

export interface PackageApproval {
  id: string;
  salonId: string;
  salonName: string;
  salonCity: string;
  salonPhotoUrl: string | null;
  salonCreatedAt: string;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  packageId: string;
  packageName: string;
  packageTier: PackageTier;
  packagePricePerMonth: number;
  subscriptionStatus: SubscriptionStatus;
  subscriptionStartDate: string;
  subscriptionEndDate: string | null;
  submittedAt: string;
  updatedAt: string;
  staffCount: number;
  reservationCount: number;
}

export interface PackageOverview {
  totalPackages: number;
  activeSubscriptions: number;
  subscriptionGrowthPercent: number;
  monthlyRevenue: number;
  pendingApprovals: number;
}

export interface CreatePackageInput {
  name: string;
  tier: PackageTier;
  tierLabel: string;
  pricePerMonth: number;
  features: PackageFeature[];
  isFeatured?: boolean;
}

export interface UpdatePackageInput
  extends Partial<CreatePackageInput> {
  isActive?: boolean;
}

export class PackageService {
  /** List all active packages for public or admin view */
  static async getAllPackages(): Promise<Package[]> {
    return apiRequest<Package[]>({
      path: '/packages',
      method: 'GET',
    });
  }

  /** List all packages including inactive ones for super admin */
  static async getAdminPackages(): Promise<Package[]> {
    return apiRequest<Package[]>({
      path: '/packages/admin',
      method: 'GET',
      auth: true,
    });
  }

  /** Get overview stats for super admin dashboard */
  static async getOverviewStats(): Promise<PackageOverview> {
    return apiRequest<PackageOverview>({
      path: '/packages/overview',
      method: 'GET',
      auth: true,
    });
  }

  /** List all platform subscriptions for super admin */
  static async getAllSubscriptions(): Promise<Subscription[]> {
    return apiRequest<Subscription[]>({
      path: '/packages/subscriptions',
      method: 'GET',
      auth: true,
    });
  }

  /** List package approval queue for super admin */
  static async getPackageApprovals(): Promise<PackageApproval[]> {
    return apiRequest<PackageApproval[]>({
      path: '/packages/approvals',
      method: 'GET',
      auth: true,
    });
  }

  /** Get details for a specific package, including its own subscribers */
  static async getPackageById(id: string): Promise<Package & { subscribers: Subscription[] }> {
    return apiRequest<Package & { subscribers: Subscription[] }>({
      path: `/packages/${id}`,
      method: 'GET',
      auth: true,
    });
  }

  /** Create a new package definition */
  static async createPackage(input: CreatePackageInput): Promise<Package> {
    return apiRequest<Package, CreatePackageInput>({
      path: '/packages',
      method: 'POST',
      body: input,
      auth: true,
    });
  }

  /** Update an existing package definition */
  static async updatePackage(
    id: string,
    input: UpdatePackageInput,
  ): Promise<Package> {
    return apiRequest<Package, any>({
      path: `/packages/${id}`,
      method: 'PATCH',
      body: input,
      auth: true,
    });
  }

  /** Permanently delete a package (backend rejects when subscriptions exist). */
  static async deletePackage(id: string): Promise<void> {
    return apiRequest<void>({
      path: `/packages/${id}`,
      method: 'DELETE',
      auth: true,
    });
  }

  /** Update subscription status from package approval queue */
  static async updateSubscriptionStatus(
    subscriptionId: string,
    status: 'pending' | 'active' | 'cancelled',
  ): Promise<Subscription> {
    return apiRequest<Subscription, { status: 'pending' | 'active' | 'cancelled' }>({
      path: `/packages/subscriptions/${subscriptionId}/status`,
      method: 'PATCH',
      body: { status },
      auth: true,
    });
  }
}
