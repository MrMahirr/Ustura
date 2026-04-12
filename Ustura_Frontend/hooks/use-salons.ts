import React from 'react';

import {
  getSalonById,
  getSalonCities,
  getSalons,
  type PaginationMeta,
  type SalonFilters,
  type SalonRecord,
} from '@/services/salon.service';

const EMPTY_PAGINATION: PaginationMeta = {
  page: 1,
  pageSize: 6,
  total: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};

export function useSalons(filters: SalonFilters = {}) {
  const city = filters.city?.trim() || undefined;
  const search = filters.search?.trim() || undefined;
  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? 6;
  const [salons, setSalons] = React.useState<SalonRecord[]>([]);
  const [pagination, setPagination] = React.useState<PaginationMeta>({
    ...EMPTY_PAGINATION,
    page,
    pageSize,
  });
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const loadSalons = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const nextResponse = await getSalons({ city, search, page, pageSize });
      setSalons(nextResponse.items);
      setPagination(nextResponse.pagination);
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : 'Salonlar yuklenemedi.',
      );
      setSalons([]);
      setPagination({
        ...EMPTY_PAGINATION,
        page,
        pageSize,
      });
    } finally {
      setIsLoading(false);
    }
  }, [city, page, pageSize, search]);

  React.useEffect(() => {
    let isActive = true;

    const run = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const nextResponse = await getSalons({ city, search, page, pageSize });

        if (!isActive) {
          return;
        }

        setSalons(nextResponse.items);
        setPagination(nextResponse.pagination);
      } catch (loadError) {
        if (!isActive) {
          return;
        }

        setError(
          loadError instanceof Error
            ? loadError.message
            : 'Salonlar yuklenemedi.',
        );
        setSalons([]);
        setPagination({
          ...EMPTY_PAGINATION,
          page,
          pageSize,
        });
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void run();

    return () => {
      isActive = false;
    };
  }, [city, page, pageSize, search]);

  return {
    salons,
    pagination,
    isLoading,
    error,
    reload: loadSalons,
  };
}

export function useSalonCities() {
  const [cities, setCities] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const loadCities = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const nextCities = await getSalonCities();
      setCities(nextCities);
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : 'Sehirler yuklenemedi.',
      );
      setCities([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    let isActive = true;

    const run = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const nextCities = await getSalonCities();

        if (!isActive) {
          return;
        }

        setCities(nextCities);
      } catch (loadError) {
        if (!isActive) {
          return;
        }

        setError(
          loadError instanceof Error ? loadError.message : 'Sehirler yuklenemedi.',
        );
        setCities([]);
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void run();

    return () => {
      isActive = false;
    };
  }, []);

  return {
    cities,
    isLoading,
    error,
    reload: loadCities,
  };
}

export function useSalonById(salonId?: string | null) {
  const [salon, setSalon] = React.useState<SalonRecord | null>(null);
  const [isLoading, setIsLoading] = React.useState(Boolean(salonId));
  const [error, setError] = React.useState<string | null>(null);

  const loadSalon = React.useCallback(async () => {
    if (!salonId) {
      setSalon(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const nextSalon = await getSalonById(salonId);
      setSalon(nextSalon);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'Salon bilgisi yuklenemedi.',
      );
      setSalon(null);
    } finally {
      setIsLoading(false);
    }
  }, [salonId]);

  React.useEffect(() => {
    let isActive = true;

    if (!salonId) {
      setSalon(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    const run = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const nextSalon = await getSalonById(salonId);

        if (!isActive) {
          return;
        }

        setSalon(nextSalon);
      } catch (loadError) {
        if (!isActive) {
          return;
        }

        setError(
          loadError instanceof Error
            ? loadError.message
            : 'Salon bilgisi yuklenemedi.',
        );
        setSalon(null);
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void run();

    return () => {
      isActive = false;
    };
  }, [salonId]);

  return {
    salon,
    isLoading,
    error,
    reload: loadSalon,
  };
}
