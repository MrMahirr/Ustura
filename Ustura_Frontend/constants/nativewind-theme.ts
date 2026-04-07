import { Colors } from '@/constants/theme';

type ThemeName = keyof typeof Colors;

export function getNativeWindThemeVariables(theme: ThemeName) {
  const palette = Colors[theme];

  return {
    '--color-primary': palette.primary,
    '--color-secondary': palette.secondary,
    '--color-tertiary': palette.tertiary,
    '--color-neutral': palette.neutral,
    '--color-surface': palette.surface,
    '--color-surface-container-lowest': palette.surfaceContainerLowest,
    '--color-surface-container-low': palette.surfaceContainerLow,
    '--color-surface-container': palette.surfaceContainer,
    '--color-surface-container-high': palette.surfaceContainerHigh,
    '--color-surface-container-highest': palette.surfaceContainerHighest,
    '--color-primary-container': palette.primaryContainer,
    '--color-on-primary': palette.onPrimary,
    '--color-on-surface': palette.onSurface,
    '--color-on-surface-variant': palette.onSurfaceVariant,
    '--color-outline-variant': palette.outlineVariant,
    '--color-error': palette.error,
    '--color-success': palette.success,
    '--color-warning': palette.warning,
  } as const;
}
