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
  identifierLabel: 'Telefon veya Email',
  identifierPlaceholder: 'ad@ustura.com',
  passwordLabel: 'Sifre',
  passwordPlaceholder: '••••••••',
  forgotPasswordLabel: 'Sifremi Unuttum',
  salonLabel: 'Salon Sec',
  rememberLabel: 'Beni Hatirla',
  submitLabel: 'GIRIS YAP',
  restrictedAreaLabel: 'Bu alan sadece yetkili personel icindir',
  customerPromptLabel: 'Musteri misin?',
  customerPromptAction: 'Kullanici girisine git',
  footerNote: '© 2024 THE OBSIDIAN ATELIER. ALL RIGHTS RESERVED.',
} as const;

export const STAFF_SALON_OPTIONS: StaffSalonOption[] = [
  { id: 'nisantasi', label: 'Merkez Salon (Nisantasi)' },
  { id: 'erenkoy', label: 'Erenkoy Subesi' },
  { id: 'besiktas', label: 'Besiktas Atelier' },
];

export const STAFF_ACCESS_SUPPORT_LINKS: StaffAccessSupportLink[] = [
  { label: 'Privacy Policy', href: '/gizlilik-politikasi' },
  { label: 'Terms of Service', href: '/kullanim-kosullari' },
  { label: 'System Status' },
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
        description: 'Telefon/email, sifre ve salon bilgisi gecerli olmadan test akisi ilerlemez.',
        tone: 'error',
      };
    case 'testReady':
      return {
        badge: 'Test Onayi',
        title: 'Yerel dogrulama tamamlandi',
        description: `${selectedSalonLabel} icin giris bilgileri yerelde dogrulandi. Gercek panel erisimi backend auth sonrasi eklenecek.`,
        tone: 'success',
      };
    case 'forgotPassword':
      return {
        badge: 'Destek Notu',
        title: 'Sifre yenileme henuz bagli degil',
        description: 'Personel ve salon sahibine yonelik sifre yenileme akisi backend ve bildirim servisiyle birlikte eklenecek.',
        tone: 'warning',
      };
    case 'idle':
    default:
      return {
        badge: 'Hazirlik',
        title: 'Personel erisim katmani hazir',
        description: 'Bu ekran su an UI ve yerel form dogrulama testi icin aktif. Gercek salon paneli baglantisi sonra eklenecek.',
        tone: 'neutral',
      };
  }
}
