import type { Href } from 'expo-router';

export type SuperAdminAccessState =
  | 'idle'
  | 'validationError'
  | 'authorizing'
  | 'accessGranted'
  | 'requestError'
  | 'forgotPassword'
  | 'systemStatus';
export type SuperAdminMessageTone = 'neutral' | 'success' | 'warning' | 'error';

export interface SuperAdminConsoleEntry {
  id: string;
  text: string;
  tone: SuperAdminMessageTone;
  pulse?: boolean;
  dimmed?: boolean;
}

export interface SuperAdminAccessMessage {
  badge: string;
  title: string;
  description: string;
  tone: SuperAdminMessageTone;
  consoleEntries: SuperAdminConsoleEntry[];
}

export interface SuperAdminSupportLink {
  label: string;
  href?: Href;
}

export const SUPER_ADMIN_ACCESS_COPY = {
  brand: 'USTURA',
  eyebrow: 'Ana Yonetici Paneli',
  subtitle: 'Sistem yonetimi icin giris yap',
  shellVersion: 'GUVENLI_KABUK_V2.0',
  emailLabel: 'Yonetici E-postasi',
  emailPlaceholder: 'admin@ustura.com',
  passwordLabel: 'Sifre',
  passwordPlaceholder: '********',
  trustedDeviceLabel: 'Bu cihazi guvenilir olarak isaretle',
  submitLabel: 'Giris Yap',
  restrictedAreaLabel: 'Bu alan yalnizca yetkili yoneticiler icindir',
  systemSecureLabel: 'SISTEM GUVENDE',
  lastLoginLabel: 'Son giris: Istanbul, Turkiye',
  legalFooterSuffix: 'Tum haklari saklidir. Yalnizca yetkili yonetici erisimi.',
} as const;

export const SUPER_ADMIN_SUPPORT_LINKS: SuperAdminSupportLink[] = [
  { label: 'Guvenlik Protokolu', href: '/kullanim-kosullari' },
  { label: 'Gizlilik Politikasi', href: '/gizlilik-politikasi' },
  { label: 'Sistem Durumu' },
];

function createIdleMessage(): SuperAdminAccessMessage {
  return {
    badge: 'Beklemede',
    title: 'Super-admin dogrulamasi bekleniyor',
    description: 'Yetkili yonetici hesabinin e-posta ve sifresini girerek panel oturumu baslat.',
    tone: 'neutral',
    consoleEntries: [
      {
        id: 'idle-status',
        text: 'Sistem beklemede... kimlik bilgileri bekleniyor',
        tone: 'neutral',
        pulse: true,
      },
      {
        id: 'idle-token',
        text: 'Oturum_belirteci: BOS',
        tone: 'neutral',
        dimmed: true,
      },
    ],
  };
}

function createAuthorizingMessage(trustedDevice: boolean): SuperAdminAccessMessage {
  return {
    badge: 'Dogrulaniyor',
    title: 'Kimlik bilgileri denetleniyor',
    description: trustedDevice
      ? 'Guvenilir cihaz tercihi kaydedildi. Oturum istegi backend uzerinden dogrulaniyor.'
      : 'Oturum istegi backend uzerinden dogrulaniyor.',
    tone: 'warning',
    consoleEntries: [
      {
        id: 'authorizing-status',
        text: 'Kimlik_dogrulama: DEVAM_EDIYOR',
        tone: 'warning',
        pulse: true,
      },
      {
        id: 'authorizing-device',
        text: trustedDevice ? 'Guvenilir_cihaz: ACIK' : 'Guvenilir_cihaz: KAPALI',
        tone: 'neutral',
      },
      {
        id: 'authorizing-gateway',
        text: 'Yetki_kaprisi: BACKEND_ILE_ESLESTIRILIYOR',
        tone: 'neutral',
      },
    ],
  };
}

function createValidationErrorMessage(): SuperAdminAccessMessage {
  return {
    badge: 'Dogrulama Hatasi',
    title: 'Form alanlarini kontrol et',
    description: 'E-posta bicimi ve sifre alani gecersiz oldugunda giris istegi gonderilmez.',
    tone: 'error',
    consoleEntries: [
      {
        id: 'validation-status',
        text: 'Dogrulama_hatasi: gecersiz kimlik bilgisi paketi',
        tone: 'error',
        pulse: true,
      },
      {
        id: 'validation-token',
        text: 'Oturum_belirteci: BOS',
        tone: 'neutral',
        dimmed: true,
      },
    ],
  };
}

function createAccessGrantedMessage(trustedDevice: boolean): SuperAdminAccessMessage {
  return {
    badge: 'Erisim Onaylandi',
    title: 'Panel oturumu acildi',
    description: trustedDevice
      ? 'Cihaz guvenilir olarak isaretlendi. Super-admin paneline yonlendiriliyorsun.'
      : 'Yetkili super-admin hesabi dogrulandi. Panel ekranina yonlendiriliyorsun.',
    tone: 'success',
    consoleEntries: [
      {
        id: 'access-status',
        text: 'Kimlik_dogrulama: BASARILI',
        tone: 'success',
        pulse: true,
      },
      {
        id: 'access-device',
        text: trustedDevice ? 'Guvenilir_cihaz: ACIK' : 'Guvenilir_cihaz: KAPALI',
        tone: 'warning',
      },
      {
        id: 'access-panel',
        text: 'Panel_erisimi: ONAYLANDI',
        tone: 'success',
      },
      {
        id: 'access-token',
        text: 'Oturum_belirteci: OLUSTURULDU',
        tone: 'success',
      },
    ],
  };
}

function createRequestErrorMessage(): SuperAdminAccessMessage {
  return {
    badge: 'Erisim Reddedildi',
    title: 'Giris tamamlanamadi',
    description: 'Kimlik bilgileri veya yetki seviyesi panel erisimi icin dogrulanamadi.',
    tone: 'error',
    consoleEntries: [
      {
        id: 'request-error',
        text: 'Yetki_kaprisi: REDDEDILDI',
        tone: 'error',
        pulse: true,
      },
      {
        id: 'request-error-token',
        text: 'Oturum_belirteci: BOS',
        tone: 'neutral',
        dimmed: true,
      },
    ],
  };
}

function createForgotPasswordMessage(): SuperAdminAccessMessage {
  return {
    badge: 'Destek Gerekli',
    title: 'Sifre sifirlama henuz aktif degil',
    description: 'Super-admin sifre yenileme akisi backend ve e-posta servisi tamamlandiginda bu ekrana eklenecek.',
    tone: 'warning',
    consoleEntries: [],
  };
}

function createSystemStatusMessage(): SuperAdminAccessMessage {
  return {
    badge: 'Sistem Durumu',
    title: 'Durum servisi henuz bagli degil',
    description: 'Gercek servis saglik kontrolleri backend ve izleme altyapisi tamamlandiginda burada yayinlanacak.',
    tone: 'warning',
    consoleEntries: [
      {
        id: 'system-status',
        text: 'Durum_api: BAGLI_DEGIL',
        tone: 'warning',
        pulse: true,
      },
      {
        id: 'system-status-token',
        text: 'Oturum_belirteci: BOS',
        tone: 'neutral',
        dimmed: true,
      },
    ],
  };
}

export function getSuperAdminAccessMessage(
  state: SuperAdminAccessState,
  trustedDevice: boolean
): SuperAdminAccessMessage {
  switch (state) {
    case 'authorizing':
      return createAuthorizingMessage(trustedDevice);
    case 'accessGranted':
      return createAccessGrantedMessage(trustedDevice);
    case 'requestError':
      return createRequestErrorMessage();
    case 'validationError':
      return createValidationErrorMessage();
    case 'forgotPassword':
      return createForgotPasswordMessage();
    case 'systemStatus':
      return createSystemStatusMessage();
    case 'idle':
    default:
      return createIdleMessage();
  }
}
