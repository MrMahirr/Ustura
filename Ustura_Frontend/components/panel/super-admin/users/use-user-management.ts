import React from 'react';

import {
  type GroupedSalonRecord,
  type UserViewMode,
  userCityOptions,
  userRecords,
  userRoleOptions,
  userSalonOptions,
  userStatusOptions,
} from '@/components/panel/super-admin/user-management.data';
import { salonRecords } from '@/components/panel/super-admin/salon-management.data';
import { matchesQuery } from '@/utils/matches-query';

const PAGE_SIZE = 4;
const salonRecordsById = new Map(salonRecords.map((record) => [record.id, record]));

function createGroupId(user: { salonId?: string; salonName: string }) {
  return (user.salonId ?? user.salonName).toLocaleLowerCase('tr-TR').replace(/[^a-z0-9]+/g, '-');
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

export function useUserManagement() {
  const [query, setQuery] = React.useState('');
  const [viewMode, setViewMode] = React.useState<UserViewMode>('all');
  const [roleIndex, setRoleIndex] = React.useState(0);
  const [statusIndex, setStatusIndex] = React.useState(0);
  const [salonIndex, setSalonIndex] = React.useState(0);
  const [cityIndex, setCityIndex] = React.useState(0);
  const [page, setPage] = React.useState(1);

  React.useEffect(() => {
    setPage(1);
  }, [query, viewMode, roleIndex, statusIndex, salonIndex, cityIndex]);

  const filteredUsers = userRecords.filter((user) => {
    const selectedRole = userRoleOptions[roleIndex];
    const selectedStatus = userStatusOptions[statusIndex];
    const selectedSalon = userSalonOptions[salonIndex];
    const selectedCity = userCityOptions[cityIndex];

    return (
      (selectedRole === 'Tum Roller' || user.role === selectedRole) &&
      (selectedStatus === 'Tum Durumlar' || user.status === selectedStatus) &&
      (selectedSalon === 'Tum Salonlar' || user.salonName === selectedSalon) &&
      (selectedCity === 'Tum Sehirler' || user.city === selectedCity) &&
      matchesQuery(query, [
        user.name,
        user.email,
        user.role,
        user.title,
        user.salonName,
        user.salonLocation,
        user.city,
        user.status,
        ...user.specialties,
      ])
    );
  });

  const sortedUsers = filteredUsers.sort(
    (left, right) => new Date(right.joinedAt).getTime() - new Date(left.joinedAt).getTime()
  );

  const groupedSalonMap = sortedUsers.reduce<Record<string, GroupedSalonRecord>>((acc, user) => {
    const salonRecord = user.salonId ? salonRecordsById.get(user.salonId) : undefined;
    const groupKey = createGroupId(user);
    const existing = acc[groupKey];

    if (!existing) {
      acc[groupKey] = {
        id: groupKey,
        salonId: user.salonId,
        salonName: salonRecord?.name ?? user.salonName,
        salonLocation: salonRecord?.location ?? user.salonLocation,
        city: user.city,
        plan: salonRecord?.plan,
        salonStatus: salonRecord?.status,
        totalUsers: 1,
        activeUsers: user.status === 'Aktif' ? 1 : 0,
        ownerCount: user.role === 'Sahip' ? 1 : 0,
        adminCount: user.role === 'Yonetici' ? 1 : 0,
        employeeCount: user.role === 'Calisan' ? 1 : 0,
        occupancyRate: user.dailyCapacity ? user.dailyCapacity.booked / user.dailyCapacity.total : undefined,
        capacityCount: user.dailyCapacity ? 1 : 0,
        users: [user],
      };

      return acc;
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

    return acc;
  }, {});

  const groupedSalons = Object.values(groupedSalonMap)
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

  const totalPages = Math.max(1, Math.ceil(sortedUsers.length / PAGE_SIZE));

  React.useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const visibleUsers = sortedUsers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const startRow = sortedUsers.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const endRow = Math.min(page * PAGE_SIZE, sortedUsers.length);

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
    filteredUsersCount: sortedUsers.length,
    startRow,
    endRow,
    selectedRole: userRoleOptions[roleIndex],
    selectedStatus: userStatusOptions[statusIndex],
    selectedSalon: userSalonOptions[salonIndex],
    selectedCity: userCityOptions[cityIndex],
    cycleRole: () => setRoleIndex((current) => (current + 1) % userRoleOptions.length),
    cycleStatus: () => setStatusIndex((current) => (current + 1) % userStatusOptions.length),
    cycleSalon: () => setSalonIndex((current) => (current + 1) % userSalonOptions.length),
    cycleCity: () => setCityIndex((current) => (current + 1) % userCityOptions.length),
    resetFilters: () => {
      setRoleIndex(0);
      setStatusIndex(0);
      setSalonIndex(0);
      setCityIndex(0);
    },
  };
}
