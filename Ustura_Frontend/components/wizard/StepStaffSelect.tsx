import React from 'react';
import { Platform, Pressable, Text, useWindowDimensions, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import BarberSelectionCard from '@/components/wizard/BarberSelectionCard';
import { BOOKING_COPY, type BookingStaffProfile } from '@/components/wizard/presentation';
import { useAppTheme } from '@/contexts/ThemeContext';
import { useThemeColor } from '@/hooks/use-theme-color';
import { hexToRgba } from '@/utils/color';

interface StepStaffSelectProps {
  salonName: string;
  salonLocation: string;
  staffMembers: BookingStaffProfile[];
  isLoading?: boolean;
  errorMessage?: string | null;
  selectedStaffId: string | null;
  onSelectAny: () => void;
  onSelectStaff: (staffId: string) => void;
  onClearSalon: () => void;
}

export default function StepStaffSelect({
  salonName,
  salonLocation,
  staffMembers,
  isLoading = false,
  errorMessage = null,
  selectedStaffId,
  onSelectAny,
  onSelectStaff,
  onClearSalon,
}: StepStaffSelectProps) {
  const { width } = useWindowDimensions();
  const { theme } = useAppTheme();
  const primary = useThemeColor({}, 'primary');
  const surfaceContainerLow = useThemeColor({}, 'surfaceContainerLow');
  const surfaceContainerLowest = useThemeColor({}, 'surfaceContainerLowest');
  const onSurface = useThemeColor({}, 'onSurface');
  const onSurfaceVariant = useThemeColor({}, 'onSurfaceVariant');
  const outlineVariant = useThemeColor({}, 'outlineVariant');

  const isDesktop = width >= 1024;
  const isTablet = width >= 768;
  const isAnyBarberSelected = selectedStaffId == null;

  return (
    <View style={{ gap: 24 }}>
      <View className="items-center">
        <View
          className="flex-row items-center self-center rounded-md border px-4 py-2"
          style={{
            gap: 10,
            backgroundColor: surfaceContainerLowest,
            borderColor: hexToRgba(primary, theme === 'light' ? 0.28 : 0.36),
          }}>
          <Text className="font-label text-xs font-bold uppercase tracking-[2.2px]" style={{ color: hexToRgba(primary, 0.86) }}>
            {salonName}
          </Text>
          <Pressable accessibilityRole="button" onPress={onClearSalon}>
            {({ hovered, pressed }) => (
              <MaterialIcons
                name="close"
                size={16}
                color={hovered || pressed ? primary : hexToRgba(onSurfaceVariant, 0.68)}
              />
            )}
          </Pressable>
        </View>
      </View>

      <View style={{ gap: 8 }}>
        <Text className="font-headline text-5xl font-bold tracking-tight" style={{ color: onSurface }}>
          {BOOKING_COPY.pageTitle}
        </Text>
        <Text className="font-body text-sm" style={{ maxWidth: 520, color: onSurfaceVariant }}>
          {BOOKING_COPY.pageDescription} {salonLocation}
        </Text>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityState={{ selected: isAnyBarberSelected }}
        onPress={onSelectAny}
        style={({ hovered, pressed }) => [
          {
            borderRadius: 16,
            borderWidth: 2,
            borderStyle: 'dashed',
            paddingHorizontal: 24,
            paddingVertical: 28,
            backgroundColor: theme === 'light' ? surfaceContainerLowest : surfaceContainerLow,
            borderColor: isAnyBarberSelected ? hexToRgba(primary, 0.72) : hexToRgba(primary, hovered ? 0.48 : 0.24),
            transform: [{ scale: pressed ? 0.99 : 1 }],
          },
          hovered
            ? Platform.OS === 'web'
              ? ({
                  boxShadow:
                    theme === 'light'
                      ? '0 18px 34px rgba(27, 27, 32, 0.08)'
                      : `0 16px 34px ${hexToRgba(primary, 0.1)}`,
                } as any)
              : {
                  shadowColor: theme === 'light' ? '#1B1B20' : primary,
                  shadowOpacity: theme === 'light' ? 0.08 : 0.12,
                  shadowRadius: 16,
                  shadowOffset: { width: 0, height: 8 },
                  elevation: 6,
                }
            : null,
        ]}>
        <View className="flex-row items-center justify-between" style={{ gap: 20 }}>
          <View className="flex-row items-center" style={{ flex: 1, gap: 20 }}>
            <View
              className="items-center justify-center rounded-full"
              style={{
                width: 64,
                height: 64,
                backgroundColor: theme === 'light' ? hexToRgba(primary, 0.12) : hexToRgba(onSurfaceVariant, 0.08),
              }}>
              <MaterialIcons name="shuffle" size={30} color={primary} />
            </View>

            <View style={{ flex: 1, gap: 4 }}>
              <Text className="font-headline text-xl font-bold" style={{ color: onSurface }}>
                {BOOKING_COPY.anyBarberTitle}
              </Text>
              <Text className="font-body text-sm" style={{ color: onSurfaceVariant }}>
                {BOOKING_COPY.anyBarberDescription}
              </Text>
            </View>
          </View>

          <View
            className="items-center justify-center rounded-md border"
            style={{
              width: 40,
              height: 40,
              backgroundColor: isAnyBarberSelected ? primary : 'transparent',
              borderColor: hexToRgba(outlineVariant, 0.6),
            }}>
            <MaterialIcons
              name="chevron-right"
              size={20}
              color={isAnyBarberSelected ? surfaceContainerLowest : onSurfaceVariant}
            />
          </View>
        </View>
      </Pressable>

      <View className="flex-row flex-wrap" style={{ gap: 24 }}>
        {isLoading ? (
          <Text className="font-body text-sm" style={{ color: onSurfaceVariant }}>
            Personel listesi yukleniyor.
          </Text>
        ) : null}

        {!isLoading && errorMessage ? (
          <Text className="font-body text-sm" style={{ color: onSurfaceVariant }}>
            {errorMessage}
          </Text>
        ) : null}

        {!isLoading && !errorMessage && staffMembers.length === 0 ? (
          <Text className="font-body text-sm" style={{ color: onSurfaceVariant }}>
            Bu salon icin listelenecek aktif personel bulunamadi.
          </Text>
        ) : null}

        {staffMembers.map((member) => (
          <View
            key={member.id}
            style={[
              isDesktop ? { width: '23.2%' } : null,
              isTablet && !isDesktop ? { width: '48%' } : null,
              !isTablet ? { width: '100%' } : null,
            ]}>
            <BarberSelectionCard
              member={member}
              selected={selectedStaffId === member.id}
              onPress={() => onSelectStaff(member.id)}
            />
          </View>
        ))}
      </View>
    </View>
  );
}
