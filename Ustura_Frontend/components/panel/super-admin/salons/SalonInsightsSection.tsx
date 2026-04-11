import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Platform, Pressable, Text, View } from 'react-native';

import type { salonOverview } from '@/components/panel/super-admin/salon-management.data';
import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { cn } from '@/utils/cn';
import { hexToRgba } from '@/utils/color';

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
    <View className={cn('gap-5', isTablet ? 'flex-row' : 'flex-col')}>
      <LinearGradient
        colors={[
          hexToRgba(adminTheme.primary, adminTheme.theme === 'dark' ? 0.1 : 0.12),
          hexToRgba(adminTheme.primaryContainer, adminTheme.theme === 'dark' ? 0.03 : 0.18),
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1.9, minHeight: 280, borderRadius: 10, borderWidth: 1, padding: 28, overflow: 'hidden', justifyContent: 'space-between', borderColor: adminTheme.borderSubtle }}>
        <View className="z-[1] max-w-[520px] gap-3.5">
          <Text className="font-headline text-[28px] tracking-[-0.5px]" style={{ color: adminTheme.onSurface }}>
            Aylik Buyume Analizi
          </Text>
          <Text className="font-body text-sm leading-6" style={{ color: adminTheme.onSurfaceVariant }}>
            Yeni salon kayitlari gecen aya gore %18 artis gosterdi. Ozel paket donusum orani en yuksek seviyesine cikti.
          </Text>
          <View className="mt-2 flex-row flex-wrap gap-8">
            <View>
              <Text className="mb-1.5 font-label text-[10px] uppercase tracking-widest" style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.72), fontFamily: 'Manrope-Bold' }}>
                Yeni Salonlar
              </Text>
              <Text className="font-headline text-[32px] tracking-[-0.6px]" style={{ color: adminTheme.success }}>
                {overview.newSalons}
              </Text>
            </View>
            <View>
              <Text className="mb-1.5 font-label text-[10px] uppercase tracking-widest" style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.72), fontFamily: 'Manrope-Bold' }}>
                Ciro Artisi
              </Text>
              <Text className="font-headline text-[32px] tracking-[-0.6px]" style={{ color: adminTheme.primary }}>
                {overview.revenueGrowth}
              </Text>
            </View>
          </View>
        </View>
        <View pointerEvents="none" className="absolute -bottom-[18px] -right-3">
          <MaterialIcons
            name="trending-up"
            size={190}
            color={hexToRgba(adminTheme.primary, adminTheme.theme === 'dark' ? 0.12 : 0.16)}
          />
        </View>
      </LinearGradient>

      <View
        className="min-h-[280px] flex-1 justify-between gap-[18px] rounded-[10px] border p-6"
        style={{
          backgroundColor: hexToRgba(adminTheme.primary, adminTheme.theme === 'dark' ? 0.06 : 0.07),
          borderColor: hexToRgba(adminTheme.primary, 0.14),
        }}>
        <View>
          <Text className="mb-3 font-headline text-2xl tracking-[-0.4px]" style={{ color: adminTheme.primary }}>
            Sistem Durumu
          </Text>
          <View className="mb-2.5 flex-row items-center gap-2">
            <View className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: adminTheme.success }} />
            <Text className="font-label text-[10px] uppercase tracking-[2.2px]" style={{ color: adminTheme.success, fontFamily: 'Manrope-Bold' }}>
              Tum Sistemler Aktif
            </Text>
          </View>
          <Text className="max-w-[320px] font-body text-sm leading-[22px]" style={{ color: adminTheme.onSurfaceVariant }}>
            Onay siralari, bildirim akisleri ve odeme servisleri normal seviyede calisiyor.
          </Text>
        </View>

        <Pressable
          accessibilityRole="button"
          className="min-h-12 items-center justify-center rounded-md border px-[18px]"
          style={({ hovered }) => [
            {
              borderColor: hexToRgba(adminTheme.primary, hovered ? 0.32 : 0.2),
              backgroundColor: hovered ? hexToRgba(adminTheme.primary, 0.08) : 'transparent',
            },
            Platform.OS === 'web'
              ? ({ transition: 'background-color 160ms ease, border-color 160ms ease, opacity 160ms ease, transform 160ms ease', cursor: 'pointer' } as any)
              : null,
          ]}>
          <Text className="text-center font-label text-[10px] uppercase tracking-[2.1px]" style={{ color: adminTheme.primary, fontFamily: 'Manrope-Bold' }}>
            Sistem Gunlugunu Goruntule
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
