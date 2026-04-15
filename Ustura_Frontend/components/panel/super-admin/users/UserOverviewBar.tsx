import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Platform, Pressable, Text, View } from 'react-native';

import type { UserOverview, UserViewMode } from '@/components/panel/super-admin/user-management.data';
import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { hexToRgba } from '@/utils/color';
import { cn } from '@/utils/cn';

import { userClassNames } from './presentation';
import { formatCompactNumber } from './utils';

interface UserOverviewBarProps {
  isWide: boolean;
  selectedViewMode: UserViewMode;
  overview: UserOverview;
  onViewModeChange: (viewMode: UserViewMode) => void;
}

function ViewSwitchButton({
  label,
  isActive,
  onPress,
}: {
  label: string;
  isActive: boolean;
  onPress: () => void;
}) {
  const adminTheme = useSuperAdminTheme();

  return (
    <Pressable
      onPress={onPress}
      className={userClassNames.viewSwitchButton}
      style={({ hovered, pressed }) => [
        {
          backgroundColor:
            !isActive && hovered
              ? adminTheme.cardBackgroundStrong
              : 'transparent',
          borderWidth: 1,
          borderColor: isActive
            ? hexToRgba(adminTheme.primary, 0.42)
            : hovered
              ? hexToRgba(adminTheme.primary, 0.16)
              : 'transparent',
          transform: [{ scale: pressed ? 0.985 : 1 }],
        },
        Platform.OS === 'web'
          ? ({
              transition:
                'background-color 160ms ease, border-color 160ms ease, opacity 160ms ease, transform 160ms ease, box-shadow 180ms ease',
              cursor: 'pointer',
              boxShadow: isActive
                ? `0 10px 24px ${hexToRgba(adminTheme.primary, 0.2)}`
                : 'none',
            } as any)
          : null,
      ]}>
      {isActive ? (
        <LinearGradient
          colors={adminTheme.goldGradient as [string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            borderRadius: 8,
          }}
        />
      ) : null}
      <Text
        className={userClassNames.viewSwitchButtonText}
        style={{
          color: isActive
            ? adminTheme.onPrimary
            : adminTheme.onSurface,
        }}>
        {label}
      </Text>
    </Pressable>
  );
}

export default function UserOverviewBar({
  isWide,
  selectedViewMode,
  overview,
  onViewModeChange,
}: UserOverviewBarProps) {
  const adminTheme = useSuperAdminTheme();

  return (
    <View
      className={cn(userClassNames.overviewSection, isWide ? 'flex-row items-center' : 'flex-col items-start')}>
      <View
        className={userClassNames.viewSwitch}
        style={{
          backgroundColor: adminTheme.cardBackground,
          borderWidth: 1,
          borderColor: hexToRgba(adminTheme.primary, 0.12),
        }}>
        <ViewSwitchButton
          label="Tum Kullanicilar"
          isActive={selectedViewMode === 'all'}
          onPress={() => onViewModeChange('all')}
        />
        <ViewSwitchButton
          label="Salonlara Gore"
          isActive={selectedViewMode === 'salons'}
          onPress={() => onViewModeChange('salons')}
        />
      </View>

      <View className={userClassNames.overviewStats}>
        <View className={userClassNames.overviewStat}>
          <Text className={userClassNames.overviewLabel} style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.72) }}>
            TOPLAM KULLANICI
          </Text>
          <Text className={userClassNames.overviewValue} style={{ color: adminTheme.primary }}>
            {formatCompactNumber(overview.totalUsers)}
          </Text>
        </View>

        <View className={userClassNames.overviewStat}>
          <Text className={userClassNames.overviewLabel} style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.72) }}>
            AKTIF BUGUN
          </Text>
          <Text className={userClassNames.overviewValue} style={{ color: adminTheme.onSurface }}>
            {formatCompactNumber(overview.activeToday)}
          </Text>
        </View>
      </View>
    </View>
  );
}
