import React, { useCallback, useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';

import BarberTopBar from '@/components/panel/barber-admin/BarberTopBar';
import ScheduleCalendarGrid from '@/components/panel/barber-admin/schedule/ScheduleCalendarGrid';
import { scheduleClassNames } from '@/components/panel/barber-admin/schedule/presentation';
import ScheduleSidebar from '@/components/panel/barber-admin/schedule/ScheduleSidebar';
import ScheduleWeekGrid from '@/components/panel/barber-admin/schedule/ScheduleWeekGrid';
import StaffFilterBar from '@/components/panel/barber-admin/schedule/StaffFilterBar';
import { useBarberSchedule } from '@/components/panel/barber-admin/schedule/use-barber-schedule';
import { useBarberAdminTheme } from '@/components/panel/barber-admin/theme';
import { hexToRgba } from '@/utils/color';

import ReservationDetailModal from './ReservationDetailModal';
import ReservationFilterBar from './ReservationFilterBar';
import ReservationListSection from './ReservationListSection';
import { reservationClassNames } from './presentation';
import { useBarberReservations } from './use-barber-reservations';

type PageViewMode = 'list' | 'day' | 'week';

const VIEW_MODE_OPTIONS: { key: PageViewMode; label: string; icon: React.ComponentProps<typeof MaterialIcons>['name'] }[] = [
  { key: 'list', label: 'Liste', icon: 'view-list' },
  { key: 'day', label: 'Günlük', icon: 'view-day' },
  { key: 'week', label: 'Haftalık', icon: 'view-week' },
];

export default function BarberAdminReservations() {
  const { width } = useWindowDimensions();
  const theme = useBarberAdminTheme();
  const listState = useBarberReservations();
  const schedule = useBarberSchedule();
  const [viewMode, setViewModeRaw] = useState<PageViewMode>('list');

  const setViewMode = useCallback((mode: PageViewMode) => {
    setViewModeRaw(mode);
    if (mode === 'day') schedule.setViewMode('day');
    else if (mode === 'week') schedule.setViewMode('week');
  }, [schedule]);

  const paddingH = width < 768 ? 16 : 32;
  const useDesktopTable = width >= 900;
  const showCalendarSidebar = width >= 1080;

  const overlayStyle =
    Platform.OS === 'web'
      ? ({
          backgroundImage: `radial-gradient(circle at 1px 1px, ${theme.dotOverlay} 1px, transparent 0)`,
          backgroundSize: '40px 40px',
          opacity: 1,
          pointerEvents: 'none',
        } as any)
      : ({ opacity: 0, pointerEvents: 'none' } as const);

  const isCalendarMode = viewMode === 'day' || viewMode === 'week';
  const isLoading = viewMode === 'list'
    ? listState.loading && listState.allItems.length === 0
    : schedule.loading;

  if (isLoading) {
    return (
      <View
        className={reservationClassNames.page}
        style={{ backgroundColor: theme.pageBackground }}>
        <BarberTopBar query={listState.query} onQueryChange={listState.setQuery} />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      </View>
    );
  }

  return (
    <View
      className={reservationClassNames.page}
      style={{ backgroundColor: theme.pageBackground }}>
      <View className="absolute inset-0" style={overlayStyle} />
      <BarberTopBar query={listState.query} onQueryChange={listState.setQuery} />

      {/* Calendar-specific header bar for day/week navigation */}
      {isCalendarMode ? (
        <CalendarNavBar
          dateLabel={schedule.dateRangeLabel}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onGoBack={schedule.goBack}
          onGoForward={schedule.goForward}
        />
      ) : null}

      {/* Staff filter for calendar mode */}
      {isCalendarMode ? (
        <StaffFilterBar
          staff={schedule.staffMembers}
          selectedStaffId={schedule.selectedStaffId}
          onSelectStaff={schedule.setSelectedStaffId}
        />
      ) : null}

      {/* List View */}
      {viewMode === 'list' ? (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: paddingH,
            paddingTop: 24,
            paddingBottom: 40,
          }}
          showsVerticalScrollIndicator={false}>
          <View className={reservationClassNames.content}>
            <PageHeader
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              onRefresh={listState.refresh}
            />

            <StatsRow overview={listState.overview} />

            <ReservationFilterBar
              activeFilter={listState.filterStatus}
              onFilterChange={listState.setFilterStatus}
              overview={listState.overview}
            />

            <ReservationListSection
              reservations={listState.pageItems}
              filteredCount={listState.filteredItems.length}
              page={listState.page}
              totalPages={listState.totalPages}
              startRow={listState.startRow}
              endRow={listState.endRow}
              useDesktopTable={useDesktopTable}
              isLoading={listState.loading}
              errorMessage={listState.error}
              onPageChange={listState.setPage}
              onRetry={listState.refresh}
              onSelectReservation={listState.setSelectedReservation}
            />
          </View>
        </ScrollView>
      ) : null}

      {/* Day View */}
      {viewMode === 'day' ? (
        <View className={scheduleClassNames.mainArea}>
          <View className={scheduleClassNames.calendarColumn}>
            <ScheduleCalendarGrid
              appointments={schedule.scheduleDay.appointments}
              onCancel={schedule.handleCancel}
              onUpdateStatus={schedule.handleUpdateStatus}
              mutating={schedule.mutating}
            />
          </View>
          {showCalendarSidebar ? (
            <ScheduleSidebar
              overview={schedule.scheduleDay.overview}
              nextUp={schedule.scheduleDay.nextUp}
            />
          ) : null}
        </View>
      ) : null}

      {/* Week View */}
      {viewMode === 'week' ? (
        <View className={scheduleClassNames.mainArea}>
          <View className={scheduleClassNames.calendarColumn}>
            <ScheduleWeekGrid
              week={schedule.scheduleWeek}
              onCancel={schedule.handleCancel}
              onUpdateStatus={schedule.handleUpdateStatus}
              mutating={schedule.mutating}
            />
          </View>
          {showCalendarSidebar ? (
            <ScheduleSidebar
              overview={schedule.scheduleWeek.overview}
              nextUp={schedule.scheduleWeek.nextUp}
            />
          ) : null}
        </View>
      ) : null}

      <ReservationDetailModal
        reservation={listState.selectedReservation}
        visible={!!listState.selectedReservation}
        mutating={listState.mutating}
        onClose={() => listState.setSelectedReservation(null)}
        onUpdateStatus={listState.handleUpdateStatus}
        onCancel={listState.handleCancel}
      />
    </View>
  );
}

/* ── View mode toggle ────────────────────────────────────── */

function ViewModeToggle({
  viewMode,
  onViewModeChange,
}: {
  viewMode: PageViewMode;
  onViewModeChange: (mode: PageViewMode) => void;
}) {
  const theme = useBarberAdminTheme();

  return (
    <View
      className="flex-row overflow-hidden rounded-lg p-1"
      style={{ backgroundColor: hexToRgba(theme.onSurfaceVariant, 0.06) }}>
      {VIEW_MODE_OPTIONS.map((opt) => {
        const isActive = viewMode === opt.key;
        return (
          <Pressable
            key={opt.key}
            onPress={() => onViewModeChange(opt.key)}
            className="flex-row items-center gap-1.5 rounded-md px-3 py-2"
            style={({ hovered }) => [
              {
                backgroundColor: isActive
                  ? theme.cardBackground
                  : hovered
                    ? hexToRgba(theme.onSurfaceVariant, 0.06)
                    : 'transparent',
              },
              isActive
                ? {
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.08,
                    shadowRadius: 3,
                    elevation: 1,
                  }
                : null,
              Platform.OS === 'web'
                ? ({ transition: 'all 180ms ease', cursor: 'pointer' } as any)
                : null,
            ]}>
            <MaterialIcons
              name={opt.icon}
              size={16}
              color={isActive ? theme.primary : hexToRgba(theme.onSurfaceVariant, 0.6)}
            />
            <Text
              style={{
                color: isActive ? theme.primary : hexToRgba(theme.onSurfaceVariant, 0.7),
                fontFamily: isActive ? 'Manrope-Bold' : 'Manrope-SemiBold',
                fontSize: 12,
                letterSpacing: 0.3,
              }}>
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

/* ── Page header (list mode) ─────────────────────────────── */

function PageHeader({
  viewMode,
  onViewModeChange,
  onRefresh,
}: {
  viewMode: PageViewMode;
  onViewModeChange: (mode: PageViewMode) => void;
  onRefresh: () => void;
}) {
  const { width } = useWindowDimensions();
  const theme = useBarberAdminTheme();
  const isMobile = width < 768;

  return (
    <View style={{ gap: isMobile ? 14 : 16 }}>
      <View
        style={{
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'flex-start' : 'center',
          gap: isMobile ? 12 : 0,
        }}>
        <View className="gap-1">
          <Text
            style={{
              color: theme.onSurface,
              fontFamily: 'Manrope-Bold',
              fontSize: isMobile ? 24 : 28,
              letterSpacing: -0.3,
            }}>
            Randevular
          </Text>
          <Text
            style={{
              color: hexToRgba(theme.onSurfaceVariant, 0.65),
              fontSize: 14,
            }}>
            Tüm randevuları görüntüleyin, onaylayın veya iptal edin.
          </Text>
        </View>

        <View className="flex-row items-center gap-3">
          <ViewModeToggle viewMode={viewMode} onViewModeChange={onViewModeChange} />
          <Pressable
            onPress={onRefresh}
            className="flex-row items-center gap-2 rounded-md border px-4 py-2.5"
            style={({ hovered }) => [
              { borderColor: hexToRgba(theme.onSurfaceVariant, 0.15) },
              Platform.OS === 'web' && hovered
                ? ({
                    borderColor: hexToRgba(theme.primary, 0.4),
                    backgroundColor: hexToRgba(theme.primary, 0.04),
                    transition: 'all 180ms ease',
                    cursor: 'pointer',
                  } as any)
                : Platform.OS === 'web'
                  ? ({ transition: 'all 180ms ease', cursor: 'pointer' } as any)
                  : null,
            ]}>
            <MaterialIcons name="refresh" size={16} color={theme.primary} />
            <Text
              style={{
                color: theme.primary,
                fontFamily: 'Manrope-Bold',
                fontSize: 12,
                letterSpacing: 0.5,
              }}>
              Yenile
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

/* ── Calendar navigation bar (day/week mode) ─────────────── */

function CalendarNavBar({
  dateLabel,
  viewMode,
  onViewModeChange,
  onGoBack,
  onGoForward,
}: {
  dateLabel: string;
  viewMode: PageViewMode;
  onViewModeChange: (mode: PageViewMode) => void;
  onGoBack: () => void;
  onGoForward: () => void;
}) {
  const { width } = useWindowDimensions();
  const theme = useBarberAdminTheme();
  const isMobile = width < 768;

  return (
    <View
      className="z-30 min-h-[68px] flex-row flex-wrap items-center justify-between gap-4 border-b px-6 py-3"
      style={[
        {
          backgroundColor:
            Platform.OS === 'web'
              ? hexToRgba(theme.surface, 0.85)
              : theme.surface,
          borderBottomColor: theme.borderSubtle,
        },
        Platform.OS === 'web'
          ? ({
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
            } as any)
          : null,
      ]}>
      {/* Left: navigation + date label */}
      <View className="flex-row items-center gap-3">
        <Pressable
          onPress={onGoBack}
          className="h-9 w-9 items-center justify-center rounded-md"
          style={({ hovered }) => [
            { backgroundColor: hovered ? theme.surfaceContainerHigh : theme.surfaceContainerLow },
            Platform.OS === 'web' ? ({ cursor: 'pointer', transition: 'background-color 180ms ease' } as any) : null,
          ]}>
          <MaterialIcons name="chevron-left" size={22} color={theme.onSurfaceVariant} />
        </Pressable>

        <Text
          style={{
            color: theme.onSurface,
            fontFamily: theme.serifFont,
            fontSize: isMobile ? 16 : 20,
            fontWeight: '700',
            letterSpacing: -0.3,
          }}>
          {dateLabel}
        </Text>

        <Pressable
          onPress={onGoForward}
          className="h-9 w-9 items-center justify-center rounded-md"
          style={({ hovered }) => [
            { backgroundColor: hovered ? theme.surfaceContainerHigh : theme.surfaceContainerLow },
            Platform.OS === 'web' ? ({ cursor: 'pointer', transition: 'background-color 180ms ease' } as any) : null,
          ]}>
          <MaterialIcons name="chevron-right" size={22} color={theme.onSurfaceVariant} />
        </Pressable>
      </View>

      {/* Right: view mode toggle */}
      <ViewModeToggle viewMode={viewMode} onViewModeChange={onViewModeChange} />
    </View>
  );
}

/* ── Stats row ────────────────────────────────────────────── */

function StatsRow({
  overview,
}: {
  overview: {
    total: number;
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
    noShow: number;
  };
}) {
  const { width } = useWindowDimensions();
  const theme = useBarberAdminTheme();
  const isMobile = width < 768;

  const cards: {
    label: string;
    value: number;
    icon: React.ComponentProps<typeof MaterialIcons>['name'];
    color: string;
    bg: string;
  }[] = [
    { label: 'Toplam', value: overview.total, icon: 'event-note', color: theme.primary, bg: hexToRgba(theme.primary, 0.1) },
    { label: 'Bekleyen', value: overview.pending, icon: 'hourglass-empty', color: theme.warning, bg: hexToRgba(theme.warning, 0.1) },
    { label: 'Onaylanan', value: overview.confirmed, icon: 'check-circle', color: theme.primary, bg: hexToRgba(theme.primary, 0.1) },
    { label: 'Tamamlanan', value: overview.completed, icon: 'done-all', color: theme.success, bg: hexToRgba(theme.success, 0.1) },
    { label: 'İptal', value: overview.cancelled, icon: 'cancel', color: theme.error, bg: hexToRgba(theme.error, 0.1) },
  ];

  return (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: isMobile ? 10 : 14,
      }}>
      {cards.map((card) => (
        <View
          key={card.label}
          className="flex-row items-center gap-3 rounded-lg border px-4 py-3"
          style={{
            backgroundColor: theme.cardBackground,
            borderColor: theme.borderSubtle,
            minWidth: isMobile ? '47%' : 150,
            flex: isMobile ? 1 : undefined,
          }}>
          <View
            className="h-9 w-9 items-center justify-center rounded-lg"
            style={{ backgroundColor: card.bg }}>
            <MaterialIcons name={card.icon} size={18} color={card.color} />
          </View>
          <View className="gap-0.5">
            <Text
              style={{
                color: theme.onSurface,
                fontFamily: 'Manrope-Bold',
                fontSize: 18,
              }}>
              {card.value}
            </Text>
            <Text
              style={{
                color: hexToRgba(theme.onSurfaceVariant, 0.6),
                fontFamily: 'Manrope-SemiBold',
                fontSize: 10,
                textTransform: 'uppercase',
                letterSpacing: 1.2,
              }}>
              {card.label}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}
