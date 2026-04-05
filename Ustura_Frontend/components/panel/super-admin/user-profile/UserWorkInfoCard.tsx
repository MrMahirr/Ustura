import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Platform, Pressable, Text, View } from 'react-native';

import type { UserProfile } from '@/components/panel/super-admin/user-profile/data';
import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { hexToRgba } from '@/utils/color';

import { styles } from './styles';

export default function UserWorkInfoCard({ profile }: { profile: UserProfile }) {
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
      <View style={styles.panelHeaderRow}>
        <Text style={[styles.panelTitle, { color: adminTheme.onSurface }]}>Personal & Work Info</Text>
        <Pressable style={styles.panelIconButton}>
          <MaterialIcons name="more-horiz" size={20} color={adminTheme.onSurfaceVariant} />
        </Pressable>
      </View>

      <View style={styles.infoGrid}>
        <View style={styles.infoColumn}>
          <View style={styles.infoItem}>
            <Text style={[styles.infoLabel, { color: adminTheme.onSurfaceVariant }]}>Phone Number</Text>
            <Text style={[styles.infoValue, { color: adminTheme.onSurface }]}>{profile.phoneNumber}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={[styles.infoLabel, { color: adminTheme.onSurfaceVariant }]}>Email Address</Text>
            <Text style={[styles.infoValue, { color: adminTheme.onSurface }]}>{profile.user.email}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={[styles.infoLabel, { color: adminTheme.onSurfaceVariant }]}>Assigned Salon</Text>
            <Text style={[styles.infoValue, { color: adminTheme.onSurface }]}>{profile.assignedSalonLabel}</Text>
          </View>
        </View>

        <View style={styles.infoColumn}>
          <Text style={[styles.infoLabel, { color: adminTheme.onSurfaceVariant }]}>Weekly Schedule</Text>
          <View style={styles.scheduleList}>
            {profile.weeklySchedule.map((item) => (
              <View key={item.id} style={[styles.scheduleRow, { borderBottomColor: hexToRgba(adminTheme.outlineVariant, 0.18) }]}>
                <Text
                  style={[
                    styles.scheduleRowLabel,
                    { color: item.tone === 'muted' ? adminTheme.onSurfaceVariant : adminTheme.onSurface },
                  ]}>
                  {item.label}
                </Text>
                <Text
                  style={[
                    styles.scheduleRowValue,
                    {
                      color:
                        item.tone === 'error'
                          ? hexToRgba(adminTheme.error, 0.8)
                          : item.tone === 'primary'
                            ? adminTheme.primary
                            : adminTheme.onSurfaceVariant,
                    },
                  ]}>
                  {item.hoursLabel}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}
