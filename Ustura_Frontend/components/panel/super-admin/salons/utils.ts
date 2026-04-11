import type { ComponentProps } from 'react';
import { MaterialIcons } from '@expo/vector-icons';

import type { SalonPlan, SalonStatus } from '@/components/panel/super-admin/salon-management.data';
import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { hexToRgba } from '@/utils/color';

type SuperAdminTheme = ReturnType<typeof useSuperAdminTheme>;

export type SalonActionIconName = ComponentProps<typeof MaterialIcons>['name'];

export interface SalonAction {
  icon: SalonActionIconName;
  label: string;
  color: string;
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0,
  }).format(amount);
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

  if (status === 'Beklemede') {
    return {
      color: theme.warning,
      backgroundColor: hexToRgba(theme.warning, 0.14),
      borderColor: hexToRgba(theme.warning, 0.24),
    };
  }

  return {
    color: theme.error,
    backgroundColor: hexToRgba(theme.error, 0.12),
    borderColor: hexToRgba(theme.error, 0.24),
  };
}

export function getPlanPalette(
  plan: SalonPlan,
  theme: Pick<SuperAdminTheme, 'primary' | 'onSurface' | 'onSurfaceVariant'>
) {
  if (plan === 'Ozel') {
    return {
      dot: theme.primary,
      text: theme.onSurface,
      glow: hexToRgba(theme.primary, 0.48),
    };
  }

  if (plan === 'Gelismis') {
    return {
      dot: hexToRgba(theme.onSurfaceVariant, 0.58),
      text: theme.onSurface,
      glow: 'transparent',
    };
  }

  return {
    dot: hexToRgba(theme.onSurfaceVariant, 0.34),
    text: hexToRgba(theme.onSurfaceVariant, 0.9),
    glow: 'transparent',
  };
}

export function getRowActions(
  status: SalonStatus,
  theme: Pick<SuperAdminTheme, 'primary' | 'success' | 'error' | 'onSurfaceVariant'>
): SalonAction[] {
  const muted = hexToRgba(theme.onSurfaceVariant, 0.78);

  if (status === 'Beklemede') {
    return [
      { icon: 'check-circle', label: 'Onayla', color: theme.success },
      { icon: 'cancel', label: 'Reddet', color: theme.error },
      { icon: 'more-vert', label: 'Diger islemler', color: muted },
    ];
  }

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
