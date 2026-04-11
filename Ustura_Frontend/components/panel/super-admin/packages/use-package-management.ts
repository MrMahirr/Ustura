import React from 'react';

import type {
  PackageApproval as ApiPackageApproval,
  Package as ApiPackage,
  PackageOverview,
  Subscription as ApiSubscription,
  SubscriptionStatus as ApiSubscriptionStatus,
  CreatePackageInput,
  UpdatePackageInput,
} from '@/services/package.service';
import { PackageService } from '@/services/package.service';

import type {
  PackageApprovalCounts,
  PackageApprovalRecord,
} from '@/components/panel/super-admin/package-approvals/types';

import type {
  PackageDefinition,
  SubscriptionRecord,
  SubscriptionStatus,
} from './types';

function formatDateLabel(value: string | null) {
  if (!value) {
    return null;
  }

  return new Intl.DateTimeFormat('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(value));
}

function formatInitial(name: string) {
  return name.trim().slice(0, 1).toLocaleUpperCase('tr-TR') || '?';
}

function mapSubscriptionStatus(status: ApiSubscriptionStatus): SubscriptionStatus {
  switch (status) {
    case 'active':
      return 'Aktif';
    case 'expired':
      return 'Suresi Doldu';
    case 'cancelled':
      return 'Iptal Edildi';
    case 'pending':
    default:
      return 'Beklemede';
  }
}

function calculateBusinessDurationLabel(salonCreatedAt: string) {
  const createdAt = new Date(salonCreatedAt);
  const now = new Date();
  const diffMonths =
    (now.getFullYear() - createdAt.getFullYear()) * 12 +
    (now.getMonth() - createdAt.getMonth());

  if (diffMonths <= 0) {
    return 'Yeni';
  }

  if (diffMonths < 12) {
    return `${diffMonths} Ay`;
  }

  const years = Math.max(1, Math.floor(diffMonths / 12));
  return `${years} Yil`;
}

function mapApprovalStatus(status: ApiSubscriptionStatus) {
  if (status === 'active') {
    return 'approved' as const;
  }

  if (status === 'cancelled') {
    return 'rejected' as const;
  }

  return 'pending' as const;
}

function mapPackageApproval(record: ApiPackageApproval): PackageApprovalRecord {
  const generatedHighlights = [
    `${record.staffCount} Berber`,
    `${new Intl.NumberFormat('tr-TR').format(record.reservationCount)} Randevu`,
    record.packageTier === 'kurumsal'
      ? 'Kurumsal Talep'
      : record.packageTier === 'profesyonel'
        ? 'Profesyonel Talep'
        : 'Temel Talep',
  ];

  return {
    id: record.id,
    salonName: record.salonName,
    city: record.salonCity,
    ownerName: record.ownerName,
    ownerRole: record.ownerEmail,
    packageName: record.packageName,
    packageTier: record.packageTier,
    packageSummary: `${record.salonName} salonu ${record.packageName} paketi icin gecis veya aktivasyon talebi olusturdu.`,
    pricePerMonth: record.packagePricePerMonth,
    submittedAt: formatDateLabel(record.submittedAt) ?? '-',
    staffCount: record.staffCount,
    monthlyReservations: record.reservationCount,
    businessDurationLabel: calculateBusinessDurationLabel(record.salonCreatedAt),
    highlights: generatedHighlights,
    reviewerNote:
      record.subscriptionStatus === 'pending'
        ? 'Talep beklemede. Paket, salon hacmi ve mevcut operasyon sinyalleriyle birlikte degerlendiriliyor.'
        : record.subscriptionStatus === 'active'
          ? 'Talep onaylanmis. Abonelik aktif durumda ve paket kullanimda.'
          : 'Talep reddedilmis veya iptal edilmis. Gerekirse tekrar inceleme icin beklemeye alinabilir.',
    status: mapApprovalStatus(record.subscriptionStatus),
    heroImageUri:
      record.salonPhotoUrl ??
      'https://images.unsplash.com/photo-1512690459411-b0fd1c86b8e0?auto=format&fit=crop&w=900&q=80',
  };
}

function buildApprovalCounts(
  approvals: PackageApprovalRecord[],
): PackageApprovalCounts {
  return approvals.reduce<PackageApprovalCounts>(
    (accumulator, approval) => {
      accumulator[approval.status] += 1;
      return accumulator;
    },
    { pending: 0, approved: 0, rejected: 0 },
  );
}

function mapPackageDefinition(
  pkg: ApiPackage,
  subscriptions: ApiSubscription[],
): PackageDefinition {
  const activeSalonCount = subscriptions.filter(
    (subscription) =>
      subscription.packageId === pkg.id && subscription.status === 'active',
  ).length;

  return {
    id: pkg.id,
    tier: pkg.tier,
    tierLabel: pkg.tierLabel,
    name: pkg.name,
    pricePerMonth: pkg.pricePerMonth,
    features: pkg.features,
    activeSalonCount,
    isFeatured: pkg.isFeatured,
    isActive: pkg.isActive,
  };
}

function mapSubscriptionRecord(subscription: ApiSubscription): SubscriptionRecord {
  return {
    id: subscription.id,
    salonName: subscription.salonName,
    salonInitial: subscription.salonInitial ?? formatInitial(subscription.salonName),
    packageName: subscription.packageName,
    packageTier: subscription.packageTier,
    startDate: formatDateLabel(subscription.startDate) ?? '-',
    endDate: formatDateLabel(subscription.endDate),
    status: mapSubscriptionStatus(subscription.status),
  };
}

export function usePackageManagement() {
  const [query, setQuery] = React.useState('');
  const [packages, setPackages] = React.useState<PackageDefinition[]>([]);
  const [subscriptions, setSubscriptions] = React.useState<SubscriptionRecord[]>([]);
  const [approvals, setApprovals] = React.useState<PackageApprovalRecord[]>([]);
  const [approvalCounts, setApprovalCounts] =
    React.useState<PackageApprovalCounts>({
      pending: 0,
      approved: 0,
      rejected: 0,
    });
  const [overview, setOverview] = React.useState<PackageOverview | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [isMutating, setIsMutating] = React.useState(false);
  const deferredQuery = React.useDeferredValue(query);

  const fetchData = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [pkgs, subs, stats, approvalQueue] = await Promise.all([
        PackageService.getAdminPackages(),
        PackageService.getAllSubscriptions(),
        PackageService.getOverviewStats(),
        PackageService.getPackageApprovals(),
      ]);

      setPackages(pkgs.map((pkg) => mapPackageDefinition(pkg, subs)));
      setSubscriptions(subs.map(mapSubscriptionRecord));

      const mappedApprovals = approvalQueue.map(mapPackageApproval);
      setApprovals(mappedApprovals);
      setApprovalCounts(buildApprovalCounts(mappedApprovals));
      setOverview(stats);
    } catch (err: any) {
      console.error('Failed to fetch package data:', err);
      setError(err.message || 'Veriler yuklenirken bir hata olustu.');
      setPackages([]);
      setSubscriptions([]);
      setApprovals([]);
      setApprovalCounts({ pending: 0, approved: 0, rejected: 0 });
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const filteredPackages = React.useMemo(() => {
    if (!deferredQuery.trim()) {
      return packages;
    }

    const lowerQuery = deferredQuery.toLocaleLowerCase('tr-TR');

    return packages.filter(
      (pkg) =>
        pkg.name.toLocaleLowerCase('tr-TR').includes(lowerQuery) ||
        pkg.tierLabel.toLocaleLowerCase('tr-TR').includes(lowerQuery) ||
        pkg.features.some((feature) =>
          feature.label.toLocaleLowerCase('tr-TR').includes(lowerQuery),
        ),
    );
  }, [deferredQuery, packages]);

  const filteredSubscriptions = React.useMemo(() => {
    if (!deferredQuery.trim()) {
      return subscriptions;
    }

    const lowerQuery = deferredQuery.toLocaleLowerCase('tr-TR');
    return subscriptions.filter(
      (sub) =>
        sub.salonName.toLocaleLowerCase('tr-TR').includes(lowerQuery) ||
        sub.packageName.toLocaleLowerCase('tr-TR').includes(lowerQuery),
    );
  }, [deferredQuery, subscriptions]);

  const runMutation = React.useCallback(
    async (operation: () => Promise<void>) => {
      setIsMutating(true);
      setError(null);
      try {
        await operation();
        await fetchData();
        return true;
      } catch (err: any) {
        setError(err.message || 'Islem tamamlanamadi.');
        return false;
      } finally {
        setIsMutating(false);
      }
    },
    [fetchData],
  );

  const createPackage = React.useCallback(
    async (data: CreatePackageInput) =>
      runMutation(async () => {
        await PackageService.createPackage(data);
      }),
    [runMutation],
  );

  const updatePackage = React.useCallback(
    async (packageId: string, data: UpdatePackageInput) =>
      runMutation(async () => {
        await PackageService.updatePackage(packageId, data);
      }),
    [runMutation],
  );

  const deactivatePackage = React.useCallback(
    async (packageId: string) =>
      runMutation(async () => {
        await PackageService.deactivatePackage(packageId);
      }),
    [runMutation],
  );

  const approvePackageSelection = React.useCallback(
    async (subscriptionId: string) =>
      runMutation(async () => {
        await PackageService.updateSubscriptionStatus(subscriptionId, 'active');
      }),
    [runMutation],
  );

  const rejectPackageSelection = React.useCallback(
    async (subscriptionId: string) =>
      runMutation(async () => {
        await PackageService.updateSubscriptionStatus(subscriptionId, 'cancelled');
      }),
    [runMutation],
  );

  return {
    query,
    setQuery,
    packages: filteredPackages,
    subscriptions: filteredSubscriptions,
    approvals,
    approvalCounts,
    overview: overview || {
      totalPackages: 0,
      activeSubscriptions: 0,
      subscriptionGrowthPercent: 0,
      monthlyRevenue: 0,
      pendingApprovals: 0,
    },
    isLoading,
    isMutating,
    error,
    refresh: fetchData,
    createPackage,
    updatePackage,
    deactivatePackage,
    approvePackageSelection,
    rejectPackageSelection,
  };
}
