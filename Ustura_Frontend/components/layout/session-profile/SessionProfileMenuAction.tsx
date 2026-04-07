import React from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { useThemeColor } from '@/hooks/use-theme-color';
import { hexToRgba } from '@/utils/color';

interface SessionProfileMenuActionProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  description: string;
  tone?: 'primary' | 'danger';
  onPress: () => void;
}

export default function SessionProfileMenuAction({
  icon,
  title,
  description,
  tone = 'primary',
  onPress,
}: SessionProfileMenuActionProps) {
  const primary = useThemeColor({}, 'primary');
  const error = useThemeColor({}, 'error');
  const onSurface = useThemeColor({}, 'onSurface');
  const onSurfaceVariant = useThemeColor({}, 'onSurfaceVariant');

  const accent = tone === 'danger' ? error : primary;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ hovered, pressed }) => [
        {
          borderRadius: 16,
          borderWidth: 1,
          paddingHorizontal: 14,
          paddingVertical: 14,
          backgroundColor: hovered || pressed ? hexToRgba(accent, 0.1) : 'transparent',
          borderColor: hovered || pressed ? hexToRgba(accent, 0.24) : 'transparent',
          transform: [{ scale: pressed ? 0.99 : 1 }],
        },
        Platform.OS === 'web'
          ? ({
              transition: 'background-color 180ms ease, border-color 180ms ease, transform 160ms ease',
            } as any)
          : null,
      ]}>
      {({ hovered }) => (
        <View className="flex-row items-center" style={{ gap: 12 }}>
          <View
            className="items-center justify-center rounded-full"
            style={{ width: 38, height: 38, backgroundColor: hexToRgba(accent, 0.12) }}>
            <MaterialIcons name={icon} size={18} color={accent} />
          </View>

          <View style={{ flex: 1, gap: 2 }}>
            <Text className="font-body text-sm font-bold" style={{ color: hovered ? accent : onSurface }}>
              {title}
            </Text>
            <Text className="font-body text-xs" style={{ color: onSurfaceVariant }}>
              {description}
            </Text>
          </View>

          <MaterialIcons name="east" size={16} color={hovered ? accent : hexToRgba(onSurfaceVariant, 0.72)} />
        </View>
      )}
    </Pressable>
  );
}
