import type { ComponentProps } from 'react';
import { MaterialIcons } from '@expo/vector-icons';

import type { UserRecord, UserRole, UserStatus } from '@/components/panel/super-admin/user-management.data';
import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { hexToRgba } from '@/utils/color';

type SuperAdminTheme = ReturnType<typeof useSuperAdminTheme>;

export type UserActionIconName = ComponentProps<typeof MaterialIcons>['name'];

export interface UserAction {
  icon: UserActionIconName;
  label: string;
  color: string;
}

export function getRolePalette(
  role: UserRole,
  theme: Pick<SuperAdminTheme, 'primary' | 'secondary' | 'onSurfaceVariant' | 'cardBackgroundStrong'>
) {
  if (role === 'Yonetici') {
    return {
      color: theme.primary,
      backgroundColor: hexToRgba(theme.primary, 0.14),
      borderColor: hexToRgba(theme.primary, 0.26),
    };
  }

  if (role === 'Sahip') {
    return {
      color: theme.secondary,
      backgroundColor: hexToRgba(theme.secondary, 0.12),
      borderColor: hexToRgba(theme.secondary, 0.22),
    };
  }

  return {
    color: theme.onSurfaceVariant,
    backgroundColor: theme.cardBackgroundStrong,
    borderColor: hexToRgba(theme.onSurfaceVariant, 0.18),
  };
}

export function getStatusPalette(
  status: UserStatus,
  theme: Pick<SuperAdminTheme, 'success' | 'error' | 'warning' | 'onSurfaceVariant'>
) {
  if (status === 'Aktif') {
    return {
      color: theme.success,
      accent: theme.success,
    };
  }

  if (status === 'Mesgul') {
    return {
      color: theme.error,
      accent: theme.error,
    };
  }

  if (status === 'Askida') {
    return {
      color: theme.warning,
      accent: theme.warning,
    };
  }

  return {
    color: hexToRgba(theme.onSurfaceVariant, 0.88),
    accent: hexToRgba(theme.onSurfaceVariant, 0.65),
  };
}

export function getOccupancyRatio(dailyCapacity?: UserRecord['dailyCapacity']) {
  if (!dailyCapacity || dailyCapacity.total <= 0) {
    return 0;
  }

  return Math.max(0, Math.min(1, dailyCapacity.booked / dailyCapacity.total));
}

export function formatOccupancy(dailyCapacity?: UserRecord['dailyCapacity']) {
  if (!dailyCapacity) {
    return 'Yok';
  }

  return `${dailyCapacity.booked}/${dailyCapacity.total}`;
}

export function getUserActions(
  role: UserRole,
  status: UserStatus,
  theme: Pick<SuperAdminTheme, 'primary' | 'error' | 'warning' | 'onSurfaceVariant'>
): UserAction[] {
  const muted = hexToRgba(theme.onSurfaceVariant, 0.78);

  if (role === 'Yonetici') {
    return [
      { icon: 'visibility', label: 'Detay', color: theme.primary },
      { icon: 'edit', label: 'Duzenle', color: theme.primary },
      { icon: status === 'Askida' ? 'shield' : 'manage-accounts', label: 'Yetki', color: muted },
    ];
  }

  if (status === 'Mesgul') {
    return [
      { icon: 'visibility', label: 'Detay', color: theme.primary },
      { icon: 'edit', label: 'Duzenle', color: theme.primary },
      { icon: 'block', label: 'Durdur', color: theme.error },
    ];
  }

  if (status === 'Askida') {
    return [
      { icon: 'visibility', label: 'Detay', color: theme.primary },
      { icon: 'restore', label: 'Yeniden Aktiflestir', color: theme.warning },
      { icon: 'edit', label: 'Duzenle', color: muted },
    ];
  }

  return [
    { icon: 'visibility', label: 'Detay', color: theme.primary },
    { icon: 'edit', label: 'Duzenle', color: theme.primary },
    { icon: 'block', label: 'Durdur', color: theme.error },
  ];
}

export function formatCompactNumber(value: number) {
  return new Intl.NumberFormat('tr-TR').format(value);
}
