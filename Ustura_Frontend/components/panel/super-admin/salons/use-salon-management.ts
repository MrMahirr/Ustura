import React from 'react';

import {
  salonPlanOptions,
  salonRecords,
  salonSortOptions,
  salonStatusOptions,
} from '@/components/panel/super-admin/salon-management.data';
import { matchesQuery } from '@/utils/matches-query';

const PAGE_SIZE = 4;

export function useSalonManagement() {
  const [query, setQuery] = React.useState('');
  const [statusIndex, setStatusIndex] = React.useState(0);
  const [planIndex, setPlanIndex] = React.useState(0);
  const [sortIndex, setSortIndex] = React.useState(0);
  const [page, setPage] = React.useState(1);

  React.useEffect(() => {
    setPage(1);
  }, [query, statusIndex, planIndex, sortIndex]);

  const filteredSalons = salonRecords
    .filter((salon) => {
      const selectedStatus = salonStatusOptions[statusIndex];
      const selectedPlan = salonPlanOptions[planIndex];

      return (
        (selectedStatus === 'Tum Durumlar' || salon.status === selectedStatus) &&
        (selectedPlan === 'Tum Paketler' || salon.plan === selectedPlan) &&
        matchesQuery(query, [salon.name, salon.reference, salon.owner, salon.ownerEmail, salon.location, salon.status, salon.plan])
      );
    })
    .sort((left, right) => {
      const sort = salonSortOptions[sortIndex];

      if (sort === 'Isme Gore (A-Z)') {
        return left.name.localeCompare(right.name, 'tr');
      }

      if (sort === 'Ciro (Yuksek)') {
        return right.monthlyRevenue - left.monthlyRevenue;
      }

      return new Date(right.joinedAt).getTime() - new Date(left.joinedAt).getTime();
    });

  const totalPages = Math.max(1, Math.ceil(filteredSalons.length / PAGE_SIZE));

  React.useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const visibleSalons = filteredSalons.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const startRow = filteredSalons.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const endRow = Math.min(page * PAGE_SIZE, filteredSalons.length);

  return {
    query,
    setQuery,
    page,
    totalPages,
    visibleSalons,
    filteredSalonsCount: filteredSalons.length,
    startRow,
    endRow,
    selectedStatus: salonStatusOptions[statusIndex],
    selectedPlan: salonPlanOptions[planIndex],
    selectedSort: salonSortOptions[sortIndex],
    cycleStatus: () => setStatusIndex((current) => (current + 1) % salonStatusOptions.length),
    cyclePlan: () => setPlanIndex((current) => (current + 1) % salonPlanOptions.length),
    cycleSort: () => setSortIndex((current) => (current + 1) % salonSortOptions.length),
    setPage,
  };
}
