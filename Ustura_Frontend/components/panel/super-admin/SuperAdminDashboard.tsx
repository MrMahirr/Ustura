import React from 'react';
import { Platform, ScrollView, View, useWindowDimensions } from 'react-native';

import ReservationTable from '@/components/panel/ReservationTable';
import DashboardBottomPanels from '@/components/panel/super-admin/dashboard/DashboardBottomPanels';
import DashboardFooter from '@/components/panel/super-admin/dashboard/DashboardFooter';
import DashboardMetricsSection from '@/components/panel/super-admin/dashboard/DashboardMetricsSection';
import DashboardMiddleSection from '@/components/panel/super-admin/dashboard/DashboardMiddleSection';
import DashboardPageHeader from '@/components/panel/super-admin/dashboard/DashboardPageHeader';
import { dashboardClassNames } from '@/components/panel/super-admin/dashboard/presentation';
import { useDashboardData } from '@/components/panel/super-admin/dashboard/use-dashboard-data';
import PanelTopBar from '@/components/panel/super-admin/PanelTopBar';
import {
  activitySnapshots,
  dashboardMetrics,
  logEntries,
} from '@/components/panel/super-admin/data';
import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';

export default function SuperAdminDashboard() {
  const { width } = useWindowDimensions();
  const adminTheme = useSuperAdminTheme();
  const dashboardData = useDashboardData();

  const isLg = width >= 1240;
  const paddingH = width < 768 ? 16 : 32;
  const metricsBasis = width >= 1440 ? '15.5%' : width >= 1024 ? '31%' : width >= 640 ? '47.5%' : '100%';
  const isBottomRowLayout = width >= 1200;
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
    <View className={dashboardClassNames.page} style={{ backgroundColor: adminTheme.pageBackground }}>
      <View className="absolute inset-0" style={overlayStyle} />

      <PanelTopBar query={dashboardData.query} onQueryChange={dashboardData.setQuery} />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: paddingH, paddingTop: 24, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}>
        <View className={dashboardClassNames.content}>
          <DashboardPageHeader isLg={isLg} />

          <DashboardMetricsSection metrics={dashboardMetrics} metricsBasis={metricsBasis} />

          <DashboardMiddleSection
            isLg={isLg}
            snapshots={activitySnapshots}
            salons={dashboardData.filteredActiveSalons}
          />

          <ReservationTable rows={dashboardData.filteredAppointments} />

          <DashboardBottomPanels
            isRowLayout={isBottomRowLayout}
            salons={dashboardData.filteredRecentSalons}
            approvals={dashboardData.filteredApprovals}
            logs={logEntries}
          />

          <DashboardFooter />
        </View>
      </ScrollView>
    </View>
  );
}
