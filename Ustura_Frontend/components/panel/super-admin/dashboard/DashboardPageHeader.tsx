import React from 'react';
import { Pressable, Text, View } from 'react-native';

import Button from '@/components/ui/Button';
import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { cn } from '@/utils/cn';

import { dashboardClassNames } from './presentation';

export default function DashboardPageHeader({ isLg }: { isLg: boolean }) {
  const adminTheme = useSuperAdminTheme();

  return (
    <View
      className={cn(dashboardClassNames.headerSection, isLg ? 'flex-row items-end' : 'flex-col items-start')}>
      <View className={dashboardClassNames.headerCopy}>
        <Text className={dashboardClassNames.title} style={{ color: adminTheme.onSurface }}>
          Platform Genel Bakis
        </Text>
        <Text className={dashboardClassNames.description} style={{ color: adminTheme.onSurfaceVariant }}>
          Sistem genelindeki operasyonel veriler, abone performansi ve teknik loglarin canli takibi.
        </Text>
      </View>

      <View className={dashboardClassNames.headerActions} style={{ width: isLg ? 'auto' : '100%' }}>
        <Pressable
          style={({ hovered }) => [
            undefined,
            {
              backgroundColor: hovered ? adminTheme.cardBackgroundStrong : adminTheme.cardBackgroundMuted,
              marginRight: isLg ? 14 : 0,
              marginBottom: isLg ? 0 : 12,
              width: isLg ? 'auto' : '100%',
            },
          ]}
          className={dashboardClassNames.secondaryCta}>
          <Text className={dashboardClassNames.secondaryCtaText} style={{ color: adminTheme.onSurface }}>
            Raporu Indir
          </Text>
        </Pressable>
        <Button
          title="Yeni Salon Ekle"
          interactionPreset="cta"
          icon="add-business"
          style={isLg ? undefined : { width: '100%' }}
        />
      </View>
    </View>
  );
}
