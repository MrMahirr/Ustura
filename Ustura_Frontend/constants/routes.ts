import type { Href } from 'expo-router';

// Expo Router typegen currently resolves `app/panel/index.tsx` as `/panel/index`
// in this workspace. Keep canonical public paths here and cast once.
const route = (path: string) => path as Href;

/** Super Admin / yonetim paneli — URL segmenti: `/panel` */
export const panelRoutes = {
  home: route('/panel'),
  salonlar: route('/panel/salonlar'),
  kullanicilar: route('/panel/kullanicilar'),
  randevular: route('/panel/randevular'),
  paketler: route('/panel/paketler'),
  basvurular: route('/panel/basvurular'),
  bildirimler: route('/panel/bildirimler'),
  personel: route('/panel/personel'),
  ayarlar: route('/panel/ayarlar'),
} as const satisfies Record<string, Href>;

/** Berber / Personel paneli — URL segmenti: `/berber` */
export const staffRoutes = {
  home: route('/berber'),
  randevular: route('/berber/randevular'),
  bildirimler: route('/berber/bildirimler'),
  personel: route('/berber/personel'),
  ayarlar: route('/berber/ayarlar'),
} as const satisfies Record<string, Href>;

export const buildPanelSalonDetailRoute = (salonId: string): Href => ({
  pathname: '/panel/salonlar/[salonId]',
  params: { salonId },
});

export const buildPanelUserDetailRoute = (userId: string): Href => ({
  pathname: '/panel/kullanicilar/[userId]',
  params: { userId },
});

/** Acik / pazarlama sayfalari (grup URL'de gorunmez) */
export const publicRoutes = {
  home: '/',
  hakkimizda: '/hakkimizda',
  hizmetler: '/hizmetler',
  kuaforler: '/kuaforler',
  randevu: '/randevu',
  gizlilikPolitikasi: '/gizlilik-politikasi',
  kullanimKosullari: '/kullanim-kosullari',
} as const satisfies Record<string, Href>;

/** Kimlik */
export const authRoutes = {
  giris: '/giris',
  kayit: '/kayit',
} as const satisfies Record<string, Href>;
