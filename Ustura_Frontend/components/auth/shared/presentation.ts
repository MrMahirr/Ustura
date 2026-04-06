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
  { label: 'Privacy Policy', href: '/gizlilik-politikasi' },
  { label: 'Terms of Service', href: '/kullanim-kosullari' },
  { label: 'System Status' },
];
