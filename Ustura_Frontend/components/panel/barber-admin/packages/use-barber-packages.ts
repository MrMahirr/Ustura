import React from 'react';

import { PackageService } from '@/services/package.service';
import type { Package } from '@/services/package.service';

import {
  buildCurrentPlan,
  buildFeatureCategories,
  buildPlanCards,
} from './data';
import type { SalonSubscriptionResponse } from './data';
import type {
  CurrentPlanViewModel,
  FeatureCategory,
  PlanCardViewModel,
} from './types';

export interface BarberPackagesState {
  loading: boolean;
  error: string | null;
  requesting: boolean;
  requestError: string | null;
  hasPendingRequest: boolean;
  currentPlan: CurrentPlanViewModel | null;
  planCards: PlanCardViewModel[];
  featureCategories: FeatureCategory[];
  requestSubscription: (packageId: string) => Promise<boolean>;
  refresh: () => void;
}

export function useBarberPackages(): BarberPackagesState {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [packages, setPackages] = React.useState<Package[]>([]);
  const [subscription, setSubscription] = React.useState<SalonSubscriptionResponse | null>(null);
  const [requesting, setRequesting] = React.useState(false);
  const [requestError, setRequestError] = React.useState<string | null>(null);

  const fetchData = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [pkgs, sub] = await Promise.all([
        PackageService.getAllPackages(),
        PackageService.getMySalonSubscription(),
      ]);

      setPackages(pkgs);
      setSubscription(sub);
    } catch (err: any) {
      setError(err?.message ?? 'Veriler yüklenirken hata oluştu.');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const currentPlan = React.useMemo(
    () => (subscription ? buildCurrentPlan(subscription) : null),
    [subscription],
  );

  const planCards = React.useMemo(
    () => buildPlanCards(packages, subscription?.packageId ?? null, subscription?.status ?? null),
    [packages, subscription],
  );

  const featureCategories = React.useMemo(
    () => buildFeatureCategories(packages),
    [packages],
  );

  const hasPendingRequest = subscription?.status === 'pending';

  const requestSubscription = React.useCallback(
    async (packageId: string): Promise<boolean> => {
      setRequesting(true);
      setRequestError(null);
      try {
        await PackageService.requestSubscription(packageId);
        await fetchData();
        return true;
      } catch (err: any) {
        setRequestError(
          err?.message ?? 'Paket talebi oluşturulurken hata oluştu.',
        );
        return false;
      } finally {
        setRequesting(false);
      }
    },
    [fetchData],
  );

  return {
    loading,
    error,
    requesting,
    requestError,
    hasPendingRequest,
    currentPlan,
    planCards,
    featureCategories,
    requestSubscription,
    refresh: fetchData,
  };
}
