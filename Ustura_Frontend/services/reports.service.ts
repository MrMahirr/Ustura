import { apiRequest } from './api';

export type AdminReportPeriod = 'today' | 'week' | 'month' | 'year' | 'custom';

export interface AdminReportsDashboard {
  period: string;
  rangeFrom: string;
  rangeTo: string;
  kpis: {
    id: string;
    label: string;
    valueFormatted: string;
    deltaLabel: string;
    deltaPositive: boolean;
    progress: number;
    accent: 'primary' | 'blue' | 'primaryContainer' | 'outline';
  }[];
  revenueSeries: { day: number; current: number; previous: number }[];
  revenueXLabels: string[];
  packageShare: { label: string; value: number; tier: string }[];
  salonGrowth: { month: number; monthLabel: string; basvuru: number; onay: number }[];
  cities: { city: string; salons: number; share: number }[];
  heatmap: number[][];
  hourly: { hour: string; h: number }[];
  topSalons: {
    rank: number;
    name: string;
    location: string;
    revenueFormatted: string;
    occupancyPct: number;
    rating: string;
    status: 'Elite' | 'Verified';
  }[];
  liveFeed: {
    id: string;
    icon: string;
    title: string;
    subtitle: string;
    tone: 'primary' | 'success' | 'info' | 'muted';
  }[];
  system: {
    apiUptimePct: number;
    responseTimeMs: number;
    errorRatePct: number;
  };
}

export class ReportsService {
  static async dashboard(period: AdminReportPeriod): Promise<AdminReportsDashboard> {
    return apiRequest<AdminReportsDashboard>({
      path: '/admin/reports/dashboard',
      method: 'GET',
      query: { period },
      auth: true,
    });
  }
}
