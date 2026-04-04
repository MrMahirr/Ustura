import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Platform, Pressable } from 'react-native';

import { hexToRgba } from '@/utils/color';

import { styles } from './styles';

export default function SalonActionIcon({
  icon,
  label,
  color,
}: {
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  label: string;
  color: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ hovered, pressed }) => [
        styles.iconAction,
        {
          backgroundColor: hovered ? hexToRgba(color, 0.12) : 'transparent',
          transform: [{ scale: pressed ? 0.94 : 1 }],
        },
        Platform.OS === 'web' ? styles.webInteractiveButton : null,
      ]}>
      {({ hovered }) => <MaterialIcons name={icon} size={18} color={hovered ? color : hexToRgba(color, 0.96)} />}
    </Pressable>
  );
}
