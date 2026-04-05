import React from 'react';
import { Text, View } from 'react-native';

import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { hexToRgba } from '@/utils/color';

import { dashboardClassNames } from './presentation';

export default function DashboardFooter() {
  const adminTheme = useSuperAdminTheme();

  return (
    <>
      <View className={dashboardClassNames.footerRule} style={{ borderTopColor: adminTheme.borderSubtle }} />
      <Text className={dashboardClassNames.footer} style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.45) }}>
        Copyright 2026 USTURA SaaS Enterprise Platform. All rights reserved.
      </Text>
    </>
  );
}
