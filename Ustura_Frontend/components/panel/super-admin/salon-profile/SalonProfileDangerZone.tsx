import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import {
  SALON_PROFILE_COPY,
  salonProfileClassNames,
} from '@/components/panel/super-admin/salon-profile/presentation';
import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { hexToRgba } from '@/utils/color';
import { confirmDestructive } from '@/utils/flash';

import type { SalonProfileMutationResult } from './use-salon-profile';

function confirmSalonDelete(salonName: string): Promise<boolean> {
  const msg = `"${salonName}" salonu kalici olarak silinecek; bagli randevu ve personel kayitlari da silinir. Devam edilsin mi?`;
  return confirmDestructive('Salonu sil', msg);
}

interface SalonProfileDangerZoneProps {
  salonName: string;
  onDelete: () => Promise<SalonProfileMutationResult>;
  isDeleting: boolean;
}

export default function SalonProfileDangerZone({
  salonName,
  onDelete,
  isDeleting,
}: SalonProfileDangerZoneProps) {
  const adminTheme = useSuperAdminTheme();
  const [localError, setLocalError] = useState<string | null>(null);

  const handlePress = async () => {
    setLocalError(null);
    const ok = await confirmSalonDelete(salonName);
    if (!ok) {
      return;
    }
    const result = await onDelete();
    if (!result.ok) {
      setLocalError(result.message);
    }
  };

  return (
    <View
      className={salonProfileClassNames.glassCard}
      style={{
        backgroundColor: hexToRgba(adminTheme.error, 0.06),
        borderColor: hexToRgba(adminTheme.error, 0.22),
      }}>
      <Text className={salonProfileClassNames.cardEyebrow} style={{ color: adminTheme.error, fontFamily: 'Manrope-Bold' }}>
        {SALON_PROFILE_COPY.dangerTitle}
      </Text>
      <Text className="mb-5 text-sm leading-5" style={{ color: adminTheme.onSurfaceVariant }}>
        {SALON_PROFILE_COPY.dangerDescription}
      </Text>

      {localError ? (
        <Text className="mb-3 text-sm" style={{ color: adminTheme.error }}>
          {localError}
        </Text>
      ) : null}

      <Pressable
        onPress={() => void handlePress()}
        disabled={isDeleting}
        className="items-center rounded-lg border py-3.5"
        style={{
          borderColor: hexToRgba(adminTheme.error, 0.45),
          opacity: isDeleting ? 0.6 : 1,
        }}>
        <Text className="font-label text-sm font-bold" style={{ color: adminTheme.error }}>
          {isDeleting ? SALON_PROFILE_COPY.deleting : SALON_PROFILE_COPY.deleteSalon}
        </Text>
      </Pressable>
    </View>
  );
}
