import { Platform } from 'react-native';

import { hexToRgba } from '@/utils/color';

import type { useSuperAdminTheme } from '../theme';
import type { LogSeverity } from './types';

type AdminTheme = ReturnType<typeof useSuperAdminTheme>;

export const logClassNames = {
  page: 'relative flex-1 overflow-hidden',
  content: 'w-full max-w-[1600px] self-center gap-8',
  headerSection: 'justify-between gap-5',
  headerCopy: 'max-w-[720px] flex-1 gap-2.5',
  eyebrow: 'font-label text-xs uppercase tracking-[4px]',
  title: 'font-headline text-[38px] tracking-[-0.8px]',
  description: 'max-w-[620px] font-body text-base',
  tableShell: 'overflow-hidden rounded-[10px] border',
  headerText: 'font-label text-[10px] uppercase tracking-[2.4px]',
  emptyTitle: 'text-base',
  emptyDescription: 'max-w-[420px] text-center text-sm leading-5',
  statsGrid: 'flex-row flex-wrap gap-3',
} as const;

export function getLogPanelShadow(theme: 'light' | 'dark') {
  return Platform.OS === 'web'
    ? ({
        boxShadow:
          theme === 'dark'
            ? '0 26px 60px rgba(0, 0, 0, 0.34)'
            : '0 24px 54px rgba(27, 27, 32, 0.08)',
      } as const)
    : {
        shadowColor: '#000000',
        shadowOpacity: theme === 'dark' ? 0.22 : 0.08,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 12 },
        elevation: 8,
      };
}

export function getSeverityPalette(severity: LogSeverity, theme: AdminTheme) {
  switch (severity) {
    case 'success':
      return {
        color: theme.success,
        backgroundColor: hexToRgba(theme.success, 0.1),
        borderColor: hexToRgba(theme.success, 0.2),
      };
    case 'warning':
      return {
        color: theme.warning,
        backgroundColor: hexToRgba(theme.warning, 0.1),
        borderColor: hexToRgba(theme.warning, 0.2),
      };
    case 'error':
      return {
        color: theme.error,
        backgroundColor: hexToRgba(theme.error, 0.1),
        borderColor: hexToRgba(theme.error, 0.2),
      };
    default:
      return {
        color: theme.primary,
        backgroundColor: hexToRgba(theme.primary, 0.08),
        borderColor: hexToRgba(theme.primary, 0.15),
      };
  }
}

export function getWebTransition() {
  return Platform.OS === 'web'
    ? ({
        transition:
          'background-color 180ms ease, border-color 180ms ease, opacity 180ms ease',
        cursor: 'pointer',
      } as any)
    : null;
}
