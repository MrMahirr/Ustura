import type { ComponentProps } from 'react';
import { MaterialIcons } from '@expo/vector-icons';

import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { hexToRgba } from '@/utils/color';

import type { SalonStatus } from './types';

type SuperAdminTheme = ReturnType<typeof useSuperAdminTheme>;

export type SalonActionIconName = ComponentProps<typeof MaterialIcons>['name'];

export type SalonRowActionKind = 'view' | 'suspend' | 'restore' | 'delete';

export interface SalonAction {
  kind: SalonRowActionKind;
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
  theme: Pick<SuperAdminTheme, 'primary' | 'success' | 'error'>,
): SalonAction[] {
  if (status === 'Askiya Alindi') {
    return [
      { kind: 'restore', icon: 'restore', label: 'Yeniden aktiflestir', color: theme.success },
      { kind: 'view', icon: 'visibility', label: 'Detaylari gor', color: theme.primary },
      { kind: 'delete', icon: 'delete-outline', label: 'Salonu sil', color: theme.error },
    ];
  }

  return [
    { kind: 'view', icon: 'visibility', label: 'Detaylari gor', color: theme.primary },
    { kind: 'suspend', icon: 'block', label: 'Askiya al', color: theme.error },
    { kind: 'delete', icon: 'delete-outline', label: 'Salonu sil', color: theme.error },
  ];
}
