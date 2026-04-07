import React from 'react';
import { Platform, View, type StyleProp, type ViewStyle } from 'react-native';

import { useAppTheme } from '@/contexts/ThemeContext';
import { useThemeColor } from '@/hooks/use-theme-color';
import { hexToRgba } from '@/utils/color';

interface BookingSurfacePanelProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  padded?: boolean;
}

export default function BookingSurfacePanel({
  children,
  style,
  padded = true,
}: BookingSurfacePanelProps) {
  const { theme } = useAppTheme();
  const primary = useThemeColor({}, 'primary');
  const surfaceContainerLow = useThemeColor({}, 'surfaceContainerLow');
  const surfaceContainerLowest = useThemeColor({}, 'surfaceContainerLowest');
  const outlineVariant = useThemeColor({}, 'outlineVariant');

  return (
    <View
      className={padded ? 'rounded-2xl border p-6' : 'overflow-hidden rounded-2xl border'}
      style={[
        {
          backgroundColor:
            theme === 'light'
              ? hexToRgba(surfaceContainerLowest, 0.96)
              : hexToRgba(surfaceContainerLow, 0.9),
          borderColor: hexToRgba(outlineVariant, theme === 'light' ? 0.52 : 0.18),
        },
        Platform.OS === 'web'
          ? ({
              boxShadow:
                theme === 'light'
                  ? '0 20px 40px rgba(27, 27, 32, 0.06)'
                  : `0 18px 36px ${hexToRgba(primary, 0.08)}`,
            } as any)
          : {
              shadowColor: theme === 'light' ? '#1B1B20' : primary,
              shadowOpacity: theme === 'light' ? 0.07 : 0.08,
              shadowRadius: 20,
              shadowOffset: { width: 0, height: 10 },
              elevation: 6,
            },
        style,
      ]}>
      {children}
    </View>
  );
}
