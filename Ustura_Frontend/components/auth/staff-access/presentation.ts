import type { Href } from 'expo-router';

import type { AuthStatusTone } from '@/components/auth/shared/AuthStatusNotice';

export type StaffAccessState = 'idle' | 'validationError' | 'testReady' | 'forgotPassword';

export interface StaffAccessNotice {
  badge: string;
  title: string;
  description: string;
  tone: AuthStatusTone;
}

export interface StaffSalonOption {
  id: string;
  label: string;
}

export interface StaffAccessSupportLink {
  label: string;
  href?: Href;
}

export const STAFF_ACCESS_COPY = {
  eyebrow: 'Personel Girisi',
  subtitle: 'Salon paneline erisim sagla',
  identifierLabel: 'Telefon veya E-posta',
  identifierPlaceholder: 'ad@ustura.com',
  passwordLabel: 'Sifre',
  passwordPlaceholder: '********',
  forgotPasswordLabel: 'Sifremi Unuttum',
  salonLabel: 'Salon Sec',
  rememberLabel: 'Beni Hatirla',
  submitLabel: 'GIRIS YAP',
  restrictedAreaLabel: 'Bu alan sadece yetkili personel icindir',
  customerPromptLabel: 'Musteri misin?',
  customerPromptAction: 'Musteri girisine git',
  footerNote: '(c) 2024 OBSIDYEN ATOLYESI. Tum haklari saklidir.',
} as const;

export const STAFF_SALON_OPTIONS: StaffSalonOption[] = [
  { id: 'nisantasi', label: 'Merkez Salon (Nisantasi)' },
  { id: 'erenkoy', label: 'Erenkoy Subesi' },
  { id: 'besiktas', label: 'Besiktas Atolyesi' },
];

export const STAFF_ACCESS_SUPPORT_LINKS: StaffAccessSupportLink[] = [
  { label: 'Gizlilik Politikasi', href: '/gizlilik-politikasi' },
  { label: 'Kullanim Kosullari', href: '/kullanim-kosullari' },
  { label: 'Sistem Durumu' },
];

export function getStaffAccessNotice(
  state: StaffAccessState,
  selectedSalonLabel: string
): StaffAccessNotice {
  switch (state) {
    case 'validationError':
      return {
        badge: 'Form Kontrolu',
        title: 'Bilgileri yeniden kontrol et',
        description: 'Telefon/e-posta, sifre ve salon bilgisi gecerli olmadan test akisi ilerlemez.',
        tone: 'error',
      };
    case 'testReady':
      return {
        badge: 'Test Onayi',
        title: 'Yerel dogrulama tamamlandi',
        description: `${selectedSalonLabel} icin giris bilgileri yerelde dogrulandi. Gercek panel erisimi arka uc girisi sonrasi eklenecek.`,
        tone: 'success',
      };
    case 'forgotPassword':
      return {
        badge: 'Destek Notu',
        title: 'Sifre yenileme henuz bagli degil',
        description: 'Personel ve salon sahibine yonelik sifre yenileme akisi arka uc ve bildirim servisiyle birlikte eklenecek.',
        tone: 'warning',
      };
    case 'idle':
    default:
      return {
        badge: 'Hazirlik',
        title: 'Personel erisim katmani hazir',
        description: 'Bu ekran su an arayuz ve yerel form dogrulama testi icin aktif. Gercek salon paneli baglantisi sonra eklenecek.',
        tone: 'neutral',
      };
  }
}
