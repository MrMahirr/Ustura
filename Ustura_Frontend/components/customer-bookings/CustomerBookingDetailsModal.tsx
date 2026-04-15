import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import {
  ActivityIndicator,
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';

import CustomerBookingDetailSection from '@/components/customer-bookings/CustomerBookingDetailSection';
import CustomerBookingStatusBadge from '@/components/customer-bookings/CustomerBookingStatusBadge';
import {
  CUSTOMER_BOOKINGS_COPY,
  formatCustomerBookingArea,
  formatCustomerBookingDateTime,
  formatCustomerBookingLongDate,
  formatCustomerBookingTimeRange,
  getCustomerBookingDurationMinutes,
  getCustomerBookingReferenceCode,
  getCustomerBookingStatusLabel,
  type CustomerBookingRecord,
} from '@/components/customer-bookings/presentation';
import { useThemeColor } from '@/hooks/use-theme-color';
import { hexToRgba } from '@/utils/color';

interface CustomerBookingDetailsModalProps {
  booking: CustomerBookingRecord | null;
  visible: boolean;
  isCancelling?: boolean;
  onClose: () => void;
  onCancel: (booking: CustomerBookingRecord) => void | Promise<void>;
  onRepeatBooking: () => void;
}

function HighlightChip({
  icon,
  label,
  value,
}: {
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  label: string;
  value: string;
}) {
  const primary = useThemeColor({}, 'primary');
  const onSurface = useThemeColor({}, 'onSurface');
  const onSurfaceVariant = useThemeColor({}, 'onSurfaceVariant');

  return (
    <View
      className="rounded-2xl px-4 py-3"
      style={{ minWidth: 160, gap: 8, backgroundColor: hexToRgba(primary, 0.08) }}>
      <View className="flex-row items-center" style={{ gap: 8 }}>
        <MaterialIcons name={icon} size={16} color={primary} />
        <Text className="font-label text-[10px] font-bold uppercase tracking-[2px]" style={{ color: onSurfaceVariant }}>
          {label}
        </Text>
      </View>
      <Text className="font-body text-sm font-semibold" style={{ color: onSurface }}>
        {value}
      </Text>
    </View>
  );
}

function DetailFact({
  icon,
  label,
  value,
  emphasized = false,
}: {
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  label: string;
  value: string;
  emphasized?: boolean;
}) {
  const primary = useThemeColor({}, 'primary');
  const onSurface = useThemeColor({}, 'onSurface');
  const onSurfaceVariant = useThemeColor({}, 'onSurfaceVariant');
  const outlineVariant = useThemeColor({}, 'outlineVariant');

  return (
    <View
      className="flex-row items-start"
      style={{
        gap: 14,
        paddingBottom: 14,
        marginBottom: 14,
        borderBottomWidth: 1,
        borderBottomColor: hexToRgba(outlineVariant, 0.16),
      }}>
      <View
        className="h-10 w-10 items-center justify-center rounded-[12px]"
        style={{ backgroundColor: hexToRgba(primary, 0.1) }}>
        <MaterialIcons name={icon} size={18} color={primary} />
      </View>
      <View style={{ flex: 1, gap: 4 }}>
        <Text className="font-label text-[10px] font-bold uppercase tracking-[2px]" style={{ color: onSurfaceVariant }}>
          {label}
        </Text>
        <Text
          className="font-body text-sm"
          style={{ color: emphasized ? primary : onSurface, fontWeight: emphasized ? '700' : '600' }}>
          {value}
        </Text>
      </View>
    </View>
  );
}

function FooterActionButton({
  label,
  icon,
  variant,
  disabled = false,
  loading = false,
  onPress,
}: {
  label: string;
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  variant: 'primary' | 'outline' | 'danger';
  disabled?: boolean;
  loading?: boolean;
  onPress: () => void;
}) {
  const primary = useThemeColor({}, 'primary');
  const onPrimary = useThemeColor({}, 'onPrimary');
  const error = useThemeColor({}, 'error');
  const onSurface = useThemeColor({}, 'onSurface');
  const outlineVariant = useThemeColor({}, 'outlineVariant');

  const palette =
    variant === 'primary'
      ? {
          backgroundColor: primary,
          borderColor: primary,
          textColor: onPrimary,
        }
      : variant === 'danger'
        ? {
            backgroundColor: 'transparent',
            borderColor: hexToRgba(error, 0.28),
            textColor: error,
          }
        : {
            backgroundColor: 'transparent',
            borderColor: hexToRgba(outlineVariant, 0.28),
            textColor: onSurface,
          };

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      onPress={onPress}
      style={({ hovered, pressed }) => [
        {
          minHeight: 52,
          minWidth: 160,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          borderRadius: 14,
          borderWidth: 1,
          paddingHorizontal: 18,
          paddingVertical: 14,
          backgroundColor:
            variant === 'primary'
              ? hovered || pressed
                ? hexToRgba(primary, 0.92)
                : palette.backgroundColor
              : hovered || pressed
                ? hexToRgba(palette.textColor, 0.08)
                : palette.backgroundColor,
          borderColor: palette.borderColor,
          opacity: disabled || loading ? 0.6 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
        Platform.OS === 'web'
          ? ({ transition: 'background-color 180ms ease, transform 160ms ease', cursor: 'pointer' } as any)
          : null,
      ]}>
      {loading ? (
        <ActivityIndicator size="small" color={palette.textColor} />
      ) : (
        <MaterialIcons name={icon} size={18} color={palette.textColor} />
      )}
      <Text className="font-label text-[11px] font-bold uppercase tracking-[2px]" style={{ color: palette.textColor }}>
        {label}
      </Text>
    </Pressable>
  );
}

function isUpcomingStatus(status: CustomerBookingRecord['status']) {
  return status === 'pending' || status === 'confirmed';
}

export default function CustomerBookingDetailsModal({
  booking,
  visible,
  isCancelling = false,
  onClose,
  onCancel,
  onRepeatBooking,
}: CustomerBookingDetailsModalProps) {
  const { width, height } = useWindowDimensions();
  const surface = useThemeColor({}, 'surface');
  const surfaceContainerLow = useThemeColor({}, 'surfaceContainerLow');
  const onSurface = useThemeColor({}, 'onSurface');
  const onSurfaceVariant = useThemeColor({}, 'onSurfaceVariant');
  const outlineVariant = useThemeColor({}, 'outlineVariant');
  const primary = useThemeColor({}, 'primary');

  if (!booking) {
    return null;
  }

  const isMobile = width < 768;
  const modalWidth = isMobile ? width - 16 : Math.min(1080, width - 56);
  const modalMaxHeight = Math.min(height - 24, 880);
  const durationMinutes = getCustomerBookingDurationMinutes(booking.startsAt, booking.endsAt);
  const areaLabel = formatCustomerBookingArea(booking.city, booking.district);
  const canCancel = isUpcomingStatus(booking.status);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      <Pressable
        className="flex-1 items-center justify-center px-2 py-3"
        onPress={onClose}
        style={{ backgroundColor: 'rgba(10, 10, 14, 0.62)' }}>
        <Pressable
          onPress={(event) => event.stopPropagation()}
          style={[
            {
              width: modalWidth,
              maxHeight: modalMaxHeight,
              overflow: 'hidden',
              borderRadius: 30,
              borderWidth: 1,
              backgroundColor: surface,
              borderColor: hexToRgba(outlineVariant, 0.22),
            },
            Platform.OS === 'web'
              ? ({ boxShadow: '0 30px 90px rgba(0, 0, 0, 0.28)' } as any)
              : {
                  shadowColor: '#000',
                  shadowOpacity: 0.28,
                  shadowRadius: 28,
                  shadowOffset: { width: 0, height: 12 },
                  elevation: 16,
                },
          ]}>
          <View
            className="flex-row items-center justify-between border-b px-5 py-4"
            style={{ borderBottomColor: hexToRgba(outlineVariant, 0.16) }}>
            <View style={{ flex: 1, gap: 4 }}>
              <Text className="font-label text-[10px] font-bold uppercase tracking-[3px]" style={{ color: primary }}>
                {CUSTOMER_BOOKINGS_COPY.detailModalTitle}
              </Text>
              <Text className="font-body text-sm" style={{ color: onSurfaceVariant }}>
                {CUSTOMER_BOOKINGS_COPY.detailModalDescription}
              </Text>
            </View>

            <Pressable
              accessibilityRole="button"
              onPress={onClose}
              style={({ hovered, pressed }) => [
                {
                  height: 42,
                  width: 42,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 14,
                  backgroundColor: hovered || pressed ? hexToRgba(onSurfaceVariant, 0.1) : 'transparent',
                },
                Platform.OS === 'web'
                  ? ({ transition: 'background-color 180ms ease', cursor: 'pointer' } as any)
                  : null,
              ]}>
              <MaterialIcons name="close" size={20} color={onSurfaceVariant} />
            </Pressable>
          </View>

          <ScrollView
            className="flex-1"
            contentContainerStyle={{ padding: isMobile ? 16 : 24, gap: 20 }}
            showsVerticalScrollIndicator={false}>
            <View
              className="overflow-hidden rounded-[28px] border"
              style={{
                backgroundColor: surfaceContainerLow,
                borderColor: hexToRgba(outlineVariant, 0.18),
              }}>
              <View
                className="absolute inset-x-0 top-0"
                style={{ height: 120, backgroundColor: hexToRgba(primary, 0.08) }}
              />

              <View
                className="flex-row flex-wrap"
                style={{ gap: 24, padding: isMobile ? 18 : 24 }}>
                <View
                  style={{
                    width: isMobile ? '100%' : 320,
                    height: isMobile ? 220 : 280,
                    overflow: 'hidden',
                    borderRadius: 22,
                  }}>
                  <Image source={{ uri: booking.imageUri }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                </View>

                <View style={{ flex: 1, minWidth: 280, gap: 18 }}>
                  <View className="flex-row flex-wrap items-start justify-between" style={{ gap: 16 }}>
                    <View style={{ flex: 1, gap: 8 }}>
                      <Text className="font-headline text-[34px] font-bold tracking-tight" style={{ color: onSurface }}>
                        {booking.salonName}
                      </Text>
                      <Text className="font-body text-base" style={{ color: hexToRgba(onSurfaceVariant, 0.82) }}>
                        {booking.address}
                      </Text>
                    </View>

                    <CustomerBookingStatusBadge status={booking.status} />
                  </View>

                  <Text className="font-body text-sm leading-6" style={{ maxWidth: 520, color: onSurfaceVariant }}>
                    {formatCustomerBookingLongDate(booking.startsAt)} gunundeki randevunun salon, konum ve hizmet ozetine
                    buradan ulasabilirsin.
                  </Text>

                  <View className="flex-row flex-wrap" style={{ gap: 12 }}>
                    <HighlightChip icon="content-cut" label="Berber" value={booking.barberName} />
                    <HighlightChip icon="place" label="Bolge" value={areaLabel} />
                    <HighlightChip icon="schedule" label="Sure" value={`${durationMinutes} dk`} />
                  </View>

                  <View
                    className="rounded-[22px] border px-4 py-4"
                    style={{
                      gap: 10,
                      backgroundColor: hexToRgba(primary, 0.06),
                      borderColor: hexToRgba(primary, 0.14),
                    }}>
                    <Text className="font-label text-[10px] font-bold uppercase tracking-[3px]" style={{ color: primary }}>
                      Randevu Ozeti
                    </Text>
                    <Text className="font-headline text-2xl font-bold" style={{ color: onSurface }}>
                      {formatCustomerBookingDateTime(booking.startsAt)}
                    </Text>
                    <Text className="font-body text-sm" style={{ color: onSurfaceVariant }}>
                      {booking.serviceName} hizmeti icin {booking.barberName} ile planlandi.
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View className="flex-row flex-wrap" style={{ gap: 16 }}>
              <View style={{ width: isMobile ? '100%' : undefined, flex: isMobile ? undefined : 1, minWidth: isMobile ? undefined : 280 }}>
                <CustomerBookingDetailSection
                  icon="storefront"
                  title={CUSTOMER_BOOKINGS_COPY.detailSalonSectionTitle}
                  subtitle="Salon kimligi ve hizmet kapsami">
                  <DetailFact icon="badge" label="Salon Adi" value={booking.salonName} emphasized />
                  <DetailFact icon="content-cut" label="Berber" value={booking.barberName} />
                  <DetailFact icon="spa" label="Hizmet" value={booking.serviceName} />
                </CustomerBookingDetailSection>
              </View>

              <View style={{ width: isMobile ? '100%' : undefined, flex: isMobile ? undefined : 1, minWidth: isMobile ? undefined : 280 }}>
                <CustomerBookingDetailSection
                  icon="place"
                  title={CUSTOMER_BOOKINGS_COPY.detailLocationSectionTitle}
                  subtitle="Salona ulasim icin gereken bilgiler">
                  <DetailFact icon="pin-drop" label="Acik Adres" value={booking.address} emphasized />
                  <DetailFact icon="map" label="Ilce ve Sehir" value={areaLabel} />
                  <View
                    className="rounded-2xl px-4 py-4"
                    style={{ backgroundColor: hexToRgba(primary, 0.06) }}>
                    <Text className="font-body text-sm leading-6" style={{ color: onSurfaceVariant }}>
                      {CUSTOMER_BOOKINGS_COPY.detailLocationHint}
                    </Text>
                  </View>
                </CustomerBookingDetailSection>
              </View>
            </View>

            <CustomerBookingDetailSection
              icon="event-note"
              title={CUSTOMER_BOOKINGS_COPY.detailAppointmentSectionTitle}
              subtitle="Rezervasyon zamani ve kayit bilgileri">
              <View className="flex-row flex-wrap" style={{ gap: 16 }}>
                <View style={{ flex: 1, minWidth: isMobile ? '100%' : 220 }}>
                  <DetailFact icon="calendar-today" label="Tarih" value={formatCustomerBookingLongDate(booking.startsAt)} emphasized />
                </View>
                <View style={{ flex: 1, minWidth: isMobile ? '100%' : 220 }}>
                  <DetailFact icon="access-time" label="Saat Araligi" value={formatCustomerBookingTimeRange(booking.startsAt, booking.endsAt)} />
                </View>
                <View style={{ flex: 1, minWidth: isMobile ? '100%' : 220 }}>
                  <DetailFact icon="timelapse" label="Toplam Sure" value={`${durationMinutes} dakika`} />
                </View>
                <View style={{ flex: 1, minWidth: isMobile ? '100%' : 220 }}>
                  <DetailFact icon="confirmation-number" label="Rezervasyon Kodu" value={getCustomerBookingReferenceCode(booking.id)} />
                </View>
              </View>

              <View className="flex-row flex-wrap" style={{ gap: 16 }}>
                <View style={{ flex: 1, minWidth: isMobile ? '100%' : 220 }}>
                  <DetailFact icon="schedule" label="Olusturulma" value={formatCustomerBookingDateTime(booking.bookedAt)} />
                </View>
                <View style={{ flex: 1, minWidth: isMobile ? '100%' : 220 }}>
                  <DetailFact icon="info-outline" label="Durum" value={getCustomerBookingStatusLabel(booking.status)} />
                </View>
              </View>
            </CustomerBookingDetailSection>
          </ScrollView>

          <View
            className="flex-row flex-wrap items-center justify-end border-t px-5 py-4"
            style={{ gap: 12, borderTopColor: hexToRgba(outlineVariant, 0.16) }}>
            <FooterActionButton
              label={CUSTOMER_BOOKINGS_COPY.detailCloseLabel}
              icon="close"
              variant="outline"
              onPress={onClose}
            />

            <FooterActionButton
              label={CUSTOMER_BOOKINGS_COPY.addBookingLabel}
              icon="add"
              variant="primary"
              onPress={onRepeatBooking}
            />

            {canCancel ? (
              <FooterActionButton
                label={CUSTOMER_BOOKINGS_COPY.cancelLabel}
                icon="cancel"
                variant="danger"
                loading={isCancelling}
                onPress={() => {
                  void onCancel(booking);
                }}
              />
            ) : null}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
