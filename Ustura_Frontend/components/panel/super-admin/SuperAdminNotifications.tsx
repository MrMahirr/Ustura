import React from 'react';
import { Platform, ScrollView, View, useWindowDimensions } from 'react-native';

import PanelTopBar from '@/components/panel/super-admin/PanelTopBar';
import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import NotificationFilters from '@/components/panel/super-admin/notifications/NotificationFilters';
import NotificationListSection from '@/components/panel/super-admin/notifications/NotificationListSection';
import NotificationPageHeader from '@/components/panel/super-admin/notifications/NotificationPageHeader';
import NotificationStatsRow from '@/components/panel/super-admin/notifications/NotificationStatsRow';
import { notificationClassNames } from '@/components/panel/super-admin/notifications/presentation';
import { useNotificationManagement } from '@/components/panel/super-admin/notifications/use-notification-management';

export default function SuperAdminNotifications() {
  const { width } = useWindowDimensions();
  const adminTheme = useSuperAdminTheme();
  const mgmt = useNotificationManagement();

  const isWide = width >= 1080;
  const paddingH = width < 768 ? 16 : 32;
  const overlayStyle =
    Platform.OS === 'web'
      ? ({
          backgroundImage: `radial-gradient(circle at 1px 1px, ${adminTheme.gridDot} 1px, transparent 0)`,
          backgroundSize: '40px 40px',
          opacity: 1,
          pointerEvents: 'none',
        } as any)
      : ({
          opacity: 0,
          pointerEvents: 'none',
        } as const);

  return (
    <View
      className={notificationClassNames.page}
      style={{ backgroundColor: adminTheme.pageBackground }}>
      <View className="absolute inset-0" style={overlayStyle} />

      <PanelTopBar query={mgmt.query} onQueryChange={mgmt.setQuery} />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: paddingH,
          paddingTop: 24,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}>
        <View className={notificationClassNames.content}>
          <NotificationPageHeader
            isWide={isWide}
            overview={mgmt.overview}
            onMarkAllRead={mgmt.markAllAsRead}
            isMarkingAllRead={mgmt.isMarkingAllRead}
            theme={adminTheme}
          />

          <NotificationStatsRow overview={mgmt.overview} theme={adminTheme} />

          <NotificationFilters
            toneFilter={mgmt.toneFilter}
            readFilter={mgmt.readFilter}
            onToneChange={mgmt.setToneFilter}
            onReadChange={mgmt.setReadFilter}
            onReset={mgmt.resetFilters}
            theme={adminTheme}
          />

          <NotificationListSection
            notifications={mgmt.notifications}
            isLoading={mgmt.isLoading}
            error={mgmt.error}
            page={mgmt.page}
            totalPages={mgmt.totalPages}
            onPageChange={mgmt.setPage}
            onMarkRead={mgmt.markAsRead}
            onRefresh={mgmt.refresh}
            theme={adminTheme}
          />
        </View>
      </ScrollView>
    </View>
  );
}
