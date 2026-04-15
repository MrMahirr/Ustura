import { Platform } from 'react-native';

import { hexToRgba } from '@/utils/color';

import type { useBarberAdminTheme } from '../theme';

type BarberTheme = ReturnType<typeof useBarberAdminTheme>;

export const packagesClassNames = {
  page: 'relative flex-1 overflow-hidden',
  scrollContent: 'w-full self-center gap-16',
  heroTitle: 'gap-2',
  bannerContainer: 'overflow-hidden',
  planGrid: 'gap-8',
  tableContainer: 'overflow-hidden',
  faqContainer: 'w-full self-center gap-8',
  faqItem: 'overflow-hidden',
} as const;

export function getBannerStyle(theme: BarberTheme) {
  return {
    backgroundColor: theme.panelBackground,
    borderLeftWidth: 3,
    borderLeftColor: theme.primary,
    borderRadius: 12,
    ...getPanelShadow(theme),
  };
}

export function getPlanCardStyle(theme: BarberTheme, isFeatured: boolean) {
  return {
    backgroundColor: theme.panelBackground,
    borderWidth: isFeatured ? 2 : 1,
    borderColor: isFeatured ? theme.primary : hexToRgba(theme.onSurfaceVariant, 0.08),
    borderRadius: 12,
    ...getPanelShadow(theme),
  };
}

export function getTableStyle(theme: BarberTheme) {
  return {
    backgroundColor: theme.panelBackground,
    borderRadius: 12,
    overflow: 'hidden' as const,
    ...getPanelShadow(theme),
  };
}

export function getFaqItemStyle(theme: BarberTheme) {
  return {
    backgroundColor: theme.panelBackground,
    borderWidth: 1,
    borderColor: hexToRgba(theme.onSurfaceVariant, 0.08),
  };
}

export function getInteractiveStyle() {
  return Platform.OS === 'web'
    ? ({
        transition:
          'transform 180ms ease, background-color 180ms ease, border-color 180ms ease, opacity 180ms ease',
        cursor: 'pointer',
      } as any)
    : null;
}

export function getUpgradeButtonGradient(theme: BarberTheme) {
  return {
    from: theme.primary,
    to: theme.primaryContainer,
  };
}

function getPanelShadow(theme: BarberTheme) {
  return Platform.OS === 'web'
    ? ({
        boxShadow:
          theme.theme === 'dark'
            ? '0 20px 40px rgba(0, 0, 0, 0.22)'
            : '0 12px 32px rgba(27, 27, 32, 0.06)',
      } as any)
    : {
        shadowColor: '#000000',
        shadowOpacity: theme.theme === 'dark' ? 0.18 : 0.08,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 8 },
        elevation: 6,
      };
}
