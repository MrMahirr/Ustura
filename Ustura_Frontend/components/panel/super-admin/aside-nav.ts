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
  { label: 'Basvurular', icon: 'assignment', href: panelRoutes.basvurular },
  { label: 'Kullanicilar', icon: 'group', href: panelRoutes.kullanicilar, matchSubroutes: true },
  { label: 'Paketler', icon: 'inventory-2', href: panelRoutes.paketler },
  { label: 'Raporlar', icon: 'analytics', href: panelRoutes.raporlar },
  { label: 'Loglar', icon: 'receipt-long', href: panelRoutes.loglar },
  { label: 'Bildirimler', icon: 'notifications', href: panelRoutes.bildirimler },
  { label: 'Sistem Ayarlari', icon: 'settings', href: panelRoutes.ayarlar },
];
