import { MaterialIcons } from '@expo/vector-icons';

import { DEFAULT_SALON_IMAGE_URI } from '@/components/kuaforler/salon-listing';
import type {
  SalonRecord,
  WorkingHoursEntry,
} from '@/services/salon.service';
import type { SalonServiceRecord } from '@/services/salon-service.service';
import type { StaffRecord } from '@/services/staff.service';

type IconName = keyof typeof MaterialIcons.glyphMap;

const DAY_ORDER = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const;

const DAY_LABELS: Record<(typeof DAY_ORDER)[number], string> = {
  monday: 'Pazartesi',
  tuesday: 'Sali',
  wednesday: 'Carsamba',
  thursday: 'Persembe',
  friday: 'Cuma',
  saturday: 'Cumartesi',
  sunday: 'Pazar',
};

const GALLERY_TILE_LABELS = [
  { title: 'Vitrin', subtitle: 'Salon girisinden ilk izlenim' },
  { title: 'Ekip Ritmi', subtitle: 'Gunluk akisi destekleyen ekip' },
  { title: 'Detay Koskusu', subtitle: 'Bakim ve son dokunus kosesi' },
] as const;

const FALLBACK_GALLERY_URLS = [
  DEFAULT_SALON_IMAGE_URI,
  'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1200&q=80',
] as const;

export interface StorefrontGalleryItem {
  id: string;
  imageUrl: string;
  title: string;
  subtitle: string;
}

export interface StorefrontMetricItem {
  label: string;
  value: string;
  helper: string;
}

export interface StorefrontServiceItem {
  id: string;
  icon: IconName;
  label: string;
  duration: string;
  priceLabel: string;
  accent: string;
  description: string;
}

export interface StorefrontTeamItem {
  id: string;
  name: string;
  roleKey: 'barber' | 'receptionist' | 'placeholder';
  roleLabel: string;
  bio: string;
  photoUrl: string | null;
  initials: string;
}

export interface StorefrontQuickFact {
  id: string;
  icon: IconName;
  label: string;
  value: string;
  hint: string;
}

export interface StorefrontWorkingDay {
  key: string;
  label: string;
  range: string;
  isToday: boolean;
  isClosed: boolean;
}

export interface SalonStorefrontViewModel {
  id: string;
  name: string;
  location: string;
  address: string;
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;
  storyTitle: string;
  storyBody: string;
  ambianceTags: string[];
  gallery: StorefrontGalleryItem[];
  metrics: StorefrontMetricItem[];
  services: StorefrontServiceItem[];
  team: StorefrontTeamItem[];
  quickFacts: StorefrontQuickFact[];
  workingDays: StorefrontWorkingDay[];
  mapsUrl: string;
}

export function formatSalonLocation(
  salon: Pick<SalonRecord, 'city' | 'district'>,
) {
  return salon.district ? `${salon.district}, ${salon.city}` : salon.city;
}

export function buildSalonStorefrontViewModel(
  salon: SalonRecord,
  staff: StaffRecord[],
  services: SalonServiceRecord[],
): SalonStorefrontViewModel {
  const location = formatSalonLocation(salon);
  const address = [salon.address, salon.district, salon.city]
    .filter(Boolean)
    .join(', ');
  const staffCount = staff.length;
  const barberCount = staff.filter((member) => member.role === 'barber').length;
  const receptionistCount = staffCount - barberCount;
  const openDays = DAY_ORDER.filter((day) => salon.workingHours[day]);
  const workingDays = DAY_ORDER.map((day) =>
    buildWorkingDay(day, salon.workingHours[day] ?? null),
  );
  const today = workingDays.find((day) => day.isToday);

  return {
    id: salon.id,
    name: salon.name,
    location,
    address,
    heroEyebrow:
      staffCount > 0
        ? `${staffCount} kisilik aktif ekip`
        : 'Randevuya hazir salon vitrini',
    heroTitle: `${salon.name} icin detayli vitrin`,
    heroDescription: `${location} bolgesinde konumlanan salonun calisma ritmini, ekip yapisini ve randevuya donuk hizmet akisini tek ekranda topla.`,
    storyTitle: `${salon.name} deneyimi`,
    storyBody:
      staffCount > 0
        ? `${salon.name}, ${barberCount} aktif berber${receptionistCount > 0 ? ` ve ${receptionistCount} karşılama ekibi` : ''} ile gunluk randevu akisini net bir duzenle yurutuyor. Bu vitrin sayfasi salonun aktif durumu, ekip yapisi ve mesai saatlerinden beslenerek daha hizli karar vermen icin tasarlandi.`
        : `${salon.name}, ${location} icin sade ama guven veren bir randevu vitrini sunuyor. Ekip detaylari henuz paylasilmamis olsa da calisma saatleri ve salon kimligi uzerinden guvenli bir ilk bakis sunuluyor.`,
    ambianceTags: buildAmbianceTags(location, openDays.length, staffCount),
    gallery: buildGallery(salon, staff),
    metrics: [
      {
        label: 'Aktif ekip',
        value: String(staffCount),
        helper:
          staffCount > 0 ? 'Randevuya katkı veren ekip uyeleri' : 'Ekip bilgisi yakinda',
      },
      {
        label: 'Acik gun',
        value: String(openDays.length),
        helper: 'Haftalik operasyon gunu',
      },
      {
        label: 'Bugun',
        value: today?.range ?? 'Kapali',
        helper: today?.isClosed ? 'Bugun hizmet vermiyor' : 'Guncel vitrin saati',
      },
    ],
    services: buildServices(salon, services, staffCount),
    team: buildTeam(staff),
    quickFacts: [
      {
        id: 'location',
        icon: 'place',
        label: 'Konum',
        value: location,
        hint: address,
      },
      {
        id: 'status',
        icon: salon.isActive ? 'verified' : 'pause-circle-filled',
        label: 'Durum',
        value: salon.isActive ? 'Rezervasyona acik' : 'Gecici olarak pasif',
        hint: salon.isActive
          ? 'Detay sayfasi acik ve goruntulenebilir'
          : 'Rezervasyon akisi tekrar acilinca otomatik guncellenir',
      },
      {
        id: 'today',
        icon: 'schedule',
        label: 'Bugunku akıs',
        value: today?.range ?? 'Kapali',
        hint: today?.isClosed
          ? 'Bugun mesai tanimlanmamis'
          : 'Saat bilgisi salon takviminden cekiliyor',
      },
      {
        id: 'staff',
        icon: 'groups-2',
        label: 'Calisan kadrosu',
        value:
          staffCount > 0 ? `${staffCount} aktif uye` : 'Kadrosu yakinda eklenecek',
        hint:
          barberCount > 0
            ? `${barberCount} berber${receptionistCount > 0 ? `, ${receptionistCount} karsilama gorevlisi` : ''}`
            : 'Henuz yayinlanmis ekip profili bulunmuyor',
      },
    ],
    workingDays,
    mapsUrl: buildMapsUrl(address),
  };
}

function buildGallery(salon: SalonRecord, staff: StaffRecord[]) {
  const candidateUrls = [
    salon.photoUrl,
    ...(salon.galleryUrls ?? []),
    ...staff.map((member) => member.photoUrl),
    ...FALLBACK_GALLERY_URLS,
  ].filter((value): value is string => Boolean(value));

  const dedupedUrls = Array.from(new Set(candidateUrls)).slice(0, 3);

  while (dedupedUrls.length < 3) {
    dedupedUrls.push(FALLBACK_GALLERY_URLS[dedupedUrls.length]);
  }

  return dedupedUrls.map((imageUrl, index) => ({
    id: `${salon.id}-gallery-${index}`,
    imageUrl,
    title: GALLERY_TILE_LABELS[index]?.title ?? 'Detay',
    subtitle:
      GALLERY_TILE_LABELS[index]?.subtitle ??
      'Salon deneyimini destekleyen gorsel katman',
  }));
}

function buildServices(
  salon: SalonRecord,
  services: SalonServiceRecord[],
  staffCount: number,
) {
  if (services.length > 0) {
    return services.map((service) => ({
      id: service.id,
      icon: pickServiceIcon(service.name),
      label: service.name,
      duration: `${service.durationMinutes} dk`,
      priceLabel: formatCurrency(service.priceAmount),
      accent: service.isActive ? 'Rezervasyona hazir' : 'Pasif',
      description:
        service.description?.trim() ||
        `${salon.name} icin tanimli hizmet kaydi. Sure ve fiyat bilgisi salon panelinden guncellenir.`,
    })) satisfies StorefrontServiceItem[];
  }

  return [
    {
      id: 'signature-cut',
      icon: 'content-cut',
      label: 'Imza kesim',
      duration: '45 dk',
      priceLabel: 'Fiyat salonda',
      accent: 'Cok tercih edilen',
      description: `${salon.name} vitrininin omurgasi. Yuz hattina gore temiz kesim, son dokunus ve gunluk kullanima hazir sekillendirme.`,
    },
    {
      id: 'beard-finish',
      icon: 'self-improvement',
      label: 'Sakal ve cizgi bakimi',
      duration: '30 dk',
      priceLabel: 'Hizli seans',
      accent: 'Net hatlar',
      description:
        'Sakal konturu, cizgi temizligi ve yuz ifadesini toparlayan hizli bakim akisi.',
    },
    {
      id: 'care-combo',
      icon: 'auto-awesome',
      label: 'Bakim kombosu',
      duration: '60 dk',
      priceLabel: 'Premium akÄ±s',
      accent: 'Tam gorunum',
      description:
        'Kesim, sakal ve son sekillendirme adimlarini tek seansta toplayan premium deneyim.',
    },
    {
      id: 'express-visit',
      icon: staffCount > 1 ? 'groups' : 'bolt',
      label: staffCount > 1 ? 'Ekip destekli hizli randevu' : 'Hizli tazeleme',
      duration: '20 dk',
      priceLabel: 'Kisa sureli',
      accent: staffCount > 1 ? 'Yogun gunler icin' : 'Ara dokunus',
      description:
        staffCount > 1
          ? 'Yogun saatlerde ekip koordinasyonuyla hizli ama kontrollu bir dokunus sunmak icin hazirlandi.'
          : 'Ana randevular arasinda sac ve sakal formunu toplamak isteyenler icin kisa seans.',
    },
  ] satisfies StorefrontServiceItem[];
}

function pickServiceIcon(name: string): IconName {
  const normalizedName = name.toLowerCase();

  if (normalizedName.includes('sakal')) {
    return 'self-improvement';
  }

  if (
    normalizedName.includes('bakim') ||
    normalizedName.includes('rituel') ||
    normalizedName.includes('paket')
  ) {
    return 'auto-awesome';
  }

  if (normalizedName.includes('fade') || normalizedName.includes('kesim')) {
    return 'content-cut';
  }

  return 'style';
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0,
  }).format(value);
}

function buildTeam(staff: StaffRecord[]): StorefrontTeamItem[] {
  if (staff.length === 0) {
    return [
      {
        id: 'pending-team',
        name: 'Ekip profili yakinda',
        roleKey: 'placeholder',
        roleLabel: 'Bilgi hazirlaniyor',
        bio: 'Salon kadrosu yayinlandiginda burada aktif ekip uyeleri ve uzmanlik rolleri listelenecek.',
        photoUrl: null,
        initials: 'UP',
      },
    ];
  }

  return staff.map((member) => ({
    id: member.id,
    name: member.displayName,
    roleKey: member.role,
    roleLabel:
      member.role === 'barber' ? 'Berber / Stil uzmani' : 'Karsilama ve operasyon',
    bio:
      member.bio?.trim() ||
      (member.role === 'barber'
        ? 'Kesim, cizgi ve son dokunus tarafinda aktif randevu akisini yonetiyor.'
        : 'Salon akisini, karsilama deneyimini ve gunluk koordinasyonu destekliyor.'),
    photoUrl: member.photoUrl,
    initials: buildInitials(member.displayName),
  }));
}

function buildAmbianceTags(
  location: string,
  openDays: number,
  staffCount: number,
) {
  return [
    location,
    `${openDays} gunluk aktif vitrin`,
    staffCount > 0 ? `${staffCount} kisilik ekip ritmi` : 'Sade rezervasyon akisi',
    'Modern bakim atmosferi',
  ];
}

function buildWorkingDay(
  key: (typeof DAY_ORDER)[number],
  entry: WorkingHoursEntry | null,
): StorefrontWorkingDay {
  const todayKey = DAY_ORDER[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];

  return {
    key,
    label: DAY_LABELS[key],
    range: entry ? `${entry.open} - ${entry.close}` : 'Kapali',
    isToday: todayKey === key,
    isClosed: !entry,
  };
}

function buildMapsUrl(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

function buildInitials(displayName: string) {
  return displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}
