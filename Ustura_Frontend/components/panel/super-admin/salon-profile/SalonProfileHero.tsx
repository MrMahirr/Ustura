import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import type { SalonProfile } from '@/components/panel/super-admin/salon-profile/data';
import ActionButton from '@/components/panel/super-admin/ActionButton';
import Button from '@/components/ui/Button';
import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { hexToRgba } from '@/utils/color';

import { styles } from './styles';

export default function SalonProfileHero({
  profile,
  isWide,
  onGoBack,
}: {
  profile: SalonProfile;
  isWide: boolean;
  onGoBack: () => void;
}) {
  const adminTheme = useSuperAdminTheme();
  const isActive = profile.salon.status === 'Aktif';

  return (
    <View style={styles.heroSection}>
      <ActionButton label="Salon Listesine Don" style={{ alignSelf: 'flex-start' }} onPress={onGoBack} />

      <View
        style={[
          styles.heroMain,
          {
            flexDirection: isWide ? 'row' : 'column',
            alignItems: isWide ? 'flex-end' : 'flex-start',
          },
        ]}>
        <View style={styles.heroCopy}>
          <View style={styles.heroBadgeRow}>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: hexToRgba(isActive ? adminTheme.success : adminTheme.warning, 0.12),
                  borderColor: hexToRgba(isActive ? adminTheme.success : adminTheme.warning, 0.26),
                },
              ]}>
              <Text style={[styles.statusBadgeText, { color: isActive ? adminTheme.success : adminTheme.warning }]}>
                {profile.heroStatusLabel}
              </Text>
            </View>

            <View style={styles.ratingRow}>
              <MaterialIcons name="star" size={16} color={adminTheme.primary} />
              <Text style={[styles.ratingText, { color: adminTheme.primary }]}>{profile.ratingLabel} Rating</Text>
            </View>
          </View>

          <Text style={[styles.heroTitle, { color: adminTheme.onSurface }]}>{profile.salon.name}</Text>

          <View style={styles.heroLocationRow}>
            <MaterialIcons name="location-on" size={16} color={hexToRgba(adminTheme.onSurfaceVariant, 0.8)} />
            <Text style={[styles.heroLocationText, { color: hexToRgba(adminTheme.onSurfaceVariant, 0.88) }]}>
              {profile.locationLabel}
            </Text>
          </View>
        </View>

        <View style={styles.heroActions}>
          <Button
            title="Detaylari Duzenle"
            variant="outline"
            interactionPreset="outlineCta"
            icon="edit"
          />
          <Button title="Canli Gorunum" interactionPreset="cta" icon="visibility" />
        </View>
      </View>
    </View>
  );
}
