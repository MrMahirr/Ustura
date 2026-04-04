import React from 'react';
import { Text, View } from 'react-native';

import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { hexToRgba } from '@/utils/color';

import { styles } from './styles';

export default function DashboardFooter() {
  const adminTheme = useSuperAdminTheme();

  return (
    <>
      <View style={[styles.footerRule, { borderTopColor: adminTheme.borderSubtle }]} />
      <Text style={[styles.footer, { color: hexToRgba(adminTheme.onSurfaceVariant, 0.45) }]}>
        Copyright 2026 USTURA SaaS Enterprise Platform. All rights reserved.
      </Text>
    </>
  );
}
