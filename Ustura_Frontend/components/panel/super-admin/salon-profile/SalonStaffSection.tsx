import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Platform, Pressable, Text, View } from 'react-native';

import type { SalonStaffMember } from '@/components/panel/super-admin/salon-profile/data';
import { salonProfileClassNames } from '@/components/panel/super-admin/salon-profile/presentation';
import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { hexToRgba } from '@/utils/color';

const staffCellPersonStyle = { flex: 2.4 } as const;
const staffCellRoleStyle = { flex: 1.4 } as const;
const staffCellPerformanceStyle = { flex: 1.5 } as const;
const staffCellActionsStyle = { flex: 0.7, alignItems: 'flex-end' as const } as const;

function StaffMenuButton() {
  const adminTheme = useSuperAdminTheme();

  return (
    <Pressable
      className="h-[34px] w-[34px] items-center justify-center rounded-full"
      style={({ hovered }) => [{ backgroundColor: hovered ? adminTheme.cardBackgroundStrong : 'transparent' }]}>
      <MaterialIcons name="more-vert" size={18} color={hexToRgba(adminTheme.onSurfaceVariant, 0.8)} />
    </Pressable>
  );
}

function StaffAvatar({ member }: { member: SalonStaffMember }) {
  const adminTheme = useSuperAdminTheme();

  return (
    <View
      className="h-[42px] w-[42px] shrink-0 overflow-hidden rounded-full border"
      style={{ borderColor: hexToRgba(adminTheme.primary, 0.2), backgroundColor: adminTheme.cardBackgroundStrong }}>
      <Image
        source={{ uri: member.imageUrl }}
        style={[
          { width: '100%', height: '100%' },
          Platform.OS === 'web' && member.mutedImage ? ({ filter: 'grayscale(1)' } as any) : null,
        ]}
        contentFit="cover"
      />
    </View>
  );
}

function PerformanceMeter({ performance, rating }: { performance: number; rating: string }) {
  const adminTheme = useSuperAdminTheme();

  return (
    <View className="flex-row items-center gap-2">
      <View className="h-1.5 flex-1 overflow-hidden rounded-full" style={{ backgroundColor: adminTheme.surfaceContainerHighest }}>
        <View className="h-full rounded-full" style={{ width: `${performance}%` as any, backgroundColor: adminTheme.primary }} />
      </View>
      <Text className="font-label text-[10px]" style={{ color: adminTheme.onSurface, fontFamily: 'Manrope-Bold' }}>
        {rating}/5
      </Text>
    </View>
  );
}

function StaffTable({ staffMembers }: { staffMembers: SalonStaffMember[] }) {
  const adminTheme = useSuperAdminTheme();

  return (
    <>
      <View className="min-h-[52px] flex-row items-center border-b px-[22px]" style={{ borderBottomColor: adminTheme.borderSubtle }}>
        <Text className={salonProfileClassNames.tableActionText} style={[staffCellPersonStyle, { color: hexToRgba(adminTheme.onSurfaceVariant, 0.68), fontFamily: 'Manrope-Bold' }]}>
          Usta
        </Text>
        <Text className={salonProfileClassNames.tableActionText} style={[staffCellRoleStyle, { color: hexToRgba(adminTheme.onSurfaceVariant, 0.68), fontFamily: 'Manrope-Bold' }]}>
          Rol
        </Text>
        <Text className={salonProfileClassNames.tableActionText} style={[staffCellPerformanceStyle, { color: hexToRgba(adminTheme.onSurfaceVariant, 0.68), fontFamily: 'Manrope-Bold' }]}>
          Performans
        </Text>
        <Text className={salonProfileClassNames.tableActionText} style={[staffCellActionsStyle, { color: hexToRgba(adminTheme.onSurfaceVariant, 0.68), textAlign: 'right', fontFamily: 'Manrope-Bold' }]}>
          Aksiyon
        </Text>
      </View>

      {staffMembers.map((member, index) => (
        <View
          key={member.id}
          className="min-h-[86px] flex-row items-center px-[22px]"
          style={index < staffMembers.length - 1 ? { borderBottomColor: adminTheme.borderSubtle, borderBottomWidth: 1 } : undefined}>
          <View className="min-w-0 justify-center py-4" style={staffCellPersonStyle}>
            <View className="min-w-0 flex-row items-center gap-3">
              <StaffAvatar member={member} />
              <Text className="font-headline text-[15px]" style={{ color: adminTheme.onSurface }}>
                {member.name}
              </Text>
            </View>
          </View>

          <View className="min-w-0 justify-center py-4" style={staffCellRoleStyle}>
            <Text className="font-label text-[10px] uppercase tracking-[1.8px]" style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.82), fontFamily: 'Manrope-SemiBold' }}>
              {member.title}
            </Text>
          </View>

          <View className="min-w-0 justify-center py-4" style={staffCellPerformanceStyle}>
            <PerformanceMeter performance={member.performance} rating={member.rating} />
          </View>

          <View className="min-w-0 justify-center py-4" style={staffCellActionsStyle}>
            <StaffMenuButton />
          </View>
        </View>
      ))}
    </>
  );
}

function StaffMobileList({ staffMembers }: { staffMembers: SalonStaffMember[] }) {
  const adminTheme = useSuperAdminTheme();

  return (
    <View className="gap-3 p-4">
      {staffMembers.map((member) => (
        <View
          key={member.id}
          className="gap-[14px] rounded-xl border p-4"
          style={{ backgroundColor: adminTheme.cardBackground, borderColor: adminTheme.borderSubtle }}>
          <View className="flex-row items-center justify-between gap-3">
            <View className="flex-row items-center gap-3">
              <StaffAvatar member={member} />
              <View>
                <Text className="font-headline text-[15px]" style={{ color: adminTheme.onSurface }}>
                  {member.name}
                </Text>
                <Text className="font-label text-[10px] uppercase tracking-[1.8px]" style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.82), fontFamily: 'Manrope-SemiBold' }}>
                  {member.title}
                </Text>
              </View>
            </View>

            <StaffMenuButton />
          </View>

          <PerformanceMeter performance={member.performance} rating={member.rating} />
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
    <View className={salonProfileClassNames.tableShell} style={{ backgroundColor: adminTheme.cardBackground, borderColor: adminTheme.borderSubtle }}>
      <View
        className={salonProfileClassNames.tableHeader}
        style={{ borderBottomColor: adminTheme.borderSubtle, backgroundColor: adminTheme.cardBackgroundMuted }}>
        <Text className={salonProfileClassNames.cardEyebrow} style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.68), marginBottom: 0, fontFamily: 'Manrope-Bold' }}>
          Usta Ekip Uyeleri
        </Text>
        <Text className={salonProfileClassNames.tableActionText} style={{ color: adminTheme.primary, fontFamily: 'Manrope-Bold' }}>
          Tum Ekibi Gor
        </Text>
      </View>

      {useDesktopTable ? <StaffTable staffMembers={staffMembers} /> : <StaffMobileList staffMembers={staffMembers} />}
    </View>
  );
}
