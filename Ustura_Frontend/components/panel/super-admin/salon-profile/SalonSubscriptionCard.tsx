import React from 'react';
import { Text, View } from 'react-native';

import type { SalonProfile } from '@/components/panel/super-admin/salon-profile/data';
import ActionButton from '@/components/panel/super-admin/ActionButton';
import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { hexToRgba } from '@/utils/color';

import { styles } from './styles';

export default function SalonSubscriptionCard({ profile }: { profile: SalonProfile }) {
  const adminTheme = useSuperAdminTheme();

  return (
    <View
      style={[
        styles.glassCard,
        {
          backgroundColor: adminTheme.cardBackground,
          borderColor: adminTheme.borderSubtle,
        },
      ]}>
      <Text style={[styles.cardEyebrow, { color: hexToRgba(adminTheme.onSurfaceVariant, 0.68) }]}>
        Abonelik Defteri
      </Text>

      <View style={styles.infoStack}>
        <View style={styles.subscriptionHeader}>
          <View style={styles.infoBlock}>
            <Text style={[styles.infoLabel, { color: hexToRgba(adminTheme.primary, 0.7) }]}>Aktif Plan</Text>
            <Text style={[styles.planText, { color: adminTheme.primary }]}>{profile.subscription.planName}</Text>
          </View>

          <View
            style={[
              styles.subscriptionStatusPill,
              { backgroundColor: hexToRgba(adminTheme.success, 0.14) },
            ]}>
            <Text style={[styles.subscriptionStatusText, { color: adminTheme.success }]}>
              {profile.subscription.statusLabel}
            </Text>
          </View>
        </View>

        <View style={styles.subscriptionGrid}>
          <View style={styles.subscriptionMeta}>
            <Text style={[styles.infoLabel, { color: hexToRgba(adminTheme.onSurfaceVariant, 0.7) }]}>Donem</Text>
            <Text style={[styles.infoValueSm, { color: adminTheme.onSurface }]}>{profile.subscription.cycleLabel}</Text>
          </View>
          <View style={styles.subscriptionMeta}>
            <Text style={[styles.infoLabel, { color: hexToRgba(adminTheme.onSurfaceVariant, 0.7) }]}>
              Sonraki Odeme
            </Text>
            <Text style={[styles.infoValueSm, { color: adminTheme.onSurface }]}>
              {profile.subscription.nextPaymentLabel}
            </Text>
          </View>
        </View>

        <View style={styles.subscriptionActions}>
          <ActionButton label="Plani Guncelle" />
          <ActionButton label="Salonu Askiya Al" variant="danger" />
        </View>
      </View>
    </View>
  );
}
