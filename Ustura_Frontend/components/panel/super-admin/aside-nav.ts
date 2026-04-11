import type { ComponentProps } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import type { Href } from 'expo-router';

import { panelRoutes } from '@/constants/routes';

export type AsideIconName = ComponentProps<typeof MaterialIcons>['name'];

export interface SuperAdminAsideItem {
  label: string;
  icon: AsideIconName;
  href?: Href;
  disabled?: boolean;
  matchSubroutes?: boolean;
}

export const superAdminAsideItems: SuperAdminAsideItem[] = [
  { label: 'Dashboard', icon: 'dashboard', href: panelRoutes.home },
  { label: 'Salonlar', icon: 'storefront', href: panelRoutes.salonlar, matchSubroutes: true },
  { label: 'Kullanicilar', icon: 'group', href: panelRoutes.kullanicilar, matchSubroutes: true },
  { label: 'Randevular', icon: 'event-available', href: panelRoutes.randevular },
  { label: 'Odemeler', icon: 'payments', disabled: true },
  { label: 'Paketler', icon: 'inventory-2', href: panelRoutes.paketler },
  { label: 'Raporlar', icon: 'analytics', disabled: true },
  { label: 'Bildirimler', icon: 'notifications', disabled: true },
  { label: 'Sistem Ayarlari', icon: 'settings', href: panelRoutes.ayarlar },
];
