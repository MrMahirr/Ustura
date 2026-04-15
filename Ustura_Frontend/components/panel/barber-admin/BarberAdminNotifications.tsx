import React from 'react';
import { Platform, ScrollView, View, useWindowDimensions } from 'react-native';

import BarberTopBar from '@/components/panel/barber-admin/BarberTopBar';
import { useBarberAdminTheme } from '@/components/panel/barber-admin/theme';
import NotificationFilters from '@/components/panel/super-admin/notifications/NotificationFilters';
import NotificationListSection from '@/components/panel/super-admin/notifications/NotificationListSection';
import NotificationPageHeader from '@/components/panel/super-admin/notifications/NotificationPageHeader';
import NotificationStatsRow from '@/components/panel/super-admin/notifications/NotificationStatsRow';
import { notificationClassNames } from '@/components/panel/super-admin/notifications/presentation';
import { useNotificationManagement } from '@/components/panel/super-admin/notifications/use-notification-management';

export default function BarberAdminNotifications() {
  const { width } = useWindowDimensions();
  const barberTheme = useBarberAdminTheme();
  const mgmt = useNotificationManagement();

  const isWide = width >= 1080;
  const paddingH = width < 768 ? 16 : 32;
  const overlayStyle =
    Platform.OS === 'web'
      ? ({
          backgroundImage: `radial-gradient(circle at 1px 1px, ${barberTheme.dotOverlay} 1px, transparent 0)`,
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
      style={{ backgroundColor: barberTheme.pageBackground }}>
      <View className="absolute inset-0" style={overlayStyle} />

      <BarberTopBar query={mgmt.query} onQueryChange={mgmt.setQuery} />

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
            theme={barberTheme}
          />

          <NotificationStatsRow overview={mgmt.overview} theme={barberTheme} />

          <NotificationFilters
            toneFilter={mgmt.toneFilter}
            readFilter={mgmt.readFilter}
            onToneChange={mgmt.setToneFilter}
            onReadChange={mgmt.setReadFilter}
            onReset={mgmt.resetFilters}
            theme={barberTheme}
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
            theme={barberTheme}
          />
        </View>
      </ScrollView>
    </View>
  );
}
