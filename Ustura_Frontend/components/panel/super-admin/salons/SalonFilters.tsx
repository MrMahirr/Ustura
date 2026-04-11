import React, { useRef, useEffect } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Platform, Pressable, ScrollView, Text, View, Animated } from 'react-native';

import { salonClassNames } from '@/components/panel/super-admin/salons/presentation';
import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { hexToRgba } from '@/utils/color';

interface FilterCardProps {
  label: string;
  value: string;
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  onPress: () => void;
  isOpen: boolean;
}

interface SalonFiltersProps {
  filterBasis: string;
  selectedStatus: string;
  selectedCity: string;
  selectedSort: string;
  statusOptions: string[];
  cityOptions: string[];
  sortOptions: string[];
  totalRecords: number;
  onStatusChange: (status: any) => void;
  onCityChange: (city: string) => void;
  onSortChange: (sort: any) => void;
}

function FilterCard({ label, value, icon, onPress, isOpen }: FilterCardProps) {
  const adminTheme = useSuperAdminTheme();

  return (
    <Pressable
      onPress={onPress}
      className={salonClassNames.filterCard}
      style={({ hovered, pressed }) => [
        {
          backgroundColor: hovered || isOpen ? adminTheme.cardBackgroundStrong : adminTheme.cardBackground,
          borderColor: hovered || isOpen ? adminTheme.borderStrong : adminTheme.borderSubtle,
          transform: [{ translateY: pressed ? 1 : hovered || isOpen ? -2 : 0 }],
          zIndex: isOpen ? 50 : 1,
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
        <MaterialIcons name={isOpen ? 'expand-less' : 'expand-more'} size={16} color={adminTheme.primary} />
      </View>
    </Pressable>
  );
}

function AnimatedDropdownList({
  options,
  selectedValue,
  onSelect,
  adminTheme,
}: {
  options: string[];
  selectedValue: string;
  onSelect: (value: string) => void;
  adminTheme: any;
}) {
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animValue, {
      toValue: 1,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [animValue]);

  const translateY = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-8, 0],
  });

  return (
    <Animated.View
      className="absolute left-0 right-0 top-[88px] z-[100] overflow-hidden rounded-[12px] border"
      style={[
        {
          backgroundColor: adminTheme.cardBackground,
          borderColor: adminTheme.borderStrong,
          opacity: animValue,
          transform: [{ translateY }],
        },
        Platform.OS === 'web'
          ? ({ boxShadow: '0 12px 32px rgba(0, 0, 0, 0.24)' } as any)
          : { elevation: 8 },
      ]}>
      <ScrollView style={{ maxHeight: 240 }} showsVerticalScrollIndicator={Platform.OS === 'web'}>
        {options.map((option, index) => {
          const isSelected = option === selectedValue;
          return (
            <Pressable
              key={option}
              onPress={() => onSelect(option)}
              style={({ hovered, pressed }) => ({
                paddingHorizontal: 16,
                paddingVertical: 12,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderTopWidth: index === 0 ? 0 : 1,
                borderTopColor: hexToRgba(adminTheme.borderSubtle, 0.5),
                backgroundColor: isSelected
                  ? hexToRgba(adminTheme.primary, 0.12)
                  : hovered || pressed
                    ? adminTheme.cardBackgroundStrong
                    : adminTheme.cardBackground,
              })}>
              <Text
                className="font-body text-[13px]"
                style={{
                  color: isSelected ? adminTheme.primary : adminTheme.onSurface,
                  fontFamily: isSelected ? 'Manrope-Bold' : 'Manrope-Medium',
                }}>
                {option}
              </Text>
              {isSelected && <MaterialIcons name="check" size={14} color={adminTheme.primary} />}
            </Pressable>
          );
        })}
      </ScrollView>
    </Animated.View>
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
  selectedCity,
  selectedSort,
  statusOptions,
  cityOptions,
  sortOptions,
  totalRecords,
  onStatusChange,
  onCityChange,
  onSortChange,
}: SalonFiltersProps) {
  const adminTheme = useSuperAdminTheme();
  const [openDropdown, setOpenDropdown] = React.useState<'status' | 'city' | 'sort' | null>(null);

  const handleToggle = (type: 'status' | 'city' | 'sort') => {
    setOpenDropdown((prev) => (prev === type ? null : type));
  };

  return (
    <View className={salonClassNames.filtersGrid} style={{ zIndex: openDropdown ? 100 : 1 }}>
      {openDropdown && Platform.OS === 'web' && (
        <Pressable
          style={{ position: 'fixed', top: 0, right: 0, bottom: 0, left: 0, zIndex: 90 } as any}
          onPress={() => setOpenDropdown(null)}
        />
      )}

      <View className="relative min-w-[190px]" style={{ width: filterBasis as any, zIndex: openDropdown === 'status' ? 110 : 1 }}>
        <FilterCard
          label="Durum Filtresi"
          value={selectedStatus}
          icon="tune"
          isOpen={openDropdown === 'status'}
          onPress={() => handleToggle('status')}
        />
        {openDropdown === 'status' && (
          <AnimatedDropdownList
            options={statusOptions}
            selectedValue={selectedStatus}
            adminTheme={adminTheme}
            onSelect={(val) => {
              onStatusChange(val);
              setOpenDropdown(null);
            }}
          />
        )}
      </View>

      <View className="relative min-w-[190px]" style={{ width: filterBasis as any, zIndex: openDropdown === 'city' ? 110 : 1 }}>
        <FilterCard
          label="Sehir Filtresi"
          value={selectedCity}
          icon="location-city"
          isOpen={openDropdown === 'city'}
          onPress={() => handleToggle('city')}
        />
        {openDropdown === 'city' && (
          <AnimatedDropdownList
            options={cityOptions}
            selectedValue={selectedCity}
            adminTheme={adminTheme}
            onSelect={(val) => {
              onCityChange(val);
              setOpenDropdown(null);
            }}
          />
        )}
      </View>

      <View className="relative min-w-[190px]" style={{ width: filterBasis as any, zIndex: openDropdown === 'sort' ? 110 : 1 }}>
        <FilterCard
          label="Siralama"
          value={selectedSort}
          icon="swap-vert"
          isOpen={openDropdown === 'sort'}
          onPress={() => handleToggle('sort')}
        />
        {openDropdown === 'sort' && (
          <AnimatedDropdownList
            options={sortOptions}
            selectedValue={selectedSort}
            adminTheme={adminTheme}
            onSelect={(val) => {
              onSortChange(val);
              setOpenDropdown(null);
            }}
          />
        )}
      </View>

      <View className="min-w-[190px]" style={{ width: filterBasis as any, zIndex: 1 }}>
        <TotalRecordsCard totalRecords={totalRecords} />
      </View>
    </View>
  );
}
