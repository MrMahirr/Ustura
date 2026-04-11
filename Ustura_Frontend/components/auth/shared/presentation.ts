import type { Href } from 'expo-router';

export interface AuthFrameLink {
  label: string;
  href?: Href;
  onPress?: () => void;
}

export const AUTH_FRAME_COPY = {
  brand: 'USTURA',
} as const;

export const AUTH_LEGAL_LINKS: AuthFrameLink[] = [
  { label: 'Gizlilik Politikasi', href: '/gizlilik-politikasi' },
  { label: 'Kullanim Kosullari', href: '/kullanim-kosullari' },
  { label: 'Sistem Durumu' },
];
