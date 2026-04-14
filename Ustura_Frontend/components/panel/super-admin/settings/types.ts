import type { ComponentProps } from 'react';
import type { MaterialIcons } from '@expo/vector-icons';

export type SettingsTabId = 'general' | 'security' | 'email' | 'reservation' | 'system';

export interface SettingsTab {
  id: SettingsTabId;
  label: string;
  icon: ComponentProps<typeof MaterialIcons>['name'];
}

export type ConfigItemStatus = 'configured' | 'missing' | 'info';

export interface ConfigDisplayItem {
  label: string;
  value: string;
  status: ConfigItemStatus;
  masked?: boolean;
}

export interface ConfigGroup {
  title: string;
  icon: ComponentProps<typeof MaterialIcons>['name'];
  items: ConfigDisplayItem[];
}
