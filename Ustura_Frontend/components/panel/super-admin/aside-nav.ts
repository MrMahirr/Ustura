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
}

/** HTML mock ile aynı sıra ve etiketler; href yalnızca mevcut rotalar için */
export const superAdminAsideItems: SuperAdminAsideItem[] = [
  { label: 'Dashboard', icon: 'dashboard', href: panelRoutes.home },
  { label: 'Salonlar', icon: 'storefront', href: panelRoutes.salonlar },
  { label: 'Kullanıcılar', icon: 'group', disabled: true },
  { label: 'Randevular', icon: 'event-available', href: panelRoutes.randevular },
  { label: 'Ödemeler', icon: 'payments', disabled: true },
  { label: 'Paketler', icon: 'inventory-2', disabled: true },
  { label: 'Raporlar', icon: 'analytics', disabled: true },
  { label: 'Bildirimler', icon: 'notifications', disabled: true },
  { label: 'Sistem Ayarları', icon: 'settings', href: panelRoutes.ayarlar },
];
