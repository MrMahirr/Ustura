import React from 'react';
import { Text, View } from 'react-native';

import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { cn } from '@/utils/cn';

import {
  SALON_REQUEST_COPY,
  salonRequestClassNames,
} from './presentation';

export default function SalonRequestsPageHeader({
  isWide,
}: {
  isWide: boolean;
}) {
  const t = useSuperAdminTheme();

  return (
    <View
      className={cn(
        salonRequestClassNames.headerSection,
        isWide ? 'flex-row items-end' : 'flex-col items-start',
      )}>
      <View className={salonRequestClassNames.headerCopy}>
        <Text
          className={salonRequestClassNames.eyebrow}
          style={{ color: t.primary, fontFamily: 'Manrope-Bold' }}>
          {SALON_REQUEST_COPY.eyebrow}
        </Text>
        <Text
          className={salonRequestClassNames.title}
          style={{ color: t.onSurface }}>
          {SALON_REQUEST_COPY.title}
        </Text>
        <Text
          className={salonRequestClassNames.description}
          style={{ color: t.onSurfaceVariant, fontWeight: '300' }}>
          {SALON_REQUEST_COPY.description}
        </Text>
      </View>
    </View>
  );
}
