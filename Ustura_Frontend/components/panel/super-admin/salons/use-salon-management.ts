import React from 'react';

import type {
  AdminSalonFilters,
  AdminSalonRecord,
} from '@/services/salon.service';
import {
  getAdminSalonCities,
  getAdminSalons,
} from '@/services/salon.service';

import type { SalonListItem, SalonOverview, SalonStatus } from './types';

const PAGE_SIZE = 4;
const DEFAULT_IMAGE_URI =
  'https://images.unsplash.com/photo-1512690459411-b0fd1c86b8e0?auto=format&fit=crop&w=400&q=80';

const statusOptions = ['Tum Durumlar', 'Aktif', 'Askiya Alindi'] as const;
const sortOptions = [
  'En Yeni',
  'Isme Gore (A-Z)',
  'Isme Gore (Z-A)',
  'Son Guncellenen',
] as const;

function formatLocation(city: string, district?: string | null) {
  return district ? `${city}, ${district}` : city;
}

function formatSalonReference(id: string) {
  return `#${id.replace(/-/g, '').slice(0, 6).toLocaleUpperCase('tr-TR')}`;
}

function formatDateLabel(value: string) {
  return new Intl.DateTimeFormat('tr-TR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
}

function mapSalonStatus(isActive: boolean): SalonStatus {
  return isActive ? 'Aktif' : 'Askiya Alindi';
}

function mapSortValue(
  value: (typeof sortOptions)[number],
): NonNullable<AdminSalonFilters['sort']> {
  switch (value) {
    case 'Isme Gore (A-Z)':
      return 'name_asc';
    case 'Isme Gore (Z-A)':
      return 'name_desc';
    case 'Son Guncellenen':
      return 'updated_desc';
    case 'En Yeni':
    default:
      return 'newest';
  }
}

function mapStatusValue(
  value: (typeof statusOptions)[number],
): AdminSalonFilters['status'] {
  if (value === 'Aktif') {
    return 'active';
  }

  if (value === 'Askiya Alindi') {
    return 'inactive';
  }

  return undefined;
}

function mapAdminSalonToListItem(salon: AdminSalonRecord): SalonListItem {
  return {
    id: salon.id,
    reference: formatSalonReference(salon.id),
    name: salon.name,
    owner: salon.ownerName,
    ownerEmail: salon.ownerEmail,
    location: formatLocation(salon.city, salon.district),
    status: mapSalonStatus(salon.isActive),
    imageUrl: salon.photoUrl || DEFAULT_IMAGE_URI,
    mutedImage: !salon.isActive,
    joinedAtLabel: formatDateLabel(salon.createdAt),
    updatedAtLabel: formatDateLabel(salon.updatedAt),
  };
}

function cycleOption<TOption extends string>(
  options: readonly TOption[],
  current: TOption,
) {
  const currentIndex = options.indexOf(current);
  return options[(currentIndex + 1) % options.length];
}

export function useSalonManagement() {
  const [query, setQuery] = React.useState('');
  const [selectedStatus, setSelectedStatus] =
    React.useState<(typeof statusOptions)[number]>('Tum Durumlar');
  const [selectedSort, setSelectedSort] =
    React.useState<(typeof sortOptions)[number]>('En Yeni');
  const [cities, setCities] = React.useState<string[]>([]);
  const [selectedCity, setSelectedCity] = React.useState('Tum Sehirler');
  const [page, setPage] = React.useState(1);
  const [salons, setSalons] = React.useState<SalonListItem[]>([]);
  const [totalPages, setTotalPages] = React.useState(1);
  const [filteredSalonsCount, setFilteredSalonsCount] = React.useState(0);
  const [overview, setOverview] = React.useState<SalonOverview>({
    totalRecords: 0,
    activeSalons: 0,
    inactiveSalons: 0,
    cityCount: 0,
    newSalonsLast30Days: 0,
  });
  const [isLoading, setIsLoading] = React.useState(true);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const cityOptions = React.useMemo(
    () => ['Tum Sehirler', ...cities],
    [cities],
  );

  React.useEffect(() => {
    if (!cityOptions.includes(selectedCity)) {
      setSelectedCity('Tum Sehirler');
    }
  }, [cityOptions, selectedCity]);

  React.useEffect(() => {
    setPage(1);
  }, [query, selectedStatus, selectedSort, selectedCity]);

  const loadCities = React.useCallback(async () => {
    try {
      const nextCities = await getAdminSalonCities();
      setCities(nextCities);
    } catch {
      setCities([]);
    }
  }, []);

  const loadSalons = React.useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await getAdminSalons({
        search: query.trim() || undefined,
        city: selectedCity === 'Tum Sehirler' ? undefined : selectedCity,
        status: mapStatusValue(selectedStatus),
        sort: mapSortValue(selectedSort),
        page,
        pageSize: PAGE_SIZE,
      });

      setSalons(response.items.map(mapAdminSalonToListItem));
      setFilteredSalonsCount(response.pagination.total);
      setTotalPages(Math.max(response.pagination.totalPages, 1));
      setOverview({
        totalRecords: response.overview.total,
        activeSalons: response.overview.active,
        inactiveSalons: response.overview.inactive,
        cityCount: response.overview.cityCount,
        newSalonsLast30Days: response.overview.newLast30Days,
      });
    } catch (loadError) {
      setSalons([]);
      setFilteredSalonsCount(0);
      setTotalPages(1);
      setErrorMessage(
        loadError instanceof Error
          ? loadError.message
          : 'Salon listesi yuklenemedi.',
      );
    } finally {
      setIsLoading(false);
    }
  }, [page, query, selectedCity, selectedSort, selectedStatus]);

  React.useEffect(() => {
    let isActive = true;

    const run = async () => {
      try {
        const nextCities = await getAdminSalonCities();

        if (!isActive) {
          return;
        }

        setCities(nextCities);
      } catch {
        if (isActive) {
          setCities([]);
        }
      }
    };

    void run();

    return () => {
      isActive = false;
    };
  }, []);

  React.useEffect(() => {
    let isActive = true;

    const run = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await getAdminSalons({
          search: query.trim() || undefined,
          city: selectedCity === 'Tum Sehirler' ? undefined : selectedCity,
          status: mapStatusValue(selectedStatus),
          sort: mapSortValue(selectedSort),
          page,
          pageSize: PAGE_SIZE,
        });

        if (!isActive) {
          return;
        }

        setSalons(response.items.map(mapAdminSalonToListItem));
        setFilteredSalonsCount(response.pagination.total);
        setTotalPages(Math.max(response.pagination.totalPages, 1));
        setOverview({
          totalRecords: response.overview.total,
          activeSalons: response.overview.active,
          inactiveSalons: response.overview.inactive,
          cityCount: response.overview.cityCount,
          newSalonsLast30Days: response.overview.newLast30Days,
        });
      } catch (loadError) {
        if (!isActive) {
          return;
        }

        setSalons([]);
        setFilteredSalonsCount(0);
        setTotalPages(1);
        setErrorMessage(
          loadError instanceof Error
            ? loadError.message
            : 'Salon listesi yuklenemedi.',
        );
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
  }, [page, query, selectedCity, selectedSort, selectedStatus]);

  const startRow =
    filteredSalonsCount === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const endRow = Math.min(page * PAGE_SIZE, filteredSalonsCount);

  return {
    query,
    setQuery,
    page,
    setPage,
    totalPages,
    visibleSalons: salons,
    filteredSalonsCount,
    startRow,
    endRow,
    selectedStatus,
    selectedCity,
    selectedSort,
    totalRecords: overview.totalRecords,
    overview,
    isLoading,
    errorMessage,
    reload: loadSalons,
    cycleStatus: () =>
      setSelectedStatus((current) => cycleOption(statusOptions, current)),
    cycleCity: () =>
      setSelectedCity((current) =>
        cycleOption(cityOptions, current),
      ),
    cycleSort: () =>
      setSelectedSort((current) => cycleOption(sortOptions, current)),
    refreshCities: loadCities,
    statusOptions: [...statusOptions],
    sortOptions: [...sortOptions],
    cityOptions,
    setSelectedStatus,
    setSelectedCity,
    setSelectedSort,
  };
}
