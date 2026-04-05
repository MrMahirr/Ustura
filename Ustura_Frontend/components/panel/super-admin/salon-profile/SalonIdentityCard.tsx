import React from 'react';
import { Text, View } from 'react-native';

import type { SalonProfile } from '@/components/panel/super-admin/salon-profile/data';
import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { hexToRgba } from '@/utils/color';

import { styles } from './styles';

export default function SalonIdentityCard({ profile }: { profile: SalonProfile }) {
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
      <View style={[styles.identityAccent, { backgroundColor: hexToRgba(adminTheme.primary, 0.34) }]} />

      <Text style={[styles.cardEyebrow, { color: hexToRgba(adminTheme.onSurfaceVariant, 0.68) }]}>Salon Kimligi</Text>

      <View style={styles.infoStack}>
        <View style={styles.infoBlock}>
          <Text style={[styles.infoLabel, { color: hexToRgba(adminTheme.primary, 0.7) }]}>Isletme Sahibi</Text>
          <Text style={[styles.ownerText, { color: adminTheme.onSurface }]}>{profile.salon.owner}</Text>
        </View>

        <View style={styles.infoBlock}>
          <Text style={[styles.infoLabel, { color: hexToRgba(adminTheme.primary, 0.7) }]}>Kayit Tarihi</Text>
          <Text style={[styles.infoValueLg, { color: hexToRgba(adminTheme.onSurface, 0.92) }]}>
            {profile.registrationDateLabel}
          </Text>
        </View>

        <View style={styles.infoBlock}>
          <Text style={[styles.infoLabel, { color: hexToRgba(adminTheme.primary, 0.7) }]}>Iletisim Bilgileri</Text>
          <Text style={[styles.infoValueSm, { color: hexToRgba(adminTheme.onSurface, 0.86) }]}>{profile.ownerPhone}</Text>
          <Text style={[styles.infoValueLink, { color: hexToRgba(adminTheme.primary, 0.9) }]}>
            {profile.salon.ownerEmail}
          </Text>
        </View>
      </View>
    </View>
  );
}
