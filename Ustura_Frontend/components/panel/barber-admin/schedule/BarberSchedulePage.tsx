import { ActivityIndicator, Platform, Text, View, useWindowDimensions } from 'react-native';

import { useBarberAdminTheme } from '@/components/panel/barber-admin/theme';

import { scheduleClassNames } from './presentation';
import ScheduleCalendarGrid from './ScheduleCalendarGrid';
import ScheduleHeader from './ScheduleHeader';
import ScheduleSidebar from './ScheduleSidebar';
import ScheduleWeekGrid from './ScheduleWeekGrid';
import StaffFilterBar from './StaffFilterBar';
import { useBarberSchedule } from './use-barber-schedule';

export default function BarberSchedulePage() {
  const { width } = useWindowDimensions();
  const theme = useBarberAdminTheme();
  const schedule = useBarberSchedule();

  const showSidebar = width >= 1080;
  const isWeekView = schedule.viewMode === 'week';

  const hasData = isWeekView
    ? schedule.scheduleWeek.days.some((d) => d.appointments.length > 0)
    : schedule.scheduleDay.appointments.length > 0;

  if (schedule.loading && !hasData) {
    return (
      <View
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: theme.pageBackground }}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  if (schedule.error && !hasData) {
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

  const overview = isWeekView
    ? schedule.scheduleWeek.overview
    : schedule.scheduleDay.overview;
  const nextUp = isWeekView
    ? schedule.scheduleWeek.nextUp
    : schedule.scheduleDay.nextUp;

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
          {isWeekView ? (
            <ScheduleWeekGrid
              week={schedule.scheduleWeek}
              onCancel={schedule.handleCancel}
              onUpdateStatus={schedule.handleUpdateStatus}
              mutating={schedule.mutating}
            />
          ) : (
            <ScheduleCalendarGrid
              appointments={schedule.scheduleDay.appointments}
              onCancel={schedule.handleCancel}
              onUpdateStatus={schedule.handleUpdateStatus}
              mutating={schedule.mutating}
            />
          )}
        </View>

        {showSidebar ? (
          <ScheduleSidebar overview={overview} nextUp={nextUp} />
        ) : null}
      </View>
    </View>
  );
}
