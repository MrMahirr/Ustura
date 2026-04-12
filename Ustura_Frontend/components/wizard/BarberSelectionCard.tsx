import React from 'react';
import { Image, Platform, Pressable, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import type { BookingStaffProfile } from '@/components/wizard/presentation';
import { useAppTheme } from '@/contexts/ThemeContext';
import { useThemeColor } from '@/hooks/use-theme-color';
import { hexToRgba } from '@/utils/color';

interface BarberSelectionCardProps {
  member: BookingStaffProfile;
  selected: boolean;
  onPress: () => void;
}

export default function BarberSelectionCard({ member, selected, onPress }: BarberSelectionCardProps) {
  const { theme } = useAppTheme();
  const primary = useThemeColor({}, 'primary');
  const surfaceContainerLow = useThemeColor({}, 'surfaceContainerLow');
  const surfaceContainerHighest = useThemeColor({}, 'surfaceContainerHighest');
  const onSurface = useThemeColor({}, 'onSurface');
  const onSurfaceVariant = useThemeColor({}, 'onSurfaceVariant');
  const outlineVariant = useThemeColor({}, 'outlineVariant');
  const hasReviews = member.reviewCount > 0;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ hovered, pressed }) => [
        {
          position: 'relative',
          borderRadius: 16,
          borderWidth: 1,
          padding: 24,
          alignItems: 'center',
          backgroundColor: selected && theme === 'light' ? surfaceContainerHighest : surfaceContainerLow,
          borderColor: selected
            ? primary
            : hovered
              ? hexToRgba(primary, theme === 'light' ? 0.34 : 0.2)
              : hexToRgba(outlineVariant, theme === 'light' ? 0.34 : 0.1),
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
        selected
          ? Platform.OS === 'web'
            ? ({
                boxShadow:
                  theme === 'light'
                    ? `0 18px 36px ${hexToRgba(primary, 0.12)}`
                    : `0 0 40px ${hexToRgba(primary, 0.16)}`,
              } as any)
            : {
                shadowColor: primary,
                shadowOpacity: theme === 'light' ? 0.12 : 0.18,
                shadowRadius: 22,
                shadowOffset: { width: 0, height: 10 },
                elevation: 10,
              }
          : null,
        !selected && hovered
          ? Platform.OS === 'web'
            ? ({
                boxShadow:
                  theme === 'light'
                    ? '0 14px 30px rgba(27, 27, 32, 0.08)'
                    : `0 16px 32px ${hexToRgba('#000000', 0.14)}`,
              } as any)
            : {
                shadowColor: theme === 'light' ? '#1B1B20' : '#000000',
                shadowOpacity: theme === 'light' ? 0.08 : 0.12,
                shadowRadius: 18,
                shadowOffset: { width: 0, height: 8 },
                elevation: 6,
              }
          : null,
      ]}>
      {selected ? (
        <View className="absolute right-4 top-4">
          <MaterialIcons name="check-circle" size={20} color={primary} />
        </View>
      ) : null}

      <View className="mb-6 rounded-full border p-1" style={{ borderColor: selected ? primary : hexToRgba(outlineVariant, 0.22) }}>
        <Image source={{ uri: member.imageUri }} style={{ width: 96, height: 96, borderRadius: 999 }} resizeMode="cover" />
      </View>

      <Text className="mb-1 font-body text-lg font-bold" style={{ color: onSurface }}>
        {member.name}
      </Text>
      <Text className="mb-4 font-label text-[10px] font-extrabold uppercase tracking-[2px]" style={{ color: selected ? primary : onSurfaceVariant }}>
        {member.specialty}
      </Text>

      {hasReviews ? (
        <View className="flex-row items-center" style={{ gap: 4 }}>
          <MaterialIcons name="star" size={14} color={primary} />
          <Text className="font-body text-xs font-bold" style={{ color: onSurface }}>
            {member.rating.toFixed(1)}
          </Text>
          <Text className="font-body text-[10px]" style={{ color: onSurfaceVariant }}>
            ({member.reviewCount})
          </Text>
        </View>
      ) : (
        <Text className="font-body text-xs font-bold uppercase tracking-[1.5px]" style={{ color: onSurfaceVariant }}>
          Yeni Uzman
        </Text>
      )}

      <View
        className="absolute inset-0 rounded-2xl border"
        pointerEvents="none"
        style={{ borderColor: selected ? hexToRgba(primary, 0.68) : 'transparent' }}
      />
      {selected ? (
        <View
          className="absolute inset-0 rounded-2xl"
          pointerEvents="none"
          style={{ backgroundColor: hexToRgba(primary, theme === 'light' ? 0.05 : 0.03) }}
        />
      ) : null}
    </Pressable>
  );
}
