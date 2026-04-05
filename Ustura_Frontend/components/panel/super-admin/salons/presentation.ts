import { Platform } from 'react-native';

export const salonClassNames = {
  page: 'relative flex-1 overflow-hidden',
  content: 'w-full max-w-[1600px] self-center gap-8',
  headerSection: 'justify-between gap-5',
  headerCopy: 'max-w-[720px] flex-1 gap-2.5',
  eyebrow: 'font-label text-xs uppercase tracking-[4px]',
  title: 'font-headline text-[38px] tracking-[-0.8px]',
  description: 'max-w-[620px] font-body text-base',
  tableShell: 'overflow-hidden rounded-[10px] border',
  filtersGrid: 'flex-row flex-wrap gap-3',
  filterCard: 'min-h-[82px] justify-between rounded-[7px] border px-[14px] py-3',
  filterLabel: 'font-label text-[9px] uppercase tracking-[1.8px]',
  headerText: 'font-label text-[10px] uppercase tracking-[2.4px]',
  emptyTitle: 'text-base',
  emptyDescription: 'max-w-[420px] text-center text-sm leading-5',
} as const;

export function getSalonPanelShadow(theme: 'light' | 'dark') {
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
