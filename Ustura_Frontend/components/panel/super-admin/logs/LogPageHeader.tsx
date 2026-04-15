import React from 'react';
import { Text, View } from 'react-native';

import { useSuperAdminTheme } from '../theme';
import { logClassNames } from './presentation';

interface LogPageHeaderProps {
  isWide: boolean;
}

export default function LogPageHeader({ isWide }: LogPageHeaderProps) {
  const adminTheme = useSuperAdminTheme();

  return (
    <View
      className={isWide ? 'flex-row items-end justify-between gap-6' : 'gap-4'}>
      <View className={logClassNames.headerCopy}>
        <Text
          className={logClassNames.eyebrow}
          style={{ color: adminTheme.primary, fontFamily: 'Manrope-Bold' }}>
          Yönetim Paneli
        </Text>
        <Text
          className={logClassNames.title}
          style={{ color: adminTheme.onSurface }}>
          Sistem Logları
        </Text>
        <Text
          className={logClassNames.description}
          style={{ color: adminTheme.onSurfaceVariant, fontWeight: '300' }}>
          Platform üzerindeki tüm kullanıcı hareketlerini, kimlik doğrulama olaylarını ve
          sistem değişikliklerini gerçek zamanlı izleyin.
        </Text>
      </View>
    </View>
  );
}
