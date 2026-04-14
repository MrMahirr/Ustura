import React from 'react';
import { Image, Platform, Pressable, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import CustomerBookingStatusBadge from '@/components/customer-bookings/CustomerBookingStatusBadge';
import {
  CUSTOMER_BOOKINGS_COPY,
  formatCustomerBookingDateTime,
  type CustomerBookingRecord,
} from '@/components/customer-bookings/presentation';
import { useAppTheme } from '@/contexts/ThemeContext';
import { useThemeColor } from '@/hooks/use-theme-color';
import { hexToRgba } from '@/utils/color';

interface CustomerBookingsListItemProps {
  booking: CustomerBookingRecord;
  onViewDetails: (booking: CustomerBookingRecord) => void;
  onCancel: (booking: CustomerBookingRecord) => void;
  onRepeatBooking: () => void;
}

export default function CustomerBookingsListItem({
  booking,
  onViewDetails,
  onCancel,
  onRepeatBooking,
}: CustomerBookingsListItemProps) {
  const { theme } = useAppTheme();
  const primary = useThemeColor({}, 'primary');
  const surfaceContainerLow = useThemeColor({}, 'surfaceContainerLow');
  const surfaceContainerHigh = useThemeColor({}, 'surfaceContainerHigh');
  const onSurface = useThemeColor({}, 'onSurface');
  const onSurfaceVariant = useThemeColor({}, 'onSurfaceVariant');
  const outlineVariant = useThemeColor({}, 'outlineVariant');
  const error = useThemeColor({}, 'error');

  const isUpcoming = booking.status === 'pending' || booking.status === 'confirmed';
  const isCompleted = booking.status === 'completed' || booking.status === 'no_show';

  return (
    <View
      className="rounded-[22px] border p-5"
      style={[
        {
          backgroundColor: isCompleted && theme === 'light' ? hexToRgba(surfaceContainerLow, 0.66) : surfaceContainerLow,
          borderColor: hexToRgba(outlineVariant, theme === 'light' ? 0.24 : 0.14),
          opacity: isCompleted ? 0.88 : 1,
        },
        Platform.OS === 'web'
          ? ({
              transition: 'background-color 220ms ease, border-color 220ms ease, opacity 220ms ease',
            } as any)
          : null,
      ]}>
      <View className="flex-row flex-wrap items-center" style={{ gap: 18 }}>
        <View style={{ width: 80, height: 80, overflow: 'hidden', borderRadius: 14 }}>
          <Image source={{ uri: booking.imageUri }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
        </View>

        <View className="flex-row flex-wrap items-center" style={{ flex: 1, minWidth: 280, gap: 18 }}>
          <View style={{ flex: 1, minWidth: 180, gap: 3 }}>
            <Text className="font-headline text-xl font-bold" style={{ color: onSurface }}>
              {booking.salonName}
            </Text>
            <Text className="font-body text-xs" style={{ color: hexToRgba(onSurfaceVariant, 0.78) }}>
              {booking.address}
            </Text>
          </View>

          <View style={{ minWidth: 100, gap: 2 }}>
            <Text className="font-label text-[9px] font-bold uppercase tracking-[2px]" style={{ color: onSurfaceVariant }}>
              Berber
            </Text>
            <Text className="font-body text-sm font-semibold" style={{ color: onSurface }}>
              {booking.barberName}
            </Text>
          </View>

          <View style={{ minWidth: 120, gap: 2 }}>
            <Text className="font-label text-[9px] font-bold uppercase tracking-[2px]" style={{ color: primary }}>
              Tarih & Saat
            </Text>
            <Text className="font-body text-sm font-semibold" style={{ color: onSurface }}>
              {formatCustomerBookingDateTime(booking.startsAt)}
            </Text>
          </View>

          <View style={{ minWidth: 120, gap: 2 }}>
            <Text className="font-label text-[9px] font-bold uppercase tracking-[2px]" style={{ color: onSurfaceVariant }}>
              Hizmet
            </Text>
            <Text className="font-body text-sm" style={{ color: onSurface }}>
              {booking.serviceName}
            </Text>
          </View>

          <CustomerBookingStatusBadge status={booking.status} />
        </View>

        <View className="flex-row items-center" style={{ gap: 10 }}>
          {isUpcoming ? (
            <>
              <Pressable
                accessibilityRole="button"
                onPress={() => onViewDetails(booking)}
                style={({ hovered, pressed }) => [
                  {
                    width: 38,
                    height: 38,
                    borderRadius: 12,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: hovered || pressed ? surfaceContainerHigh : 'transparent',
                    transform: [{ scale: pressed ? 0.95 : 1 }],
                  },
                  Platform.OS === 'web'
                    ? ({ transition: 'background-color 180ms ease, transform 160ms ease' } as any)
                    : null,
                ]}>
                <MaterialIcons name="info-outline" size={20} color={onSurfaceVariant} />
              </Pressable>

              <Pressable
                accessibilityRole="button"
                onPress={() => onCancel(booking)}
                style={({ hovered, pressed }) => [
                  {
                    width: 38,
                    height: 38,
                    borderRadius: 12,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: hovered || pressed ? hexToRgba(error, 0.12) : 'transparent',
                    transform: [{ scale: pressed ? 0.95 : 1 }],
                  },
                  Platform.OS === 'web'
                    ? ({ transition: 'background-color 180ms ease, transform 160ms ease' } as any)
                    : null,
                ]}>
                <MaterialIcons name="close" size={20} color={error} />
              </Pressable>
            </>
          ) : (
            <Pressable
              accessibilityRole="button"
              onPress={onRepeatBooking}
              style={({ hovered, pressed }) => [
                {
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  backgroundColor: hovered || pressed ? hexToRgba(primary, 0.14) : surfaceContainerHigh,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                },
                Platform.OS === 'web'
                  ? ({ transition: 'background-color 180ms ease, transform 160ms ease' } as any)
                  : null,
              ]}>
              <MaterialIcons name="history" size={16} color={primary} />
              <Text className="font-label text-[10px] font-bold uppercase tracking-[2px]" style={{ color: onSurface }}>
                {CUSTOMER_BOOKINGS_COPY.repeatLabel}
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}
