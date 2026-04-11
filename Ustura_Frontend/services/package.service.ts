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
  salonName: string;
  salonInitial: string;
  packageName: string;
  packageTier: PackageTier;
  startDate: string;
  endDate: string | null;
  status: SubscriptionStatus;
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

export class PackageService {
  /** List all active packages for public or admin view */
  static async getAllPackages(): Promise<Package[]> {
    return apiRequest<Package[]>({
      path: '/packages',
      method: 'GET',
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
  static async updatePackage(id: string, input: Partial<CreatePackageInput> & { isActive?: boolean }): Promise<Package> {
    return apiRequest<Package, any>({
      path: `/packages/${id}`,
      method: 'PATCH',
      body: input,
      auth: true,
    });
  }
}
