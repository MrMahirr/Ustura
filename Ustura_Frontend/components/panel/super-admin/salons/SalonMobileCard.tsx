import React from 'react';
import { Image } from 'expo-image';
import { Platform, Pressable, Text, View } from 'react-native';

import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { hexToRgba } from '@/utils/color';

import SalonActionIcon from './SalonActionIcon';
import type { SalonListItem } from './types';
import { getRowActions, getStatusPalette } from './utils';

export default function SalonMobileCard({ salon, onPress }: { salon: SalonListItem; onPress?: () => void }) {
  const adminTheme = useSuperAdminTheme();
  const statusPalette = getStatusPalette(salon.status, adminTheme);
  const actions = getRowActions(salon.status, adminTheme);

  return (
    <Pressable
      onPress={onPress}
      className="gap-4 rounded-[10px] border p-4"
      style={[
        { backgroundColor: adminTheme.cardBackground, borderColor: adminTheme.borderSubtle },
        Platform.OS === 'web' && onPress ? ({ cursor: 'pointer' } as any) : null,
      ]}>
      <View className="flex-row items-start justify-between gap-3">
        <View className="min-w-0 flex-1 flex-row items-center gap-3.5">
          <View
            className="h-[52px] w-[52px] shrink-0 overflow-hidden rounded-md border"
            style={{ borderColor: adminTheme.borderSubtle, backgroundColor: adminTheme.cardBackgroundStrong }}>
            <Image
              source={{ uri: salon.imageUrl }}
              style={[
                { width: '100%', height: '100%' },
                Platform.OS === 'web' && salon.mutedImage ? ({ filter: 'grayscale(1)' } as any) : null,
              ]}
              contentFit="cover"
            />
          </View>
          <View className="min-w-0 flex-1 gap-1">
            <Text className="font-body text-sm" style={{ color: adminTheme.onSurface, fontFamily: 'Manrope-Bold' }} numberOfLines={1}>
              {salon.name}
            </Text>
            <Text className="font-body text-xs leading-[18px]" style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.82) }}>
              ID: {salon.reference}
            </Text>
          </View>
        </View>

        <View
          className="self-start rounded-full border px-2.5 py-1.5"
          style={{ backgroundColor: statusPalette.backgroundColor, borderColor: statusPalette.borderColor }}>
          <Text className="font-label text-[10px] uppercase tracking-wide" style={{ color: statusPalette.color, fontFamily: 'Manrope-Bold' }}>
            {salon.status}
          </Text>
        </View>
      </View>

      <View className="flex-row flex-wrap gap-3.5">
        <View className="min-w-[150px] flex-1 gap-1">
          <Text className="font-label text-[10px] uppercase tracking-widest" style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.72), fontFamily: 'Manrope-Bold' }}>
            Isletmeci
          </Text>
          <Text className="font-body text-[13px]" style={{ color: adminTheme.onSurface, fontFamily: 'Manrope-SemiBold' }}>
            {salon.owner}
          </Text>
          <Text className="font-body text-[11px] leading-4" style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.82) }}>
            {salon.ownerEmail}
          </Text>
        </View>
        <View className="min-w-[150px] flex-1 gap-1">
          <Text className="font-label text-[10px] uppercase tracking-widest" style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.72), fontFamily: 'Manrope-Bold' }}>
            Konum
          </Text>
          <Text className="font-body text-[13px]" style={{ color: adminTheme.onSurface, fontFamily: 'Manrope-SemiBold' }}>
            {salon.location}
          </Text>
        </View>
        <View className="min-w-[150px] flex-1 gap-1">
          <Text className="font-label text-[10px] uppercase tracking-widest" style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.72), fontFamily: 'Manrope-Bold' }}>
            Kayit Tarihi
          </Text>
          <Text className="font-body text-[13px]" style={{ color: adminTheme.onSurface, fontFamily: 'Manrope-SemiBold' }}>
            {salon.joinedAtLabel}
          </Text>
        </View>
        <View className="min-w-[150px] flex-1 gap-1">
          <Text className="font-label text-[10px] uppercase tracking-widest" style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.72), fontFamily: 'Manrope-Bold' }}>
            Son Guncelleme
          </Text>
          <Text className="font-body text-[13px]" style={{ color: adminTheme.primary, fontFamily: 'Manrope-SemiBold' }}>
            {salon.updatedAtLabel}
          </Text>
        </View>
      </View>

      <View className="flex-row justify-end gap-1.5">
        {actions.map((action) => (
          <SalonActionIcon key={`${salon.id}-${action.icon}`} icon={action.icon} label={action.label} color={action.color} />
        ))}
      </View>
    </Pressable>
  );
}
