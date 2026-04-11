import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Platform, Pressable, Text, View } from 'react-native';

import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { hexToRgba } from '@/utils/color';

import SalonActionIcon from './SalonActionIcon';
import type { SalonListItem } from './types';
import { getRowActions, getStatusPalette } from './utils';

const cellSalonStyle = { flex: 2.4 } as const;
const cellOwnerStyle = { flex: 1.6, paddingRight: 20 } as const;
const cellLocationStyle = { flex: 1.45, paddingRight: 16 } as const;
const cellStatusStyle = { flex: 1.05, paddingRight: 16 } as const;
const cellPlanStyle = { flex: 0.95, paddingRight: 16 } as const;
const cellActionsStyle = { flex: 1.1, alignItems: 'flex-end' as const } as const;

export default function SalonRow({ salon, onPress }: { salon: SalonListItem; onPress?: () => void }) {
  const adminTheme = useSuperAdminTheme();
  const statusPalette = getStatusPalette(salon.status, adminTheme);
  const actions = getRowActions(salon.status, adminTheme);

  return (
    <Pressable
      onPress={onPress}
      className="min-h-[88px] flex-row items-center px-6"
      style={({ hovered }) => [
        { backgroundColor: hovered ? adminTheme.cardBackgroundStrong : 'transparent' },
        Platform.OS === 'web'
          ? ({
              transition: 'background-color 180ms ease',
              cursor: onPress ? 'pointer' : 'default',
            } as any)
          : null,
      ]}>
      {({ hovered }) => (
        <>
          <View className="min-w-0 justify-center py-[18px]" style={cellSalonStyle}>
            <View className="min-w-0 flex-row items-center gap-3.5">
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
          </View>

          <View className="min-w-0 justify-center py-[18px]" style={cellOwnerStyle}>
            <Text className="font-body text-sm" style={{ color: adminTheme.onSurface, fontFamily: 'Manrope-SemiBold' }} numberOfLines={1}>
              {salon.owner}
            </Text>
            <Text className="mt-0.5 font-body text-[11px] leading-[18px]" style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.8) }} numberOfLines={1}>
              {salon.ownerEmail}
            </Text>
          </View>

          <View className="min-w-0 justify-center py-[18px]" style={cellLocationStyle}>
            <View className="flex-row items-center gap-1">
              <MaterialIcons name="location-on" size={16} color={hexToRgba(adminTheme.onSurfaceVariant, 0.74)} />
              <Text className="shrink font-body text-xs leading-[18px]" style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.92) }} numberOfLines={1}>
                {salon.location}
              </Text>
            </View>
          </View>

          <View className="min-w-0 justify-center py-[18px]" style={cellStatusStyle}>
            <View
              className="self-start rounded-full border px-2.5 py-1.5"
              style={{ backgroundColor: statusPalette.backgroundColor, borderColor: statusPalette.borderColor }}>
              <Text className="font-label text-[10px] uppercase tracking-wide" style={{ color: statusPalette.color, fontFamily: 'Manrope-Bold' }}>
                {salon.status}
              </Text>
            </View>
          </View>

          <View className="min-w-0 justify-center py-[18px]" style={cellPlanStyle}>
            <Text className="font-body text-xs" style={{ color: adminTheme.onSurface, fontFamily: 'Manrope-Bold' }}>
              {salon.joinedAtLabel}
            </Text>
          </View>

          <View className="min-w-0 justify-center py-[18px]" style={cellActionsStyle}>
            <View className="flex-row items-center gap-1" style={{ opacity: hovered ? 1 : 0.18 }}>
              {actions.map((action) => (
                <SalonActionIcon key={`${salon.id}-${action.icon}`} icon={action.icon} label={action.label} color={action.color} />
              ))}
            </View>
          </View>
        </>
      )}
    </Pressable>
  );
}
