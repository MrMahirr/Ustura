export const scheduleClassNames = {
  page: 'relative flex-1 overflow-hidden',
  mainArea: 'flex-1 flex-row',
  calendarColumn: 'flex-1',
  sidebarColumn: 'w-80 border-l',
} as const;

export const SCHEDULE_COPY = {
  dayLabel: 'Gun',
  weekLabel: 'Hafta',
  overviewTitle: 'Gunun Ozeti',
  totalLabel: 'Toplam Randevu',
  completedLabel: 'Tamamlanan',
  cancelledLabel: 'Iptal Edilen',
  nextUpTitle: 'Siradaki:',
  prepareLabel: 'ISTASYONU HAZIRLA',
  minutesUntilSuffix: 'dakika icinde',
  completedStatus: 'Tamamlandi',
  upcomingStatus: 'Bekliyor',
  cancelledStatus: 'Iptal',
  allStaffLabel: 'Tüm Personel',
  staffFilterTitle: 'PERSONEL',
  staffRoleBarber: 'Berber',
  staffRoleReceptionist: 'Resepsiyonist',
  noStaffFound: 'Personel bulunamadı',
} as const;
