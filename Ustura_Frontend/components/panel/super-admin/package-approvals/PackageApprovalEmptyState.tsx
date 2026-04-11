import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { hexToRgba } from '@/utils/color';

export default function PackageApprovalEmptyState({
  activeStatus,
  hasQuery,
}: {
  activeStatus: 'pending' | 'approved' | 'rejected';
  hasQuery: boolean;
}) {
  const adminTheme = useSuperAdminTheme();

  const titleMap = {
    pending: 'Bekleyen basvuru kalmadi',
    approved: 'Onaylanan talep bulunmuyor',
    rejected: 'Reddedilen talep bulunmuyor',
  } as const;

  const description = hasQuery
    ? 'Arama filtresi sonucunda eslesen bir paket talebi yok. Sorguyu genisletmeyi dene.'
    : 'Bu sekmede goruntulenecek bir paket talebi yok. Yeni basvurular geldiginde burada listelenecek.';

  return (
    <View
      className="items-center justify-center rounded-[12px] border px-6 py-12"
      style={{
        backgroundColor: adminTheme.cardBackground,
        borderColor: adminTheme.borderSubtle,
      }}>
      <View
        className="mb-5 h-16 w-16 items-center justify-center rounded-full"
        style={{ backgroundColor: hexToRgba(adminTheme.primary, 0.12) }}>
        <MaterialIcons name="inventory-2" size={30} color={adminTheme.primary} />
      </View>
      <Text
        className="font-headline text-[28px] tracking-[-0.6px]"
        style={{ color: adminTheme.onSurface }}>
        {titleMap[activeStatus]}
      </Text>
      <Text
        className="mt-2 max-w-[420px] text-center font-body text-sm leading-6"
        style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.78) }}>
        {description}
      </Text>
    </View>
  );
}
