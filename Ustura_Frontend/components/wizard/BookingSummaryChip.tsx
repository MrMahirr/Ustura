import React from 'react';
import { Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { useAppTheme } from '@/contexts/ThemeContext';
import { useThemeColor } from '@/hooks/use-theme-color';
import { hexToRgba } from '@/utils/color';

interface BookingSummaryChipProps {
  label: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
  tone?: 'highlight' | 'neutral';
}

export default function BookingSummaryChip({
  label,
  icon,
  tone = 'neutral',
}: BookingSummaryChipProps) {
  const { theme } = useAppTheme();
  const primary = useThemeColor({}, 'primary');
  const surfaceContainerLow = useThemeColor({}, 'surfaceContainerLow');
  const surfaceContainerLowest = useThemeColor({}, 'surfaceContainerLowest');
  const onSurface = useThemeColor({}, 'onSurface');
  const onSurfaceVariant = useThemeColor({}, 'onSurfaceVariant');

  const isHighlight = tone === 'highlight';

  return (
    <View
      className="flex-row items-center self-start rounded-full border px-4 py-2"
      style={{
        gap: 8,
        backgroundColor: isHighlight
          ? hexToRgba(primary, theme === 'light' ? 0.12 : 0.14)
          : theme === 'light'
            ? surfaceContainerLowest
            : surfaceContainerLow,
        borderColor: isHighlight ? hexToRgba(primary, 0.34) : hexToRgba(onSurfaceVariant, 0.18),
      }}>
      {icon ? (
        <MaterialIcons
          name={icon}
          size={16}
          color={isHighlight ? primary : hexToRgba(onSurfaceVariant, 0.82)}
        />
      ) : null}
      <Text
        className="font-label text-xs font-bold uppercase tracking-[2.2px]"
        style={{ color: isHighlight ? primary : onSurface }}>
        {label}
      </Text>
    </View>
  );
}
