import React from 'react';

import { ReportsService, type AdminReportPeriod, type AdminReportsDashboard } from '@/services/reports.service';

import type { ReportPeriodId } from './types';

function apiPeriod(period: ReportPeriodId): AdminReportPeriod {
  return period === 'custom' ? 'month' : period;
}

export function useReportDashboard(initialPeriod: ReportPeriodId = 'month') {
  const [period, setPeriod] = React.useState<ReportPeriodId>(initialPeriod);
  const [dashboard, setDashboard] = React.useState<AdminReportsDashboard | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchDashboard = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await ReportsService.dashboard(apiPeriod(period));
      setDashboard(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Raporlar yuklenemedi.';
      setError(message);
      setDashboard(null);
    } finally {
      setIsLoading(false);
    }
  }, [period]);

  React.useEffect(() => {
    void fetchDashboard();
  }, [fetchDashboard]);

  return {
    period,
    setPeriod,
    dashboard,
    isLoading,
    error,
    refresh: fetchDashboard,
  };
}
