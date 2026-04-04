import React from 'react';

import {
  activeSalons,
  approvalRequests,
  recentAppointments,
  recentSalons,
} from '@/components/panel/super-admin/data';
import { matchesQuery } from '@/utils/matches-query';

export function useDashboardData() {
  const [query, setQuery] = React.useState('');

  const filteredActiveSalons = activeSalons.filter((salon) => matchesQuery(query, [salon.name, salon.appointments]));
  const filteredAppointments = recentAppointments.filter((appointment) =>
    matchesQuery(query, [appointment.salon, appointment.user, appointment.barber, appointment.time, appointment.status])
  );
  const filteredRecentSalons = recentSalons.filter((salon) => matchesQuery(query, [salon.name, salon.addedAt]));
  const filteredApprovals = approvalRequests.filter((approval) =>
    matchesQuery(query, [approval.name, approval.summary, approval.status])
  );

  return {
    query,
    setQuery,
    filteredActiveSalons,
    filteredAppointments,
    filteredRecentSalons,
    filteredApprovals,
  };
}
