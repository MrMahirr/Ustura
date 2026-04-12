import React from 'react';
import { Text, View } from 'react-native';

import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { hexToRgba } from '@/utils/color';

export default function PackageApprovalFeatureChips({
  items,
}: {
  items: string[];
}) {
  const adminTheme = useSuperAdminTheme();

  return (
    <View className="flex-row flex-wrap gap-2">
      {items.map((item) => (
        <View
          key={item}
          className="rounded-[8px] px-2.5 py-1.5"
          style={{ backgroundColor: adminTheme.cardBackgroundStrong }}>
          <Text
            className="font-label text-[9px] uppercase tracking-[1.8px]"
            style={{
              color: hexToRgba(adminTheme.onSurfaceVariant, 0.86),
              fontFamily: 'Manrope-Bold',
            }}>
            {item}
          </Text>
        </View>
      ))}
    </View>
  );
}
