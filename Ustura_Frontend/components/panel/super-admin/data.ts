import type { ComponentProps } from 'react';
import { MaterialIcons } from '@expo/vector-icons';

export type MaterialIconName = ComponentProps<typeof MaterialIcons>['name'];

export interface DashboardMetric {
  id: string;
  label: string;
  value: string;
  icon: MaterialIconName;
  trendLabel: string;
  trendTone: 'positive' | 'negative' | 'neutral';
  highlight?: 'default' | 'alert';
}

export interface ActivityPoint {
  label: string;
  value: number;
}

export interface ActivitySnapshot {
  key: 'weekly' | 'monthly';
  label: string;
  headline: string;
  total: string;
  delta: string;
  points: ActivityPoint[];
}

export interface ActiveSalon {
  id: string;
  name: string;
  appointments: string;
  rating: string;
  imageUrl?: string;
}

export interface RecentAppointment {
  id: string;
  salon: string;
  user: string;
  barber: string;
  time: string;
  status: string;
  statusTone: 'success' | 'warning' | 'info';
}

export interface RecentSalon {
  id: string;
  name: string;
  addedAt: string;
}

export interface ApprovalRequest {
  id: string;
  name: string;
  summary: string;
  status: string;
}

export interface LogEntry {
  id: string;
  time: string;
  message: string;
  tone: 'success' | 'neutral' | 'error' | 'primary';
}

export interface AdminNotification {
  id: string;
  title: string;
  description: string;
  time: string;
  tone: 'success' | 'warning' | 'error' | 'primary';
  unread?: boolean;
}

export const dashboardMetrics: DashboardMetric[] = [
  {
    id: 'total-salons',
    label: 'Toplam Salon',
    value: '1,248',
    icon: 'storefront',
    trendLabel: '+12% bu ay',
    trendTone: 'positive',
  },
  {
    id: 'total-users',
    label: 'Toplam Kullanici',
    value: '42.5K',
    icon: 'group',
    trendLabel: '+8% haftalik artis',
    trendTone: 'positive',
  },
  {
    id: 'daily-bookings',
    label: 'Gunluk Randevu',
    value: '3,892',
    icon: 'calendar-today',
    trendLabel: '+24% bugun',
    trendTone: 'positive',
  },
  {
    id: 'subscriptions',
    label: 'Aktif Abonelik',
    value: '982',
    icon: 'verified',
    trendLabel: 'Stabil yenileme hizi',
    trendTone: 'neutral',
  },
  {
    id: 'daily-revenue',
    label: 'Gunluk Gelir',
    value: '₺42,150',
    icon: 'payments',
    trendLabel: '+5.2% tahsilat',
    trendTone: 'positive',
  },
  {
    id: 'errors',
    label: 'Hata / Uyari',
    value: '14',
    icon: 'warning',
    trendLabel: '-2%',
    trendTone: 'negative',
    highlight: 'alert',
  },
];

export const activitySnapshots: ActivitySnapshot[] = [
  {
    key: 'weekly',
    label: 'Haftalik',
    headline: 'Canli operasyon temposu',
    total: '27.4K islem',
    delta: '+14% onceki haftaya gore',
    points: [
      { label: 'Pzt', value: 42 },
      { label: 'Sal', value: 58 },
      { label: 'Car', value: 51 },
      { label: 'Per', value: 72 },
      { label: 'Cum', value: 84 },
      { label: 'Cmt', value: 68 },
      { label: 'Paz', value: 91 },
    ],
  },
  {
    key: 'monthly',
    label: 'Aylik',
    headline: 'Abonelik ve randevu yogunlugu',
    total: '118K islem',
    delta: '+9% onceki aya gore',
    points: [
      { label: '1H', value: 55 },
      { label: '2H', value: 63 },
      { label: '3H', value: 74 },
      { label: '4H', value: 92 },
    ],
  },
];

export const activeSalons: ActiveSalon[] = [
  {
    id: 'sharp-blade',
    name: 'The Sharp Blade',
    appointments: '1,240 Randevu / Ay',
    rating: '4.9',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCxjseBkxWPAJ4z6h8MAOQg3tHbsNdhEOfYK-LztfXR9VUbvw3LlzyI0PITZ-elkaeku_fAYqcBQn1ishjdgFtNIsWYU_ilo-Nt65SP7dSRTq4uAhyD4IGGIaX-zOcnWvk7I9seoQaDLCuSF2IabsOc4FlbMUbqP-XKr3S7J7Ug1bNhEkIUvD3BjbnuMvVVEVdxC72MPYTxusSyUaGrwYtYzMREZ-STxSS7RXg7_fDfPKfxW-Ufw3wGFPurCLnjVBmlgnv6w7Ld9Ek',
  },
  {
    id: 'gentleman-choice',
    name: "Gentleman's Choice",
    appointments: '980 Randevu / Ay',
    rating: '4.8',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB07BtvZDjyfW8U0TP2iq3BwfZHshMzCeSRBNlmcPHW0nzS560mkPhobpegVakH90zZ2SNkSukEgybggeIO7HAh74kuF_3wzQZ0iw2D1qsnhG0W2kbzAzkQDP015-kCemT5yGThaTm36U-Kilyn7J54xod8BrRuudR6kcbNxI0eR5DUDVVP2np1LE6LTvPHzHan1-HuDmBXmYF1FY79sCM1qoAM1foB5oEMSD7ywytRvn8eXMKZTqoTOMpm40pXDBD7ryK-r9Ryx5o',
  },
  {
    id: 'urban-fade',
    name: 'Urban Fade Studio',
    appointments: '845 Randevu / Ay',
    rating: '4.7',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDioI11vPh9ltF22CVbxS2M2-gb6HU3dzPvkJBW54W3hnaX0_jGI8er6jjZp_1rTEVYwYyH_STGpfPFS4R-Hftq2EYTSiM64gl8bF7D0MvfsACnhtaqHpWpR6yCK0IHRBdPMNHRpWBIKOQmqU0JE_fSOdNQuadCv9_zOPTNZ3GXCl9GXbCGe42JBVVig-vDR0RUBwkyMcNnDZl-5dwHsH3NINPcgnVWRJz5_b3fSU_skagn-kzXzXL4HJGfmu-LwU1e-v06ZK7H30E',
  },
  { id: 'gold-scissors', name: 'Gold Scissors', appointments: '790 Randevu / Ay', rating: '4.8' },
];

export const recentAppointments: RecentAppointment[] = [
  {
    id: 'appt-1',
    salon: 'The Sharp Blade',
    user: 'Can Yilmaz',
    barber: 'Ahmet Usta',
    time: '14:30, Bugun',
    status: 'Onaylandi',
    statusTone: 'success',
  },
  {
    id: 'appt-2',
    salon: "Gentleman's Choice",
    user: 'Mert Demir',
    barber: 'Mehmet Berberoglu',
    time: '15:00, Bugun',
    status: 'Beklemede',
    statusTone: 'warning',
  },
  {
    id: 'appt-3',
    salon: 'Urban Fade Studio',
    user: 'Arda Kaya',
    barber: 'Barber Selim',
    time: '16:15, Bugun',
    status: 'Tamamlandi',
    statusTone: 'info',
  },
  {
    id: 'appt-4',
    salon: 'Gold Scissors',
    user: 'Ege Koc',
    barber: 'Yunus Kaya',
    time: '17:10, Bugun',
    status: 'Onaylandi',
    statusTone: 'success',
  },
];

export const recentSalons: RecentSalon[] = [
  { id: 'new-1', name: 'Gold Scissors', addedAt: 'Kayit: 2 saat once' },
  { id: 'new-2', name: 'Modern Cuts', addedAt: 'Kayit: 5 saat once' },
  { id: 'new-3', name: 'North Blend Club', addedAt: 'Kayit: 1 gun once' },
];

export const approvalRequests: ApprovalRequest[] = [
  {
    id: 'approval-1',
    name: 'Elite Grooming Co.',
    summary: 'Uyelik basvurusu ve evrak onayi bekleniyor.',
    status: 'Yeni Talep',
  },
  {
    id: 'approval-2',
    name: 'Noir Barber House',
    summary: 'Paket yukselme istegi inceleme sirasinda.',
    status: 'Paket Revize',
  },
];

export const logEntries: LogEntry[] = [
  { id: 'log-1', time: '14:32:01', message: 'DB connection re-established', tone: 'success' },
  { id: 'log-2', time: '14:31:45', message: 'User ID: 2948 updated profile', tone: 'neutral' },
  { id: 'log-3', time: '14:28:12', message: 'API Error: Timeout on Endpoint /auth/v2', tone: 'error' },
  { id: 'log-4', time: '14:25:00', message: 'Weekly backup scheduled started', tone: 'primary' },
  { id: 'log-5', time: '14:23:18', message: 'Queue worker resumed after deployment', tone: 'neutral' },
];

export const adminNotifications: AdminNotification[] = [
  {
    id: 'notif-1',
    title: 'Yeni salon onayi bekliyor',
    description: 'Elite Grooming Co. evrak kontrolu icin siraya alindi.',
    time: '2 dk once',
    tone: 'warning',
    unread: true,
  },
  {
    id: 'notif-2',
    title: 'API timeout algilandi',
    description: '/auth/v2 endpointi icin esik deger uyarisi olustu.',
    time: '8 dk once',
    tone: 'error',
    unread: true,
  },
  {
    id: 'notif-3',
    title: 'Haftalik yedekleme tamamlandi',
    description: 'Tum tenant verileri basariyla arsivlendi.',
    time: '24 dk once',
    tone: 'success',
  },
  {
    id: 'notif-4',
    title: 'Paket yukselme talebi',
    description: 'Noir Barber House paketi yonetici onayina gonderdi.',
    time: '1 saat once',
    tone: 'primary',
    unread: true,
  },
];
