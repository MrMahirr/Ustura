import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Platform, Pressable, Text, View } from 'react-native';

import type { UserProfileAppointment } from '@/components/panel/super-admin/user-profile/data';
import { getUserProfilePanelShadow, userProfileClassNames } from '@/components/panel/super-admin/user-profile/presentation';
import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { hexToRgba } from '@/utils/color';

function AppointmentStatusPill({ appointment }: { appointment: UserProfileAppointment }) {
  const adminTheme = useSuperAdminTheme();
  const isActive = appointment.statusTone === 'primary';

  return (
    <View
      className="self-start min-h-6 items-center justify-center rounded-sm border px-2.5 py-[5px]"
      style={{
        backgroundColor: isActive ? hexToRgba(adminTheme.primary, 0.16) : hexToRgba(adminTheme.success, 0.14),
        borderColor: isActive ? hexToRgba(adminTheme.primary, 0.2) : hexToRgba(adminTheme.success, 0.2),
      }}>
      <Text className={userProfileClassNames.statusText} style={{ color: isActive ? adminTheme.primary : adminTheme.success, fontFamily: 'Manrope-Bold' }}>
        {appointment.statusLabel}
      </Text>
    </View>
  );
}

const customerCellStyle = { flex: 1.35, paddingRight: 12 } as const;
const serviceCellStyle = { flex: 1.5, paddingRight: 12 } as const;
const dateCellStyle = { flex: 1.2, paddingRight: 12 } as const;
const statusCellStyle = { flex: 0.9, paddingRight: 12 } as const;
const actionsCellStyle = { width: 56, alignItems: 'flex-end' as const } as const;

export default function UserAppointmentsSection({
  appointments,
  useDesktopTable,
}: {
  appointments: UserProfileAppointment[];
  useDesktopTable: boolean;
}) {
  const adminTheme = useSuperAdminTheme();

  return (
    <View
      className={userProfileClassNames.panelCard}
      style={[
        {
          backgroundColor: adminTheme.cardBackground,
        },
        getUserProfilePanelShadow(adminTheme.theme),
      ]}>
      <Text className={userProfileClassNames.panelTitle} style={{ color: adminTheme.onSurface }}>
        Recent Appointments
      </Text>

      {useDesktopTable ? (
        <View className="gap-2">
          <View className="min-h-[42px] flex-row items-center border-b" style={{ borderBottomColor: hexToRgba(adminTheme.outlineVariant, 0.2) }}>
            <Text className={userProfileClassNames.labelText} style={[customerCellStyle, { color: adminTheme.onSurfaceVariant, fontFamily: 'Manrope-Bold' }]}>
              Customer
            </Text>
            <Text className={userProfileClassNames.labelText} style={[serviceCellStyle, { color: adminTheme.onSurfaceVariant, fontFamily: 'Manrope-Bold' }]}>
              Service
            </Text>
            <Text className={userProfileClassNames.labelText} style={[dateCellStyle, { color: adminTheme.onSurfaceVariant, fontFamily: 'Manrope-Bold' }]}>
              Date & Time
            </Text>
            <Text className={userProfileClassNames.labelText} style={[statusCellStyle, { color: adminTheme.onSurfaceVariant, fontFamily: 'Manrope-Bold' }]}>
              Status
            </Text>
            <Text
              className={userProfileClassNames.labelText}
              style={[actionsCellStyle, { color: adminTheme.onSurfaceVariant, textAlign: 'right', fontFamily: 'Manrope-Bold' }]}>
              Actions
            </Text>
          </View>

          {appointments.map((appointment) => (
            <View
              key={appointment.id}
              className="min-h-14 flex-row items-center border-b"
              style={[
                { borderBottomColor: hexToRgba(adminTheme.outlineVariant, 0.1) },
                Platform.OS === 'web'
                  ? ({ transition: 'transform 180ms ease, background-color 180ms ease, border-color 180ms ease, box-shadow 220ms ease, opacity 180ms ease' } as any)
                  : null,
              ]}>
              <View className="min-w-0 justify-center py-[14px]" style={customerCellStyle}>
                <Text className={userProfileClassNames.primaryText} style={{ color: adminTheme.onSurface, fontFamily: 'Manrope-SemiBold' }}>
                  {appointment.customerName}
                </Text>
              </View>
              <View className="min-w-0 justify-center py-[14px]" style={serviceCellStyle}>
                <Text className={userProfileClassNames.secondaryText} style={{ color: adminTheme.onSurfaceVariant }}>
                  {appointment.serviceName}
                </Text>
              </View>
              <View className="min-w-0 justify-center py-[14px]" style={dateCellStyle}>
                <Text className={userProfileClassNames.secondaryText} style={{ color: adminTheme.onSurface }}>
                  {appointment.dateTimeLabel}
                </Text>
              </View>
              <View className="min-w-0 justify-center py-[14px]" style={statusCellStyle}>
                <AppointmentStatusPill appointment={appointment} />
              </View>
              <View className="min-w-0 justify-center py-[14px]" style={actionsCellStyle}>
                <Pressable
                  className={userProfileClassNames.panelIconButton}
                  style={({ hovered, pressed }) => [
                    hovered ? { backgroundColor: adminTheme.cardBackgroundStrong } : null,
                    { transform: [{ scale: pressed ? 0.96 : hovered ? 1.02 : 1 }] },
                  ]}>
                  <MaterialIcons name="visibility" size={18} color={hexToRgba(adminTheme.onSurfaceVariant, 0.86)} />
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View className="gap-3">
          {appointments.map((appointment) => (
            <View
              key={appointment.id}
              className="gap-3 rounded-sm border p-4"
              style={{ backgroundColor: adminTheme.cardBackgroundStrong, borderColor: adminTheme.borderSubtle }}>
              <View className="gap-1">
                <Text className={userProfileClassNames.primaryText} style={{ color: adminTheme.onSurface, fontFamily: 'Manrope-SemiBold' }}>
                  {appointment.customerName}
                </Text>
                <Text className={userProfileClassNames.secondaryText} style={{ color: adminTheme.onSurfaceVariant }}>
                  {appointment.serviceName}
                </Text>
              </View>
              <Text className={userProfileClassNames.secondaryText} style={{ color: adminTheme.onSurface }}>
                {appointment.dateTimeLabel}
              </Text>
              <AppointmentStatusPill appointment={appointment} />
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
