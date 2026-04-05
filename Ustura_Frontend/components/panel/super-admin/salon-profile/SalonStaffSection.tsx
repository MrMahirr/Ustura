import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Platform, Pressable, Text, View } from 'react-native';

import type { SalonStaffMember } from '@/components/panel/super-admin/salon-profile/data';
import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { hexToRgba } from '@/utils/color';

import { styles } from './styles';

function StaffTable({
  staffMembers,
}: {
  staffMembers: SalonStaffMember[];
}) {
  const adminTheme = useSuperAdminTheme();

  return (
    <>
      <View style={[styles.staffHeaderRow, { borderBottomColor: adminTheme.borderSubtle }]}>
        <Text style={[styles.tableColumnLabel, styles.staffCellPerson, { color: hexToRgba(adminTheme.onSurfaceVariant, 0.68) }]}>
          Usta
        </Text>
        <Text style={[styles.tableColumnLabel, styles.staffCellRole, { color: hexToRgba(adminTheme.onSurfaceVariant, 0.68) }]}>
          Rol
        </Text>
        <Text
          style={[
            styles.tableColumnLabel,
            styles.staffCellPerformance,
            { color: hexToRgba(adminTheme.onSurfaceVariant, 0.68) },
          ]}>
          Performans
        </Text>
        <Text
          style={[
            styles.tableColumnLabel,
            styles.staffCellActions,
            { color: hexToRgba(adminTheme.onSurfaceVariant, 0.68), textAlign: 'right' },
          ]}>
          Aksiyon
        </Text>
      </View>

      {staffMembers.map((member, index) => (
        <View
          key={member.id}
          style={[
            styles.staffRow,
            index < staffMembers.length - 1 ? { borderBottomColor: adminTheme.borderSubtle, borderBottomWidth: 1 } : null,
          ]}>
          <View style={[styles.staffCell, styles.staffCellPerson]}>
            <View style={styles.staffPersonRow}>
              <View
                style={[
                  styles.staffAvatarFrame,
                  {
                    borderColor: hexToRgba(adminTheme.primary, 0.2),
                    backgroundColor: adminTheme.cardBackgroundStrong,
                  },
                ]}>
                <Image
                  source={{ uri: member.imageUrl }}
                  style={[
                    styles.staffAvatar,
                    Platform.OS === 'web' && member.mutedImage ? ({ filter: 'grayscale(1)' } as any) : null,
                  ]}
                  contentFit="cover"
                />
              </View>
              <Text style={[styles.staffName, { color: adminTheme.onSurface }]}>{member.name}</Text>
            </View>
          </View>

          <View style={[styles.staffCell, styles.staffCellRole]}>
            <Text style={[styles.staffRole, { color: hexToRgba(adminTheme.onSurfaceVariant, 0.82) }]}>{member.title}</Text>
          </View>

          <View style={[styles.staffCell, styles.staffCellPerformance]}>
            <View style={styles.performanceRow}>
              <View style={[styles.performanceTrack, { backgroundColor: adminTheme.surfaceContainerHighest }]}>
                <View
                  style={[
                    styles.performanceBar,
                    { width: `${member.performance}%` as any, backgroundColor: adminTheme.primary },
                  ]}
                />
              </View>
              <Text style={[styles.performanceText, { color: adminTheme.onSurface }]}>{member.rating}/5</Text>
            </View>
          </View>

          <View style={[styles.staffCell, styles.staffCellActions]}>
            <Pressable
              style={({ hovered }) => [
                styles.iconButton,
                { backgroundColor: hovered ? adminTheme.cardBackgroundStrong : 'transparent' },
              ]}>
              <MaterialIcons name="more-vert" size={18} color={hexToRgba(adminTheme.onSurfaceVariant, 0.8)} />
            </Pressable>
          </View>
        </View>
      ))}
    </>
  );
}

function StaffMobileList({ staffMembers }: { staffMembers: SalonStaffMember[] }) {
  const adminTheme = useSuperAdminTheme();

  return (
    <View style={styles.staffMobileList}>
      {staffMembers.map((member) => (
        <View
          key={member.id}
          style={[
            styles.staffMobileCard,
            { backgroundColor: adminTheme.cardBackground, borderColor: adminTheme.borderSubtle },
          ]}>
          <View style={styles.staffMobileTop}>
            <View style={styles.staffPersonRow}>
              <View
                style={[
                  styles.staffAvatarFrame,
                  {
                    borderColor: hexToRgba(adminTheme.primary, 0.2),
                    backgroundColor: adminTheme.cardBackgroundStrong,
                  },
                ]}>
                <Image
                  source={{ uri: member.imageUrl }}
                  style={[
                    styles.staffAvatar,
                    Platform.OS === 'web' && member.mutedImage ? ({ filter: 'grayscale(1)' } as any) : null,
                  ]}
                  contentFit="cover"
                />
              </View>
              <View>
                <Text style={[styles.staffName, { color: adminTheme.onSurface }]}>{member.name}</Text>
                <Text style={[styles.staffRole, { color: hexToRgba(adminTheme.onSurfaceVariant, 0.82) }]}>{member.title}</Text>
              </View>
            </View>

            <Pressable
              style={({ hovered }) => [
                styles.iconButton,
                { backgroundColor: hovered ? adminTheme.cardBackgroundStrong : 'transparent' },
              ]}>
              <MaterialIcons name="more-vert" size={18} color={hexToRgba(adminTheme.onSurfaceVariant, 0.8)} />
            </Pressable>
          </View>

          <View style={styles.performanceRow}>
            <View style={[styles.performanceTrack, { backgroundColor: adminTheme.surfaceContainerHighest }]}>
              <View
                style={[
                  styles.performanceBar,
                  { width: `${member.performance}%` as any, backgroundColor: adminTheme.primary },
                ]}
              />
            </View>
            <Text style={[styles.performanceText, { color: adminTheme.onSurface }]}>{member.rating}/5</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

export default function SalonStaffSection({
  staffMembers,
  useDesktopTable,
}: {
  staffMembers: SalonStaffMember[];
  useDesktopTable: boolean;
}) {
  const adminTheme = useSuperAdminTheme();

  return (
    <View
      style={[
        styles.tableShell,
        { backgroundColor: adminTheme.cardBackground, borderColor: adminTheme.borderSubtle },
      ]}>
      <View
        style={[
          styles.tableHeader,
          { borderBottomColor: adminTheme.borderSubtle, backgroundColor: adminTheme.cardBackgroundMuted },
        ]}>
        <Text style={[styles.cardEyebrow, { color: hexToRgba(adminTheme.onSurfaceVariant, 0.68), marginBottom: 0 }]}>
          Usta Ekip Uyeleri
        </Text>
        <Text style={[styles.tableActionText, { color: adminTheme.primary }]}>Tum Ekibi Gor</Text>
      </View>

      {useDesktopTable ? <StaffTable staffMembers={staffMembers} /> : <StaffMobileList staffMembers={staffMembers} />}
    </View>
  );
}
