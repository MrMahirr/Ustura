import { Platform } from 'react-native';

import { useAppTheme } from '@/contexts/ThemeContext';
import { useThemeColor } from '@/hooks/use-theme-color';
import { hexToRgba } from '@/utils/color';

export function useBarberAdminTheme() {
  const { theme } = useAppTheme();

  const primary = useThemeColor({}, 'primary');
  const primaryContainer = useThemeColor({}, 'primaryContainer');
  const surface = useThemeColor({}, 'surface');
  const neutral = useThemeColor({}, 'neutral');
  const surfaceContainerLowest = useThemeColor({}, 'surfaceContainerLowest');
  const surfaceContainerLow = useThemeColor({}, 'surfaceContainerLow');
  const surfaceContainer = useThemeColor({}, 'surfaceContainer');
  const surfaceContainerHigh = useThemeColor({}, 'surfaceContainerHigh');
  const surfaceContainerHighest = useThemeColor({}, 'surfaceContainerHighest');
  const onPrimary = useThemeColor({}, 'onPrimary');
  const onSurface = useThemeColor({}, 'onSurface');
  const onSurfaceVariant = useThemeColor({}, 'onSurfaceVariant');
  const success = useThemeColor({}, 'success');
  const error = useThemeColor({}, 'error');
  const warning = useThemeColor({}, 'warning');

  const isDark = theme === 'dark';

  return {
    theme,
    primary,
    primaryContainer,
    surface,
    neutral,
    surfaceContainerLowest,
    surfaceContainerLow,
    surfaceContainer,
    surfaceContainerHigh,
    surfaceContainerHighest,
    onPrimary,
    onSurface,
    onSurfaceVariant,
    success,
    error,
    warning,
    pageBackground: isDark ? '#0A0A0F' : surface,
    panelBackground: isDark ? surfaceContainerLow : surfaceContainerLowest,
    panelBackgroundStrong: isDark ? surfaceContainer : surfaceContainerHigh,
    panelBackgroundMuted: isDark ? '#0A0A0F' : surfaceContainerLow,
    borderSubtle: isDark ? hexToRgba(onSurface, 0.08) : hexToRgba(onSurfaceVariant, 0.12),
    borderStrong: isDark ? hexToRgba(primary, 0.2) : hexToRgba(onSurfaceVariant, 0.2),
    successSoft: hexToRgba(success, 0.12),
    warningSoft: hexToRgba(warning, 0.12),
    errorSoft: hexToRgba(error, 0.12),
    dotOverlay: hexToRgba(primary, isDark ? 0.06 : 0.09),
    goldGradient: isDark
      ? ([primary, primaryContainer] as const)
      : ([primaryContainer, primary] as const),
    topBarBackground: isDark ? hexToRgba(surface, 0.82) : hexToRgba(surfaceContainerLowest, 0.96),
    searchBackground: isDark ? surfaceContainerLow : surfaceContainerHigh,
    cardBackground: isDark ? surfaceContainerLow : surfaceContainerLowest,
    cardBackgroundMuted: isDark ? surface : surfaceContainerLow,
    cardBackgroundStrong: isDark ? surfaceContainer : surfaceContainerHigh,
    sidebarBackground: isDark ? surface : surfaceContainerLowest,
    sidebarActiveBackground: isDark ? surfaceContainerLow : surfaceContainerHigh,
    sidebarActiveBorder: isDark ? primaryContainer : primary,
    serifFont: Platform.select({ web: 'Noto Serif, serif', default: 'serif' }),
    bodyFont: Platform.select({ web: 'Manrope, sans-serif', default: 'System' }),
  };
}
