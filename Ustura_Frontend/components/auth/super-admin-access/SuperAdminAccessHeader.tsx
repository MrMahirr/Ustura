import { Text, View } from 'react-native';

import { SUPER_ADMIN_ACCESS_COPY } from '@/components/auth/super-admin-access/presentation';
import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { hexToRgba } from '@/utils/color';

export default function SuperAdminAccessHeader() {
  const adminTheme = useSuperAdminTheme();

  return (
    <View className="items-center" style={{ gap: 16 }}>
      <View className="items-center">
        <Text className="font-headline text-4xl font-extrabold tracking-[-1.2px]" style={{ color: adminTheme.primary }}>
          {SUPER_ADMIN_ACCESS_COPY.brand}
        </Text>

        <View className="mt-2 flex-row items-center" style={{ gap: 8 }}>
          <View className="h-px w-4" style={{ backgroundColor: hexToRgba(adminTheme.onSurfaceVariant, 0.32) }} />
          <Text
            className="font-label text-[10px] uppercase tracking-[3.2px]"
            style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.9) }}>
            {SUPER_ADMIN_ACCESS_COPY.eyebrow}
          </Text>
          <View className="h-px w-4" style={{ backgroundColor: hexToRgba(adminTheme.onSurfaceVariant, 0.32) }} />
        </View>
      </View>

      <View className="items-center">
        <Text className="font-body text-sm font-light" style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.68) }}>
          {SUPER_ADMIN_ACCESS_COPY.subtitle}
        </Text>
      </View>
    </View>
  );
}
