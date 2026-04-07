import React from 'react';
import { Platform, Text, View } from 'react-native';

import type { GroupedSalonRecord } from '@/components/panel/super-admin/user-management.data';
import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { hexToRgba } from '@/utils/color';

import { userClassNames } from './presentation';

export default function UserGroupedCard({ group, basis }: { group: GroupedSalonRecord; basis: string }) {
  const adminTheme = useSuperAdminTheme();
  const occupancyPercent = typeof group.occupancyRate === 'number' ? Math.round(group.occupancyRate * 100) : null;

  return (
    <View
      className={userClassNames.groupedCard}
      style={{
        width: basis as any,
        backgroundColor: adminTheme.cardBackground,
        borderColor: adminTheme.borderSubtle,
        ...(Platform.OS === 'web'
          ? ({
              boxShadow:
                adminTheme.theme === 'dark'
                  ? '0 20px 42px rgba(0, 0, 0, 0.22)'
                  : '0 20px 42px rgba(27, 27, 32, 0.06)',
            } as any)
          : null),
      }}>
      <View className={userClassNames.groupedCardHeader}>
        <Text className={userClassNames.groupedCardTitle} style={{ color: adminTheme.onSurface }} numberOfLines={1}>
          {group.salonName}
        </Text>
        <Text className={userClassNames.groupedCardLocation} style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.82) }}>
          {group.salonLocation}
        </Text>
      </View>

      <View className={userClassNames.groupedStatsRow}>
        <View className={userClassNames.groupedStat}>
          <Text className={userClassNames.groupedStatLabel} style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.72) }}>
            Toplam
          </Text>
          <Text className={userClassNames.groupedStatValue} style={{ color: adminTheme.primary }}>
            {group.totalUsers}
          </Text>
        </View>
        <View className={userClassNames.groupedStat}>
          <Text className={userClassNames.groupedStatLabel} style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.72) }}>
            Aktif
          </Text>
          <Text className={userClassNames.groupedStatValue} style={{ color: adminTheme.onSurface }}>
            {group.activeUsers}
          </Text>
        </View>
        <View className={userClassNames.groupedStat}>
          <Text className={userClassNames.groupedStatLabel} style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.72) }}>
            Owner
          </Text>
          <Text className={userClassNames.groupedStatValue} style={{ color: adminTheme.onSurface }}>
            {group.ownerCount}
          </Text>
        </View>
        <View className={userClassNames.groupedStat}>
          <Text className={userClassNames.groupedStatLabel} style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.72) }}>
            Employee
          </Text>
          <Text className={userClassNames.groupedStatValue} style={{ color: adminTheme.onSurface }}>
            {group.employeeCount}
          </Text>
        </View>
      </View>

      <View className={userClassNames.groupedOccupancy}>
        <Text className={userClassNames.groupedStatLabel} style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.72) }}>
          Ortalama Doluluk
        </Text>
        <Text className={userClassNames.groupedOccupancyText} style={{ color: adminTheme.onSurface }}>
          {occupancyPercent === null ? 'Randevu kapasitesi yok' : `%${occupancyPercent} doluluk`}
        </Text>
        {occupancyPercent !== null ? (
          <View className={userClassNames.occupancyBar} style={{ width: '100%', backgroundColor: adminTheme.cardBackgroundStrong }}>
            <View
              className={userClassNames.occupancyBarFill}
              style={{ width: `${occupancyPercent}%`, backgroundColor: adminTheme.primary }}
            />
          </View>
        ) : null}
      </View>
    </View>
  );
}
