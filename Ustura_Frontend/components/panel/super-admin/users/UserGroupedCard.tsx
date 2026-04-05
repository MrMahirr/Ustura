import React from 'react';
import { Platform, Text, View } from 'react-native';

import type { GroupedSalonRecord } from '@/components/panel/super-admin/user-management.data';
import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { hexToRgba } from '@/utils/color';

import { styles } from './styles';

export default function UserGroupedCard({ group, basis }: { group: GroupedSalonRecord; basis: string }) {
  const adminTheme = useSuperAdminTheme();
  const occupancyPercent = typeof group.occupancyRate === 'number' ? Math.round(group.occupancyRate * 100) : null;

  return (
    <View
      style={[
        styles.groupedCard,
        {
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
        },
      ]}>
      <View style={styles.groupedCardHeader}>
        <Text style={[styles.groupedCardTitle, { color: adminTheme.onSurface }]} numberOfLines={1}>
          {group.salonName}
        </Text>
        <Text style={[styles.groupedCardLocation, { color: hexToRgba(adminTheme.onSurfaceVariant, 0.82) }]}>
          {group.salonLocation}
        </Text>
      </View>

      <View style={styles.groupedStatsRow}>
        <View style={styles.groupedStat}>
          <Text style={[styles.groupedStatLabel, { color: hexToRgba(adminTheme.onSurfaceVariant, 0.72) }]}>Toplam</Text>
          <Text style={[styles.groupedStatValue, { color: adminTheme.primary }]}>{group.totalUsers}</Text>
        </View>
        <View style={styles.groupedStat}>
          <Text style={[styles.groupedStatLabel, { color: hexToRgba(adminTheme.onSurfaceVariant, 0.72) }]}>Aktif</Text>
          <Text style={[styles.groupedStatValue, { color: adminTheme.onSurface }]}>{group.activeUsers}</Text>
        </View>
        <View style={styles.groupedStat}>
          <Text style={[styles.groupedStatLabel, { color: hexToRgba(adminTheme.onSurfaceVariant, 0.72) }]}>Owner</Text>
          <Text style={[styles.groupedStatValue, { color: adminTheme.onSurface }]}>{group.ownerCount}</Text>
        </View>
        <View style={styles.groupedStat}>
          <Text style={[styles.groupedStatLabel, { color: hexToRgba(adminTheme.onSurfaceVariant, 0.72) }]}>Employee</Text>
          <Text style={[styles.groupedStatValue, { color: adminTheme.onSurface }]}>{group.employeeCount}</Text>
        </View>
      </View>

      <View style={styles.groupedOccupancy}>
        <Text style={[styles.groupedStatLabel, { color: hexToRgba(adminTheme.onSurfaceVariant, 0.72) }]}>
          Ortalama Doluluk
        </Text>
        <Text style={[styles.groupedOccupancyText, { color: adminTheme.onSurface }]}>
          {occupancyPercent === null ? 'Randevu kapasitesi yok' : `%${occupancyPercent} doluluk`}
        </Text>
        {occupancyPercent !== null ? (
          <View style={[styles.occupancyBar, { width: '100%', backgroundColor: adminTheme.cardBackgroundStrong }]}>
            <View
              style={[
                styles.occupancyBarFill,
                { width: `${occupancyPercent}%`, backgroundColor: adminTheme.primary },
              ]}
            />
          </View>
        ) : null}
      </View>
    </View>
  );
}
