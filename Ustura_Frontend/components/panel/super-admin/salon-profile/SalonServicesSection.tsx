import React from 'react';
import { Text, View } from 'react-native';

import type { SalonServiceItem } from '@/components/panel/super-admin/salon-profile/data';
import { salonProfileClassNames } from '@/components/panel/super-admin/salon-profile/presentation';
import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { hexToRgba } from '@/utils/color';

export default function SalonServicesSection({
  services,
  totalServices,
  itemBasis,
}: {
  services: SalonServiceItem[];
  totalServices: number;
  itemBasis: string;
}) {
  const adminTheme = useSuperAdminTheme();

  return (
    <View className={salonProfileClassNames.tableShell} style={{ backgroundColor: adminTheme.cardBackground, borderColor: adminTheme.borderSubtle }}>
      <View
        className={salonProfileClassNames.tableHeader}
        style={{ borderBottomColor: adminTheme.borderSubtle, backgroundColor: adminTheme.cardBackgroundMuted }}>
        <Text className={salonProfileClassNames.cardEyebrow} style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.68), marginBottom: 0, fontFamily: 'Manrope-Bold' }}>
          Hizmet Menusu
        </Text>

        <View className="flex-row flex-wrap items-center gap-[14px]">
          <Text className={salonProfileClassNames.tableActionText} style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.72), fontFamily: 'Manrope-Bold' }}>
            Toplam Hizmet: {totalServices}
          </Text>
          <Text className={salonProfileClassNames.tableActionText} style={{ color: adminTheme.primary, fontFamily: 'Manrope-Bold' }}>
            Menuyu Duzenle
          </Text>
        </View>
      </View>

      <View className="flex-row flex-wrap gap-px">
        {services.map((service) => (
          <View key={service.id} className="min-w-[260px]" style={{ width: itemBasis as any }}>
            <View
              className="min-h-[150px] justify-between gap-[14px] border p-5"
              style={{ backgroundColor: adminTheme.cardBackground, borderColor: adminTheme.borderSubtle }}>
              <View className="gap-2">
                <Text className="font-headline text-xl tracking-[-0.4px]" style={{ color: adminTheme.onSurface }}>
                  {service.name}
                </Text>
                <View className="flex-row flex-wrap items-center gap-2">
                  <Text className="font-label text-[9px] uppercase tracking-[2px]" style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.72), fontFamily: 'Manrope-Bold' }}>
                    {service.category}
                  </Text>
                  <View className="h-1 w-1 rounded-full" style={{ backgroundColor: hexToRgba(adminTheme.primary, 0.4) }} />
                  <Text className="font-label text-[9px] uppercase tracking-[2px]" style={{ color: adminTheme.primary, fontFamily: 'Manrope-Bold' }}>
                    {service.durationLabel}
                  </Text>
                </View>
              </View>

              <View className="gap-2.5">
                <Text className="font-body text-2xl" style={{ color: adminTheme.primary, fontFamily: 'Manrope-Bold' }}>
                  {service.priceLabel}
                </Text>

                <View className="flex-row items-center justify-end gap-2">
                  <View className="flex-row gap-0.5">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <View
                        key={`${service.id}-bar-${index}`}
                        className="h-4 w-1 rounded-full"
                        style={{
                          backgroundColor:
                            index < service.popularityLevel ? adminTheme.primary : hexToRgba(adminTheme.primary, 0.18),
                        }}
                      />
                    ))}
                  </View>
                  <Text className="font-label text-[9px] uppercase tracking-[2px]" style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.72), fontFamily: 'Manrope-Bold' }}>
                    {service.popularityLabel}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
