import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Platform, Pressable, Text, View } from 'react-native';

import { userOverview } from '@/components/panel/super-admin/user-management.data';
import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { hexToRgba } from '@/utils/color';

import { styles } from './styles';

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
      style={[
        styles.insightMetricCard,
        {
          backgroundColor: adminTheme.cardBackgroundStrong,
          borderColor: adminTheme.borderSubtle,
        },
      ]}>
      <Text style={[styles.insightMetricLabel, { color: hexToRgba(adminTheme.onSurfaceVariant, 0.72) }]}>{label}</Text>
      <Text style={[styles.insightMetricValue, { color: valueColor }]}>{value}</Text>
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
      style={({ hovered, pressed }) => [
        styles.exportButton,
        {
          backgroundColor: hovered ? adminTheme.cardBackgroundStrong : adminTheme.cardBackground,
          borderColor: hovered ? adminTheme.borderStrong : adminTheme.borderSubtle,
          transform: [{ translateY: pressed ? 1 : hovered ? -1 : 0 }],
        },
        Platform.OS === 'web' ? styles.webInteractiveCard : null,
      ]}>
      <Text style={[styles.exportButtonText, { color: adminTheme.onSurface }]}>{label}</Text>
      <MaterialIcons name={icon} size={20} color={adminTheme.primary} />
    </Pressable>
  );
}

export default function UserInsightsSection({ isWide }: { isWide: boolean }) {
  const adminTheme = useSuperAdminTheme();

  return (
    <View
      style={[
        styles.insightsGrid,
        {
          flexDirection: isWide ? 'row' : 'column',
        },
      ]}>
      <View
        style={[
          styles.growthCard,
          {
            flex: isWide ? 1.85 : undefined,
            backgroundColor: adminTheme.cardBackground,
            borderColor: adminTheme.borderSubtle,
          },
        ]}>
        <View style={styles.growthIcon}>
          <MaterialIcons name="trending-up" size={96} color={hexToRgba(adminTheme.onSurfaceVariant, 0.14)} />
        </View>

        <View style={styles.growthCopy}>
          <Text style={[styles.growthTitle, { color: adminTheme.onSurface }]}>Kullanici Buyume Analizi</Text>
          <Text style={[styles.growthDescription, { color: adminTheme.onSurfaceVariant }]}>
            Son 30 gun icinde platforma katilan yeni salon sahipleri ve calisanlarda cift haneli artis devam ediyor.
          </Text>
        </View>

        <View style={styles.growthMetrics}>
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
        style={[
          styles.exportCard,
          {
            flex: isWide ? 1 : undefined,
            borderColor: hexToRgba(adminTheme.primary, 0.18),
          },
        ]}>
        <View>
          <Text style={[styles.exportTitle, { color: adminTheme.primary }]}>Hizli Raporla</Text>
          <Text style={[styles.exportDescription, { color: adminTheme.onSurfaceVariant }]}>
            Tum kullanici listesini guncel rolleri ve salon eslesmeleriyle birlikte disa aktar.
          </Text>
        </View>

        <View style={styles.exportActions}>
          <ExportButton label="PDF Olarak Indir" icon="picture-as-pdf" />
          <ExportButton label="Excel (XLSX) Disa Aktar" icon="table-chart" />
        </View>
      </LinearGradient>
    </View>
  );
}
