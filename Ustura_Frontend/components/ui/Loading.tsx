import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

export default function Loading() {
  const primary = useThemeColor({}, 'primary');
  const onSurfaceVariant = useThemeColor({}, 'onSurfaceVariant');

  return (
    <View className="items-center justify-center gap-3 py-10">
      <ActivityIndicator color={primary} size="large" />
      <Text className="text-xs uppercase tracking-[1.8px]" style={{ color: onSurfaceVariant, fontFamily: 'Manrope-Bold' }}>
        Yukleniyor
      </Text>
    </View>
  );
}
