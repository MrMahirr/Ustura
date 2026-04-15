export const SALON_PROFILE_COPY = {
  editSectionTitle: 'Salon Bilgilerini Duzenle',
  editSectionHint: 'Degisiklikleri kaydettikten sonra liste ve detay otomatik guncellenir.',
  fieldName: 'Salon adi',
  fieldAddress: 'Adres',
  fieldCity: 'Sehir',
  fieldDistrict: 'Ilce',
  fieldPhotoUrl: 'Gorsel URL',
  fieldActive: 'Salon aktif (listelerde ve randevularda gorunur)',
  save: 'Degisiklikleri Kaydet',
  saving: 'Kaydediliyor...',
  dangerTitle: 'Tehlikeli Bolge',
  dangerDescription:
    'Salonu silmek; bagli personel, randevu ve abonelik verilerini kalici olarak kaldirir. Bu islem geri alinamaz.',
  deleteSalon: 'Salonu Sil',
  deleting: 'Siliniyor...',
} as const;

export const salonProfileClassNames = {
  page: 'relative flex-1 overflow-hidden',
  content: 'w-full max-w-[1640px] self-center gap-7',
  heroSection: 'gap-5',
  column: 'min-w-0 gap-6',
  glassCard: 'overflow-hidden rounded-xl border p-6',
  tableShell: 'overflow-hidden rounded-xl border',
  tableHeader: 'flex-row flex-wrap items-center justify-between gap-3 border-b px-[22px] py-[18px]',
  cardEyebrow: 'mb-5 font-label text-[10px] uppercase tracking-[3.2px]',
  infoLabel: 'font-label text-[9px] uppercase tracking-widest',
  infoValueSm: 'font-body text-[13px] leading-5',
  tableActionText: 'font-label text-[10px] uppercase tracking-[2.2px]',
  footerText: 'font-label text-[10px] uppercase tracking-widest',
} as const;
