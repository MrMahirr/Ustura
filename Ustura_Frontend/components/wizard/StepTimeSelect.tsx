import React from 'react';
import { Text, useWindowDimensions, View } from 'react-native';

import BookingDateSelector from '@/components/wizard/BookingDateSelector';
import BookingLocationCard from '@/components/wizard/BookingLocationCard';
import BookingSummaryChip from '@/components/wizard/BookingSummaryChip';
import BookingSurfacePanel from '@/components/wizard/BookingSurfacePanel';
import TimeSlotGrid from '@/components/wizard/TimeSlotGrid';
import {
  BOOKING_LOCATION_IMAGE_URI,
  BOOKING_TIME_SELECTION_COPY,
  type BookingDateOption,
  type BookingTimeSlot,
} from '@/components/wizard/time-selection-presentation';
import { useThemeColor } from '@/hooks/use-theme-color';
import { hexToRgba } from '@/utils/color';

interface StepTimeSelectProps {
  salonName: string;
  salonLocation: string;
  staffName: string;
  dateOptions: BookingDateOption[];
  selectedDateId: string | null;
  selectedDateLabel?: string | null;
  selectedTimeId: string | null;
  timeSlots: BookingTimeSlot[];
  onSelectDate: (dateId: string) => void;
  onSelectTime: (timeId: string) => void;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
  previousWeekDisabled?: boolean;
  isLoadingSlots?: boolean;
  slotErrorMessage?: string | null;
}

export default function StepTimeSelect({
  salonName,
  salonLocation,
  staffName,
  dateOptions,
  selectedDateId,
  selectedDateLabel,
  selectedTimeId,
  timeSlots,
  onSelectDate,
  onSelectTime,
  onPreviousWeek,
  onNextWeek,
  previousWeekDisabled = false,
  isLoadingSlots = false,
  slotErrorMessage = null,
}: StepTimeSelectProps) {
  const { width } = useWindowDimensions();
  const onSurface = useThemeColor({}, 'onSurface');
  const onSurfaceVariant = useThemeColor({}, 'onSurfaceVariant');

  const isDesktop = width >= 1024;

  return (
    <View style={{ gap: 28 }}>
      <View style={{ gap: 14 }}>
        <View style={{ gap: 8 }}>
          <Text className="font-headline text-5xl font-bold tracking-tight" style={{ color: onSurface }}>
            {BOOKING_TIME_SELECTION_COPY.pageTitle}
          </Text>
          <Text className="font-body text-sm" style={{ maxWidth: 620, color: onSurfaceVariant }}>
            {BOOKING_TIME_SELECTION_COPY.pageDescription}
          </Text>
        </View>

        <View className="flex-row flex-wrap" style={{ gap: 12 }}>
          <BookingSummaryChip label={salonName} icon="storefront" tone="highlight" />
          <BookingSummaryChip label={staffName} icon="content-cut" />
        </View>
      </View>

      <View className="flex-row flex-wrap" style={{ gap: 24 }}>
        <View style={isDesktop ? { width: '38%' } : { width: '100%' }}>
          <View style={{ gap: 20 }}>
            <BookingDateSelector
              title={BOOKING_TIME_SELECTION_COPY.dateSectionTitle}
              dateOptions={dateOptions}
              selectedDateId={selectedDateId}
              onSelectDate={onSelectDate}
              onPreviousWeek={onPreviousWeek}
              onNextWeek={onNextWeek}
              previousDisabled={previousWeekDisabled}
            />

            <BookingLocationCard
              imageUri={BOOKING_LOCATION_IMAGE_URI}
              locationLabel={BOOKING_TIME_SELECTION_COPY.locationLabel}
              locationValue={salonLocation}
            />
          </View>
        </View>

        <View style={isDesktop ? { width: '59.5%' } : { width: '100%' }}>
          <BookingSurfacePanel>
            <View style={{ gap: 20 }}>
              <View className="flex-row items-start justify-between" style={{ gap: 16 }}>
                <View style={{ flex: 1, gap: 4 }}>
                  <Text className="font-headline text-2xl font-bold" style={{ color: onSurface }}>
                    {BOOKING_TIME_SELECTION_COPY.timeSectionTitle}
                  </Text>
                  {selectedDateLabel ? (
                    <Text className="font-body text-xs" style={{ color: hexToRgba(onSurfaceVariant, 0.82) }}>
                      {selectedDateLabel}
                    </Text>
                  ) : null}
                  {isLoadingSlots ? (
                    <Text className="font-body text-xs" style={{ color: hexToRgba(onSurfaceVariant, 0.82) }}>
                      Musait saatler yukleniyor.
                    </Text>
                  ) : null}
                  {!isLoadingSlots && slotErrorMessage ? (
                    <Text className="font-body text-xs" style={{ color: hexToRgba(onSurfaceVariant, 0.82) }}>
                      {slotErrorMessage}
                    </Text>
                  ) : null}
                  {!isLoadingSlots && !slotErrorMessage && timeSlots.length === 0 ? (
                    <Text className="font-body text-xs" style={{ color: hexToRgba(onSurfaceVariant, 0.82) }}>
                      Bu tarih icin uygun slot bulunamadi.
                    </Text>
                  ) : null}
                </View>

                <Text
                  className="font-label text-[10px] font-bold uppercase tracking-[2.6px]"
                  style={{ color: hexToRgba(onSurfaceVariant, 0.74) }}>
                  {BOOKING_TIME_SELECTION_COPY.timezoneLabel}
                </Text>
              </View>

              <TimeSlotGrid slots={timeSlots} selectedTimeId={selectedTimeId} onSelectTime={onSelectTime} />
            </View>
          </BookingSurfacePanel>
        </View>
      </View>
    </View>
  );
}
