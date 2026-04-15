export interface AdminReportKpiDto {
  id: string;
  label: string;
  valueFormatted: string;
  deltaLabel: string;
  deltaPositive: boolean;
  progress: number;
  accent: 'primary' | 'blue' | 'primaryContainer' | 'outline';
}

export interface AdminReportRevenuePointDto {
  day: number;
  current: number;
  previous: number;
}

export interface AdminReportPackageSliceDto {
  label: string;
  value: number;
  tier: string;
}

export interface AdminReportSalonGrowthPointDto {
  month: number;
  monthLabel: string;
  basvuru: number;
  onay: number;
}

export interface AdminReportCityDto {
  city: string;
  salons: number;
  share: number;
}

export interface AdminReportHourlyDto {
  hour: string;
  h: number;
}

export interface AdminReportTopSalonDto {
  rank: number;
  name: string;
  location: string;
  revenueFormatted: string;
  occupancyPct: number;
  rating: string;
  status: 'Elite' | 'Verified';
}

export interface AdminReportLiveItemDto {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  tone: 'primary' | 'success' | 'info' | 'muted';
}

export interface AdminReportSystemDto {
  apiUptimePct: number;
  responseTimeMs: number;
  errorRatePct: number;
}

export interface AdminReportsDashboardDto {
  period: string;
  rangeFrom: string;
  rangeTo: string;
  kpis: AdminReportKpiDto[];
  revenueSeries: AdminReportRevenuePointDto[];
  revenueXLabels: string[];
  packageShare: AdminReportPackageSliceDto[];
  salonGrowth: AdminReportSalonGrowthPointDto[];
  cities: AdminReportCityDto[];
  heatmap: number[][];
  hourly: AdminReportHourlyDto[];
  topSalons: AdminReportTopSalonDto[];
  liveFeed: AdminReportLiveItemDto[];
  system: AdminReportSystemDto;
}
