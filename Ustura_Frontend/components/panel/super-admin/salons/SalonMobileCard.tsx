import React from 'react';
import { Image } from 'expo-image';
import { Platform, Text, View } from 'react-native';

import type { SalonRecord } from '@/components/panel/super-admin/salon-management.data';
import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { hexToRgba } from '@/utils/color';

import SalonActionIcon from './SalonActionIcon';
import { styles } from './styles';
import { formatCurrency, getPlanPalette, getRowActions, getStatusPalette } from './utils';

export default function SalonMobileCard({ salon }: { salon: SalonRecord }) {
  const adminTheme = useSuperAdminTheme();
  const statusPalette = getStatusPalette(salon.status, adminTheme);
  const planPalette = getPlanPalette(salon.plan, adminTheme);
  const actions = getRowActions(salon.status, adminTheme);

  return (
    <View
      style={[
        styles.mobileCard,
        { backgroundColor: adminTheme.cardBackground, borderColor: adminTheme.borderSubtle },
      ]}>
      <View style={styles.mobileCardTop}>
        <View style={styles.salonInfo}>
          <View
            style={[
              styles.salonThumbFrame,
              {
                borderColor: adminTheme.borderSubtle,
                backgroundColor: adminTheme.cardBackgroundStrong,
              },
            ]}>
            <Image
              source={{ uri: salon.imageUrl }}
              style={[
                styles.salonThumb,
                Platform.OS === 'web' && salon.mutedImage ? ({ filter: 'grayscale(1)' } as any) : null,
              ]}
              contentFit="cover"
            />
          </View>
          <View style={styles.salonCopy}>
            <Text style={[styles.salonName, { color: adminTheme.onSurface }]} numberOfLines={1}>
              {salon.name}
            </Text>
            <Text style={[styles.salonId, { color: hexToRgba(adminTheme.onSurfaceVariant, 0.82) }]}>ID: {salon.reference}</Text>
          </View>
        </View>

        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor: statusPalette.backgroundColor,
              borderColor: statusPalette.borderColor,
            },
          ]}>
          <Text style={[styles.statusText, { color: statusPalette.color }]}>{salon.status}</Text>
        </View>
      </View>

      <View style={styles.mobileMetaGrid}>
        <View style={styles.mobileMetaItem}>
          <Text style={[styles.mobileMetaLabel, { color: hexToRgba(adminTheme.onSurfaceVariant, 0.72) }]}>Isletmeci</Text>
          <Text style={[styles.mobileMetaValue, { color: adminTheme.onSurface }]}>{salon.owner}</Text>
          <Text style={[styles.mobileMetaSubValue, { color: hexToRgba(adminTheme.onSurfaceVariant, 0.82) }]}>
            {salon.ownerEmail}
          </Text>
        </View>
        <View style={styles.mobileMetaItem}>
          <Text style={[styles.mobileMetaLabel, { color: hexToRgba(adminTheme.onSurfaceVariant, 0.72) }]}>Konum</Text>
          <Text style={[styles.mobileMetaValue, { color: adminTheme.onSurface }]}>{salon.location}</Text>
        </View>
        <View style={styles.mobileMetaItem}>
          <Text style={[styles.mobileMetaLabel, { color: hexToRgba(adminTheme.onSurfaceVariant, 0.72) }]}>Paket</Text>
          <View style={styles.planRow}>
            <View
              style={[
                styles.planDot,
                {
                  backgroundColor: planPalette.dot,
                  ...(Platform.OS === 'web' && planPalette.glow !== 'transparent'
                    ? ({ boxShadow: `0 0 12px ${planPalette.glow}` } as any)
                    : null),
                },
              ]}
            />
            <Text style={[styles.planText, { color: planPalette.text }]}>{salon.plan}</Text>
          </View>
        </View>
        <View style={styles.mobileMetaItem}>
          <Text style={[styles.mobileMetaLabel, { color: hexToRgba(adminTheme.onSurfaceVariant, 0.72) }]}>Aylik Ciro</Text>
          <Text style={[styles.mobileMetaValue, { color: adminTheme.primary }]}>
            {formatCurrency(salon.monthlyRevenue)}
          </Text>
        </View>
      </View>

      <View style={styles.mobileActions}>
        {actions.map((action) => (
          <SalonActionIcon
            key={`${salon.id}-${action.icon}`}
            icon={action.icon}
            label={action.label}
            color={action.color}
          />
        ))}
      </View>
    </View>
  );
}
