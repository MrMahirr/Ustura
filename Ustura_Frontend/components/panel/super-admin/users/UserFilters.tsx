import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Platform, Pressable, Text, View } from 'react-native';

import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { hexToRgba } from '@/utils/color';

import { styles } from './styles';

interface FilterFieldProps {
  value: string;
  onPress: () => void;
  minWidth?: number;
}

interface UserFiltersProps {
  selectedRole: string;
  selectedStatus: string;
  selectedSalon: string;
  selectedCity: string;
  onCycleRole: () => void;
  onCycleStatus: () => void;
  onCycleSalon: () => void;
  onCycleCity: () => void;
  onReset: () => void;
}

function FilterField({ value, onPress, minWidth = 140 }: FilterFieldProps) {
  const adminTheme = useSuperAdminTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ hovered, pressed }) => [
        styles.filterField,
        {
          minWidth,
          backgroundColor: hovered ? adminTheme.cardBackgroundStrong : hexToRgba(adminTheme.cardBackgroundStrong, 0.76),
          borderColor: hovered ? adminTheme.borderStrong : adminTheme.borderSubtle,
          transform: [{ translateY: pressed ? 1 : hovered ? -1 : 0 }],
        },
        Platform.OS === 'web' ? styles.webInteractiveCard : null,
      ]}>
      <Text style={[styles.filterFieldText, { color: adminTheme.onSurface }]} numberOfLines={1}>
        {value}
      </Text>
      <MaterialIcons name="expand-more" size={18} color={adminTheme.primary} />
    </Pressable>
  );
}

export default function UserFilters({
  selectedRole,
  selectedStatus,
  selectedSalon,
  selectedCity,
  onCycleRole,
  onCycleStatus,
  onCycleSalon,
  onCycleCity,
  onReset,
}: UserFiltersProps) {
  const adminTheme = useSuperAdminTheme();

  return (
    <View
      style={[
        styles.filterShell,
        Platform.OS === 'web' ? styles.stickyFilters : null,
        {
          backgroundColor: hexToRgba(adminTheme.cardBackground, 0.88),
          borderColor: adminTheme.borderSubtle,
          ...(Platform.OS === 'web'
            ? ({
                backdropFilter: 'blur(18px)',
                WebkitBackdropFilter: 'blur(18px)',
                boxShadow:
                  adminTheme.theme === 'dark'
                    ? '0 18px 44px rgba(0, 0, 0, 0.28)'
                    : '0 18px 44px rgba(27, 27, 32, 0.08)',
              } as any)
            : null),
        },
      ]}>
      <View style={styles.filterRow}>
        <FilterField value={selectedRole} onPress={onCycleRole} />
        <FilterField value={selectedStatus} onPress={onCycleStatus} />
        <FilterField value={selectedSalon} onPress={onCycleSalon} minWidth={180} />
        <FilterField value={selectedCity} onPress={onCycleCity} />

        <Pressable
          onPress={onReset}
          style={({ hovered, pressed }) => [
            styles.clearButton,
            {
              backgroundColor: hovered ? hexToRgba(adminTheme.primary, 0.08) : 'transparent',
              transform: [{ scale: pressed ? 0.985 : 1 }],
            },
            Platform.OS === 'web' ? styles.webInteractiveButton : null,
          ]}>
          <MaterialIcons name="filter-list-off" size={18} color={adminTheme.onSurfaceVariant} />
          <Text style={[styles.clearButtonText, { color: adminTheme.onSurfaceVariant }]}>Temizle</Text>
        </Pressable>
      </View>
    </View>
  );
}
