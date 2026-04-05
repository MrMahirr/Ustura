import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, Text, View } from 'react-native';

import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { hexToRgba } from '@/utils/color';

type IconName = React.ComponentProps<typeof MaterialIcons>['name'];

interface UserSalonActionButtonProps {
  label?: string;
  icon: IconName;
  variant?: 'primary' | 'secondary' | 'icon';
  onPress?: () => void;
  rotationDeg?: number;
}

export default function UserSalonActionButton({
  label,
  icon,
  variant = 'secondary',
  onPress,
  rotationDeg = 0,
}: UserSalonActionButtonProps) {
  const adminTheme = useSuperAdminTheme();
  const isIconOnly = variant === 'icon';

  return (
    <Pressable
      accessibilityRole="button"
      disabled={!onPress}
      className={isIconOnly ? 'h-10 w-10 items-center justify-center rounded-sm border' : 'min-h-10 overflow-hidden rounded-sm border'}
      onPress={onPress}
      style={({ hovered, pressed }) => [
        {
          opacity: onPress ? 1 : 0.48,
          backgroundColor:
            variant === 'primary'
              ? 'transparent'
              : hovered
                ? adminTheme.cardBackgroundStrong
                : adminTheme.cardBackground,
          borderColor:
            variant === 'primary'
              ? hexToRgba(adminTheme.primary, 0.22)
              : hovered
                ? adminTheme.primary
                : adminTheme.borderStrong,
          transform: [{ scale: pressed ? 0.985 : hovered ? 1.015 : 1 }],
        },
      ]}>
      {({ hovered }) => (
        <View className={isIconOnly ? undefined : 'min-h-10 flex-row items-center justify-center gap-2 px-4'}>
          {variant === 'primary' ? (
            <LinearGradient
              colors={adminTheme.goldGradient as [string, string]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
            />
          ) : null}

          <MaterialIcons
            name={icon}
            size={isIconOnly ? 20 : 16}
            color={variant === 'primary' ? adminTheme.onPrimary : hovered ? adminTheme.primary : adminTheme.onSurfaceVariant}
            style={rotationDeg ? ({ transform: [{ rotate: `${rotationDeg}deg` }] } as any) : undefined}
          />

          {!isIconOnly && label ? (
            <Text
              className="text-[10px] uppercase tracking-[0.15em]"
              style={{
                color: variant === 'primary' ? adminTheme.onPrimary : hovered ? adminTheme.primary : adminTheme.onSurfaceVariant,
                fontFamily: 'Manrope-Bold',
              }}>
              {label}
            </Text>
          ) : null}
        </View>
      )}
    </Pressable>
  );
}
