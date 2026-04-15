import type { ComponentProps } from 'react';
import { MaterialIcons } from '@expo/vector-icons';

export type ReportMaterialIconName = ComponentProps<typeof MaterialIcons>['name'];

export type ReportPeriodId = 'today' | 'week' | 'month' | 'year' | 'custom';

export interface ReportKpi {
  id: string;
  label: string;
  value: string;
  deltaLabel: string;
  deltaPositive: boolean;
  progress: number;
  accent: 'primary' | 'blue' | 'primaryContainer' | 'outline';
}

export interface TopSalonRow {
  rank: number;
  name: string;
  location: string;
  revenue: string;
  occupancyPct: number;
  rating: string;
  status: 'Elite' | 'Verified';
}

export interface LiveActivityItem {
  id: string;
  /** MaterialIcons adi (API veya fixture) */
  icon: ReportMaterialIconName | string;
  title: string;
  subtitle: string;
  tone: 'primary' | 'success' | 'info' | 'muted';
}
