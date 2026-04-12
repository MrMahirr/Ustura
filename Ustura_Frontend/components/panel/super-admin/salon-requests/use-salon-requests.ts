import { useCallback, useEffect, useMemo, useState } from 'react';

import type { OwnerApplicationRecord } from '@/services/platform-admin.service';
import {
  approveOwnerApplication,
  getOwnerApplications,
  rejectOwnerApplication,
} from '@/services/platform-admin.service';

import {
  computeStats,
  extractCities,
  filterApplications,
  mapApplicationToListItem,
} from './data';
import type {
  ApplicationStatusFilter,
  SalonRequestListItem,
  SalonRequestStats,
} from './types';

export function useSalonRequests() {
  const [rawApplications, setRawApplications] = useState<
    OwnerApplicationRecord[]
  >([]);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] =
    useState<ApplicationStatusFilter>('all');
  const [cityFilter, setCityFilter] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [mutating, setMutating] = useState(false);

  const allItems: SalonRequestListItem[] = useMemo(
    () => rawApplications.map(mapApplicationToListItem),
    [rawApplications],
  );

  const stats: SalonRequestStats = useMemo(
    () => computeStats(rawApplications),
    [rawApplications],
  );

  const cities = useMemo(() => extractCities(allItems), [allItems]);

  const filteredItems = useMemo(
    () => filterApplications(allItems, statusFilter, cityFilter, query),
    [allItems, statusFilter, cityFilter, query],
  );

  const selectedItem = useMemo(
    () => allItems.find((item) => item.id === selectedId) ?? null,
    [allItems, selectedId],
  );

  const selectedRaw = useMemo(
    () => rawApplications.find((app) => app.id === selectedId) ?? null,
    [rawApplications, selectedId],
  );

  const load = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await getOwnerApplications();
      setRawApplications(data);
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Basvurular yuklenemedi.',
      );
      setRawApplications([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    const run = async () => {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const data = await getOwnerApplications();
        if (active) setRawApplications(data);
      } catch (err) {
        if (active) {
          setErrorMessage(
            err instanceof Error ? err.message : 'Basvurular yuklenemedi.',
          );
          setRawApplications([]);
        }
      } finally {
        if (active) setIsLoading(false);
      }
    };
    void run();
    return () => {
      active = false;
    };
  }, []);

  const handleApprove = useCallback(
    async (applicationId: string) => {
      setMutating(true);
      try {
        const updated = await approveOwnerApplication(applicationId);
        setRawApplications((prev) =>
          prev.map((app) => (app.id === updated.id ? updated : app)),
        );
      } catch {
        // caller can handle via UI
      } finally {
        setMutating(false);
      }
    },
    [],
  );

  const handleReject = useCallback(
    async (applicationId: string, reason?: string) => {
      setMutating(true);
      try {
        const updated = await rejectOwnerApplication(applicationId, reason);
        setRawApplications((prev) =>
          prev.map((app) => (app.id === updated.id ? updated : app)),
        );
      } catch {
        // caller can handle via UI
      } finally {
        setMutating(false);
      }
    },
    [],
  );

  return {
    query,
    setQuery,
    statusFilter,
    setStatusFilter,
    cityFilter,
    setCityFilter,
    cities,
    stats,
    filteredItems,
    selectedId,
    selectedItem,
    selectedRaw,
    setSelectedId,
    isLoading,
    errorMessage,
    mutating,
    reload: load,
    handleApprove,
    handleReject,
  };
}
