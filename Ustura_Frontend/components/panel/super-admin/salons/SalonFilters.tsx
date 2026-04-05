import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Platform, Pressable, Text, View } from 'react-native';

import { salonClassNames } from '@/components/panel/super-admin/salons/presentation';
import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { hexToRgba } from '@/utils/color';

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
      className={salonClassNames.filterCard}
      style={({ hovered, pressed }) => [
        {
          backgroundColor: hovered ? adminTheme.cardBackgroundStrong : adminTheme.cardBackground,
          borderColor: hovered ? adminTheme.borderStrong : adminTheme.borderSubtle,
          transform: [{ translateY: pressed ? 1 : hovered ? -2 : 0 }],
        },
        Platform.OS === 'web'
          ? ({ transition: 'transform 180ms ease, background-color 180ms ease, border-color 180ms ease' } as any)
          : null,
      ]}>
      <View className="flex-row items-center justify-between">
        <Text className={salonClassNames.filterLabel} style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.72), fontFamily: 'Manrope-Bold' }}>
          {label}
        </Text>
        <MaterialIcons name={icon} size={16} color={hexToRgba(adminTheme.onSurfaceVariant, 0.68)} />
      </View>

      <View className="flex-row items-center justify-between gap-2.5">
        <Text className="flex-1 font-body text-[13px] leading-[18px]" style={{ color: adminTheme.onSurface, fontFamily: 'Manrope-Bold' }} numberOfLines={1}>
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
      className="min-h-[82px] flex-row items-center justify-between rounded-[7px] border px-[14px] py-3"
      style={{ backgroundColor: adminTheme.cardBackground, borderColor: adminTheme.borderSubtle }}>
      <View>
        <Text className={salonClassNames.filterLabel} style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.72), fontFamily: 'Manrope-Bold' }}>
          Toplam Kayit
        </Text>
        <Text className="mt-1.5 font-headline text-[28px] tracking-[-0.6px]" style={{ color: adminTheme.primary }}>
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
    <View className={salonClassNames.filtersGrid}>
      <View className="min-w-[190px]" style={{ width: filterBasis as any }}>
        <FilterCard label="Durum Filtresi" value={selectedStatus} icon="tune" onPress={onCycleStatus} />
      </View>
      <View className="min-w-[190px]" style={{ width: filterBasis as any }}>
        <FilterCard label="Abonelik Plani" value={selectedPlan} icon="inventory-2" onPress={onCyclePlan} />
      </View>
      <View className="min-w-[190px]" style={{ width: filterBasis as any }}>
        <FilterCard label="Siralama" value={selectedSort} icon="swap-vert" onPress={onCycleSort} />
      </View>
      <View className="min-w-[190px]" style={{ width: filterBasis as any }}>
        <TotalRecordsCard totalRecords={totalRecords} />
      </View>
    </View>
  );
}
