import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Platform, Pressable } from 'react-native';

import { hexToRgba } from '@/utils/color';

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
      className="h-[34px] w-[34px] items-center justify-center rounded-full"
      style={({ hovered, pressed }) => [
        {
          backgroundColor: hovered ? hexToRgba(color, 0.12) : 'transparent',
          transform: [{ scale: pressed ? 0.94 : 1 }],
        },
        Platform.OS === 'web'
          ? ({
              transition: 'background-color 160ms ease, border-color 160ms ease, opacity 160ms ease, transform 160ms ease',
              cursor: 'pointer',
            } as any)
          : null,
      ]}>
      {({ hovered }) => <MaterialIcons name={icon} size={18} color={hovered ? color : hexToRgba(color, 0.96)} />}
    </Pressable>
  );
}
