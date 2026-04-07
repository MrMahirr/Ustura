import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

import BookingSurfacePanel from '@/components/wizard/BookingSurfacePanel';
import { useAppTheme } from '@/contexts/ThemeContext';
import { useThemeColor } from '@/hooks/use-theme-color';
import { hexToRgba } from '@/utils/color';

interface BookingLocationCardProps {
  imageUri: string;
  locationLabel: string;
  locationValue: string;
}

export default function BookingLocationCard({
  imageUri,
  locationLabel,
  locationValue,
}: BookingLocationCardProps) {
  const { theme } = useAppTheme();
  const primary = useThemeColor({}, 'primary');
  const surface = useThemeColor({}, 'surface');
  const onSurface = useThemeColor({}, 'onSurface');

  return (
    <BookingSurfacePanel padded={false}>
      <View style={{ height: 208 }}>
        <Image source={{ uri: imageUri }} style={StyleSheet.absoluteFillObject} resizeMode="cover" />

        <LinearGradient
          colors={[
            hexToRgba('#000000', theme === 'light' ? 0.08 : 0.18),
            hexToRgba('#000000', theme === 'light' ? 0.22 : 0.34),
            hexToRgba(surface, theme === 'light' ? 0.94 : 0.9),
          ]}
          locations={[0, 0.4, 1]}
          style={StyleSheet.absoluteFillObject}
        />

        <View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFillObject,
            { backgroundColor: hexToRgba(primary, theme === 'light' ? 0.04 : 0.03) },
          ]}
        />

        <View className="absolute inset-x-0 bottom-0 p-5" style={{ gap: 6 }}>
          <View
            className="flex-row items-center self-start rounded-full border px-3 py-1.5"
            style={{
              gap: 6,
              backgroundColor: hexToRgba(primary, theme === 'light' ? 0.12 : 0.14),
              borderColor: hexToRgba(primary, 0.24),
            }}>
            <MaterialIcons name="place" size={14} color={primary} />
            <Text className="font-label text-[10px] font-bold uppercase tracking-[2.2px]" style={{ color: primary }}>
              {locationLabel}
            </Text>
          </View>

          <Text className="font-body text-base font-semibold" style={{ color: onSurface }}>
            {locationValue}
          </Text>
        </View>
      </View>
    </BookingSurfacePanel>
  );
}
