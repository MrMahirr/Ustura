export type CustomerBookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
export type CustomerBookingsTabId = 'upcoming' | 'completed' | 'cancelled';

export interface CustomerBookingRecord {
  id: string;
  salonName: string;
  address: string;
  city: string;
  district: string | null;
  barberName: string;
  serviceName: string;
  startsAt: string;
  endsAt: string;
  bookedAt: string;
  status: CustomerBookingStatus;
  imageUri: string;
}

export interface CustomerBookingsTabOption {
  id: CustomerBookingsTabId;
  label: string;
}

export const CUSTOMER_BOOKINGS_COPY = {
  heroTitle: 'Randevularim',
  heroDescription: 'Yaklasan, gecmis ve iptal edilen randevularini tek panelden goruntule ve bir sonraki stilini planla.',
  nextBookingLabel: 'En Yakin Randevun',
  addBookingLabel: 'Yeni Randevu Al',
  emptyTitle: 'Bu sekmede gosterilecek randevu bulunmuyor.',
  emptyDescription: 'Yeni bir rezervasyon olusturdugunda veya gecmis kayitlar geldikce burada gorunecek.',
  detailLabel: 'Detay',
  cancelLabel: 'Iptal Et',
  repeatLabel: 'Tekrar Al',
  bookingsMenuLabel: 'Randevularim',
  bookingsMenuDescription: 'Yaklasan rezervasyonlarini ve gecmis kayitlarini gor.',
  profileQuickLabel: 'Hizli Erisim',
  detailsPreviewTitle: 'Randevu Detayi',
  cancelPreviewTitle: 'Randevu Iptal Edildi',
  detailModalTitle: 'Randevu Detaylari',
  detailModalDescription: 'Salon, konum ve rezervasyon ozetini tek ekranda incele.',
  detailSalonSectionTitle: 'Salon Detaylari',
  detailLocationSectionTitle: 'Konum',
  detailAppointmentSectionTitle: 'Randevu Detaylari',
  detailCloseLabel: 'Kapat',
  detailLocationHint: 'Randevu saatinden 10 dakika once salonda olman tavsiye edilir.',
} as const;

export const CUSTOMER_BOOKINGS_TABS: CustomerBookingsTabOption[] = [
  { id: 'upcoming', label: 'Yaklasan Randevular' },
  { id: 'completed', label: 'Gecmis Randevular' },
  { id: 'cancelled', label: 'Iptal Edilenler' },
];

// TODO: Backend customer-bookings endpoint baglandiginda bu mock veri kaldirilacak.
export const MOCK_CUSTOMER_BOOKINGS: CustomerBookingRecord[] = [
  {
    id: 'booking-nisantasi',
    salonName: 'Ustura Atelier Nisantasi',
    address: 'Tesvikiye, Abdi Ipekci Cd. No:42',
    city: 'Istanbul',
    district: 'Sisli',
    barberName: 'Selim Erkan',
    serviceName: 'Sac & Sakal',
    startsAt: '2026-04-10T14:30:00+03:00',
    endsAt: '2026-04-10T15:30:00+03:00',
    bookedAt: '2026-04-05T10:00:00+03:00',
    status: 'confirmed',
    imageUri:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBhVIsfBkXvSAvKVjiXYr55PZHud5_BRspDtt5DYv1fS_2yK2xFgqr8TxvetbaTmFc91JpeOc_0wZskqzZzSEv2ZaGat947w8QJeiubqvqGFIiVaNqbl4z94x4Qw6oBcw9Zlo5u0mBFoD4Nh7G7OR2MRwM8zcNnygykBF1AKUiF7O4swVZP4QIPjfXtcpYRYyDkckgn1FUU40SviTRPnYM-l0fsgbK8g9ONCGSv3i_5w5Beuqr40_rFnT-zntDjOkz7KWdRWRiplpc',
  },
  {
    id: 'booking-bebek',
    salonName: 'Ustura Atelier Bebek',
    address: 'Bebek Sahil Yolu No:12',
    city: 'Istanbul',
    district: 'Besiktas',
    barberName: 'Melih Can',
    serviceName: 'Modern Kesim',
    startsAt: '2026-04-18T11:00:00+03:00',
    endsAt: '2026-04-18T12:00:00+03:00',
    bookedAt: '2026-04-11T18:40:00+03:00',
    status: 'pending',
    imageUri:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDbCcDL9ClvUTlxURQkh_tdoHL5LahAajl2oTf7AI27_8x2NMx9XY1TZPjfoalIJuugLykfjzZHNkpBm12mAsoJXka8KS5KiuXXPw1lPtLiu9_I-zBtKMmX1mqLCccL7AJxkB7fVNpySKgrfBSCIuN6SfNUTaGWSv29i4YmjIoqCWcydnchIi16Z5tQQ5MX4R7QTs_sOK5c6s4eejJtFSkkCa2rYNn5l-7Y6LJPdYJPTap0U8JqNB0lC1KwEb8TFBfWaUJ2DoGdmSM',
  },
  {
    id: 'booking-kadikoy',
    salonName: 'Ustura Atelier Kadikoy',
    address: 'Moda Cd. No:88',
    city: 'Istanbul',
    district: 'Kadikoy',
    barberName: 'Canberk Korkmaz',
    serviceName: 'Sakal Tirasi',
    startsAt: '2026-03-28T10:00:00+03:00',
    endsAt: '2026-03-28T10:45:00+03:00',
    bookedAt: '2026-03-20T12:30:00+03:00',
    status: 'completed',
    imageUri:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBDInj4-TSOUZqSz4Kq3-FBHzmYx0jg_5r1ia8JEtDdbgoTSnCPk7Sv5v492Amsuh9_YVIKF2whY9KKGAs1K8jKemacTFp0IyIpuJlaJJA1-Lsz8xKXf9zRu-qnP9CH_tE4uBGUYFg0PGOmIN9vIfSm0f0UqOQnlXTfZhDvYWCQnWR2BLX4aQdk7KyDXobmHT_LLIjqbacmRF7Js-JkkEkR55zs4OyVtyBtVZnqIX4ocOcGCUNDSP15Qhzumq3vyAK3PFzz7us0P_M',
  },
  {
    id: 'booking-etiler',
    salonName: 'Ustura Atelier Etiler',
    address: 'Nisbetiye Cd. No:27',
    city: 'Istanbul',
    district: 'Besiktas',
    barberName: 'Ahmet Yilmaz',
    serviceName: 'Cilt Bakimi',
    startsAt: '2026-03-31T16:00:00+03:00',
    endsAt: '2026-03-31T17:15:00+03:00',
    bookedAt: '2026-03-24T09:15:00+03:00',
    status: 'cancelled',
    imageUri:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDbCcDL9ClvUTlxURQkh_tdoHL5LahAajl2oTf7AI27_8x2NMx9XY1TZPjfoalIJuugLykfjzZHNkpBm12mAsoJXka8KS5KiuXXPw1lPtLiu9_I-zBtKMmX1mqLCccL7AJxkB7fVNpySKgrfBSCIuN6SfNUTaGWSv29i4YmjIoqCWcydnchIi16Z5tQQ5MX4R7QTs_sOK5c6s4eejJtFSkkCa2rYNn5l-7Y6LJPdYJPTap0U8JqNB0lC1KwEb8TFBfWaUJ2DoGdmSM',
  },
];

function formatWithLocale(startsAt: string, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat('tr-TR', options).format(new Date(startsAt));
}

export function formatCustomerBookingDate(startsAt: string) {
  return formatWithLocale(startsAt, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).replaceAll('.', '');
}

export function formatCustomerBookingTime(startsAt: string) {
  return formatWithLocale(startsAt, {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatCustomerBookingLongDate(startsAt: string) {
  return formatWithLocale(startsAt, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function formatCustomerBookingDateTime(startsAt: string) {
  return `${formatCustomerBookingDate(startsAt)}, ${formatCustomerBookingTime(startsAt)}`;
}

export function formatCustomerBookingTimeRange(startsAt: string, endsAt: string) {
  return `${formatCustomerBookingTime(startsAt)} - ${formatCustomerBookingTime(endsAt)}`;
}

export function formatCustomerBookingArea(city: string, district: string | null) {
  return district ? `${district}, ${city}` : city;
}

export function getCustomerBookingDurationMinutes(startsAt: string, endsAt: string) {
  const durationMs = new Date(endsAt).getTime() - new Date(startsAt).getTime();
  return Math.max(0, Math.round(durationMs / 60000));
}

export function getCustomerBookingReferenceCode(bookingId: string) {
  return `RN-${bookingId.replace(/[^a-z0-9]/gi, '').slice(-6).toUpperCase()}`;
}

export function getCustomerBookingStatusLabel(status: CustomerBookingStatus) {
  switch (status) {
    case 'pending':
      return 'Onay Bekliyor';
    case 'confirmed':
      return 'Onaylandi';
    case 'completed':
      return 'Tamamlandi';
    case 'cancelled':
      return 'Iptal Edildi';
    case 'no_show':
      return 'Gidilmedi';
    default:
      return status;
  }
}

export function getBookingTabId(status: CustomerBookingStatus): CustomerBookingsTabId {
  if (status === 'pending' || status === 'confirmed') return 'upcoming';
  if (status === 'cancelled') return 'cancelled';
  return 'completed';
}

function isUpcomingStatus(status: CustomerBookingStatus): boolean {
  return status === 'pending' || status === 'confirmed';
}

export function sortBookingsByDate(bookings: CustomerBookingRecord[]) {
  return [...bookings].sort((left, right) => {
    const leftTime = new Date(left.startsAt).getTime();
    const rightTime = new Date(right.startsAt).getTime();

    if (isUpcomingStatus(left.status) && isUpcomingStatus(right.status)) {
      return leftTime - rightTime;
    }

    return rightTime - leftTime;
  });
}

export function getNextUpcomingBooking(bookings: CustomerBookingRecord[]) {
  return sortBookingsByDate(bookings).find((booking) => isUpcomingStatus(booking.status)) ?? null;
}
