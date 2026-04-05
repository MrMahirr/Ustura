import React from 'react';
import { Platform, Pressable, Text, View } from 'react-native';

import { userOverview, type UserViewMode } from '@/components/panel/super-admin/user-management.data';
import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { hexToRgba } from '@/utils/color';
import { cn } from '@/utils/cn';

import { userClassNames } from './presentation';
import { formatCompactNumber } from './utils';

interface UserOverviewBarProps {
  isWide: boolean;
  selectedViewMode: UserViewMode;
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
          backgroundColor: isActive
            ? adminTheme.primary
            : hovered
              ? adminTheme.cardBackgroundStrong
              : 'transparent',
          transform: [{ scale: pressed ? 0.985 : 1 }],
        },
        Platform.OS === 'web'
          ? ({
              transition: 'background-color 160ms ease, border-color 160ms ease, opacity 160ms ease, transform 160ms ease',
              cursor: 'pointer',
            } as any)
          : null,
      ]}>
      <Text
        className={userClassNames.viewSwitchButtonText}
        style={{ color: isActive ? adminTheme.onPrimary : adminTheme.onSurfaceVariant }}>
        {label}
      </Text>
    </Pressable>
  );
}

export default function UserOverviewBar({
  isWide,
  selectedViewMode,
  onViewModeChange,
}: UserOverviewBarProps) {
  const adminTheme = useSuperAdminTheme();

  return (
    <View
      className={cn(userClassNames.overviewSection, isWide ? 'flex-row items-center' : 'flex-col items-start')}>
      <View className={userClassNames.viewSwitch} style={{ backgroundColor: adminTheme.cardBackground }}>
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
            {formatCompactNumber(userOverview.totalUsers)}
          </Text>
        </View>

        <View className={userClassNames.overviewStat}>
          <Text className={userClassNames.overviewLabel} style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.72) }}>
            AKTIF BUGUN
          </Text>
          <Text className={userClassNames.overviewValue} style={{ color: adminTheme.onSurface }}>
            {formatCompactNumber(userOverview.activeToday)}
          </Text>
        </View>
      </View>
    </View>
  );
}
