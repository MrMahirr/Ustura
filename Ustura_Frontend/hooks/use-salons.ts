import React from 'react';

import {
  getSalonById,
  getSalons,
  type SalonFilters,
  type SalonRecord,
} from '@/services/salon.service';

export function useSalons(filters: SalonFilters = {}) {
  const city = filters.city?.trim() || undefined;
  const search = filters.search?.trim() || undefined;
  const [salons, setSalons] = React.useState<SalonRecord[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const loadSalons = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const nextSalons = await getSalons({ city, search });
      setSalons(nextSalons);
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : 'Salonlar yuklenemedi.',
      );
      setSalons([]);
    } finally {
      setIsLoading(false);
    }
  }, [city, search]);

  React.useEffect(() => {
    let isActive = true;

    const run = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const nextSalons = await getSalons({ city, search });

        if (!isActive) {
          return;
        }

        setSalons(nextSalons);
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
  }, [city, search]);

  return {
    salons,
    isLoading,
    error,
    reload: loadSalons,
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
