export interface BookingDateOption {
  id: string;
  shortDayLabel: string;
  dayNumberLabel: string;
  fullDateLabel: string;
}

export interface BookingTimeSlot {
  id: string;
  label: string;
  startsAt: string;
  endsAt: string;
  status: 'available' | 'reserved' | 'held';
  availableStaffIds: string[];
}

export const BOOKING_TIME_SELECTION_COPY = {
  pageTitle: 'Tarih ve Saat Secin',
  pageDescription: 'Secili salon ve berber icin uygun gunu ve saati rezerve et.',
  dateSectionTitle: 'Tarih secin',
  timeSectionTitle: 'Saat secin',
  timezoneLabel: 'EET (GMT+3)',
  locationLabel: 'Konum',
  durationNote: 'Her randevu 30 dakikadir',
  confirmLabel: 'Randevuyu Onayla',
  confirmPreviewTitle: 'Rezervasyon Onizlemesi',
  confirmPreviewDescription:
    'Secimin kaydedildi. 4. adim ve rezervasyon altyapisi baglandiginda bu aksiyon dogrudan olusturma istegine donecek.',
} as const;

export const BOOKING_LOCATION_IMAGE_URI =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBHoOkTa3hxqZjSm4ALThGJOLRyKQkbNsWR5UrRJZvs9OEXDbBLlFibOm9xZKYiVrdWlNPXHIy4ZLpm_No0qazOwDrPgs_V81k13jgw5qnpfY0GdGggfZrz8UyOYhommmbyNtlnak4ZCEq-lsX20Qckm4QVe-ienFl2SLY38I9hLkqKSWSdFil0uMVOIgwJx0l1C81u8tjSdEfUjtfd8D-Zf9hAy5VxFFKc-2UemWx5TcAHQp5WpS6AFpdftIBHmvH1sKyBFZq7P5c';

const DAY_LABELS = ['Paz', 'Pzt', 'Sal', 'Car', 'Per', 'Cum', 'Cmt'] as const;
const MONTH_LABELS = [
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
] as const;

function addDays(baseDate: Date, amount: number) {
  const nextDate = new Date(baseDate);
  nextDate.setDate(baseDate.getDate() + amount);
  return nextDate;
}

function formatDateId(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function createBookingDateOptions(weekOffset: number) {
  const today = new Date();
  const startDate = addDays(today, weekOffset * 7);

  return Array.from({ length: 7 }, (_, index): BookingDateOption => {
    const currentDate = addDays(startDate, index);

    return {
      id: formatDateId(currentDate),
      shortDayLabel: DAY_LABELS[currentDate.getDay()],
      dayNumberLabel: `${currentDate.getDate()}`,
      fullDateLabel: `${currentDate.getDate()} ${MONTH_LABELS[currentDate.getMonth()]} ${DAY_LABELS[currentDate.getDay()]}`,
    };
  });
}
