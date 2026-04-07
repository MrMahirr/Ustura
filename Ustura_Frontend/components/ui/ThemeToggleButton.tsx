import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Animated, Platform, Pressable, View } from 'react-native';

import { useAppTheme } from '@/contexts/ThemeContext';
import { useThemeColor } from '@/hooks/use-theme-color';
import { hexToRgba } from '@/utils/color';

interface ThemeToggleButtonProps {
  size?: 'default' | 'compact';
}

export default function ThemeToggleButton({ size = 'default' }: ThemeToggleButtonProps) {
  const { theme, toggleTheme } = useAppTheme();
  const primary = useThemeColor({}, 'primary');
  const surface = useThemeColor({}, 'surface');
  const surfaceContainerLow = useThemeColor({}, 'surfaceContainerLow');
  const onSurfaceVariant = useThemeColor({}, 'onSurfaceVariant');
  const isCompact = size === 'compact';
  const buttonSize = isCompact ? 32 : 46;
  const iconSize = isCompact ? 15 : 20;
  const pressAnim = React.useRef(new Animated.Value(0)).current;

  const iconRotate = pressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', theme === 'light' ? '-16deg' : '16deg'],
  });

  const handlePressIn = () => {
    Animated.spring(pressAnim, {
      toValue: 1,
      speed: 18,
      bounciness: 6,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(pressAnim, {
      toValue: 0,
      speed: 18,
      bounciness: 6,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={{ width: buttonSize, height: buttonSize, alignItems: 'center', justifyContent: 'center' }}>
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          width: buttonSize + (isCompact ? 6 : 10),
          height: buttonSize + (isCompact ? 6 : 10),
          borderRadius: (buttonSize + (isCompact ? 6 : 10)) / 2,
          backgroundColor: hexToRgba(primary, isCompact ? 0.08 : 0.06),
        }}
      />

      <Pressable
        className="items-center justify-center"
        onPress={toggleTheme}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityRole="button"
        accessibilityLabel={theme === 'light' ? 'Karanlik temaya gec' : 'Acik temaya gec'}
        style={({ hovered, pressed }) => [
          {
            width: buttonSize,
            height: buttonSize,
            borderRadius: buttonSize / 2,
            borderWidth: isCompact ? 1 : 0,
            backgroundColor: hovered
              ? hexToRgba(surfaceContainerLow, isCompact ? 0.9 : 0.92)
              : hexToRgba(surface, isCompact ? 0.42 : 0.82),
            borderColor: isCompact
              ? hovered
                ? hexToRgba(primary, 0.22)
                : hexToRgba(onSurfaceVariant, 0.12)
              : 'transparent',
            transform: [{ scale: pressed ? 0.95 : hovered ? 1.03 : 1 }],
          },
          Platform.OS === 'web'
            ? ({
                boxShadow: hovered
                  ? `0 ${isCompact ? 10 : 12}px ${isCompact ? 22 : 24}px ${hexToRgba(primary, isCompact ? 0.2 : 0.18)}`
                  : `0 ${isCompact ? 5 : 6}px ${isCompact ? 14 : 16}px ${hexToRgba(primary, isCompact ? 0.12 : 0.08)}`,
                cursor: 'pointer',
                transition: 'background-color 240ms ease, border-color 240ms ease, box-shadow 240ms ease, transform 200ms ease',
              } as any)
            : {
                shadowColor: primary,
                shadowOpacity: hovered ? (isCompact ? 0.16 : 0.18) : isCompact ? 0.1 : 0.1,
                shadowRadius: hovered ? (isCompact ? 12 : 14) : isCompact ? 7 : 8,
                shadowOffset: { width: 0, height: hovered ? (isCompact ? 7 : 8) : isCompact ? 4 : 4 },
                elevation: hovered ? (isCompact ? 6 : 8) : isCompact ? 4 : 4,
              },
        ]}>
        <Animated.View style={{ transform: [{ rotate: iconRotate }] }}>
          <MaterialIcons name={theme === 'light' ? 'dark-mode' : 'light-mode'} size={iconSize} color={primary} />
        </Animated.View>
      </Pressable>
    </View>
  );
}
