import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Platform, Pressable, Text, View } from 'react-native';

import type { salonOverview } from '@/components/panel/super-admin/salon-management.data';
import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { hexToRgba } from '@/utils/color';

import { styles } from './styles';

type SalonOverview = typeof salonOverview;

export default function SalonInsightsSection({
  isTablet,
  overview,
}: {
  isTablet: boolean;
  overview: SalonOverview;
}) {
  const adminTheme = useSuperAdminTheme();

  return (
    <View style={[styles.insightsGrid, { flexDirection: isTablet ? 'row' : 'column' }]}>
      <LinearGradient
        colors={[
          hexToRgba(adminTheme.primary, adminTheme.theme === 'dark' ? 0.1 : 0.12),
          hexToRgba(adminTheme.primaryContainer, adminTheme.theme === 'dark' ? 0.03 : 0.18),
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.growthCard, { borderColor: adminTheme.borderSubtle }]}>
        <View style={styles.growthCopy}>
          <Text style={[styles.growthTitle, { color: adminTheme.onSurface }]}>Aylik Buyume Analizi</Text>
          <Text style={[styles.growthDescription, { color: adminTheme.onSurfaceVariant }]}>
            Yeni salon kayitlari gecen aya gore %18 artis gosterdi. Premium paket donusum orani en yuksek seviyesine cikti.
          </Text>
          <View style={styles.growthMetrics}>
            <View>
              <Text style={[styles.growthLabel, { color: hexToRgba(adminTheme.onSurfaceVariant, 0.72) }]}>
                Yeni Salonlar
              </Text>
              <Text style={[styles.growthValue, { color: adminTheme.success }]}>{overview.newSalons}</Text>
            </View>
            <View>
              <Text style={[styles.growthLabel, { color: hexToRgba(adminTheme.onSurfaceVariant, 0.72) }]}>
                Ciro Artisi
              </Text>
              <Text style={[styles.growthValue, { color: adminTheme.primary }]}>{overview.revenueGrowth}</Text>
            </View>
          </View>
        </View>
        <View pointerEvents="none" style={styles.growthIcon}>
          <MaterialIcons
            name="trending-up"
            size={190}
            color={hexToRgba(adminTheme.primary, adminTheme.theme === 'dark' ? 0.12 : 0.16)}
          />
        </View>
      </LinearGradient>

      <View
        style={[
          styles.systemCard,
          {
            backgroundColor: hexToRgba(adminTheme.primary, adminTheme.theme === 'dark' ? 0.06 : 0.07),
            borderColor: hexToRgba(adminTheme.primary, 0.14),
          },
        ]}>
        <View>
          <Text style={[styles.systemTitle, { color: adminTheme.primary }]}>Sistem Durumu</Text>
          <View style={styles.systemStatusRow}>
            <View style={[styles.systemPulse, { backgroundColor: adminTheme.success }]} />
            <Text style={[styles.systemStatusText, { color: adminTheme.success }]}>Tum Sistemler Aktif</Text>
          </View>
          <Text style={[styles.systemDescription, { color: adminTheme.onSurfaceVariant }]}>
            Onay siralari, bildirim akisleri ve odeme servisleri normal seviyede calisiyor.
          </Text>
        </View>

        <Pressable
          accessibilityRole="button"
          style={({ hovered }) => [
            styles.systemButton,
            {
              borderColor: hexToRgba(adminTheme.primary, hovered ? 0.32 : 0.2),
              backgroundColor: hovered ? hexToRgba(adminTheme.primary, 0.08) : 'transparent',
            },
            Platform.OS === 'web' ? styles.webInteractiveButton : null,
          ]}>
          <Text style={[styles.systemButtonText, { color: adminTheme.primary }]}>Sistem Gunlugunu Goruntule</Text>
        </Pressable>
      </View>
    </View>
  );
}
