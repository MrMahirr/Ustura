import type { Href } from 'expo-router';

import type { AuthStatusTone } from '@/components/auth/shared/AuthStatusNotice';

export interface CustomerAuthNotice {
  badge: string;
  title: string;
  description: string;
  tone: AuthStatusTone;
}

export type CustomerAccessState =
  | 'idle'
  | 'validationError'
  | 'invalidCredentials'
  | 'requestError'
  | 'forgotPassword'
  | 'providerPreview'
  | 'testReady';
export type CustomerRegistrationState =
  | 'idle'
  | 'validationError'
  | 'alternateRoute'
  | 'requestError'
  | 'testReady';

export interface CustomerAccessBarberProfile {
  id: string;
  imageUri: string;
  accessibilityLabel: string;
}

export const CUSTOMER_ACCESS_COPY = {
  footerNote: '(c) 2026 USTURA. ALL RIGHTS RESERVED.',
  eyebrow: 'Premium Grooming Login',
  brandTitle: 'USTURA',
  brandTagline: 'Keskin Stil, Kolay Randevu.',
  brandDescription:
    'Favori berberini sec, zamanini rezerve et. En iyi grooming deneyimi seni bekliyor.',
  brandRosterLabel: '50+ Premium Berber',
  formTitle: 'Giris Yap',
  formDescription: 'USTURA musteri hesabina giris yap',
  identifierLabel: 'E-posta',
  identifierPlaceholder: 'isim@ornek.com',
  passwordLabel: 'Sifre',
  passwordPlaceholder: '********',
  rememberMeLabel: 'Beni hatirla',
  forgotPasswordLabel: 'Sifremi Unuttum',
  submitLabel: 'Giris Yap',
  dividerLabel: 'veya',
  googleLabel: 'Google ile giris yap',
  registerPromptLabel: 'Hesabin yok mu?',
  registerPromptAction: 'Kayit Ol',
  staffLabel: 'Personel Girisi',
  adminLabel: 'Super Admin',
} as const;

export const CUSTOMER_ACCESS_BARBER_PROFILES: CustomerAccessBarberProfile[] = [
  {
    id: 'barber-1',
    imageUri:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD73qiiTJ-kQNf-sY_Jf-J6L_MliXA__CG5ALY8p1dgKBuSGYJGWv5cjI8pHaTuaAfLembVsN8ae3dGqXER-ZYTSY4K77jerqFv2mnzDBuKQwwgG3PcFsWG0nXdaMz7FuY1ynApMC77TYEAVZYrOvYsulR04kjjfF5uwP_b1Xkd3GBQNCONqM9pw9z7JkAinjGRX-qdDaTP5nHQrP_0iIbyiW8iUM4hYIw9DZggUeT5paXxFZ6KIsn0M6QJOm7nF2eFYFGRuIOGNz4',
    accessibilityLabel: 'Profesyonel berber portresi',
  },
  {
    id: 'barber-2',
    imageUri:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB4iES9LzzhCdVIzvNqLJV6Xqrf_n8JuqVnuQertMIi0N5NWiWw71bHX7z9NfqVGNMJ6aqMr3kj-zwkzIdfsEB3cfm-_0JTkb5zgIIB-kE9F68MK_djZCPt7i6kqacekHKKukrsFx-7fB1yI3RXbjj_hCkXOekxxG1rVaUS7Fk3YtIvxYe9LtxWWwIoyqEz7iGetFpmVWwoFFgFCaBvRRUmio_tz_kwEetEfCK8C6s6CW3jxoztGJNwrbx_rDQkj09-HlL92SjtINs',
    accessibilityLabel: 'Luks salonda calisan stilist portresi',
  },
  {
    id: 'barber-3',
    imageUri:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD0wo3uZv0vIHvuonDdR9mMo-B8wFeyDPOMx_RJZkW2gMwbJqpkNGJt7tTJVrYatnNE_lsOcVHhnxTpFqEnF2a3lEGubzG36aMxzy5uIdlORD9KIEB6_GLAAHKmhxcW5K-7Gmh3JqWm7Ea6_G6mV8iNm7i4W6NY3RcJ8Akn93JrxNBOEx-RIVpD4MsmhkXWeFiigq0M2bWuhTgU58Kxjfp3bCCX_uwfttkoxQnyCOzS8KShoHh0V7wub8wQgkctpLkjOcKhadrlddQ',
    accessibilityLabel: 'Keskin sac kesimi yapan usta berber portresi',
  },
];

export const CUSTOMER_REGISTRATION_COPY = {
  footerNote: '(c) 2026 USTURA. ALL RIGHTS RESERVED.',
  formTitle: 'Kayit Ol',
  formDescription: 'USTURA hesabini olustur',
  title: 'Dakikalar icinde hesabini ac ve uygun saatleri yakala.',
  description:
    'Musteri kaydi, randevu gecmisi ve favori salonlar icin hazir. Alternatif roller secildiginde seni dogru auth akisina yonlendirecegiz.',
  fullNameLabel: 'Ad Soyad',
  fullNamePlaceholder: 'Mahir Demir',
  phoneLabel: 'Telefon',
  phonePlaceholder: '0555 000 00 00',
  emailLabel: 'Email',
  emailPlaceholder: 'ornek@ustura.com',
  passwordLabel: 'Sifre',
  passwordPlaceholder: '********',
  roleLabel: 'Hesap Tipi',
  rolePlaceholder: 'Bir hesap tipi sec',
  submitLabel: 'Hesabi Hazirla',
  signInLabel: 'Giris Yap',
  signInPromptLabel: 'Zaten bir hesabin var mi?',
  signInPromptAction: 'Giris Yap',
} as const;

export interface CustomerRoleOption {
  id: 'customer' | 'staff' | 'super-admin';
  label: string;
  description: string;
  availability: 'self-service' | 'redirect';
  href?: Href;
}

export const CUSTOMER_ROLE_OPTIONS: CustomerRoleOption[] = [
  {
    id: 'customer',
    label: 'Musteri',
    description: 'Randevu al, favori salonlarini kaydet ve gecmis islemlerini takip et.',
    availability: 'self-service',
  },
  {
    id: 'staff',
    label: 'Personel',
    description: 'Salon ici ekip hesaplari self-service kayit yerine personel auth akisi ile yonetilir.',
    availability: 'redirect',
    href: '/personel/giris',
  },
  {
    id: 'super-admin',
    label: 'Super Admin',
    description: 'Platform yonetimi icin self-service kayit kapali. Ayricalikli erisim gerektirir.',
    availability: 'redirect',
    href: '/super-admin/giris',
  },
];

export function getCustomerAccessNotice(state: CustomerAccessState): CustomerAuthNotice {
  switch (state) {
    case 'validationError':
      return {
        badge: 'Dogrulama',
        title: 'Form alanlarini kontrol et.',
        description: 'Devam etmeden once email veya telefon ve sifre alanlarini gecerli bicimde doldur.',
        tone: 'error',
      };
    case 'forgotPassword':
      return {
        badge: 'Kurtarma',
        title: 'Sifre sifirlama akisi sonraki API asamasinda baglanacak.',
        description: 'Simdilik kayitli email veya telefon bilgilerini kullanarak test girisi yapabilirsin.',
        tone: 'warning',
      };
    case 'invalidCredentials':
      return {
        badge: 'Kimlik Dogrulama',
        title: 'Email veya sifre dogrulanamadi.',
        description: 'Hesap bilgilerini kontrol edip tekrar dene.',
        tone: 'warning',
      };
    case 'requestError':
      return {
        badge: 'API',
        title: 'Giris islemi tamamlanamadi.',
        description: 'Sunucu, Google saglayicisi veya ag baglantisi su anda cevap vermiyor olabilir.',
        tone: 'warning',
      };
    case 'providerPreview':
      return {
        badge: 'SSO Preview',
        title: 'Google ile giris yakinda baglanacak.',
        description: 'Sosyal giris butonu yeni auth contract geldikten sonra provider entegrasyonuna baglanacak.',
        tone: 'neutral',
      };
    case 'testReady':
      return {
        badge: 'Oturum',
        title: 'Musteri oturumu baslatildi.',
        description: 'Kimlik dogrulandi ve seni bir sonraki ekrana yonlendiriyoruz.',
        tone: 'success',
      };
    case 'idle':
    default:
      return {
        badge: 'Preview',
        title: 'Genel musteri auth giris noktasi aktif.',
        description: 'Bu ekran artik placeholder yerine gercek form davranisi ve route yonlendirmeleri sunuyor.',
        tone: 'neutral',
      };
  }
}

export function getCustomerRegistrationNotice(
  state: CustomerRegistrationState,
  selectedRole: CustomerRoleOption
): CustomerAuthNotice {
  switch (state) {
    case 'validationError':
      return {
        badge: 'Dogrulama',
        title: 'Kayit bilgilerini tamamla.',
        description: 'Ad soyad, telefon, email, sifre ve hesap tipi alanlari gecerli olmadan devam edemezsin.',
        tone: 'error',
      };
    case 'alternateRoute':
      return {
        badge: 'Yonlendirme',
        title: `${selectedRole.label} icin farkli auth yolu kullaniliyor.`,
        description:
          selectedRole.href != null
            ? 'Bu secim self-service kaydi acmiyor. Ilgili giris ekranina giderek dogru akistan devam et.'
            : 'Bu rol icin self-service kayit acik degil.',
        tone: 'warning',
      };
    case 'requestError':
      return {
        badge: 'API',
        title: 'Kayit istegi tamamlanamadi.',
        description: 'Girilen bilgiler sunucuda islenemedi. Birazdan tekrar dene.',
        tone: 'warning',
      };
    case 'testReady':
      return {
        badge: 'Hesap',
        title: 'Musteri hesabi olusturuldu.',
        description: 'Kayit tamamlandi. Yeni oturum acildi ve seni uygun akisa yonlendiriyoruz.',
        tone: 'success',
      };
    case 'idle':
    default:
      return {
        badge: 'Onboarding',
        title: 'Musteri kaydi aktif; diger roller yonlendirme ile ayriliyor.',
        description:
          selectedRole.id === 'customer'
            ? 'Varsayilan kayit tipi musteri hesabi. Dilersen alternatif role gecip sistemin seni dogru auth yoluna tasimasini gorebilirsin.'
            : `${selectedRole.label} secildi. Submit sonrasi seni uygun auth yonlendirmesine hazirlayacagiz.`,
        tone: 'neutral',
      };
  }
}
