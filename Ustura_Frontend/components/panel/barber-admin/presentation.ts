import { Platform } from 'react-native';

import { hexToRgba } from '@/utils/color';

import { useBarberAdminTheme } from './theme';

type BarberTheme = ReturnType<typeof useBarberAdminTheme>;

export const barberAdminClassNames = {
  page: 'relative flex-1 overflow-hidden',
  content: 'w-full max-w-[1600px] self-center gap-8',
  splitGrid: 'gap-8',
  metricGrid: 'gap-4',
  panelSection: 'overflow-hidden rounded-xl border',
  panelHeader: 'mb-5 flex-row items-center justify-between gap-4',
  appointmentList: 'gap-3',
  staffList: 'gap-4',
  fab: 'absolute bottom-6 right-6 z-40 h-16 w-16 items-center justify-center rounded-full',
} as const;

export function getBarberPanelShadow(theme: BarberTheme) {
  return Platform.OS === 'web'
    ? ({
        boxShadow:
          theme.theme === 'dark'
            ? '0 24px 54px rgba(0, 0, 0, 0.26)'
            : '0 18px 42px rgba(27, 27, 32, 0.10)',
      } as any)
    : {
        shadowColor: '#000000',
        shadowOpacity: theme.theme === 'dark' ? 0.2 : 0.1,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 10 },
        elevation: 8,
      };
}

export function getInteractiveWebStyle() {
  return Platform.OS === 'web'
    ? ({
        transition:
          'transform 180ms ease, background-color 180ms ease, border-color 180ms ease, opacity 180ms ease, box-shadow 220ms ease',
        cursor: 'pointer',
      } as any)
    : null;
}

export function getMetricToneColor(
  tone: 'positive' | 'neutral' | 'attention',
  theme: BarberTheme,
) {
  if (tone === 'positive') {
    return theme.success;
  }

  if (tone === 'attention') {
    return theme.error;
  }

  return hexToRgba(theme.onSurfaceVariant, 0.88);
}
