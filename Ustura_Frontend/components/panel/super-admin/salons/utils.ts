import type { ComponentProps } from 'react';
import { MaterialIcons } from '@expo/vector-icons';

import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { hexToRgba } from '@/utils/color';

import type { SalonStatus } from './types';

type SuperAdminTheme = ReturnType<typeof useSuperAdminTheme>;

export type SalonActionIconName = ComponentProps<typeof MaterialIcons>['name'];

export interface SalonAction {
  icon: SalonActionIconName;
  label: string;
  color: string;
}

export function getStatusPalette(
  status: SalonStatus,
  theme: Pick<SuperAdminTheme, 'success' | 'warning' | 'error'>
) {
  if (status === 'Aktif') {
    return {
      color: theme.success,
      backgroundColor: hexToRgba(theme.success, 0.12),
      borderColor: hexToRgba(theme.success, 0.24),
    };
  }

  return {
    color: theme.error,
    backgroundColor: hexToRgba(theme.error, 0.12),
    borderColor: hexToRgba(theme.error, 0.24),
  };
}

export function getRowActions(
  status: SalonStatus,
  theme: Pick<
    SuperAdminTheme,
    'primary' | 'success' | 'error' | 'onSurfaceVariant'
  >,
): SalonAction[] {
  const muted = hexToRgba(theme.onSurfaceVariant, 0.78);

  if (status === 'Askiya Alindi') {
    return [
      { icon: 'restore', label: 'Yeniden aktiflestir', color: theme.success },
      { icon: 'visibility', label: 'Detaylari gor', color: theme.primary },
      { icon: 'more-vert', label: 'Diger islemler', color: muted },
    ];
  }

  return [
    { icon: 'visibility', label: 'Detaylari gor', color: theme.primary },
    { icon: 'block', label: 'Askiya al', color: theme.error },
    { icon: 'more-vert', label: 'Diger islemler', color: muted },
  ];
}
