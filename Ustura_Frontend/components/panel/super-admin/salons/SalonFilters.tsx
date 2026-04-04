import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Platform, Pressable, Text, View } from 'react-native';

import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { hexToRgba } from '@/utils/color';

import { styles } from './styles';

interface FilterCardProps {
  label: string;
  value: string;
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  onPress: () => void;
}

interface SalonFiltersProps {
  filterBasis: string;
  selectedStatus: string;
  selectedPlan: string;
  selectedSort: string;
  totalRecords: number;
  onCycleStatus: () => void;
  onCyclePlan: () => void;
  onCycleSort: () => void;
}

function FilterCard({ label, value, icon, onPress }: FilterCardProps) {
  const adminTheme = useSuperAdminTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ hovered, pressed }) => [
        styles.filterCard,
        {
          backgroundColor: hovered ? adminTheme.cardBackgroundStrong : adminTheme.cardBackground,
          borderColor: hovered ? adminTheme.borderStrong : adminTheme.borderSubtle,
          transform: [{ translateY: pressed ? 1 : hovered ? -2 : 0 }],
        },
        Platform.OS === 'web' ? styles.webInteractiveCard : null,
      ]}>
      <View style={styles.filterLabelRow}>
        <Text style={[styles.filterLabel, { color: hexToRgba(adminTheme.onSurfaceVariant, 0.72) }]}>{label}</Text>
        <MaterialIcons name={icon} size={16} color={hexToRgba(adminTheme.onSurfaceVariant, 0.68)} />
      </View>

      <View style={styles.filterValueRow}>
        <Text style={[styles.filterValue, { color: adminTheme.onSurface }]} numberOfLines={1}>
          {value}
        </Text>
        <MaterialIcons name="expand-more" size={16} color={adminTheme.primary} />
      </View>
    </Pressable>
  );
}

function TotalRecordsCard({ totalRecords }: { totalRecords: number }) {
  const adminTheme = useSuperAdminTheme();

  return (
    <View
      style={[
        styles.totalCard,
        { backgroundColor: adminTheme.cardBackground, borderColor: adminTheme.borderSubtle },
      ]}>
      <View>
        <Text style={[styles.filterLabel, { color: hexToRgba(adminTheme.onSurfaceVariant, 0.72) }]}>Toplam Kayit</Text>
        <Text style={[styles.totalValue, { color: adminTheme.primary }]}>
          {new Intl.NumberFormat('tr-TR').format(totalRecords)}
        </Text>
      </View>
      <MaterialIcons name="analytics" size={30} color={hexToRgba(adminTheme.onSurfaceVariant, 0.28)} />
    </View>
  );
}

export default function SalonFilters({
  filterBasis,
  selectedStatus,
  selectedPlan,
  selectedSort,
  totalRecords,
  onCycleStatus,
  onCyclePlan,
  onCycleSort,
}: SalonFiltersProps) {
  return (
    <View style={styles.filtersGrid}>
      <View style={[styles.filterItem, { width: filterBasis as any }]}>
        <FilterCard label="Durum Filtresi" value={selectedStatus} icon="tune" onPress={onCycleStatus} />
      </View>
      <View style={[styles.filterItem, { width: filterBasis as any }]}>
        <FilterCard label="Abonelik Plani" value={selectedPlan} icon="inventory-2" onPress={onCyclePlan} />
      </View>
      <View style={[styles.filterItem, { width: filterBasis as any }]}>
        <FilterCard label="Siralama" value={selectedSort} icon="swap-vert" onPress={onCycleSort} />
      </View>
      <View style={[styles.filterItem, { width: filterBasis as any }]}>
        <TotalRecordsCard totalRecords={totalRecords} />
      </View>
    </View>
  );
}
