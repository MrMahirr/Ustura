import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Platform, Pressable, Text, View } from 'react-native';

import type { UserProfileAppointment } from '@/components/panel/super-admin/user-profile/data';
import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { hexToRgba } from '@/utils/color';

import { styles } from './styles';

function AppointmentStatusPill({ appointment }: { appointment: UserProfileAppointment }) {
  const adminTheme = useSuperAdminTheme();
  const isActive = appointment.statusTone === 'primary';

  return (
    <View
      style={[
        styles.statusPill,
        {
          backgroundColor: isActive ? hexToRgba(adminTheme.primary, 0.16) : hexToRgba(adminTheme.success, 0.14),
          borderColor: isActive ? hexToRgba(adminTheme.primary, 0.2) : hexToRgba(adminTheme.success, 0.2),
        },
      ]}>
      <Text
        style={[
          styles.statusPillText,
          { color: isActive ? adminTheme.primary : adminTheme.success },
        ]}>
        {appointment.statusLabel}
      </Text>
    </View>
  );
}

export default function UserAppointmentsSection({
  appointments,
  useDesktopTable,
}: {
  appointments: UserProfileAppointment[];
  useDesktopTable: boolean;
}) {
  const adminTheme = useSuperAdminTheme();
  const cardShadowStyle =
    Platform.OS === 'web'
      ? ({
          boxShadow:
            adminTheme.theme === 'dark'
              ? '0 18px 40px rgba(0, 0, 0, 0.24)'
              : '0 18px 40px rgba(27, 27, 32, 0.08)',
        } as any)
      : {
          shadowColor: '#000000',
          shadowOpacity: adminTheme.theme === 'dark' ? 0.18 : 0.08,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 10 },
          elevation: 8,
        };

  return (
    <View
      style={[
        styles.panelCard,
        {
          backgroundColor: adminTheme.cardBackground,
          ...cardShadowStyle,
        },
      ]}>
      <Text style={[styles.panelTitle, { color: adminTheme.onSurface }]}>Recent Appointments</Text>

      {useDesktopTable ? (
        <View style={styles.tableWrap}>
          <View style={[styles.tableHeaderRow, { borderBottomColor: hexToRgba(adminTheme.outlineVariant, 0.2) }]}>
            <Text style={[styles.tableHeaderText, styles.customerCell, { color: adminTheme.onSurfaceVariant }]}>Customer</Text>
            <Text style={[styles.tableHeaderText, styles.serviceCell, { color: adminTheme.onSurfaceVariant }]}>Service</Text>
            <Text style={[styles.tableHeaderText, styles.dateCell, { color: adminTheme.onSurfaceVariant }]}>Date & Time</Text>
            <Text style={[styles.tableHeaderText, styles.statusCell, { color: adminTheme.onSurfaceVariant }]}>Status</Text>
            <Text style={[styles.tableHeaderText, styles.actionsCell, { color: adminTheme.onSurfaceVariant, textAlign: 'right' }]}>
              Actions
            </Text>
          </View>

          {appointments.map((appointment) => (
            <View
              key={appointment.id}
              style={[
                styles.tableRow,
                Platform.OS === 'web' ? styles.webInteractiveCard : null,
                { borderBottomColor: hexToRgba(adminTheme.outlineVariant, 0.1) },
              ]}>
              <View style={[styles.tableCell, styles.customerCell]}>
                <Text style={[styles.tablePrimaryText, { color: adminTheme.onSurface }]}>{appointment.customerName}</Text>
              </View>
              <View style={[styles.tableCell, styles.serviceCell]}>
                <Text style={[styles.tableSecondaryText, { color: adminTheme.onSurfaceVariant }]}>{appointment.serviceName}</Text>
              </View>
              <View style={[styles.tableCell, styles.dateCell]}>
                <Text style={[styles.tableSecondaryText, { color: adminTheme.onSurface }]}>{appointment.dateTimeLabel}</Text>
              </View>
              <View style={[styles.tableCell, styles.statusCell]}>
                <AppointmentStatusPill appointment={appointment} />
              </View>
              <View style={[styles.tableCell, styles.actionsCell]}>
                <Pressable style={styles.panelIconButton}>
                  <MaterialIcons name="visibility" size={18} color={hexToRgba(adminTheme.onSurfaceVariant, 0.86)} />
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.mobileAppointmentList}>
          {appointments.map((appointment) => (
            <View
              key={appointment.id}
              style={[
                styles.mobileAppointmentCard,
                { backgroundColor: adminTheme.cardBackgroundStrong, borderColor: adminTheme.borderSubtle },
              ]}>
              <View style={styles.mobileAppointmentMeta}>
                <Text style={[styles.tablePrimaryText, { color: adminTheme.onSurface }]}>{appointment.customerName}</Text>
                <Text style={[styles.tableSecondaryText, { color: adminTheme.onSurfaceVariant }]}>{appointment.serviceName}</Text>
              </View>
              <Text style={[styles.tableSecondaryText, { color: adminTheme.onSurface }]}>{appointment.dateTimeLabel}</Text>
              <AppointmentStatusPill appointment={appointment} />
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
