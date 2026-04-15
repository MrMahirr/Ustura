import React from 'react';

import type {
  GroupedSalonRecord,
  UserFilterOption,
  UserOverview,
  UserRecord,
  UserViewMode,
} from '@/components/panel/super-admin/user-management.data';
import type { AdminUsersQuery } from '@/services/user.service';
import { UserService } from '@/services/user.service';

import {
  createCityOptions,
  createRoleOptions,
  createSalonOptions,
  createStatusOptions,
  mapAdminUserRecord,
  mapOverview,
  mapSalonMetadata,
} from './mappers';

const PAGE_SIZE = 4;

function createGroupId(user: { salonId?: string; salonName: string }) {
  return (user.salonId ?? user.salonName)
    .toLocaleLowerCase('tr-TR')
    .replace(/[^a-z0-9]+/g, '-');
}

function getStatusOrder(status: GroupedSalonRecord['users'][number]['status']) {
  if (status === 'Aktif') {
    return 0;
  }

  if (status === 'Mesgul') {
    return 1;
  }

  if (status === 'Pasif') {
    return 2;
  }

  return 3;
}

function getSalonOrder(status?: GroupedSalonRecord['salonStatus']) {
  if (status === 'Aktif') {
    return 0;
  }

  if (status === 'Beklemede') {
    return 1;
  }

  if (status === 'Askiya Alindi') {
    return 2;
  }

  return 3;
}

function buildGroupedSalons(
  users: UserRecord[],
  metadataByUserId: Map<string, ReturnType<typeof mapSalonMetadata>>,
) {
  const groupedSalonMap = users.reduce<Record<string, GroupedSalonRecord>>((accumulator, user) => {
    const metadata = metadataByUserId.get(user.id);
    const groupKey = createGroupId(user);
    const existing = accumulator[groupKey];

    if (!existing) {
      accumulator[groupKey] = {
        id: groupKey,
        salonId: user.salonId,
        salonName: user.salonName,
        salonLocation: user.salonLocation,
        city: user.city,
        plan: metadata?.plan,
        salonStatus: metadata?.salonStatus,
        totalUsers: 1,
        activeUsers: user.status === 'Aktif' ? 1 : 0,
        ownerCount: user.role === 'Sahip' ? 1 : 0,
        adminCount: user.role === 'Yonetici' ? 1 : 0,
        employeeCount: user.role === 'Calisan' ? 1 : 0,
        occupancyRate: user.dailyCapacity ? user.dailyCapacity.booked / user.dailyCapacity.total : undefined,
        capacityCount: user.dailyCapacity ? 1 : 0,
        users: [user],
      };

      return accumulator;
    }

    existing.users.push(user);
    existing.totalUsers += 1;
    existing.activeUsers += user.status === 'Aktif' ? 1 : 0;
    existing.ownerCount += user.role === 'Sahip' ? 1 : 0;
    existing.adminCount += user.role === 'Yonetici' ? 1 : 0;
    existing.employeeCount += user.role === 'Calisan' ? 1 : 0;

    if (user.dailyCapacity) {
      const currentRate = user.dailyCapacity.booked / user.dailyCapacity.total;
      existing.occupancyRate =
        typeof existing.occupancyRate === 'number'
          ? (existing.occupancyRate * existing.capacityCount + currentRate) / (existing.capacityCount + 1)
          : currentRate;
      existing.capacityCount += 1;
    }

    return accumulator;
  }, {});

  return Object.values(groupedSalonMap)
    .map((group) => ({
      ...group,
      users: [...group.users].sort((left, right) => {
        const statusDiff = getStatusOrder(left.status) - getStatusOrder(right.status);

        if (statusDiff !== 0) {
          return statusDiff;
        }

        return new Date(right.joinedAt).getTime() - new Date(left.joinedAt).getTime();
      }),
    }))
    .sort((left, right) => {
      const statusDiff = getSalonOrder(left.salonStatus) - getSalonOrder(right.salonStatus);

      if (statusDiff !== 0) {
        return statusDiff;
      }

      return right.totalUsers - left.totalUsers;
    });
}

function getSelectedOption(options: UserFilterOption[], index: number) {
  return options[Math.min(index, Math.max(0, options.length - 1))] ?? options[0] ?? { label: '' };
}

export function useUserManagement() {
  const [query, setQuery] = React.useState('');
  const [viewMode, setViewMode] = React.useState<UserViewMode>('all');
  const [roleIndex, setRoleIndex] = React.useState(0);
  const [statusIndex, setStatusIndex] = React.useState(0);
  const [salonIndex, setSalonIndex] = React.useState(0);
  const [cityIndex, setCityIndex] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [users, setUsers] = React.useState<UserRecord[]>([]);
  const [groupedSalons, setGroupedSalons] = React.useState<GroupedSalonRecord[]>([]);
  const [overview, setOverview] = React.useState<UserOverview>({
    totalUsers: 0,
    activeToday: 0,
    newRegistrations: '+0',
    conversion: '0.0%',
  });
  const [roleOptions] = React.useState(() => createRoleOptions());
  const [statusOptions] = React.useState(() => createStatusOptions());
  const [salonOptions, setSalonOptions] = React.useState<UserFilterOption[]>([{ label: 'Tum Salonlar' }]);
  const [cityOptions, setCityOptions] = React.useState<UserFilterOption[]>([{ label: 'Tum Sehirler' }]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [listRevision, setListRevision] = React.useState(0);
  const deferredQuery = React.useDeferredValue(query);

  const selectedRole = getSelectedOption(roleOptions, roleIndex);
  const selectedStatus = getSelectedOption(statusOptions, statusIndex);
  const selectedSalon = getSelectedOption(salonOptions, salonIndex);
  const selectedCity = getSelectedOption(cityOptions, cityIndex);

  React.useEffect(() => {
    setPage(1);
  }, [deferredQuery, viewMode, roleIndex, statusIndex, salonIndex, cityIndex]);

  React.useEffect(() => {
    let isMounted = true;

    const fetchUsers = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await UserService.getAdminUsers({
          search: deferredQuery.trim() || undefined,
          role: selectedRole.value as AdminUsersQuery['role'],
          status: selectedStatus.value as AdminUsersQuery['status'],
          salonId: selectedSalon.value,
          city: selectedCity.value,
        });

        if (!isMounted) {
          return;
        }

        const metadataByUserId = new Map(
          response.items.map((item) => [item.id, mapSalonMetadata(item)]),
        );
        const mappedUsers = response.items.map(mapAdminUserRecord);

        setUsers(mappedUsers);
        setGroupedSalons(buildGroupedSalons(mappedUsers, metadataByUserId));
        setOverview(mapOverview(response.overview));
        setSalonOptions(createSalonOptions(response.filters.salons));
        setCityOptions(createCityOptions(response.filters.cities));
      } catch (err: any) {
        if (!isMounted) {
          return;
        }

        console.error('Failed to fetch admin users:', err);
        setError(err?.message || 'Kullanici verileri yuklenemedi.');
        setUsers([]);
        setGroupedSalons([]);
        setOverview({
          totalUsers: 0,
          activeToday: 0,
          newRegistrations: '+0',
          conversion: '0.0%',
        });
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void fetchUsers();

    return () => {
      isMounted = false;
    };
  }, [
    deferredQuery,
    selectedCity.value,
    selectedRole.value,
    selectedSalon.value,
    selectedStatus.value,
    listRevision,
  ]);

  React.useEffect(() => {
    if (roleIndex >= roleOptions.length) {
      setRoleIndex(0);
    }

    if (statusIndex >= statusOptions.length) {
      setStatusIndex(0);
    }

    if (salonIndex >= salonOptions.length) {
      setSalonIndex(0);
    }

    if (cityIndex >= cityOptions.length) {
      setCityIndex(0);
    }
  }, [cityIndex, cityOptions.length, roleIndex, roleOptions.length, salonIndex, salonOptions.length, statusIndex, statusOptions.length]);

  const totalPages = Math.max(1, Math.ceil(users.length / PAGE_SIZE));

  React.useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const visibleUsers = React.useMemo(
    () => users.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [page, users],
  );
  const startRow = users.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const endRow = Math.min(page * PAGE_SIZE, users.length);

  const selectRole = React.useCallback((value: string | undefined) => {
    const idx = roleOptions.findIndex((o) => o.value === value);
    setRoleIndex(idx >= 0 ? idx : 0);
  }, [roleOptions]);

  const selectStatus = React.useCallback((value: string | undefined) => {
    const idx = statusOptions.findIndex((o) => o.value === value);
    setStatusIndex(idx >= 0 ? idx : 0);
  }, [statusOptions]);

  const selectSalon = React.useCallback((value: string | undefined) => {
    const idx = salonOptions.findIndex((o) => o.value === value);
    setSalonIndex(idx >= 0 ? idx : 0);
  }, [salonOptions]);

  const selectCity = React.useCallback((value: string | undefined) => {
    const idx = cityOptions.findIndex((o) => o.value === value);
    setCityIndex(idx >= 0 ? idx : 0);
  }, [cityOptions]);

  return {
    query,
    setQuery,
    viewMode,
    setViewMode,
    page,
    setPage,
    totalPages,
    visibleUsers,
    groupedSalons,
    filteredUsersCount: users.length,
    startRow,
    endRow,
    selectedRole: selectedRole.label,
    selectedRoleValue: selectedRole.value,
    selectedStatus: selectedStatus.label,
    selectedStatusValue: selectedStatus.value,
    selectedSalon: selectedSalon.label,
    selectedSalonValue: selectedSalon.value,
    selectedCity: selectedCity.label,
    selectedCityValue: selectedCity.value,
    roleOptions,
    statusOptions,
    salonOptions,
    cityOptions,
    overview,
    isLoading,
    error,
    selectRole,
    selectStatus,
    selectSalon,
    selectCity,
    resetFilters: () => {
      setRoleIndex(0);
      setStatusIndex(0);
      setSalonIndex(0);
      setCityIndex(0);
    },
    refreshUsers: () => setListRevision((current) => current + 1),
  };
}
