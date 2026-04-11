import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Platform, Pressable, Text, View } from 'react-native';

import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { hexToRgba } from '@/utils/color';

import { PackageBadge, StatusBadge } from './SubscriptionRow';
import type { SubscriptionRecord } from './types';

export default function SubscriptionMobileCard({ subscription }: { subscription: SubscriptionRecord }) {
  const adminTheme = useSuperAdminTheme();

  return (
    <View
      className="gap-3 rounded-[10px] border p-4"
      style={{
        backgroundColor: adminTheme.cardBackground,
        borderColor: adminTheme.borderSubtle,
      }}>
      {/* Header row */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <View
            className="h-9 w-9 items-center justify-center rounded-sm"
            style={{ backgroundColor: hexToRgba(adminTheme.primary, 0.1) }}>
            <Text className="font-body text-sm" style={{ color: adminTheme.primary, fontFamily: 'Manrope-Bold' }}>
              {subscription.salonInitial}
            </Text>
          </View>
          <Text className="font-body text-sm" style={{ color: adminTheme.onSurface, fontFamily: 'Manrope-Bold' }}>
            {subscription.salonName}
          </Text>
        </View>
        <Pressable className="h-8 w-8 items-center justify-center">
          <MaterialIcons name="more-vert" size={18} color={hexToRgba(adminTheme.onSurfaceVariant, 0.6)} />
        </Pressable>
      </View>

      {/* Details */}
      <View className="flex-row flex-wrap items-center gap-3">
        <PackageBadge packageName={subscription.packageName} tier={subscription.packageTier} />
        <StatusBadge status={subscription.status} />
      </View>

      {/* Dates */}
      <View className="flex-row gap-6">
        <View>
          <Text
            className="mb-0.5 font-label text-[9px] uppercase tracking-[1.5px]"
            style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.55), fontFamily: 'Manrope-Bold' }}>
            Baslangic
          </Text>
          <Text className="font-body text-xs" style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.7) }}>
            {subscription.startDate}
          </Text>
        </View>
        <View>
          <Text
            className="mb-0.5 font-label text-[9px] uppercase tracking-[1.5px]"
            style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.55), fontFamily: 'Manrope-Bold' }}>
            Bitis
          </Text>
          <Text className="font-body text-xs" style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.7) }}>
            {subscription.endDate ?? '-'}
          </Text>
        </View>
      </View>
    </View>
  );
}
