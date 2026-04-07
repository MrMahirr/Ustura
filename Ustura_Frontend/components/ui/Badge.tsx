import React from 'react';
import { Pressable, Text, type ViewStyle } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

import { cn } from '@/utils/cn';

interface BadgeProps {
  label: string;
  onPress?: () => void;
  isActive?: boolean;
  style?: ViewStyle;
}

export default function Badge({ label, onPress, isActive, style }: BadgeProps) {
  const primary = useThemeColor({}, 'primary');
  const onPrimary = useThemeColor({}, 'onPrimary');
  const surfaceContainerHigh = useThemeColor({}, 'surfaceContainerHigh');
  const onSurfaceVariant = useThemeColor({}, 'onSurfaceVariant');

  const bgColor = isActive ? primary : surfaceContainerHigh;
  const textColor = isActive ? onPrimary : onSurfaceVariant;

  return (
    <Pressable
      className="items-center justify-center rounded-full px-6 py-2"
      onPress={onPress}
      style={({ pressed, hovered }) => [
        { backgroundColor: bgColor },
        !isActive && (pressed || hovered) && { backgroundColor: primary },
        style,
      ]}>
      {({ pressed, hovered }) => (
        <Text
          className={cn('font-label text-xs tracking-badge')}
          style={{ color: !isActive && (pressed || hovered) ? onPrimary : textColor, fontFamily: 'Manrope-Bold' }}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}
