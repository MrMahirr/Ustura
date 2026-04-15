import React from 'react';
import { Pressable, Text, View } from 'react-native';

import Card from '@/components/ui/Card';
import { useBarberAdminTheme } from '@/components/panel/barber-admin/theme';
import { STAFF_ROLE_LABELS } from '@/components/panel/barber-admin/staff/presentation';
import { hexToRgba } from '@/utils/color';

import type { StaffRoleFilter } from './types';

interface StaffFilterBarProps {
  roleFilter: StaffRoleFilter;
  onRoleFilterChange: (value: StaffRoleFilter) => void;
  filteredCount: number;
  totalCount: number;
}

const FILTER_OPTIONS: { value: StaffRoleFilter; label: string }[] = [
  { value: 'all', label: 'Tum roller' },
  { value: 'barber', label: STAFF_ROLE_LABELS.barber },
  { value: 'receptionist', label: STAFF_ROLE_LABELS.receptionist },
];

export default function StaffFilterBar({
  roleFilter,
  onRoleFilterChange,
  filteredCount,
  totalCount,
}: StaffFilterBarProps) {
  const theme = useBarberAdminTheme();

  return (
    <Card variant="glass" contentStyle={{ gap: 14 }}>
      <View className="gap-1">
        <Text
          style={{
            color: theme.onSurface,
            fontFamily: 'Manrope-Bold',
            fontSize: 16,
          }}>
          Kadroyu filtrele
        </Text>
        <Text
          style={{
            color: hexToRgba(theme.onSurfaceVariant, 0.68),
            fontSize: 13,
          }}>
          {`${filteredCount}/${totalCount} kayit listeleniyor`}
        </Text>
      </View>

      <View className="flex-row flex-wrap gap-2">
        {FILTER_OPTIONS.map((option) => {
          const isActive = roleFilter === option.value;

          return (
            <Pressable
              key={option.value}
              onPress={() => onRoleFilterChange(option.value)}
              className="min-h-[38px] rounded-full px-4 py-2"
              style={({ hovered }) => [
                {
                  backgroundColor: isActive
                    ? theme.primaryContainer
                    : hovered
                      ? hexToRgba(theme.primary, 0.05)
                      : theme.cardBackgroundMuted,
                  borderWidth: 1,
                  borderColor: isActive ? hexToRgba(theme.primary, 0.36) : theme.borderSubtle,
                  opacity: hovered ? 0.98 : 1,
                },
              ]}>
              <Text
                style={{
                  color: isActive ? theme.primary : theme.onSurface,
                  fontFamily: isActive ? 'Manrope-Bold' : 'Manrope-SemiBold',
                  fontSize: 12,
                }}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </Card>
  );
}
