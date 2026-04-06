import { MaterialIcons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { SUPER_ADMIN_ACCESS_COPY } from '@/components/auth/super-admin-access/presentation';
import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { hexToRgba } from '@/utils/color';

export default function SuperAdminAccessIndicators() {
  const adminTheme = useSuperAdminTheme();

  return (
    <View className="px-2" style={{ gap: 16 }}>
      <View className="flex-row items-center justify-center" style={{ gap: 8 }}>
        <MaterialIcons name="lock-outline" size={16} color={hexToRgba(adminTheme.onSurfaceVariant, 0.54)} />
        <Text
          className="font-label text-[10px] uppercase tracking-[1.6px]"
          style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.54) }}>
          {SUPER_ADMIN_ACCESS_COPY.restrictedAreaLabel}
        </Text>
      </View>

      <View className="flex-row items-center justify-between" style={{ gap: 12 }}>
        <View className="flex-row items-center" style={{ gap: 6 }}>
          <View className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: hexToRgba(adminTheme.success, 0.34) }} />
          <Text className="font-label text-[10px] uppercase tracking-[1.4px]" style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.5) }}>
            {SUPER_ADMIN_ACCESS_COPY.systemSecureLabel}
          </Text>
        </View>

        <Text className="font-label text-[10px]" style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.44) }}>
          {SUPER_ADMIN_ACCESS_COPY.lastLoginLabel}
        </Text>
      </View>
    </View>
  );
}
