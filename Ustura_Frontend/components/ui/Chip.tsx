import React from 'react';
import { Pressable, Text } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}

export default function Chip({ label, selected = false, onPress }: ChipProps) {
  const primary = useThemeColor({}, 'primary');
  const onPrimary = useThemeColor({}, 'onPrimary');
  const surfaceContainerHigh = useThemeColor({}, 'surfaceContainerHigh');
  const onSurfaceVariant = useThemeColor({}, 'onSurfaceVariant');

  return (
    <Pressable
      className="min-h-9 items-center justify-center rounded-full px-4 py-2"
      onPress={onPress}
      style={({ hovered, pressed }) => ({
        backgroundColor: selected
          ? primary
          : pressed || hovered
            ? surfaceContainerHigh
            : surfaceContainerHigh,
      })}>
      <Text
        className="text-[11px] uppercase tracking-[1.2px]"
        style={{ color: selected ? onPrimary : onSurfaceVariant, fontFamily: selected ? 'Manrope-Bold' : 'Manrope-Medium' }}>
        {label}
      </Text>
    </Pressable>
  );
}
