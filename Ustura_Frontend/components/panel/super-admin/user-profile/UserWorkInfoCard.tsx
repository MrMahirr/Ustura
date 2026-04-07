import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import type { UserProfile } from '@/components/panel/super-admin/user-profile/data';
import { getUserProfilePanelShadow, userProfileClassNames } from '@/components/panel/super-admin/user-profile/presentation';
import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { hexToRgba } from '@/utils/color';

export default function UserWorkInfoCard({ profile }: { profile: UserProfile }) {
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
      <View className={userProfileClassNames.panelHeaderRow}>
        <Text className={userProfileClassNames.panelTitle} style={{ color: adminTheme.onSurface }}>
          Personal & Work Info
        </Text>
        <Pressable
          className={userProfileClassNames.panelIconButton}
          style={({ hovered, pressed }) => [
            hovered ? { backgroundColor: adminTheme.cardBackgroundStrong } : null,
            { transform: [{ scale: pressed ? 0.96 : hovered ? 1.02 : 1 }] },
          ]}>
          <MaterialIcons name="more-horiz" size={20} color={adminTheme.onSurfaceVariant} />
        </Pressable>
      </View>

      <View className="flex-row flex-wrap gap-6">
        <View className="min-w-[280px] flex-1 gap-[18px]">
          <View className="gap-1.5">
            <Text className={userProfileClassNames.labelText} style={{ color: adminTheme.onSurfaceVariant, fontFamily: 'Manrope-Bold' }}>
              Phone Number
            </Text>
            <Text className="text-lg leading-[26px]" style={{ color: adminTheme.onSurface, fontFamily: 'Manrope-SemiBold' }}>
              {profile.phoneNumber}
            </Text>
          </View>
          <View className="gap-1.5">
            <Text className={userProfileClassNames.labelText} style={{ color: adminTheme.onSurfaceVariant, fontFamily: 'Manrope-Bold' }}>
              Email Address
            </Text>
            <Text className="text-lg leading-[26px]" style={{ color: adminTheme.onSurface, fontFamily: 'Manrope-SemiBold' }}>
              {profile.user.email}
            </Text>
          </View>
          <View className="gap-1.5">
            <Text className={userProfileClassNames.labelText} style={{ color: adminTheme.onSurfaceVariant, fontFamily: 'Manrope-Bold' }}>
              Assigned Salon
            </Text>
            <Text className="text-lg leading-[26px]" style={{ color: adminTheme.onSurface, fontFamily: 'Manrope-SemiBold' }}>
              {profile.assignedSalonLabel}
            </Text>
          </View>
        </View>

        <View className="min-w-[280px] flex-1 gap-[18px]">
          <Text className={userProfileClassNames.labelText} style={{ color: adminTheme.onSurfaceVariant, fontFamily: 'Manrope-Bold' }}>
            Weekly Schedule
          </Text>
          <View className="gap-2">
            {profile.weeklySchedule.map((item) => (
              <View
                key={item.id}
                className="min-h-[42px] flex-row items-center justify-between gap-4 border-b py-2"
                style={{ borderBottomColor: hexToRgba(adminTheme.outlineVariant, 0.18) }}>
                <Text className="font-body text-sm" style={{ color: item.tone === 'muted' ? adminTheme.onSurfaceVariant : adminTheme.onSurface }}>
                  {item.label}
                </Text>
                <Text
                  className="font-body text-sm"
                  style={{
                    color:
                      item.tone === 'error'
                        ? hexToRgba(adminTheme.error, 0.8)
                        : item.tone === 'primary'
                          ? adminTheme.primary
                          : adminTheme.onSurfaceVariant,
                    fontFamily: 'Manrope-Bold',
                  }}>
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
