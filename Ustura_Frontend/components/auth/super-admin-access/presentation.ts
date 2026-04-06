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
  eyebrow: 'Super Admin Panel',
  subtitle: 'Sistem yönetimi için giriş yap',
  shellVersion: 'SECURE_SHELL_V2.0',
  emailLabel: 'Admin Email',
  emailPlaceholder: 'admin@ustura.saas',
  passwordLabel: 'Şifre',
  passwordPlaceholder: '••••••••',
  forgotPasswordLabel: 'Şifremi Unuttum',
  trustedDeviceLabel: 'Bu cihazı güvenilir olarak işaretle',
  submitLabel: 'Giriş Yap',
  restrictedAreaLabel: 'Bu alan yalnızca yetkili yöneticiler içindir',
  systemSecureLabel: 'SYSTEM SECURE',
  lastLoginLabel: 'Son giriş: İstanbul, Türkiye',
  legalFooterSuffix: 'ALL RIGHTS RESERVED. SECURE ADMIN ACCESS ONLY.',
} as const;

export const SUPER_ADMIN_SUPPORT_LINKS: SuperAdminSupportLink[] = [
  { label: 'Security Protocol', href: '/kullanim-kosullari' },
  { label: 'Privacy Policy', href: '/gizlilik-politikasi' },
  { label: 'System Status' },
];

function createIdleMessage(): SuperAdminAccessMessage {
  return {
    badge: 'Beklemede',
    title: 'Doğrulama bekleniyor',
    description: 'Bu ekran şu an yalnızca UI ve yerel form doğrulama testi için aktiftir.',
    tone: 'neutral',
    consoleEntries: [
      {
        id: 'idle-status',
        text: 'System idle... awaiting credentials',
        tone: 'neutral',
        pulse: true,
      },
      {
        id: 'idle-token',
        text: 'Session_token: NULL',
        tone: 'neutral',
        dimmed: true,
      },
    ],
  };
}

function createValidationErrorMessage(): SuperAdminAccessMessage {
  return {
    badge: 'Doğrulama Hatası',
    title: 'Form alanlarını kontrol et',
    description: 'Email formatı ve şifre alanı doldurulmadan test akışı ilerletilmez.',
    tone: 'error',
    consoleEntries: [
      {
        id: 'validation-status',
        text: 'Validation_error: invalid credential payload',
        tone: 'error',
        pulse: true,
      },
      {
        id: 'validation-token',
        text: 'Session_token: NULL',
        tone: 'neutral',
        dimmed: true,
      },
    ],
  };
}

function createTestReadyMessage(trustedDevice: boolean): SuperAdminAccessMessage {
  return {
    badge: 'Test Onayı',
    title: 'Yerel doğrulama tamamlandı',
    description: trustedDevice
      ? 'Cihaz güvenilir olarak işaretlendi. Gerçek oturum açma ve panel erişimi backend entegrasyonu sonrası eklenecek.'
      : 'Giriş verileri yerelde doğrulandı. Gerçek oturum açma ve panel erişimi backend entegrasyonu sonrası eklenecek.',
    tone: 'success',
    consoleEntries: [
      {
        id: 'test-status',
        text: 'Mock_validation: PASSED',
        tone: 'success',
        pulse: true,
      },
      {
        id: 'test-access',
        text: trustedDevice ? 'Trusted_device: ENABLED' : 'Trusted_device: DISABLED',
        tone: 'warning',
      },
      {
        id: 'test-pending',
        text: 'Panel_access: WAITING_FOR_BACKEND_AUTH',
        tone: 'neutral',
      },
      {
        id: 'test-token',
        text: 'Session_token: NULL',
        tone: 'neutral',
        dimmed: true,
      },
    ],
  };
}

function createForgotPasswordMessage(): SuperAdminAccessMessage {
  return {
    badge: 'Test Notu',
    title: 'Şifre sıfırlama henüz bağlı değil',
    description: 'Şifre yenileme akışı backend ve mail servisi hazır olduğunda bu ekrana entegre edilecek.',
    tone: 'warning',
    consoleEntries: [],
  };
}

function createSystemStatusMessage(): SuperAdminAccessMessage {
  return {
    badge: 'Sistem Durumu',
    title: 'Status endpointi henüz bağlı değil',
    description: 'Gerçek servis sağlık kontrolleri backend ve izleme altyapısı tamamlandığında burada yayınlanacak.',
    tone: 'warning',
    consoleEntries: [
      {
        id: 'system-status',
        text: 'Status_api: NOT_CONNECTED',
        tone: 'warning',
        pulse: true,
      },
      {
        id: 'system-status-token',
        text: 'Session_token: NULL',
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
