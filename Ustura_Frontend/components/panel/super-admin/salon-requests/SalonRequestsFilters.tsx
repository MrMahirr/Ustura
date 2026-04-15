import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Platform, Pressable, Text, View } from 'react-native';

import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { hexToRgba } from '@/utils/color';

import {
  SALON_REQUEST_COPY,
  salonRequestClassNames,
} from './presentation';
import type { ApplicationStatusFilter } from './types';

interface SalonRequestsFiltersProps {
  statusFilter: ApplicationStatusFilter;
  cityFilter: string | null;
  cities: string[];
  onStatusChange: (status: ApplicationStatusFilter) => void;
  onCityChange: (city: string | null) => void;
}

const STATUS_TABS: { key: ApplicationStatusFilter; label: string }[] = [
  { key: 'all', label: SALON_REQUEST_COPY.filterAll },
  { key: 'pending', label: SALON_REQUEST_COPY.filterPending },
  { key: 'approved', label: SALON_REQUEST_COPY.filterApproved },
  { key: 'rejected', label: SALON_REQUEST_COPY.filterRejected },
];

function StatusTab({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  const t = useSuperAdminTheme();

  return (
    <Pressable
      onPress={onPress}
      className={salonRequestClassNames.filterChip}
      style={[
        {
          backgroundColor: active ? t.primary : 'transparent',
          borderRadius: 2,
        },
        Platform.OS === 'web'
          ? ({ transition: 'background-color 150ms ease' } as any)
          : null,
      ]}>
      <Text
        style={{
          color: active ? t.onPrimary : t.onSurfaceVariant,
          fontSize: 12,
          fontFamily: 'Manrope-Bold',
        }}>
        {label}
      </Text>
    </Pressable>
  );
}

function CitySelect({
  cities,
  selected,
  onSelect,
}: {
  cities: string[];
  selected: string | null;
  onSelect: (city: string | null) => void;
}) {
  const t = useSuperAdminTheme();

  if (Platform.OS !== 'web') {
    return null;
  }

  return (
    <View
      style={[
        {
          backgroundColor: t.surfaceContainerHighest,
          borderRadius: 2,
          overflow: 'hidden',
        },
      ]}>
      <select
        value={selected ?? ''}
        onChange={(e: any) => onSelect(e.target.value || null)}
        style={{
          backgroundColor: 'transparent',
          color: t.onSurface,
          border: 'none',
          fontSize: 12,
          fontWeight: 500,
          fontFamily: 'Manrope, sans-serif',
          paddingBlock: 8,
          paddingInline: 12,
          paddingRight: 36,
          outline: 'none',
          cursor: 'pointer',
        } as any}>
        <option value="">{SALON_REQUEST_COPY.citySelect}</option>
        {cities.map((city) => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}
      </select>
    </View>
  );
}

export default function SalonRequestsFilters({
  statusFilter,
  cityFilter,
  cities,
  onStatusChange,
  onCityChange,
}: SalonRequestsFiltersProps) {
  const t = useSuperAdminTheme();

  return (
    <View
      className={salonRequestClassNames.filterBar}
      style={{
        backgroundColor: t.pageBackgroundAccent,
        borderWidth: 1,
        borderColor: hexToRgba(t.onSurface, 0.06),
        borderRadius: 2,
      }}>
      <View className="flex-row items-center gap-2">
        {STATUS_TABS.map((tab) => (
          <StatusTab
            key={tab.key}
            label={tab.label}
            active={statusFilter === tab.key}
            onPress={() => onStatusChange(tab.key)}
          />
        ))}
      </View>

      <View className="flex-row items-center gap-3">
        <CitySelect
          cities={cities}
          selected={cityFilter}
          onSelect={onCityChange}
        />
        <Pressable
          style={{
            padding: 8,
            backgroundColor: t.surfaceContainerHighest,
          }}>
          <MaterialIcons name="sort" size={18} color={t.onSurfaceVariant} />
        </Pressable>
      </View>
    </View>
  );
}
