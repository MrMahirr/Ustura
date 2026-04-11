import {
  salonRecords,
  type SalonPlan,
  type SalonRecord,
  type SalonStatus,
} from '@/components/panel/super-admin/salon-management.data';

export interface SalonProfileMetric {
  id: string;
  label: string;
  value: string;
  trendLabel?: string;
  trendTone?: 'positive' | 'negative' | 'neutral';
  bars: number[];
  accent: 'primary' | 'success' | 'error';
}

export interface SalonStaffMember {
  id: string;
  name: string;
  title: string;
  rating: string;
  performance: number;
  imageUrl: string;
  mutedImage?: boolean;
}

export interface SalonServiceItem {
  id: string;
  name: string;
  category: string;
  durationLabel: string;
  priceLabel: string;
  popularityLabel: string;
  popularityLevel: number;
}

export interface SalonSubscriptionDetails {
  planName: string;
  statusLabel: string;
  cycleLabel: string;
  nextPaymentLabel: string;
}

export interface SalonProfile {
  salon: SalonRecord;
  heroStatusLabel: string;
  ratingLabel: string;
  locationLabel: string;
  registrationDateLabel: string;
  ownerPhone: string;
  subscription: SalonSubscriptionDetails;
  metrics: SalonProfileMetric[];
  staffMembers: SalonStaffMember[];
  services: SalonServiceItem[];
  totalServices: number;
}

const monthNames = [
  'Ocak',
  'Subat',
  'Mart',
  'Nisan',
  'Mayis',
  'Haziran',
  'Temmuz',
  'Agustos',
  'Eylul',
  'Ekim',
  'Kasim',
  'Aralik',
];

const staffPortraits = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDJtUa3dQ_v-eHD4NKfczWY7O-nBJtqGogQ1wpccdmXMh_G7qNfLv8S-tNPrhDUgU8hrdVFuDH5S17jKVewwOassj2QzRQYNmWlJjbUq4O5e8m5_u_0xOYjymwASyQFOXLlwwobXrjF0sEuuEK6w9fjZ--WmJZfOv0SQsfEUzmRx9Vc9ut2UhrWVJ03NaAZxHC3AM8j86yWDFzIIA2P0lwDu77dySTUm5XzbrXaji2-wzBcIi0X0xtpUzIc85PbTMXVkYwO8fPP_gE',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDl66xOx2Pzn67RDTVWtQ4P68syTZMSPVUQBK5KV_B1LUBjm1CGPArJh01NzxYPfeJq79MoS7Gm0sRXYTDZ4iXCDV3AKMnsaU7Cpptm1lurSMZBhk9Rs4Z1Bnac70wzahDzFHV7NFk11AcAhct7ogIGrcouDX6Zu6r9DmO4lE-nqj2sxcOf75HM06trBAy8NzLUsHHqLpv52Ra_DwEc5kccDqImvF-LbI2wz80hSvMemZyLpXKEPPcI7AnZaHQBJzWkgOrXjpqG7ao',
  'https://picsum.photos/seed/ustura-staff-1/120/120',
  'https://picsum.photos/seed/ustura-staff-2/120/120',
];

const staffNames = ['Hakan Demir', 'Sinan Kaya', 'Mert Sancak', 'Baris Ekinci', 'Kaan Aral', 'Emre Cetin'];
const staffTitles = ['Usta Berber', 'Kidemli Stilist', 'Renk Uzmn.', 'Fade Ustasi', 'Sakal Tasarimcisi'];

const serviceTemplates = [
  { name: 'Obsidyen Kesim', category: 'Imza', durationMinutes: 60, basePrice: 1150, popularity: 'Cok Satan', level: 4 },
  { name: 'Sakal Sekillendirme', category: 'Bakim', durationMinutes: 30, basePrice: 650, popularity: 'Dengeli', level: 2 },
  { name: 'Sicak Havlu Ritueli', category: 'Rahatlama', durationMinutes: 20, basePrice: 480, popularity: 'Stabil', level: 3 },
  { name: 'Kraliyet Bakim Paketi', category: 'Tumden', durationMinutes: 120, basePrice: 1850, popularity: 'Gozde Secim', level: 5 },
];

function hashValue(input: string) {
  return input.split('').reduce((total, char, index) => total + char.charCodeAt(0) * (index + 3), 0);
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatLongDate(dateString: string) {
  const value = new Date(dateString);
  return `${value.getDate()} ${monthNames[value.getMonth()]} ${value.getFullYear()}`;
}

function buildPhoneNumber(hash: number) {
  const tail = String(1000 + (hash % 9000));
  const middle = String(100 + (Math.floor(hash / 10) % 900));
  return `+90 (${500 + (hash % 39)}) ${middle}-${tail.slice(0, 2)}-${tail.slice(2)}`;
}

function buildStatusLabel(status: SalonStatus) {
  if (status === 'Aktif') {
    return 'AKTIF';
  }

  if (status === 'Beklemede') {
    return 'BEKLEMEDE';
  }

  return 'ASKIDA';
}

function buildRatingLabel(hash: number) {
  return (4.6 + ((hash % 4) * 0.1)).toFixed(1);
}

function buildLocationLabel(location: string) {
  return `${location} / Turkiye`;
}

function buildSubscription(plan: SalonPlan, hash: number): SalonSubscriptionDetails {
  const cycleLabel = plan === 'Temel' ? '3 Aylik' : 'Aylik';
  const nextPayment = new Date();
  nextPayment.setDate(nextPayment.getDate() + 8 + (hash % 18));

  return {
    planName: `${plan} Paket`,
    statusLabel: 'AKTIF',
    cycleLabel,
    nextPaymentLabel: formatLongDate(nextPayment.toISOString()),
  };
}

function createBars(seed: number, base: number) {
  return Array.from({ length: 6 }, (_, index) => {
    const value = base + ((seed + index * 17) % 36);
    return Math.max(14, Math.min(96, value));
  });
}

function buildMetrics(record: SalonRecord, hash: number): SalonProfileMetric[] {
  const totalBookings = Math.round(record.monthlyRevenue / (95 + (hash % 25)));
  const growthWhole = 12 + (hash % 10);
  const growthFraction = (hash % 7) + 1;
  const cancellationWhole = 2 + (hash % 3);
  const cancellationFraction = (hash % 8) + 1;

  return [
    {
      id: 'bookings',
      label: 'Toplam Randevu',
      value: new Intl.NumberFormat('tr-TR').format(totalBookings),
      trendLabel: `+${6 + (hash % 12)}% bu ay`,
      trendTone: 'positive',
      bars: createBars(hash, 24),
      accent: 'primary',
    },
    {
      id: 'revenue',
      label: 'Aylik Ciro',
      value: formatCurrency(record.monthlyRevenue),
      trendLabel: `+${3 + (hash % 8)}% tahsilat`,
      trendTone: 'positive',
      bars: createBars(hash + 9, 36),
      accent: 'primary',
    },
    {
      id: 'growth',
      label: 'Buyume Orani',
      value: `%${growthWhole}.${growthFraction}`,
      trendLabel: 'Yeni paket donusumu yukseliste',
      trendTone: 'positive',
      bars: createBars(hash + 19, 28),
      accent: 'success',
    },
    {
      id: 'cancellation',
      label: 'Iptal Orani',
      value: `%${cancellationWhole}.${cancellationFraction}`,
      trendLabel: `${hash % 2 === 0 ? '-' : '+'}${1 + (hash % 3)} puan`,
      trendTone: 'negative',
      bars: createBars(hash + 27, 12).reverse(),
      accent: 'error',
    },
  ];
}

function buildStaffMembers(record: SalonRecord, hash: number): SalonStaffMember[] {
  return Array.from({ length: 4 }, (_, index) => {
    const sourceIndex = (hash + index) % staffNames.length;
    const performance = 82 + ((hash + index * 11) % 15);
    const rating = (4.4 + (((hash + index * 7) % 6) * 0.1)).toFixed(1);

    return {
      id: `${record.id}-staff-${index + 1}`,
      name: index === 0 ? record.owner : staffNames[sourceIndex],
      title: staffTitles[(hash + index * 3) % staffTitles.length],
      rating,
      performance,
      imageUrl: staffPortraits[index % staffPortraits.length],
      mutedImage: index > 1,
    };
  });
}

function buildServices(record: SalonRecord, hash: number): SalonServiceItem[] {
  const planMultiplier = record.plan === 'Ozel' ? 1.16 : record.plan === 'Gelismis' ? 1.08 : 1;

  return serviceTemplates.map((service, index) => ({
    id: `${record.id}-service-${index + 1}`,
    name: service.name,
    category: service.category,
    durationLabel: `${service.durationMinutes} DK`,
    priceLabel: formatCurrency(Math.round(service.basePrice * planMultiplier + (hash % 70) * 5)),
    popularityLabel: service.popularity,
    popularityLevel: Math.min(5, Math.max(1, service.level + ((hash + index) % 2 === 0 ? 0 : -1))),
  }));
}

function buildProfile(record: SalonRecord): SalonProfile {
  const hash = hashValue(record.id);

  return {
    salon: record,
    heroStatusLabel: buildStatusLabel(record.status),
    ratingLabel: buildRatingLabel(hash),
    locationLabel: buildLocationLabel(record.location),
    registrationDateLabel: formatLongDate(record.joinedAt),
    ownerPhone: buildPhoneNumber(hash),
    subscription: buildSubscription(record.plan, hash),
    metrics: buildMetrics(record, hash),
    staffMembers: buildStaffMembers(record, hash),
    services: buildServices(record, hash),
    totalServices: 18 + (hash % 8),
  };
}

export function getSalonProfileById(salonId?: string) {
  if (!salonId) {
    return null;
  }

  const record = salonRecords.find((item) => item.id === salonId);
  if (!record) {
    return null;
  }

  return buildProfile(record);
}
