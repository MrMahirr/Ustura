import React from 'react';
import { View, Text, useWindowDimensions, Pressable, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import Input from '@/components/ui/Input';
import { useThemeColor } from '@/hooks/use-theme-color';
import { hexToRgba } from '@/utils/color';

export type SalonSortOption = 'default' | 'name-asc' | 'name-desc';

interface FilterBarProps {
  searchQuery: string;
  activeCity: string;
  cities: string[];
  activeSort: SalonSortOption;
  onSearchChange: (value: string) => void;
  onCityChange: (city: string) => void;
  onSortChange: (sort: SalonSortOption) => void;
}

interface SelectDropdownProps<TOption extends string> {
  label: string;
  valueLabel: string;
  options: { label: string; value: TOption }[];
  selectedValue: TOption | string;
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (value: TOption) => void;
}

function SelectDropdown<TOption extends string>({
  label,
  valueLabel,
  options,
  selectedValue,
  isOpen,
  onToggle,
  onSelect,
}: SelectDropdownProps<TOption>) {
  const primary = useThemeColor({}, 'primary');
  const onSurface = useThemeColor({}, 'onSurface');
  const onSurfaceVariant = useThemeColor({}, 'onSurfaceVariant');
  const surface = useThemeColor({}, 'surface');
  const surfaceContainerLow = useThemeColor({}, 'surfaceContainerLow');
  const surfaceContainerLowest = useThemeColor({}, 'surfaceContainerLowest');
  const outlineVariant = useThemeColor({}, 'outlineVariant');

  return (
    <View style={{ minWidth: 210, position: 'relative', zIndex: isOpen ? 120 : 2 }}>
      <Text className="mb-2 font-label text-[11px] uppercase tracking-[2px]" style={{ color: onSurfaceVariant }}>
        {label}
      </Text>

      <Pressable
        onPress={onToggle}
        style={({ hovered, pressed }) => [
          {
            minHeight: 50,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            borderWidth: 1,
            borderRadius: 18,
            paddingHorizontal: 16,
            backgroundColor: hovered || pressed || isOpen ? hexToRgba(primary, 0.08) : surface,
            borderColor: hovered || pressed || isOpen ? hexToRgba(primary, 0.28) : outlineVariant,
          },
          Platform.OS === 'web'
            ? ({ transition: 'background-color 220ms ease, border-color 220ms ease' } as any)
            : null,
        ]}>
        <Text className="font-body text-sm font-semibold" style={{ color: onSurface }}>
          {valueLabel}
        </Text>
        <MaterialIcons
          name={isOpen ? 'expand-less' : 'expand-more'}
          size={20}
          color={primary}
        />
      </Pressable>

      {isOpen ? (
        <View
          className="absolute left-0 right-0 overflow-hidden rounded-[20px] border"
          style={[
            {
              top: 78,
              zIndex: 140,
              borderColor: outlineVariant,
              backgroundColor: surfaceContainerLow,
            },
            Platform.OS === 'web'
              ? ({
                  boxShadow: '0 18px 40px rgba(27, 27, 32, 0.14)',
                } as any)
              : {
                  shadowColor: '#000000',
                  shadowOpacity: 0.12,
                  shadowRadius: 18,
                  shadowOffset: { width: 0, height: 8 },
                  elevation: 8,
                },
          ]}>
          {options.map((option, index) => {
            const isSelected = option.value === selectedValue;

            return (
              <Pressable
                key={option.value}
                onPress={() => onSelect(option.value)}
                style={({ hovered, pressed }) => ({
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  borderTopWidth: index === 0 ? 0 : 1,
                  borderTopColor: outlineVariant,
                  backgroundColor: isSelected
                    ? hexToRgba(primary, 0.1)
                    : hovered || pressed
                      ? surfaceContainerLowest
                      : surfaceContainerLow,
                })}>
                <View className="flex-row items-center justify-between gap-3">
                  <Text className="font-body text-sm font-medium" style={{ color: onSurface }}>
                    {option.label}
                  </Text>
                  {isSelected ? (
                    <MaterialIcons name="check" size={18} color={primary} />
                  ) : null}
                </View>
              </Pressable>
            );
          })}
        </View>
      ) : null}
    </View>
  );
}

export default function FilterBar({
  searchQuery,
  activeCity,
  cities,
  activeSort,
  onSearchChange,
  onCityChange,
  onSortChange,
}: FilterBarProps) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const [openDropdown, setOpenDropdown] = React.useState<'city' | 'sort' | null>(null);

  const primary = useThemeColor({}, 'primary');
  const onSurface = useThemeColor({}, 'onSurface');
  const onSurfaceVariant = useThemeColor({}, 'onSurfaceVariant');
  const surface = useThemeColor({}, 'surface');
  const surfaceContainerLowest = useThemeColor({}, 'surfaceContainerLowest');
  const outlineVariant = useThemeColor({}, 'outlineVariant');
  const cityOptions = React.useMemo(
    () => cities.map((city) => ({ label: city, value: city })),
    [cities]
  );
  const sortOptions = React.useMemo(
    () => [
      { label: 'Varsayilan', value: 'default' as const },
      { label: 'Isme Gore A-Z', value: 'name-asc' as const },
      { label: 'Isme Gore Z-A', value: 'name-desc' as const },
    ],
    []
  );
  const activeSortLabel =
    sortOptions.find((option) => option.value === activeSort)?.label ?? 'Varsayilan';

  return (
    <View
      className="my-12 w-full gap-6 rounded-[28px] border px-5 py-6"
      style={[
        {
          position: 'relative',
          zIndex: openDropdown ? 80 : 4,
          backgroundColor: surfaceContainerLowest,
          borderColor: outlineVariant,
        },
        Platform.OS === 'web'
          ? ({
              boxShadow: openDropdown
                ? '0 22px 48px rgba(27, 27, 32, 0.12)'
                : '0 10px 28px rgba(27, 27, 32, 0.06)',
            } as any)
          : {
              shadowColor: '#000000',
              shadowOpacity: openDropdown ? 0.12 : 0.06,
              shadowRadius: openDropdown ? 18 : 10,
              shadowOffset: { width: 0, height: openDropdown ? 8 : 4 },
              elevation: openDropdown ? 8 : 4,
            },
      ]}>
      <View
        className="justify-between gap-6"
        style={{ flexDirection: isDesktop ? 'row' : 'column', alignItems: isDesktop ? 'flex-end' : 'flex-start' }}>
        <View className="gap-2">
          <Text className="font-label text-base uppercase tracking-[2px]" style={{ color: primary }}>
            KESFET
          </Text>
          <Text className="font-headline text-5xl font-bold" style={{ color: onSurface }}>
            Kuaforler
          </Text>
        </View>

        <View className="self-stretch" style={{ width: isDesktop ? 384 : '100%' }}>
          <Input
            value={searchQuery}
            onChangeText={onSearchChange}
            placeholder="Salon veya hizmet ara..."
            iconLeft="search"
            containerStyle={{
              marginTop: 0,
              borderBottomWidth: 1,
              borderRadius: 18,
              paddingHorizontal: 12,
              backgroundColor: surface,
            }}
          />
        </View>
      </View>

      <View
        className="w-full justify-between py-4"
        style={{ flexDirection: isDesktop ? 'row' : 'column', alignItems: isDesktop ? 'center' : 'flex-start', gap: 18 }}>
        <View className="flex-row flex-wrap gap-4">
          <SelectDropdown
            label="Sehir"
            valueLabel={activeCity}
            options={cityOptions}
            selectedValue={activeCity}
            isOpen={openDropdown === 'city'}
            onToggle={() =>
              setOpenDropdown((current) => (current === 'city' ? null : 'city'))
            }
            onSelect={(city) => {
              onCityChange(city);
              setOpenDropdown(null);
            }}
          />

          <SelectDropdown
            label="Siralama"
            valueLabel={activeSortLabel}
            options={sortOptions}
            selectedValue={activeSort}
            isOpen={openDropdown === 'sort'}
            onToggle={() =>
              setOpenDropdown((current) => (current === 'sort' ? null : 'sort'))
            }
            onSelect={(sort) => {
              onSortChange(sort);
              setOpenDropdown(null);
            }}
          />
        </View>

        <Text className="font-body text-sm" style={{ color: onSurfaceVariant, marginTop: isDesktop ? 18 : 0 }}>
          Filtrelerini dropdown icinden secerek sonucu daralt.
        </Text>
      </View>
    </View>
  );
}
