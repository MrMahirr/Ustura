import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Platform, Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { Typography } from '@/constants/typography';
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
      onPress={onPress}
      style={({ hovered, pressed }) => [
        styles.button,
        variant === 'secondary' && {
          backgroundColor: hovered ? adminTheme.cardBackgroundStrong : adminTheme.cardBackgroundStrong,
          borderColor: hovered ? adminTheme.borderStrong : adminTheme.borderSubtle,
        },
        variant === 'danger' && {
          backgroundColor: hovered ? hexToRgba(adminTheme.error, 0.14) : hexToRgba(adminTheme.error, 0.1),
          borderColor: hexToRgba(adminTheme.error, 0.22),
        },
        {
          transform: [{ scale: pressed ? 0.985 : hovered ? 1.01 : 1 }],
        },
        style,
      ]}>
      {({ hovered }) => (
        <View style={styles.inner}>
          {variant === 'primary' ? (
            <LinearGradient
              colors={adminTheme.goldGradient as [string, string]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFillObject}
            />
          ) : null}

          <Text
            style={[
              styles.label,
              {
                color:
                  variant === 'primary'
                    ? adminTheme.onPrimary
                    : variant === 'danger'
                      ? adminTheme.error
                      : hovered
                        ? adminTheme.onSurface
                        : adminTheme.onSurface,
                fontFamily: adminTheme.bodyFont,
              },
            ]}>
            {label}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 42,
    borderRadius: 4,
    borderWidth: 1,
    overflow: 'hidden',
    ...(Platform.OS === 'web'
      ? ({
          cursor: 'pointer',
          transition: 'transform 180ms ease, border-color 180ms ease, background-color 180ms ease',
        } as any)
      : {}),
  },
  inner: {
    minHeight: 42,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...Typography.labelSm,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
});
