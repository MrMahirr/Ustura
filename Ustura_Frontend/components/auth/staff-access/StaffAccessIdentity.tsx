import { Text, View } from 'react-native';

import { STAFF_ACCESS_COPY } from '@/components/auth/staff-access/presentation';
import { useAuthAccessTheme } from '@/components/auth/shared/use-auth-access-theme';
import { hexToRgba } from '@/utils/color';

export default function StaffAccessIdentity() {
  const theme = useAuthAccessTheme();

  return (
    <View className="mb-10 items-center">
      <Text className="mb-2 font-headline text-4xl font-bold tracking-[-0.8px]" style={{ color: theme.onSurface }}>
        USTURA
      </Text>

      <View className="mb-3 flex-row items-center justify-center" style={{ gap: 12 }}>
        <View className="h-px w-8" style={{ backgroundColor: hexToRgba(theme.onSurfaceVariant, 0.3) }} />
        <Text
          className="font-label text-[11px] font-bold uppercase tracking-[3px]"
          style={{ color: theme.primary }}>
          {STAFF_ACCESS_COPY.eyebrow}
        </Text>
        <View className="h-px w-8" style={{ backgroundColor: hexToRgba(theme.onSurfaceVariant, 0.3) }} />
      </View>

      <Text className="font-body font-light tracking-[0.4px]" style={{ color: theme.onSurfaceVariant }}>
        {STAFF_ACCESS_COPY.subtitle}
      </Text>
    </View>
  );
}
