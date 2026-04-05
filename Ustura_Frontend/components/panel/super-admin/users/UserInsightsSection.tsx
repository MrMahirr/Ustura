import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Platform, Pressable, Text, View } from 'react-native';

import { userOverview } from '@/components/panel/super-admin/user-management.data';
import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { hexToRgba } from '@/utils/color';
import { cn } from '@/utils/cn';

import { userClassNames } from './presentation';

function GrowthMetricCard({
  label,
  value,
  valueColor,
}: {
  label: string;
  value: string;
  valueColor: string;
}) {
  const adminTheme = useSuperAdminTheme();

  return (
    <View
      className={userClassNames.insightMetricCard}
      style={{ backgroundColor: adminTheme.cardBackgroundStrong, borderColor: adminTheme.borderSubtle }}>
      <Text className={userClassNames.insightMetricLabel} style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.72) }}>
        {label}
      </Text>
      <Text className={userClassNames.insightMetricValue} style={{ color: valueColor }}>
        {value}
      </Text>
    </View>
  );
}

function ExportButton({
  label,
  icon,
}: {
  label: string;
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
}) {
  const adminTheme = useSuperAdminTheme();

  return (
    <Pressable
      accessibilityRole="button"
      className={userClassNames.exportButton}
      style={({ hovered, pressed }) => [
        {
          backgroundColor: hovered ? adminTheme.cardBackgroundStrong : adminTheme.cardBackground,
          borderColor: hovered ? adminTheme.borderStrong : adminTheme.borderSubtle,
          transform: [{ translateY: pressed ? 1 : hovered ? -1 : 0 }],
        },
        Platform.OS === 'web'
          ? ({
              transition: 'transform 180ms ease, background-color 180ms ease, border-color 180ms ease, box-shadow 220ms ease',
              cursor: 'pointer',
            } as any)
          : null,
      ]}>
      <Text className={userClassNames.exportButtonText} style={{ color: adminTheme.onSurface }}>
        {label}
      </Text>
      <MaterialIcons name={icon} size={20} color={adminTheme.primary} />
    </Pressable>
  );
}

export default function UserInsightsSection({ isWide }: { isWide: boolean }) {
  const adminTheme = useSuperAdminTheme();

  return (
    <View
      className={cn(userClassNames.insightsGrid, isWide ? 'flex-row' : 'flex-col')}>
      <View
        className={userClassNames.growthCard}
        style={{
          flex: isWide ? 1.85 : undefined,
          backgroundColor: adminTheme.cardBackground,
          borderColor: adminTheme.borderSubtle,
        }}>
        <View className={userClassNames.growthIcon}>
          <MaterialIcons name="trending-up" size={96} color={hexToRgba(adminTheme.onSurfaceVariant, 0.14)} />
        </View>

        <View className={userClassNames.growthCopy}>
          <Text className={userClassNames.growthTitle} style={{ color: adminTheme.onSurface }}>
            Kullanici Buyume Analizi
          </Text>
          <Text className={userClassNames.growthDescription} style={{ color: adminTheme.onSurfaceVariant }}>
            Son 30 gun icinde platforma katilan yeni salon sahipleri ve calisanlarda cift haneli artis devam ediyor.
          </Text>
        </View>

        <View className={userClassNames.growthMetrics}>
          <GrowthMetricCard label="Yeni Kayit" value={userOverview.newRegistrations} valueColor={adminTheme.success} />
          <GrowthMetricCard label="Donusum" value={userOverview.conversion} valueColor={adminTheme.primary} />
        </View>
      </View>

      <LinearGradient
        colors={[
          adminTheme.cardBackground,
          adminTheme.theme === 'dark' ? hexToRgba(adminTheme.pageBackground, 0.98) : adminTheme.cardBackgroundStrong,
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className={userClassNames.exportCard}
        style={{ flex: isWide ? 1 : undefined, borderColor: hexToRgba(adminTheme.primary, 0.18) }}>
        <View>
          <Text className={userClassNames.exportTitle} style={{ color: adminTheme.primary }}>
            Hizli Raporla
          </Text>
          <Text className={userClassNames.exportDescription} style={{ color: adminTheme.onSurfaceVariant }}>
            Tum kullanici listesini guncel rolleri ve salon eslesmeleriyle birlikte disa aktar.
          </Text>
        </View>

        <View className={userClassNames.exportActions}>
          <ExportButton label="PDF Olarak Indir" icon="picture-as-pdf" />
          <ExportButton label="Excel (XLSX) Disa Aktar" icon="table-chart" />
        </View>
      </LinearGradient>
    </View>
  );
}
