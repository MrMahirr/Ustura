import React from 'react';
import { Text, View } from 'react-native';

import { salonProfileClassNames } from '@/components/panel/super-admin/salon-profile/presentation';
import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import type { AdminSalonDetailRecord } from '@/services/salon.service';
import { hexToRgba } from '@/utils/color';

function formatDateLabel(iso: string) {
  return new Intl.DateTimeFormat('tr-TR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(iso));
}

export default function SalonIdentityCard({ detail }: { detail: AdminSalonDetailRecord }) {
  const adminTheme = useSuperAdminTheme();

  return (
    <View
      className={salonProfileClassNames.glassCard}
      style={{ backgroundColor: adminTheme.cardBackground, borderColor: adminTheme.borderSubtle }}>
      <View className="absolute bottom-0 left-0 top-0 w-[3px]" style={{ backgroundColor: hexToRgba(adminTheme.primary, 0.34) }} />

      <Text className={salonProfileClassNames.cardEyebrow} style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.68), fontFamily: 'Manrope-Bold' }}>
        Salon Kimligi
      </Text>

      <View className="gap-5">
        <View className="gap-[5px]">
          <Text className={salonProfileClassNames.infoLabel} style={{ color: hexToRgba(adminTheme.primary, 0.7), fontFamily: 'Manrope-Bold' }}>
            Isletme Sahibi
          </Text>
          <Text className="font-headline text-2xl tracking-[-0.4px]" style={{ color: adminTheme.onSurface }}>
            {detail.ownerName}
          </Text>
        </View>

        <View className="gap-[5px]">
          <Text className={salonProfileClassNames.infoLabel} style={{ color: hexToRgba(adminTheme.primary, 0.7), fontFamily: 'Manrope-Bold' }}>
            Kayit Tarihi
          </Text>
          <Text className="font-body text-base" style={{ color: hexToRgba(adminTheme.onSurface, 0.92), fontFamily: 'Manrope-SemiBold' }}>
            {formatDateLabel(detail.createdAt)}
          </Text>
        </View>

        <View className="gap-[5px]">
          <Text className={salonProfileClassNames.infoLabel} style={{ color: hexToRgba(adminTheme.primary, 0.7), fontFamily: 'Manrope-Bold' }}>
            Son Guncelleme
          </Text>
          <Text className="font-body text-base" style={{ color: hexToRgba(adminTheme.onSurface, 0.92), fontFamily: 'Manrope-SemiBold' }}>
            {formatDateLabel(detail.updatedAt)}
          </Text>
        </View>

        <View className="gap-[5px]">
          <Text className={salonProfileClassNames.infoLabel} style={{ color: hexToRgba(adminTheme.primary, 0.7), fontFamily: 'Manrope-Bold' }}>
            Iletisim
          </Text>
          <Text className="font-body text-[13px] underline" style={{ color: hexToRgba(adminTheme.primary, 0.9) }}>
            {detail.ownerEmail}
          </Text>
        </View>
      </View>
    </View>
  );
}
