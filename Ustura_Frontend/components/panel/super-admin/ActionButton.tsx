import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Platform, Pressable, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { hexToRgba } from '@/utils/color';

interface ActionButtonProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'danger';
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

export default function ActionButton({
  label,
  variant = 'secondary',
  style,
  onPress,
}: ActionButtonProps) {
  const adminTheme = useSuperAdminTheme();

  return (
    <Pressable
      className="min-h-[42px] overflow-hidden rounded-sm border"
      onPress={onPress}
      style={({ hovered, pressed }) => [
        variant === 'secondary' && {
          backgroundColor: adminTheme.cardBackgroundStrong,
          borderColor: hovered ? adminTheme.borderStrong : adminTheme.borderSubtle,
        },
        variant === 'danger' && {
          backgroundColor: hovered ? hexToRgba(adminTheme.error, 0.14) : hexToRgba(adminTheme.error, 0.1),
          borderColor: hexToRgba(adminTheme.error, 0.22),
        },
        Platform.OS === 'web'
          ? ({
              cursor: 'pointer',
              transition: 'transform 180ms ease, border-color 180ms ease, background-color 180ms ease',
            } as any)
          : null,
        {
          transform: [{ scale: pressed ? 0.985 : hovered ? 1.01 : 1 }],
        },
        style,
      ]}>
      {({ hovered }) => (
        <View className="min-h-[42px] items-center justify-center px-5">
          {variant === 'primary' ? (
            <LinearGradient
              colors={adminTheme.goldGradient as [string, string]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
            />
          ) : null}

          <Text
            className="text-[11px] uppercase tracking-ui"
            style={{
              color:
                variant === 'primary'
                  ? adminTheme.onPrimary
                  : variant === 'danger'
                    ? adminTheme.error
                    : hovered
                      ? adminTheme.onSurface
                      : adminTheme.onSurface,
              fontFamily: adminTheme.bodyFont,
              fontWeight: '800',
            }}>
            {label}
          </Text>
        </View>
      )}
    </Pressable>
  );
}
