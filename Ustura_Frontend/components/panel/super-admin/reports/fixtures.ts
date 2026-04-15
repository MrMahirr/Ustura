import type { LiveActivityItem, ReportKpi, TopSalonRow } from './types';

export const REPORT_PERIOD_LABELS = {
  today: 'Bugun',
  week: 'Bu Hafta',
  month: 'Bu Ay',
  year: 'Bu Yil',
  custom: 'Ozel',
} as const;

export const KPI_FIXTURE: ReportKpi[] = [
  {
    id: 'revenue',
    label: 'Toplam Gelir',
    value: '₺48.750',
    deltaLabel: '+18%',
    deltaPositive: true,
    progress: 0.75,
    accent: 'primary',
  },
  {
    id: 'salons',
    label: 'Aktif Salon',
    value: '142',
    deltaLabel: '+12',
    deltaPositive: true,
    progress: 0.6,
    accent: 'blue',
  },
  {
    id: 'reservations',
    label: 'Toplam Rezervasyon',
    value: '8.947',
    deltaLabel: '+23%',
    deltaPositive: true,
    progress: 0.85,
    accent: 'primaryContainer',
  },
  {
    id: 'users',
    label: 'Aktif Kullanici',
    value: '3.284',
    deltaLabel: '+8%',
    deltaPositive: true,
    progress: 0.4,
    accent: 'outline',
  },
];

export const REVENUE_X_TICKS = ['01 MAY', '07 MAY', '14 MAY', '21 MAY', '28 MAY'];

export const REVENUE_SERIES_FIXTURE = [
  { day: 1, current: 42, previous: 38 },
  { day: 7, current: 55, previous: 48 },
  { day: 14, current: 52, previous: 50 },
  { day: 21, current: 68, previous: 55 },
  { day: 28, current: 62, previous: 58 },
];

export const PACKAGE_SHARE_FIXTURE = [
  { label: 'Profesyonel', value: 51, colorKey: 'a' as const },
  { label: 'Baslangic', value: 38, colorKey: 'b' as const },
  { label: 'Kurumsal', value: 11, colorKey: 'c' as const },
];

export const SALON_GROWTH_FIXTURE = [
  { month: 0, basvuru: 40, onay: 30 },
  { month: 1, basvuru: 60, onay: 45 },
  { month: 2, basvuru: 85, onay: 70 },
  { month: 3, basvuru: 70, onay: 65 },
  { month: 4, basvuru: 95, onay: 88 },
];

export const MONTH_SHORT_TR = ['OCAK', 'SUB', 'MAR', 'NIS', 'MAY'];

export const CITY_SALON_FIXTURE = [
  { city: 'Istanbul', salons: 62, share: 0.78 },
  { city: 'Ankara', salons: 28, share: 0.45 },
  { city: 'Izmir', salons: 24, share: 0.38 },
  { city: 'Bursa', salons: 18, share: 0.28 },
];

/** 53 columns x 7 rows — intensity 0–4 */
export function buildHeatmapLevels(seed = 42): number[][] {
  let s = seed;
  const next = () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return (s % 5) as 0 | 1 | 2 | 3 | 4;
  };
  const rows: number[][] = [];
  for (let r = 0; r < 7; r += 1) {
    const row: number[] = [];
    for (let c = 0; c < 53; c += 1) {
      row.push(next());
    }
    rows.push(row);
  }
  return rows;
}

export const HOURLY_AVG_FIXTURE = [
  { hour: '09:00', h: 0.1 },
  { hour: '10:00', h: 0.2 },
  { hour: '11:00', h: 0.45 },
  { hour: '12:00', h: 0.55 },
  { hour: '13:00', h: 0.25 },
  { hour: '14:00', h: 0.35 },
  { hour: '15:00', h: 0.75 },
  { hour: '16:00', h: 1 },
  { hour: '17:00', h: 0.9 },
  { hour: '18:00', h: 0.65 },
  { hour: '19:00', h: 0.3 },
];

export const TOP_SALONS_FIXTURE: TopSalonRow[] = [
  {
    rank: 1,
    name: 'The Noble Barber Shop',
    location: 'Nisantasi, Istanbul',
    revenue: '₺12.450',
    occupancyPct: 94,
    rating: '4.9',
    status: 'Elite',
  },
  {
    rank: 2,
    name: 'Maestro Grooming',
    location: 'Besiktas, Istanbul',
    revenue: '₺9.800',
    occupancyPct: 88,
    rating: '4.8',
    status: 'Elite',
  },
  {
    rank: 3,
    name: 'Old School Classics',
    location: 'Cankaya, Ankara',
    revenue: '₺7.220',
    occupancyPct: 82,
    rating: '4.7',
    status: 'Verified',
  },
];

export const LIVE_ACTIVITY_FIXTURE: LiveActivityItem[] = [
  {
    id: '1',
    icon: 'verified',
    title: 'Mahir Kuafor salon basvurusu onaylandi.',
    subtitle: 'Simdi • Onay Sureci',
    tone: 'primary',
  },
  {
    id: '2',
    icon: 'payments',
    title: 'Gold Cut Atelier profesyonel paket odemesi alindi (₺1.250).',
    subtitle: '12 Dakika Once • Finans',
    tone: 'success',
  },
  {
    id: '3',
    icon: 'event-available',
    title: 'Trend Barber 500. rezervasyonunu tamamladi.',
    subtitle: '34 Dakika Once • Milestone',
    tone: 'info',
  },
  {
    id: '4',
    icon: 'person-add',
    title: 'Yeni uye kaydi: Ahmet Yilmaz.',
    subtitle: '1 Saat Once • Kullanici',
    tone: 'muted',
  },
];
