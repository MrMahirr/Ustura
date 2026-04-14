import type { Href } from 'expo-router';

import type { AuthStatusTone } from '@/components/auth/shared/AuthStatusNotice';

export type StaffAccessState =
  | 'idle'
  | 'validationError'
  | 'authorizing'
  | 'accessGranted'
  | 'invalidCredentials'
  | 'requestError'
  | 'forgotPassword';

export interface StaffAccessNotice {
  badge: string;
  title: string;
  description: string;
  tone: AuthStatusTone;
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
  rememberLabel: 'Beni Hatirla',
  submitLabel: 'GIRIS YAP',
  submittingLabel: 'GIRIS YAPILIYOR',
  restrictedAreaLabel: 'Bu alan sadece yetkili personel icindir',
  customerPromptLabel: 'Musteri misin?',
  customerPromptAction: 'Musteri girisine git',
  footerNote: '(c) 2024 OBSIDYEN ATOLYESI. Tum haklari saklidir.',
} as const;

export const STAFF_ACCESS_SUPPORT_LINKS: StaffAccessSupportLink[] = [
  { label: 'Gizlilik Politikasi', href: '/gizlilik-politikasi' },
  { label: 'Kullanim Kosullari', href: '/kullanim-kosullari' },
  { label: 'Sistem Durumu' },
];

export function getStaffAccessNotice(
  state: StaffAccessState,
): StaffAccessNotice {
  switch (state) {
    case 'validationError':
      return {
        badge: 'Form Kontrolu',
        title: 'Bilgileri yeniden kontrol et',
        description: 'Telefon/e-posta ve sifre gecerli olmadan giris ilerlemez.',
        tone: 'error',
      };
    case 'authorizing':
      return {
        badge: 'Dogrulama',
        title: 'Kimlik dogrulaniyor',
        description: 'Giris bilgileri kontrol ediliyor. Lutfen bekleyin...',
        tone: 'neutral',
      };
    case 'accessGranted':
      return {
        badge: 'Basarili',
        title: 'Giris onaylandi',
        description: 'Salon paneline yonlendiriliyorsunuz...',
        tone: 'success',
      };
    case 'invalidCredentials':
      return {
        badge: 'Hatali Bilgi',
        title: 'Giris basarisiz',
        description: 'E-posta veya sifre hatali. Lutfen bilgileri kontrol edip tekrar dene.',
        tone: 'error',
      };
    case 'requestError':
      return {
        badge: 'Sunucu Hatasi',
        title: 'Giris tamamlanamadi',
        description: 'Sunucuyla iletisim kurulamadi. Lutfen internet baglantini kontrol edip tekrar dene.',
        tone: 'error',
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
        description: 'Salon paneline erisim icin e-posta ve sifre bilgilerinizi girin.',
        tone: 'neutral',
      };
  }
}
