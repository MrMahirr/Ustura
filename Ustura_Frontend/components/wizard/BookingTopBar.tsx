import React from 'react';
import { Platform, Text, View } from 'react-native';

import SessionProfileCard from '@/components/layout/SessionProfileCard';
import ThemeToggleButton from '@/components/ui/ThemeToggleButton';
import { useAppTheme } from '@/contexts/ThemeContext';
import { useThemeColor } from '@/hooks/use-theme-color';
import { hexToRgba } from '@/utils/color';

interface BookingTopBarProps {
  compact: boolean;
  title: string;
}

export default function BookingTopBar({ compact, title }: BookingTopBarProps) {
  const { theme } = useAppTheme();
  const surface = useThemeColor({}, 'surface');
  const onSurface = useThemeColor({}, 'onSurface');
  const primary = useThemeColor({}, 'primary');
  const outlineVariant = useThemeColor({}, 'outlineVariant');

  return (
    <View
      className="absolute left-0 right-0 top-0 z-50 border-b"
      style={[
        {
          minHeight: 72,
          paddingHorizontal: compact ? 20 : 24,
          paddingVertical: 12,
          backgroundColor:
            theme === 'light'
              ? Platform.OS === 'web'
                ? 'rgba(253, 251, 255, 0.92)'
                : surface
              : Platform.OS === 'web'
                ? hexToRgba(surface, 0.82)
                : surface,
          borderBottomColor: hexToRgba(outlineVariant, theme === 'light' ? 0.46 : 0.18),
        },
        Platform.OS === 'web'
          ? ({
              backdropFilter: 'blur(18px)',
              boxShadow:
                theme === 'light'
                  ? '0 12px 30px rgba(27, 27, 32, 0.08)'
                  : '0 10px 32px rgba(0, 0, 0, 0.18)',
            } as any)
          : {
              shadowColor: theme === 'light' ? '#1B1B20' : '#000000',
              shadowOpacity: theme === 'light' ? 0.08 : 0.16,
              shadowRadius: 18,
              shadowOffset: { width: 0, height: 8 },
              elevation: 8,
            },
      ]}>
      <View className="flex-row items-center justify-between" style={{ gap: 16 }}>
        <View style={{ flex: 1, gap: 2 }}>
          <Text className="font-headline text-xl font-bold italic tracking-tight" style={{ color: primary }}>
            {title}
          </Text>
          {!compact ? (
            <Text className="font-label text-[10px] uppercase tracking-[3px]" style={{ color: hexToRgba(onSurface, 0.42) }}>
              Ozel Randevu Akisi
            </Text>
          ) : null}
        </View>

        <View className="flex-row items-center" style={{ gap: 12 }}>
          <ThemeToggleButton size="compact" />
          <SessionProfileCard compact={compact} size="small" />
        </View>
      </View>
    </View>
  );
}
