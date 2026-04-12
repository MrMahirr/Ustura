import { ActivityIndicator, Platform, Text, View, useWindowDimensions } from 'react-native';

import { useBarberAdminTheme } from '@/components/panel/barber-admin/theme';

import { scheduleClassNames } from './presentation';
import ScheduleCalendarGrid from './ScheduleCalendarGrid';
import ScheduleHeader from './ScheduleHeader';
import ScheduleSidebar from './ScheduleSidebar';
import StaffFilterBar from './StaffFilterBar';
import { useBarberSchedule } from './use-barber-schedule';

export default function BarberSchedulePage() {
  const { width } = useWindowDimensions();
  const theme = useBarberAdminTheme();
  const schedule = useBarberSchedule();

  const showSidebar = width >= 1080;

  if (schedule.loading && schedule.scheduleDay.appointments.length === 0) {
    return (
      <View
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: theme.pageBackground }}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  if (schedule.error && schedule.scheduleDay.appointments.length === 0) {
    return (
      <View
        className="flex-1 items-center justify-center gap-2"
        style={{ backgroundColor: theme.pageBackground }}>
        <Text
          className="font-headline text-base font-bold"
          style={{ color: theme.error }}>
          {schedule.error}
        </Text>
      </View>
    );
  }

  return (
    <View
      className={scheduleClassNames.page}
      style={{ backgroundColor: theme.pageBackground }}>
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

      <ScheduleHeader
        dateRangeLabel={schedule.dateRangeLabel}
        viewMode={schedule.viewMode}
        onViewModeChange={schedule.setViewMode}
        onGoBack={schedule.goBack}
        onGoForward={schedule.goForward}
      />

      <StaffFilterBar
        staff={schedule.staffMembers}
        selectedStaffId={schedule.selectedStaffId}
        onSelectStaff={schedule.setSelectedStaffId}
      />

      <View className={scheduleClassNames.mainArea}>
        <View className={scheduleClassNames.calendarColumn}>
          <ScheduleCalendarGrid
            appointments={schedule.scheduleDay.appointments}
            onCancel={schedule.handleCancel}
            onUpdateStatus={schedule.handleUpdateStatus}
            mutating={schedule.mutating}
          />
        </View>

        {showSidebar ? (
          <ScheduleSidebar
            overview={schedule.scheduleDay.overview}
            nextUp={schedule.scheduleDay.nextUp}
          />
        ) : null}
      </View>
    </View>
  );
}
