import React from 'react';
import { Text, View } from 'react-native';

import { getUserProfilePanelShadow, userProfileClassNames } from '@/components/panel/super-admin/user-profile/presentation';
import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';

export default function UserExpertiseCard({ expertise }: { expertise: string[] }) {
  const adminTheme = useSuperAdminTheme();

  return (
    <View
      className={userProfileClassNames.panelCard}
      style={[
        {
          backgroundColor: adminTheme.cardBackground,
        },
        getUserProfilePanelShadow(adminTheme.theme),
      ]}>
      <Text className={userProfileClassNames.panelTitleSm} style={{ color: adminTheme.onSurface }}>
        Expertise
      </Text>

      <View className="flex-row flex-wrap gap-2.5">
        {expertise.map((item) => (
          <View
            key={item}
            className="min-h-9 border px-4 py-2.5"
            style={{
              backgroundColor: adminTheme.surfaceContainerHighest,
              borderColor: adminTheme.borderSubtle,
            }}>
            <Text className="font-label text-[10px] uppercase tracking-[1.8px]" style={{ color: adminTheme.onSurface, fontFamily: 'Manrope-Bold' }}>
              {item}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
