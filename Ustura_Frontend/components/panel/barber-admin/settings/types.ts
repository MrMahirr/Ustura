import type { ComponentProps } from 'react';
import type { MaterialIcons } from '@expo/vector-icons';
import type { WorkingHoursEntry } from '@/services/salon.service';

export type BarberSettingsTabId =
  | 'salon-info'
  | 'storefront'
  | 'services'
  | 'working-hours'
  | 'notifications'
  | 'account';

export interface BarberSettingsTab {
  id: BarberSettingsTabId;
  label: string;
  icon: ComponentProps<typeof MaterialIcons>['name'];
}

export type DayKey =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export interface DaySchedule {
  day: DayKey;
  label: string;
  entry: WorkingHoursEntry | null;
}

export interface SalonFormData {
  name: string;
  address: string;
  city: string;
  district: string;
  photoUrl: string;
}

export const DAY_LABELS: Record<DayKey, string> = {
  monday: 'Pazartesi',
  tuesday: 'Salı',
  wednesday: 'Çarşamba',
  thursday: 'Perşembe',
  friday: 'Cuma',
  saturday: 'Cumartesi',
  sunday: 'Pazar',
};

export const DAY_ORDER: DayKey[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];
