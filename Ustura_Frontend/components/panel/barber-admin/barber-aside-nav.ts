import type { ComponentProps } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import type { Href } from 'expo-router';

import { staffRoutes } from '@/constants/routes';

export type BarberAsideIconName = ComponentProps<typeof MaterialIcons>['name'];

export interface BarberAsideItem {
  label: string;
  icon: BarberAsideIconName;
  href: Href;
}

export const barberAsideItems: BarberAsideItem[] = [
  { label: 'Dashboard', icon: 'dashboard', href: staffRoutes.home },
  { label: 'Randevular', icon: 'calendar-today', href: staffRoutes.randevular },
  { label: 'Bildirimler', icon: 'notifications', href: staffRoutes.bildirimler },
  { label: 'Personel', icon: 'badge', href: staffRoutes.personel },
  { label: 'Abonelik', icon: 'workspace-premium', href: staffRoutes.paketler },
  { label: 'Ayarlar', icon: 'settings', href: staffRoutes.ayarlar },
];
