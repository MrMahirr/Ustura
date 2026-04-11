import { Platform } from 'react-native';

export const packageProfileClassNames = {
  page: 'relative flex-1 overflow-hidden',
  content: 'w-full max-w-[1400px] self-center',
  column: 'flex-1',
} as const;

export function getPackagePanelShadow(theme: 'light' | 'dark') {
  return Platform.OS === 'web'
    ? ({
        boxShadow:
          theme === 'dark'
            ? '0 16px 40px rgba(0, 0, 0, 0.28)'
            : '0 16px 36px rgba(27, 27, 32, 0.05)',
      } as const)
    : {
        shadowColor: '#000000',
        shadowOpacity: theme === 'dark' ? 0.22 : 0.08,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 12 },
        elevation: 8,
      };
}
