import { Platform } from 'react-native';

import { hexToRgba } from '@/utils/color';

import type { useSuperAdminTheme } from '../theme';

type AdminTheme = ReturnType<typeof useSuperAdminTheme>;

export const settingsClassNames = {
  page: 'relative flex-1 overflow-hidden',
  content: 'w-full max-w-[1100px] self-center gap-8',
} as const;

export function getSettingsCardStyle(theme: AdminTheme) {
  return {
    backgroundColor: theme.cardBackground,
    borderWidth: 1,
    borderColor: theme.borderSubtle,
    borderRadius: 12,
    ...getSettingsShadow(theme),
  };
}

export function getSettingsTabStyle(theme: AdminTheme, isActive: boolean) {
  if (isActive) {
    return {
      backgroundColor: hexToRgba(theme.primary, 0.08),
      borderBottomWidth: 2,
      borderBottomColor: theme.primary,
    };
  }
  return {
    backgroundColor: 'transparent',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  };
}

export function getStatusColor(theme: AdminTheme, status: 'configured' | 'missing' | 'info') {
  switch (status) {
    case 'configured':
      return theme.success;
    case 'missing':
      return theme.error;
    case 'info':
    default:
      return hexToRgba(theme.onSurfaceVariant, 0.6);
  }
}

export function getWebTransition() {
  return Platform.OS === 'web'
    ? ({
        transition: 'background-color 180ms ease, border-color 180ms ease, opacity 180ms ease',
        cursor: 'pointer',
      } as any)
    : null;
}

function getSettingsShadow(theme: AdminTheme) {
  return Platform.OS === 'web'
    ? ({
        boxShadow:
          theme.theme === 'dark'
            ? '0 16px 36px rgba(0, 0, 0, 0.2)'
            : '0 8px 24px rgba(27, 27, 32, 0.05)',
      } as any)
    : {
        shadowColor: '#000000',
        shadowOpacity: theme.theme === 'dark' ? 0.15 : 0.06,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 6 },
        elevation: 5,
      };
}
