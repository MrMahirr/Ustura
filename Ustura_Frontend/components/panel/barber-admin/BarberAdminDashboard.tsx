import React from 'react';
import { Platform, ScrollView, View, useWindowDimensions } from 'react-native';

import { barberAdminClassNames } from './presentation';
import { useBarberDashboard } from './use-barber-dashboard';
import { useBarberAdminTheme } from './theme';
import BarberDashboardHeader from './BarberDashboardHeader';
import BarberMetricsGrid from './BarberMetricsGrid';
import BarberTopBar from './BarberTopBar';
import QuickAppointmentFab from './QuickAppointmentFab';
import StaffStatusPanel from './StaffStatusPanel';
import TodayAppointmentsPanel from './TodayAppointmentsPanel';

export default function BarberAdminDashboard() {
  const { width } = useWindowDimensions();
  const theme = useBarberAdminTheme();
  const dashboard = useBarberDashboard();
  const [query, setQuery] = React.useState('');

  const paddingHorizontal = width < 768 ? 16 : width < 1280 ? 24 : 32;
  const isWide = width >= 980;
  const metricColumns = width >= 1320 ? 4 : width >= 760 ? 2 : 1;

  return (
    <View className={barberAdminClassNames.page} style={{ backgroundColor: theme.pageBackground }}>
      <View
        className="absolute inset-0"
        pointerEvents="none"
        style={
          Platform.OS === 'web'
            ? ({
                opacity: 1,
                backgroundImage: `radial-gradient(circle at 1px 1px, ${theme.dotOverlay} 1px, transparent 0)`,
                backgroundSize: '40px 40px',
              } as any)
            : { opacity: 0 }
        }
      />

      <BarberTopBar query={query} onQueryChange={setQuery} />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal,
          paddingTop: width < 768 ? 22 : 32,
          paddingBottom: 96,
        }}
        showsVerticalScrollIndicator={false}>
        <View className={barberAdminClassNames.content}>
          <BarberDashboardHeader
            heroLabel={dashboard.heroLabel}
            title={dashboard.title}
            subtitle={dashboard.subtitle}
            dateLabel={dashboard.dateLabel}
            isWide={isWide}
          />

          <BarberMetricsGrid metrics={dashboard.metrics} columns={metricColumns} />

          <View className={isWide ? 'flex-row items-start gap-8' : 'gap-8'}>
            <View style={{ flex: isWide ? 1.85 : undefined }}>
              <TodayAppointmentsPanel appointments={dashboard.appointments} />
            </View>

            <View style={{ flex: isWide ? 1 : undefined }}>
              <StaffStatusPanel staff={dashboard.staff} />
            </View>
          </View>
        </View>
      </ScrollView>

      <QuickAppointmentFab />
    </View>
  );
}
