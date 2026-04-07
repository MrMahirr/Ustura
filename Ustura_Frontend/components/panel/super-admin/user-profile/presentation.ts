import { Platform } from 'react-native';

export const userProfileClassNames = {
  page: 'relative flex-1 overflow-hidden',
  content: 'w-full max-w-[1600px] self-center gap-7',
  column: 'gap-6',
  panelCard: 'gap-[18px] rounded-sm p-7',
  panelHeaderRow: 'flex-row items-center justify-between gap-4',
  panelHeaderCopy: 'gap-1.5',
  panelTitle: 'font-headline text-[30px] leading-[36px]',
  panelTitleSm: 'font-headline text-2xl leading-[30px]',
  panelSubtitle: 'font-body text-xs leading-[18px]',
  panelIconButton: 'h-[34px] w-[34px] items-center justify-center rounded-full',
  labelText: 'font-label text-[10px] uppercase tracking-widest',
  primaryText: 'font-body text-sm',
  secondaryText: 'font-body text-[13px] leading-[18px]',
  statusText: 'font-label text-[10px] uppercase tracking-wide',
} as const;

export function getUserProfilePanelShadow(theme: 'light' | 'dark') {
  return Platform.OS === 'web'
    ? ({
        boxShadow:
          theme === 'dark'
            ? '0 18px 40px rgba(0, 0, 0, 0.24)'
            : '0 18px 40px rgba(27, 27, 32, 0.08)',
      } as const)
    : {
        shadowColor: '#000000',
        shadowOpacity: theme === 'dark' ? 0.18 : 0.08,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 10 },
        elevation: 8,
      };
}
