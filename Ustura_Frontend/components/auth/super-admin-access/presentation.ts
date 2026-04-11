import type { Href } from 'expo-router';

export type SuperAdminAccessState = 'idle' | 'validationError' | 'testReady' | 'forgotPassword' | 'systemStatus';
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
  emailPlaceholder: 'admin@ustura.saas',
  passwordLabel: 'Sifre',
  passwordPlaceholder: '********',
  forgotPasswordLabel: 'Sifremi Unuttum',
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
    title: 'Dogrulama bekleniyor',
    description: 'Bu ekran su an yalnizca arayuz ve yerel form dogrulama testi icin aktiftir.',
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

function createValidationErrorMessage(): SuperAdminAccessMessage {
  return {
    badge: 'Dogrulama Hatasi',
    title: 'Form alanlarini kontrol et',
    description: 'E-posta bicimi ve sifre alani doldurulmadan test akisi ilerletilmez.',
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

function createTestReadyMessage(trustedDevice: boolean): SuperAdminAccessMessage {
  return {
    badge: 'Test Onayi',
    title: 'Yerel dogrulama tamamlandi',
    description: trustedDevice
      ? 'Cihaz guvenilir olarak isaretlendi. Gercek oturum acma ve panel erisimi arka uc entegrasyonu sonrasi eklenecek.'
      : 'Giris verileri yerelde dogrulandi. Gercek oturum acma ve panel erisimi arka uc entegrasyonu sonrasi eklenecek.',
    tone: 'success',
    consoleEntries: [
      {
        id: 'test-status',
        text: 'Yerel_dogrulama: BASARILI',
        tone: 'success',
        pulse: true,
      },
      {
        id: 'test-access',
        text: trustedDevice ? 'Guvenilir_cihaz: ACIK' : 'Guvenilir_cihaz: KAPALI',
        tone: 'warning',
      },
      {
        id: 'test-pending',
        text: 'Panel_erisimi: ARKA_UC_DOGRULAMASI_BEKLENIYOR',
        tone: 'neutral',
      },
      {
        id: 'test-token',
        text: 'Oturum_belirteci: BOS',
        tone: 'neutral',
        dimmed: true,
      },
    ],
  };
}

function createForgotPasswordMessage(): SuperAdminAccessMessage {
  return {
    badge: 'Test Notu',
    title: 'Sifre sifirlama henuz bagli degil',
    description: 'Sifre yenileme akisi arka uc ve e-posta servisi hazir oldugunda bu ekrana entegre edilecek.',
    tone: 'warning',
    consoleEntries: [],
  };
}

function createSystemStatusMessage(): SuperAdminAccessMessage {
  return {
    badge: 'Sistem Durumu',
    title: 'Durum ucu henuz bagli degil',
    description: 'Gercek servis saglik kontrolleri arka uc ve izleme altyapisi tamamlandiginda burada yayinlanacak.',
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
    case 'validationError':
      return createValidationErrorMessage();
    case 'testReady':
      return createTestReadyMessage(trustedDevice);
    case 'forgotPassword':
      return createForgotPasswordMessage();
    case 'systemStatus':
      return createSystemStatusMessage();
    case 'idle':
    default:
      return createIdleMessage();
  }
}
