import React from 'react';
import { Text, View } from 'react-native';

import type { SalonServiceItem } from '@/components/panel/super-admin/salon-profile/data';
import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { hexToRgba } from '@/utils/color';

import { styles } from './styles';

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
    <View
      style={[
        styles.tableShell,
        { backgroundColor: adminTheme.cardBackground, borderColor: adminTheme.borderSubtle },
      ]}>
      <View
        style={[
          styles.tableHeader,
          { borderBottomColor: adminTheme.borderSubtle, backgroundColor: adminTheme.cardBackgroundMuted },
        ]}>
        <Text style={[styles.cardEyebrow, { color: hexToRgba(adminTheme.onSurfaceVariant, 0.68), marginBottom: 0 }]}>
          Hizmet Menusu
        </Text>

        <View style={styles.tableHeaderActions}>
          <Text style={[styles.tableActionText, { color: hexToRgba(adminTheme.onSurfaceVariant, 0.72) }]}>
            Toplam Hizmet: {totalServices}
          </Text>
          <Text style={[styles.tableActionText, { color: adminTheme.primary }]}>Menuyu Duzenle</Text>
        </View>
      </View>

      <View style={styles.servicesGrid}>
        {services.map((service) => (
          <View key={service.id} style={[styles.serviceItem, { width: itemBasis as any }]}>
            <View
              style={[
                styles.serviceCard,
                { backgroundColor: adminTheme.cardBackground, borderColor: adminTheme.borderSubtle },
              ]}>
              <View style={{ gap: 8 }}>
                <Text style={[styles.serviceTitle, { color: adminTheme.onSurface }]}>{service.name}</Text>
                <View style={styles.serviceMetaRow}>
                  <Text style={[styles.serviceMetaText, { color: hexToRgba(adminTheme.onSurfaceVariant, 0.72) }]}>
                    {service.category}
                  </Text>
                  <View
                    style={{ width: 4, height: 4, borderRadius: 999, backgroundColor: hexToRgba(adminTheme.primary, 0.4) }}
                  />
                  <Text style={[styles.serviceMetaText, { color: adminTheme.primary }]}>{service.durationLabel}</Text>
                </View>
              </View>

              <View style={{ gap: 10 }}>
                <Text style={[styles.servicePrice, { color: adminTheme.primary }]}>{service.priceLabel}</Text>

                <View style={styles.popularityRow}>
                  <View style={styles.popularityBars}>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <View
                        key={`${service.id}-bar-${index}`}
                        style={[
                          styles.popularityBar,
                          {
                            backgroundColor:
                              index < service.popularityLevel
                                ? adminTheme.primary
                                : hexToRgba(adminTheme.primary, 0.18),
                          },
                        ]}
                      />
                    ))}
                  </View>
                  <Text style={[styles.serviceMetaText, { color: hexToRgba(adminTheme.onSurfaceVariant, 0.72) }]}>
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
