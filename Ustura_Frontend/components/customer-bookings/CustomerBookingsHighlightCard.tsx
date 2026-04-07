import React from 'react';
import { Image, Platform, Pressable, Text, View } from 'react-native';

import CustomerBookingStatusBadge from '@/components/customer-bookings/CustomerBookingStatusBadge';
import {
  CUSTOMER_BOOKINGS_COPY,
  formatCustomerBookingDate,
  formatCustomerBookingTime,
  type CustomerBookingRecord,
} from '@/components/customer-bookings/presentation';
import { useAppTheme } from '@/contexts/ThemeContext';
import { useThemeColor } from '@/hooks/use-theme-color';
import { hexToRgba } from '@/utils/color';

interface CustomerBookingsHighlightCardProps {
  booking: CustomerBookingRecord | null;
  onViewDetails: (booking: CustomerBookingRecord) => void;
  onCancel: (booking: CustomerBookingRecord) => void;
}

function DetailBlock({
  label,
  value,
  highlighted = false,
}: {
  label: string;
  value: string;
  highlighted?: boolean;
}) {
  const primary = useThemeColor({}, 'primary');
  const onSurface = useThemeColor({}, 'onSurface');
  const onSurfaceVariant = useThemeColor({}, 'onSurfaceVariant');

  return (
    <View style={{ gap: 2 }}>
      <Text className="font-label text-[9px] font-bold uppercase tracking-[2px]" style={{ color: onSurfaceVariant }}>
        {label}
      </Text>
      <Text className="font-body text-sm font-semibold" style={{ color: highlighted ? primary : onSurface }}>
        {value}
      </Text>
    </View>
  );
}

export default function CustomerBookingsHighlightCard({
  booking,
  onViewDetails,
  onCancel,
}: CustomerBookingsHighlightCardProps) {
  const { theme } = useAppTheme();
  const primary = useThemeColor({}, 'primary');
  const error = useThemeColor({}, 'error');
  const surfaceContainerLow = useThemeColor({}, 'surfaceContainerLow');
  const surfaceContainerLowest = useThemeColor({}, 'surfaceContainerLowest');
  const onSurface = useThemeColor({}, 'onSurface');
  const onSurfaceVariant = useThemeColor({}, 'onSurfaceVariant');
  const outlineVariant = useThemeColor({}, 'outlineVariant');

  if (booking == null) {
    return null;
  }

  return (
    <View style={{ gap: 14 }}>
      <Text className="font-label text-[10px] font-bold uppercase tracking-[3px]" style={{ color: primary }}>
        {CUSTOMER_BOOKINGS_COPY.nextBookingLabel}
      </Text>

      <View style={{ position: 'relative' }}>
        <View
          pointerEvents="none"
          className="absolute inset-0 rounded-[26px]"
          style={{
            backgroundColor: hexToRgba(primary, theme === 'light' ? 0.08 : 0.06),
            transform: [{ scale: 1.02 }],
            ...(Platform.OS === 'web' ? ({ filter: 'blur(24px)' } as any) : {}),
          }}
        />

        <View
          className="rounded-[26px] border-l-4"
          style={[
            {
              overflow: 'hidden',
              borderLeftColor: primary,
              backgroundColor: theme === 'light' ? surfaceContainerLowest : surfaceContainerLow,
              borderColor: hexToRgba(outlineVariant, theme === 'light' ? 0.28 : 0.14),
            },
            Platform.OS === 'web'
              ? ({
                  boxShadow:
                    theme === 'light'
                      ? '0 24px 48px rgba(27, 27, 32, 0.08)'
                      : '0 24px 48px rgba(0, 0, 0, 0.24)',
                } as any)
              : {
                  shadowColor: theme === 'light' ? '#1B1B20' : '#000000',
                  shadowOpacity: theme === 'light' ? 0.08 : 0.18,
                  shadowRadius: 22,
                  shadowOffset: { width: 0, height: 10 },
                  elevation: 8,
                },
          ]}>
          <View
            className="flex-row flex-wrap"
            style={{ gap: 24, padding: 24 }}>
            <View
              style={{
                width: '100%',
                maxWidth: 264,
                height: 240,
                overflow: 'hidden',
                borderRadius: 16,
              }}>
              <Image source={{ uri: booking.imageUri }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
            </View>

            <View style={{ flex: 1, minWidth: 280, gap: 16 }}>
              <View className="flex-row flex-wrap items-start justify-between" style={{ gap: 16 }}>
                <View style={{ flex: 1, gap: 6 }}>
                  <Text className="font-headline text-[30px] font-bold tracking-tight" style={{ color: onSurface }}>
                    {booking.salonName}
                  </Text>
                  <Text className="font-body text-sm" style={{ color: onSurfaceVariant }}>
                    {booking.address}
                  </Text>
                </View>

                <CustomerBookingStatusBadge status={booking.status} />
              </View>

              <View
                className="flex-row flex-wrap border-y"
                style={{
                  gap: 16,
                  paddingVertical: 16,
                  borderTopColor: hexToRgba(outlineVariant, 0.16),
                  borderBottomColor: hexToRgba(outlineVariant, 0.16),
                }}>
                <View style={{ width: '22%', minWidth: 120 }}>
                  <DetailBlock label="Berber" value={booking.barberName} />
                </View>
                <View style={{ width: '22%', minWidth: 120 }}>
                  <DetailBlock label="Hizmet" value={booking.serviceName} />
                </View>
                <View style={{ width: '22%', minWidth: 120 }}>
                  <DetailBlock label="Tarih" value={formatCustomerBookingDate(booking.startsAt)} highlighted />
                </View>
                <View style={{ width: '22%', minWidth: 120 }}>
                  <DetailBlock label="Saat" value={formatCustomerBookingTime(booking.startsAt)} highlighted />
                </View>
              </View>

              <View className="flex-row flex-wrap" style={{ gap: 12 }}>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => onViewDetails(booking)}
                  style={({ hovered, pressed }) => [
                    {
                      borderRadius: 10,
                      borderWidth: 1,
                      paddingHorizontal: 20,
                      paddingVertical: 12,
                      backgroundColor: hovered || pressed ? hexToRgba(outlineVariant, 0.16) : 'transparent',
                      borderColor: hexToRgba(outlineVariant, 0.24),
                      transform: [{ scale: pressed ? 0.98 : 1 }],
                    },
                    Platform.OS === 'web'
                      ? ({ transition: 'background-color 180ms ease, border-color 180ms ease, transform 160ms ease' } as any)
                      : null,
                  ]}>
                  <Text className="font-label text-[10px] font-bold uppercase tracking-[2px]" style={{ color: onSurface }}>
                    {CUSTOMER_BOOKINGS_COPY.detailLabel}
                  </Text>
                </Pressable>

                <Pressable
                  accessibilityRole="button"
                  onPress={() => onCancel(booking)}
                  style={({ hovered, pressed }) => [
                    {
                      borderRadius: 10,
                      borderWidth: 1,
                      paddingHorizontal: 20,
                      paddingVertical: 12,
                      backgroundColor: hovered || pressed ? hexToRgba(error, 0.12) : 'transparent',
                      borderColor: hexToRgba(error, 0.24),
                      transform: [{ scale: pressed ? 0.98 : 1 }],
                    },
                    Platform.OS === 'web'
                      ? ({ transition: 'background-color 180ms ease, border-color 180ms ease, transform 160ms ease' } as any)
                      : null,
                  ]}>
                  <Text className="font-label text-[10px] font-bold uppercase tracking-[2px]" style={{ color: error }}>
                    {CUSTOMER_BOOKINGS_COPY.cancelLabel}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
