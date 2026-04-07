import React from 'react';
import { Text, View } from 'react-native';

import type { SalonProfile } from '@/components/panel/super-admin/salon-profile/data';
import { salonProfileClassNames } from '@/components/panel/super-admin/salon-profile/presentation';
import ActionButton from '@/components/panel/super-admin/ActionButton';
import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { hexToRgba } from '@/utils/color';

export default function SalonSubscriptionCard({ profile }: { profile: SalonProfile }) {
  const adminTheme = useSuperAdminTheme();

  return (
    <View className={salonProfileClassNames.glassCard} style={{ backgroundColor: adminTheme.cardBackground, borderColor: adminTheme.borderSubtle }}>
      <Text className={salonProfileClassNames.cardEyebrow} style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.68), fontFamily: 'Manrope-Bold' }}>
        Abonelik Defteri
      </Text>

      <View className="gap-5">
        <View className="flex-row items-center justify-between gap-3">
          <View className="gap-[5px]">
            <Text className={salonProfileClassNames.infoLabel} style={{ color: hexToRgba(adminTheme.primary, 0.7), fontFamily: 'Manrope-Bold' }}>
              Aktif Plan
            </Text>
            <Text className="font-headline text-2xl tracking-[-0.5px]" style={{ color: adminTheme.primary }}>
              {profile.subscription.planName}
            </Text>
          </View>

          <View className="rounded-full px-2.5 py-1.5" style={{ backgroundColor: hexToRgba(adminTheme.success, 0.14) }}>
            <Text className="font-label text-[9px] uppercase tracking-[1.8px]" style={{ color: adminTheme.success, fontFamily: 'Manrope-Bold' }}>
              {profile.subscription.statusLabel}
            </Text>
          </View>
        </View>

        <View className="flex-row flex-wrap gap-[14px]">
          <View className="min-w-[130px] flex-1 gap-1">
            <Text className={salonProfileClassNames.infoLabel} style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.7), fontFamily: 'Manrope-Bold' }}>
              Donem
            </Text>
            <Text className={salonProfileClassNames.infoValueSm} style={{ color: adminTheme.onSurface }}>
              {profile.subscription.cycleLabel}
            </Text>
          </View>
          <View className="min-w-[130px] flex-1 gap-1">
            <Text className={salonProfileClassNames.infoLabel} style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.7), fontFamily: 'Manrope-Bold' }}>
              Sonraki Odeme
            </Text>
            <Text className={salonProfileClassNames.infoValueSm} style={{ color: adminTheme.onSurface }}>
              {profile.subscription.nextPaymentLabel}
            </Text>
          </View>
        </View>

        <View className="mt-2 gap-2.5">
          <ActionButton label="Plani Guncelle" />
          <ActionButton label="Salonu Askiya Al" variant="danger" />
        </View>
      </View>
    </View>
  );
}
