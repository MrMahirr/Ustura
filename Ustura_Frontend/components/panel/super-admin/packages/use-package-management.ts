import React from 'react';
import { PackageService, type Package, type PackageOverview, type Subscription } from '@/services/package.service';

export function usePackageManagement() {
  const [query, setQuery] = React.useState('');
  const [packages, setPackages] = React.useState<Package[]>([]);
  const [subscriptions, setSubscriptions] = React.useState<Subscription[]>([]);
  const [overview, setOverview] = React.useState<PackageOverview | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchData = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [pkgs, subs, stats] = await Promise.all([
        PackageService.getAllPackages(),
        PackageService.getAllSubscriptions(),
        PackageService.getOverviewStats(),
      ]);
      
      setPackages(pkgs);
      setSubscriptions(subs);
      setOverview(stats);
    } catch (err: any) {
      console.error('Failed to fetch package data:', err);
      setError(err.message || 'Veriler yuklenirken bir hata olustu.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredSubscriptions = React.useMemo(() => {
    if (!query.trim()) {
      return subscriptions;
    }

    const lowerQuery = query.toLocaleLowerCase('tr-TR');
    return subscriptions.filter(
      (sub) =>
        sub.salonName.toLocaleLowerCase('tr-TR').includes(lowerQuery) ||
        sub.packageName.toLocaleLowerCase('tr-TR').includes(lowerQuery),
    );
  }, [query, subscriptions]);

  const createPackage = async (data: any) => {
    try {
      await PackageService.createPackage(data);
      await fetchData(); // Refresh
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  return {
    query,
    setQuery,
    packages,
    subscriptions: filteredSubscriptions,
    overview: overview || {
      totalPackages: 0,
      activeSubscriptions: 0,
      subscriptionGrowthPercent: 0,
      monthlyRevenue: 0,
      pendingApprovals: 0,
    },
    isLoading,
    error,
    refresh: fetchData,
    createPackage,
  };
}
