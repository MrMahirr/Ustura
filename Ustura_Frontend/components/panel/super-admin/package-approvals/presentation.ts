import { Platform } from 'react-native';

import { hexToRgba } from '@/utils/color';

import type { PackageApprovalStatus } from './types';

export const packageApprovalClassNames = {
  shell: 'overflow-hidden rounded-[14px] border',
  panel: 'rounded-[12px] border',
  label: 'font-label text-[10px] uppercase tracking-[2.4px]',
  serifTitle: 'font-headline tracking-[-0.6px]',
} as const;

export function getPackageApprovalPanelShadow(theme: 'light' | 'dark') {
  return Platform.OS === 'web'
    ? ({
        boxShadow:
          theme === 'dark'
            ? '0 30px 72px rgba(0, 0, 0, 0.28)'
            : '0 24px 54px rgba(27, 27, 32, 0.08)',
      } as const)
    : {
        shadowColor: '#000000',
        shadowOpacity: theme === 'dark' ? 0.2 : 0.08,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 10 },
        elevation: 6,
      };
}

interface ApprovalStatusPaletteInput {
  primary: string;
  success: string;
  error: string;
  warning: string;
  onSurfaceVariant: string;
}

export function getApprovalStatusPalette(
  status: PackageApprovalStatus,
  input: ApprovalStatusPaletteInput,
) {
  if (status === 'approved') {
    return {
      accent: input.success,
      accentSoft: hexToRgba(input.success, 0.12),
      accentBorder: hexToRgba(input.success, 0.24),
      textColor: input.success,
      label: 'Onaylandi',
    };
  }

  if (status === 'rejected') {
    return {
      accent: input.error,
      accentSoft: hexToRgba(input.error, 0.12),
      accentBorder: hexToRgba(input.error, 0.24),
      textColor: input.error,
      label: 'Reddedildi',
    };
  }

  return {
    accent: input.primary,
    accentSoft: hexToRgba(input.warning || input.primary, 0.12),
    accentBorder: hexToRgba(input.primary, 0.24),
    textColor: input.primary,
    label: 'Beklemede',
  };
}
