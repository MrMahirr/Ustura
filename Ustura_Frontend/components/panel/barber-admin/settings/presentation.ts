import { Platform } from 'react-native';

import { hexToRgba } from '@/utils/color';

import type { useBarberAdminTheme } from '../theme';

type BarberTheme = ReturnType<typeof useBarberAdminTheme>;

export const barberSettingsClassNames = {
  page: 'relative flex-1 overflow-hidden',
  content: 'w-full max-w-[960px] self-center gap-8',
} as const;

export function getBarberCardStyle(theme: BarberTheme) {
  return {
    backgroundColor: theme.panelBackground,
    borderWidth: 1,
    borderColor: theme.borderSubtle,
    borderRadius: 12,
    ...getBarberSettingShadow(theme),
  };
}

export function getBarberTabStyle(theme: BarberTheme, isActive: boolean) {
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

export function getBarberInputStyle(theme: BarberTheme) {
  return {
    backgroundColor: theme.panelBackgroundMuted,
    borderWidth: 1,
    borderColor: theme.borderSubtle,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'web' ? 12 : 10,
    color: theme.onSurface,
    fontSize: 14,
  };
}

export function getBarberWebTransition() {
  return Platform.OS === 'web'
    ? ({
        transition: 'background-color 180ms ease, border-color 180ms ease, opacity 180ms ease',
        cursor: 'pointer',
      } as any)
    : null;
}

export function getBarberInputWebStyle() {
  return Platform.OS === 'web'
    ? ({ outlineWidth: 0, outlineStyle: 'none' } as any)
    : null;
}

function getBarberSettingShadow(theme: BarberTheme) {
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
