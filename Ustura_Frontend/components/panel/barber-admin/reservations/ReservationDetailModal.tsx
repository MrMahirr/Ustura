import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import {
  ActivityIndicator,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';

import { useBarberAdminTheme } from '@/components/panel/barber-admin/theme';
import type { OperationalReservationStatus } from '@/services/reservation.service';
import { hexToRgba } from '@/utils/color';

import { getReservationStatusColor } from './presentation';
import type { ReservationListItem } from './types';

interface Props {
  reservation: ReservationListItem | null;
  visible: boolean;
  mutating: boolean;
  onClose: () => void;
  onUpdateStatus: (reservationId: string, status: OperationalReservationStatus) => void;
  onCancel: (reservationId: string) => void;
}

interface ActionButton {
  label: string;
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  status?: OperationalReservationStatus;
  isCancel?: boolean;
  color: string;
  bg: string;
}

function getAvailableActions(
  status: string,
  theme: ReturnType<typeof useBarberAdminTheme>,
): ActionButton[] {
  const actions: ActionButton[] = [];

  if (status === 'pending') {
    actions.push({
      label: 'Onayla',
      icon: 'check-circle',
      status: 'confirmed',
      color: '#fff',
      bg: theme.success,
    });
    actions.push({
      label: 'İptal Et',
      icon: 'cancel',
      isCancel: true,
      color: '#fff',
      bg: theme.error,
    });
  }

  if (status === 'confirmed') {
    actions.push({
      label: 'Tamamlandı',
      icon: 'done-all',
      status: 'completed',
      color: '#fff',
      bg: theme.success,
    });
    actions.push({
      label: 'Gelmedi',
      icon: 'person-off',
      status: 'no_show',
      color: '#fff',
      bg: theme.warning,
    });
    actions.push({
      label: 'İptal Et',
      icon: 'cancel',
      isCancel: true,
      color: '#fff',
      bg: theme.error,
    });
  }

  return actions;
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  label: string;
  value: string;
}) {
  const theme = useBarberAdminTheme();
  return (
    <View className="flex-row items-start gap-3 py-3">
      <View
        className="h-9 w-9 items-center justify-center rounded-lg"
        style={{ backgroundColor: hexToRgba(theme.primary, 0.08) }}>
        <MaterialIcons name={icon} size={18} color={theme.primary} />
      </View>
      <View className="min-w-0 flex-1 gap-0.5">
        <Text
          style={{
            color: hexToRgba(theme.onSurfaceVariant, 0.6),
            fontFamily: 'Manrope-Bold',
            fontSize: 10,
            textTransform: 'uppercase',
            letterSpacing: 1.4,
          }}>
          {label}
        </Text>
        <Text
          style={{
            color: theme.onSurface,
            fontFamily: 'Manrope-SemiBold',
            fontSize: 14,
          }}>
          {value}
        </Text>
      </View>
    </View>
  );
}

export default function ReservationDetailModal({
  reservation,
  visible,
  mutating,
  onClose,
  onUpdateStatus,
  onCancel,
}: Props) {
  const { width } = useWindowDimensions();
  const theme = useBarberAdminTheme();

  if (!reservation) return null;

  const statusPalette = getReservationStatusColor(reservation.status, theme);
  const actions = getAvailableActions(reservation.status, theme);
  const isMobile = width < 640;
  const modalWidth = isMobile ? width - 32 : Math.min(520, width - 64);

  const handleAction = (action: ActionButton) => {
    if (action.isCancel) {
      onCancel(reservation.id);
    } else if (action.status) {
      onUpdateStatus(reservation.id, action.status);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent>
      <Pressable
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        onPress={onClose}>
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={[
            {
              width: modalWidth,
              maxHeight: '90%',
              backgroundColor: theme.cardBackground,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: theme.borderSubtle,
              overflow: 'hidden',
            },
            Platform.OS === 'web'
              ? ({
                  boxShadow: '0 24px 48px rgba(0,0,0,0.18)',
                } as any)
              : {
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 12 },
                  shadowOpacity: 0.2,
                  shadowRadius: 24,
                  elevation: 12,
                },
          ]}>
          {/* Header */}
          <View
            className="flex-row items-center justify-between border-b px-5 py-4"
            style={{ borderBottomColor: theme.borderSubtle }}>
            <View className="flex-row items-center gap-3">
              <View
                className="h-10 w-10 items-center justify-center rounded-full"
                style={{ backgroundColor: statusPalette.bg }}>
                <MaterialIcons name="event-note" size={20} color={statusPalette.color} />
              </View>
              <View>
                <Text
                  style={{
                    color: theme.onSurface,
                    fontFamily: 'Manrope-Bold',
                    fontSize: 16,
                  }}>
                  Randevu Detayı
                </Text>
                <View
                  className="mt-1 self-start rounded-full border px-2 py-0.5"
                  style={{
                    backgroundColor: statusPalette.bg,
                    borderColor: statusPalette.border,
                  }}>
                  <Text
                    style={{
                      color: statusPalette.color,
                      fontFamily: 'Manrope-Bold',
                      fontSize: 9,
                      textTransform: 'uppercase',
                      letterSpacing: 1,
                    }}>
                    {reservation.statusLabel}
                  </Text>
                </View>
              </View>
            </View>

            <Pressable
              onPress={onClose}
              className="h-9 w-9 items-center justify-center rounded-full"
              style={({ hovered }) => [
                {
                  backgroundColor: hovered
                    ? hexToRgba(theme.onSurfaceVariant, 0.1)
                    : 'transparent',
                },
                Platform.OS === 'web'
                  ? ({ transition: 'background-color 160ms ease', cursor: 'pointer' } as any)
                  : null,
              ]}>
              <MaterialIcons name="close" size={20} color={theme.onSurfaceVariant} />
            </Pressable>
          </View>

          {/* Body */}
          <ScrollView
            contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 16 }}
            showsVerticalScrollIndicator={false}>
            <InfoRow icon="person" label="Müşteri" value={reservation.customerName} />

            <View style={{ height: 1, backgroundColor: theme.borderSubtle }} />
            <InfoRow icon="content-cut" label="Personel" value={reservation.staffName} />

            <View style={{ height: 1, backgroundColor: theme.borderSubtle }} />
            <InfoRow icon="calendar-today" label="Tarih" value={reservation.date} />

            <View style={{ height: 1, backgroundColor: theme.borderSubtle }} />
            <InfoRow
              icon="access-time"
              label="Saat"
              value={`${reservation.time} – ${reservation.endTime} (${reservation.durationMinutes} dk)`}
            />

            {reservation.notes ? (
              <>
                <View style={{ height: 1, backgroundColor: theme.borderSubtle }} />
                <InfoRow icon="notes" label="Not" value={reservation.notes} />
              </>
            ) : null}

            <View style={{ height: 1, backgroundColor: theme.borderSubtle }} />
            <InfoRow icon="schedule" label="Oluşturulma" value={reservation.createdAtLabel} />
          </ScrollView>

          {/* Actions */}
          {actions.length > 0 ? (
            <View
              className="border-t px-5 py-4"
              style={{ borderTopColor: theme.borderSubtle }}>
              <Text
                style={{
                  color: hexToRgba(theme.onSurfaceVariant, 0.6),
                  fontFamily: 'Manrope-Bold',
                  fontSize: 10,
                  textTransform: 'uppercase',
                  letterSpacing: 1.6,
                  marginBottom: 12,
                }}>
                İşlemler
              </Text>
              <View
                style={{
                  flexDirection: isMobile ? 'column' : 'row',
                  gap: 10,
                }}>
                {actions.map((action) => (
                  <Pressable
                    key={action.label}
                    onPress={() => handleAction(action)}
                    disabled={mutating}
                    className="min-h-[44px] flex-row items-center justify-center gap-2 rounded-lg px-5 py-3"
                    style={({ hovered }) => [
                      {
                        backgroundColor: action.bg,
                        opacity: mutating ? 0.6 : hovered ? 0.9 : 1,
                        flex: isMobile ? undefined : 1,
                      },
                      Platform.OS === 'web'
                        ? ({
                            transition: 'opacity 160ms ease, transform 160ms ease',
                            cursor: mutating ? 'wait' : 'pointer',
                          } as any)
                        : null,
                    ]}>
                    {mutating ? (
                      <ActivityIndicator size="small" color={action.color} />
                    ) : (
                      <MaterialIcons name={action.icon} size={18} color={action.color} />
                    )}
                    <Text
                      style={{
                        color: action.color,
                        fontFamily: 'Manrope-Bold',
                        fontSize: 13,
                      }}>
                      {action.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          ) : (
            <View
              className="items-center border-t px-5 py-4"
              style={{ borderTopColor: theme.borderSubtle }}>
              <View className="flex-row items-center gap-2">
                <MaterialIcons
                  name="info-outline"
                  size={16}
                  color={hexToRgba(theme.onSurfaceVariant, 0.5)}
                />
                <Text
                  style={{
                    color: hexToRgba(theme.onSurfaceVariant, 0.5),
                    fontFamily: 'Manrope-SemiBold',
                    fontSize: 12,
                  }}>
                  Bu randevu için yapılabilecek işlem bulunmuyor.
                </Text>
              </View>
            </View>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}
