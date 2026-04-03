import React from 'react';
import { Text, Pressable, StyleSheet, ViewStyle } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Typography } from '@/constants/typography';

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
      onPress={onPress}
      style={({ pressed, hovered }) => [
        styles.badge,
        { backgroundColor: bgColor },
        !isActive && (pressed || hovered) && { backgroundColor: primary },
        style
      ]}
    >
      {({ pressed, hovered }) => (
        <Text style={[styles.text, { color: !isActive && (pressed || hovered) ? onPrimary : textColor }]}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s', // works on web
  } as any,
  text: {
    ...Typography.labelMd,
    fontFamily: 'Manrope-Bold',
    textTransform: 'none',
    letterSpacing: 0.5,
  },
});
