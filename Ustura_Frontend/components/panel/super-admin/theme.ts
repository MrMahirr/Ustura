import { Platform } from 'react-native';

import { useAppTheme } from '@/contexts/ThemeContext';
import { useThemeColor } from '@/hooks/use-theme-color';
import { hexToRgba } from '@/utils/color';

export function useSuperAdminTheme() {
  const { theme } = useAppTheme();

  const primary = useThemeColor({}, 'primary');
  const primaryContainer = useThemeColor({}, 'primaryContainer');
  const secondary = useThemeColor({}, 'secondary');
  const tertiary = useThemeColor({}, 'tertiary');
  const neutral = useThemeColor({}, 'neutral');
  const surface = useThemeColor({}, 'surface');
  const surfaceContainerLowest = useThemeColor({}, 'surfaceContainerLowest');
  const surfaceContainerLow = useThemeColor({}, 'surfaceContainerLow');
  const surfaceContainer = useThemeColor({}, 'surfaceContainer');
  const surfaceContainerHigh = useThemeColor({}, 'surfaceContainerHigh');
  const surfaceContainerHighest = useThemeColor({}, 'surfaceContainerHighest');
  const onPrimary = useThemeColor({}, 'onPrimary');
  const onSurface = useThemeColor({}, 'onSurface');
  const onSurfaceVariant = useThemeColor({}, 'onSurfaceVariant');
  const outlineVariant = useThemeColor({}, 'outlineVariant');
  const error = useThemeColor({}, 'error');
  const success = useThemeColor({}, 'success');
  const warning = useThemeColor({}, 'warning');

  return {
    theme,
    primary,
    primaryContainer,
    secondary,
    tertiary,
    neutral,
    surface,
    surfaceContainerLowest,
    surfaceContainerLow,
    surfaceContainer,
    surfaceContainerHigh,
    surfaceContainerHighest,
    onPrimary,
    onSurface,
    onSurfaceVariant,
    outlineVariant,
    error,
    success,
    warning,
    pageBackground: theme === 'dark' ? neutral : surface,
    pageBackgroundAccent: theme === 'dark' ? surface : surfaceContainerLow,
    sidebarBackground: theme === 'dark' ? surface : surfaceContainerLowest,
    sidebarActiveBackground: theme === 'dark' ? surfaceContainerLow : surfaceContainerHigh,
    topBarBackground: theme === 'dark' ? hexToRgba(surface, 0.82) : hexToRgba(surfaceContainerLowest, 0.96),
    cardBackground: theme === 'dark' ? surfaceContainerLow : surfaceContainerLowest,
    cardBackgroundMuted: theme === 'dark' ? surface : surfaceContainerLow,
    cardBackgroundStrong: theme === 'dark' ? surfaceContainer : surfaceContainerHigh,
    searchBackground: theme === 'dark' ? surfaceContainerLow : surfaceContainerHigh,
    tableHeaderBackground: theme === 'dark' ? surface : surfaceContainer,
    logBackground: surfaceContainerLowest,
    borderSubtle: theme === 'dark' ? hexToRgba(onSurface, 0.06) : hexToRgba(onSurfaceVariant, 0.12),
    borderStrong: theme === 'dark' ? hexToRgba(onSurface, 0.1) : hexToRgba(onSurfaceVariant, 0.2),
    gridDot: hexToRgba(primary, theme === 'dark' ? 0.05 : 0.09),
    goldGradient: [theme === 'dark' ? hexToRgba(primary, 1) : primaryContainer, primary],
    serifFont: Platform.select({ web: 'Noto Serif, serif', default: 'serif' }),
    bodyFont: Platform.select({ web: 'Manrope, sans-serif', default: 'System' }),
    monoFont: Platform.select({
      web: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
      default: 'monospace',
    }),
  };
}
