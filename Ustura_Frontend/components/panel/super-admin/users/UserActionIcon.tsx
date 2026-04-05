import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Platform, Pressable, type GestureResponderEvent } from 'react-native';

import { hexToRgba } from '@/utils/color';

import { userClassNames } from './presentation';

export default function UserActionIcon({
  icon,
  label,
  color,
  onPress,
}: {
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  label: string;
  color: string;
  onPress?: (event: GestureResponderEvent) => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      className={userClassNames.iconAction}
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
