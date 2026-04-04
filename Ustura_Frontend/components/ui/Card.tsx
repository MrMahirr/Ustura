import React from 'react';
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { useAppTheme } from '@/contexts/ThemeContext';
import { useThemeColor } from '@/hooks/use-theme-color';
import { hexToRgba } from '@/utils/color';

export interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  padding?: number;
  variant?: 'low' | 'default' | 'high' | 'glass';
  accentColor?: string;
  accentPosition?: 'left' | 'top';
}

export default function Card({
  children,
  style,
  contentStyle,
  padding = 24,
  variant = 'default',
  accentColor,
  accentPosition = 'left',
}: CardProps) {
  const surfaceContainerLow = useThemeColor({}, 'surfaceContainerLow');
  const surfaceContainer = useThemeColor({}, 'surfaceContainer');
  const surfaceContainerHigh = useThemeColor({}, 'surfaceContainerHigh');
  const outlineVariant = useThemeColor({}, 'outlineVariant');
  const { theme } = useAppTheme();

  const backgroundColor =
    variant === 'low'
      ? surfaceContainerLow
      : variant === 'high'
        ? surfaceContainerHigh
        : variant === 'glass'
          ? hexToRgba(theme === 'light' ? '#FFFFFF' : surfaceContainerLow, theme === 'light' ? 0.92 : 0.82)
          : surfaceContainer;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor,
          borderColor: accentColor ?? outlineVariant,
          padding,
        },
        accentColor && accentPosition === 'left' && { borderLeftWidth: 3 },
        accentColor && accentPosition === 'top' && { borderTopWidth: 3 },
        variant === 'glass' &&
          (Platform.OS === 'web'
            ? ({
                backdropFilter: 'blur(18px)',
                boxShadow:
                  theme === 'light'
                    ? '0 22px 48px rgba(27, 27, 32, 0.08)'
                    : '0 22px 48px rgba(0, 0, 0, 0.28)',
              } as any)
            : {
                shadowColor: '#000000',
                shadowOpacity: theme === 'light' ? 0.1 : 0.22,
                shadowRadius: 18,
                shadowOffset: { width: 0, height: 8 },
                elevation: 8,
              }),
        style,
      ]}>
      <View style={contentStyle}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    ...(Platform.OS === 'web'
      ? ({
          transition: 'background-color 260ms ease, border-color 260ms ease, box-shadow 260ms ease',
        } as any)
      : {}),
  },
});
