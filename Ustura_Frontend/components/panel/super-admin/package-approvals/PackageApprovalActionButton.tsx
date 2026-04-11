import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Platform, Pressable, Text, View } from 'react-native';

import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { hexToRgba } from '@/utils/color';

type PackageApprovalActionVariant = 'ghost' | 'danger' | 'approve';

interface PackageApprovalActionButtonProps {
  label: string;
  variant: PackageApprovalActionVariant;
  onPress?: () => void;
  fullWidth?: boolean;
}

export default function PackageApprovalActionButton({
  label,
  variant,
  onPress,
  fullWidth = false,
}: PackageApprovalActionButtonProps) {
  const adminTheme = useSuperAdminTheme();

  if (variant === 'approve') {
    return (
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        style={({ hovered, pressed }) => [
          fullWidth ? { flex: 1 } : null,
          {
            transform: [{ scale: pressed ? 0.985 : hovered ? 1.01 : 1 }],
          },
          Platform.OS === 'web'
            ? ({
                transition: 'transform 180ms ease, filter 180ms ease',
                filter: hovered ? 'brightness(1.04)' : 'brightness(1)',
              } as any)
            : null,
        ]}>
        <LinearGradient
          colors={adminTheme.goldGradient as [string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            minHeight: 46,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 18,
          }}>
          <Text
            className="font-label text-[11px] uppercase tracking-[2px]"
            style={{ color: adminTheme.onPrimary, fontFamily: 'Manrope-Bold' }}>
            {label}
          </Text>
        </LinearGradient>
      </Pressable>
    );
  }

  const isDanger = variant === 'danger';

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ hovered, pressed }) => [
        fullWidth ? { flex: 1 } : null,
        {
          minHeight: 46,
          borderRadius: 10,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 18,
          borderWidth: 1,
          backgroundColor:
            hovered || pressed
              ? isDanger
                ? hexToRgba(adminTheme.error, 0.1)
                : adminTheme.cardBackgroundStrong
              : 'transparent',
          borderColor: isDanger
            ? hexToRgba(adminTheme.error, 0.26)
            : adminTheme.borderStrong,
        },
        Platform.OS === 'web'
          ? ({ transition: 'background-color 180ms ease, border-color 180ms ease' } as any)
          : null,
      ]}>
      <View className="flex-row items-center justify-center gap-2">
        <Text
          className="font-label text-[11px] uppercase tracking-[2px]"
          style={{
            color: isDanger ? adminTheme.error : adminTheme.onSurfaceVariant,
            fontFamily: 'Manrope-Bold',
          }}>
          {label}
        </Text>
      </View>
    </Pressable>
  );
}
