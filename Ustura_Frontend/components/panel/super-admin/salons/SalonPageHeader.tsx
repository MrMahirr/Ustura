import React from 'react';
import { Text, View } from 'react-native';

import { salonClassNames } from '@/components/panel/super-admin/salons/presentation';
import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { cn } from '@/utils/cn';

export default function SalonPageHeader({ isWide }: { isWide: boolean }) {
  const adminTheme = useSuperAdminTheme();

  return (
    <View className={cn(salonClassNames.headerSection, isWide ? 'flex-row items-end' : 'flex-col items-start')}>
      <View className={salonClassNames.headerCopy}>
        <Text className={salonClassNames.eyebrow} style={{ color: adminTheme.primary, fontFamily: 'Manrope-Bold' }}>
          Yonetim Paneli
        </Text>
        <Text className={salonClassNames.title} style={{ color: adminTheme.onSurface }}>
          Salon Yonetimi
        </Text>
        <Text className={salonClassNames.description} style={{ color: adminTheme.onSurfaceVariant, fontWeight: '300' }}>
          Platformdaki salonlari, sahip bilgilerini ve durumlarini gercek zamanli liste uzerinden yonet.
        </Text>
      </View>
    </View>
  );
}
