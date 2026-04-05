import React from 'react';
import { Platform, Pressable, Text, View } from 'react-native';

import { userOverview, type UserViewMode } from '@/components/panel/super-admin/user-management.data';
import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { hexToRgba } from '@/utils/color';

import { styles } from './styles';
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
      style={({ hovered, pressed }) => [
        styles.viewSwitchButton,
        {
          backgroundColor: isActive
            ? adminTheme.primary
            : hovered
              ? adminTheme.cardBackgroundStrong
              : 'transparent',
          transform: [{ scale: pressed ? 0.985 : 1 }],
        },
        Platform.OS === 'web' ? styles.webInteractiveButton : null,
      ]}>
      <Text
        style={[
          styles.viewSwitchButtonText,
          { color: isActive ? adminTheme.onPrimary : adminTheme.onSurfaceVariant },
        ]}>
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
      style={[
        styles.overviewSection,
        {
          flexDirection: isWide ? 'row' : 'column',
          alignItems: isWide ? 'center' : 'flex-start',
        },
      ]}>
      <View style={[styles.viewSwitch, { backgroundColor: adminTheme.cardBackground }]}>
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

      <View style={styles.overviewStats}>
        <View style={styles.overviewStat}>
          <Text style={[styles.overviewLabel, { color: hexToRgba(adminTheme.onSurfaceVariant, 0.72) }]}>
            TOPLAM KULLANICI
          </Text>
          <Text style={[styles.overviewValue, { color: adminTheme.primary }]}>
            {formatCompactNumber(userOverview.totalUsers)}
          </Text>
        </View>

        <View style={styles.overviewStat}>
          <Text style={[styles.overviewLabel, { color: hexToRgba(adminTheme.onSurfaceVariant, 0.72) }]}>
            AKTIF BUGUN
          </Text>
          <Text style={[styles.overviewValue, { color: adminTheme.onSurface }]}>
            {formatCompactNumber(userOverview.activeToday)}
          </Text>
        </View>
      </View>
    </View>
  );
}
