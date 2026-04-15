import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import {
  LayoutAnimation,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import type { UserFilterOption } from '@/components/panel/super-admin/user-management.data';
import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { hexToRgba } from '@/utils/color';

import { userClassNames } from './presentation';

const DROPDOWN_MAX_HEIGHT = 240;
const ITEM_HEIGHT = 42;

interface DropdownFilterProps {
  label: string;
  selectedValue: string | undefined;
  options: UserFilterOption[];
  onSelect: (value: string | undefined) => void;
  minWidth?: number;
}

interface UserFiltersProps {
  selectedRole: string;
  selectedRoleValue: string | undefined;
  roleOptions: UserFilterOption[];
  onSelectRole: (value: string | undefined) => void;

  selectedStatus: string;
  selectedStatusValue: string | undefined;
  statusOptions: UserFilterOption[];
  onSelectStatus: (value: string | undefined) => void;

  selectedSalon: string;
  selectedSalonValue: string | undefined;
  salonOptions: UserFilterOption[];
  onSelectSalon: (value: string | undefined) => void;

  selectedCity: string;
  selectedCityValue: string | undefined;
  cityOptions: UserFilterOption[];
  onSelectCity: (value: string | undefined) => void;

  onReset: () => void;
}

function DropdownFilter({
  label,
  selectedValue,
  options,
  onSelect,
  minWidth = 140,
}: DropdownFilterProps) {
  const adminTheme = useSuperAdminTheme();
  const [open, setOpen] = React.useState(false);
  const chevronRotation = useSharedValue(0);

  const toggle = React.useCallback(() => {
    if (Platform.OS !== 'web') {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }
    setOpen((prev) => {
      chevronRotation.value = withTiming(!prev ? 1 : 0, { duration: 220 });
      return !prev;
    });
  }, [chevronRotation]);

  const close = React.useCallback(() => {
    chevronRotation.value = withTiming(0, { duration: 220 });
    setOpen(false);
  }, [chevronRotation]);

  const handleSelect = React.useCallback(
    (value: string | undefined) => {
      onSelect(value);
      close();
    },
    [onSelect, close],
  );

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${chevronRotation.value * 180}deg` }],
  }));

  const needsScroll = options.length * ITEM_HEIGHT > DROPDOWN_MAX_HEIGHT;
  const dropdownHeight = Math.min(options.length * ITEM_HEIGHT, DROPDOWN_MAX_HEIGHT);

  return (
    <View style={{ minWidth, zIndex: open ? 50 : 1 }}>
      <Pressable
        onPress={toggle}
        className={userClassNames.filterField}
        style={({ hovered, pressed }) => [
          {
            minWidth,
            backgroundColor: open
              ? adminTheme.cardBackgroundStrong
              : hovered
                ? adminTheme.cardBackgroundStrong
                : hexToRgba(adminTheme.cardBackgroundStrong, 0.76),
            borderColor: open
              ? adminTheme.primary
              : hovered
                ? adminTheme.borderStrong
                : adminTheme.borderSubtle,
            transform: [{ translateY: pressed ? 1 : hovered ? -1 : 0 }],
          },
          Platform.OS === 'web'
            ? ({
                transition:
                  'transform 180ms ease, background-color 180ms ease, border-color 180ms ease, box-shadow 220ms ease',
                cursor: 'pointer',
              } as any)
            : null,
        ]}>
        <Text
          className={userClassNames.filterFieldText}
          style={{ color: adminTheme.onSurface }}
          numberOfLines={1}>
          {label}
        </Text>
        <Animated.View style={chevronStyle}>
          <MaterialIcons
            name="expand-more"
            size={18}
            color={open ? adminTheme.primary : hexToRgba(adminTheme.onSurfaceVariant, 0.7)}
          />
        </Animated.View>
      </Pressable>

      {open && (
        <>
          {Platform.OS === 'web' && (
            <Pressable
              onPress={close}
              style={{
                position: 'fixed' as any,
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 40,
              }}
            />
          )}

          <Animated.View
            entering={FadeIn.duration(160)}
            exiting={FadeOut.duration(120)}
            style={[
              {
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                marginTop: 6,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: adminTheme.borderStrong,
                backgroundColor: adminTheme.cardBackground,
                zIndex: 60,
                overflow: 'hidden',
                height: dropdownHeight,
              },
              Platform.OS === 'web'
                ? ({
                    boxShadow:
                      adminTheme.theme === 'dark'
                        ? '0 12px 40px rgba(0,0,0,0.48)'
                        : '0 12px 40px rgba(27,27,32,0.14)',
                  } as any)
                : {
                    shadowColor: '#000',
                    shadowOpacity: adminTheme.theme === 'dark' ? 0.4 : 0.12,
                    shadowRadius: 16,
                    shadowOffset: { width: 0, height: 8 },
                    elevation: 12,
                  },
            ]}>
            <ScrollView
              bounces={false}
              showsVerticalScrollIndicator={needsScroll}
              nestedScrollEnabled
              style={{ maxHeight: DROPDOWN_MAX_HEIGHT }}>
              {options.map((option, index) => {
                const isSelected = option.value === selectedValue;
                const isLast = index === options.length - 1;

                return (
                  <DropdownItem
                    key={option.value ?? '__all__'}
                    label={option.label}
                    isSelected={isSelected}
                    isLast={isLast}
                    onPress={() => handleSelect(option.value)}
                  />
                );
              })}
            </ScrollView>
          </Animated.View>
        </>
      )}
    </View>
  );
}

const DropdownItem = React.memo(function DropdownItem({
  label,
  isSelected,
  isLast,
  onPress,
}: {
  label: string;
  isSelected: boolean;
  isLast: boolean;
  onPress: () => void;
}) {
  const adminTheme = useSuperAdminTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ hovered }) => [
        {
          height: ITEM_HEIGHT,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 14,
          gap: 10,
          backgroundColor: isSelected
            ? hexToRgba(adminTheme.primary, 0.1)
            : hovered
              ? hexToRgba(adminTheme.onSurface, 0.04)
              : 'transparent',
          borderBottomWidth: isLast ? 0 : 1,
          borderBottomColor: hexToRgba(adminTheme.borderSubtle, 0.5),
        },
        Platform.OS === 'web'
          ? ({ transition: 'background-color 120ms ease', cursor: 'pointer' } as any)
          : null,
      ]}>
      {isSelected && (
        <MaterialIcons name="check" size={15} color={adminTheme.primary} />
      )}
      <Text
        numberOfLines={1}
        style={{
          flex: 1,
          fontFamily: Platform.select({ web: 'Manrope, sans-serif', default: 'System' }),
          fontSize: 13,
          fontWeight: isSelected ? '700' : '500',
          color: isSelected ? adminTheme.primary : adminTheme.onSurface,
        }}>
        {label}
      </Text>
    </Pressable>
  );
});

export default function UserFilters({
  selectedRole,
  selectedRoleValue,
  roleOptions,
  onSelectRole,
  selectedStatus,
  selectedStatusValue,
  statusOptions,
  onSelectStatus,
  selectedSalon,
  selectedSalonValue,
  salonOptions,
  onSelectSalon,
  selectedCity,
  selectedCityValue,
  cityOptions,
  onSelectCity,
  onReset,
}: UserFiltersProps) {
  const adminTheme = useSuperAdminTheme();
  const { width } = useWindowDimensions();
  const isCompact = width < 640;

  return (
    <View
      className={userClassNames.filterShell}
      style={{
        backgroundColor: hexToRgba(adminTheme.cardBackground, 0.88),
        borderColor: adminTheme.borderSubtle,
        zIndex: 30,
        ...(Platform.OS === 'web'
          ? ({
              position: 'sticky',
              top: 18,
              backdropFilter: 'blur(18px)',
              WebkitBackdropFilter: 'blur(18px)',
              boxShadow:
                adminTheme.theme === 'dark'
                  ? '0 18px 44px rgba(0, 0, 0, 0.28)'
                  : '0 18px 44px rgba(27, 27, 32, 0.08)',
            } as any)
          : null),
      }}>
      <View
        className={userClassNames.filterRow}
        style={{ zIndex: 30 }}>
        <DropdownFilter
          label={selectedRole}
          selectedValue={selectedRoleValue}
          options={roleOptions}
          onSelect={onSelectRole}
          minWidth={isCompact ? 120 : 140}
        />
        <DropdownFilter
          label={selectedStatus}
          selectedValue={selectedStatusValue}
          options={statusOptions}
          onSelect={onSelectStatus}
          minWidth={isCompact ? 120 : 140}
        />
        <DropdownFilter
          label={selectedSalon}
          selectedValue={selectedSalonValue}
          options={salonOptions}
          onSelect={onSelectSalon}
          minWidth={isCompact ? 140 : 180}
        />
        <DropdownFilter
          label={selectedCity}
          selectedValue={selectedCityValue}
          options={cityOptions}
          onSelect={onSelectCity}
          minWidth={isCompact ? 120 : 140}
        />

        <Pressable
          onPress={onReset}
          className={userClassNames.clearButton}
          style={({ hovered, pressed }) => [
            {
              backgroundColor: hovered
                ? hexToRgba(adminTheme.primary, 0.08)
                : 'transparent',
              transform: [{ scale: pressed ? 0.985 : 1 }],
            },
            Platform.OS === 'web'
              ? ({
                  transition:
                    'background-color 160ms ease, border-color 160ms ease, opacity 160ms ease, transform 160ms ease',
                  cursor: 'pointer',
                } as any)
              : null,
          ]}>
          <MaterialIcons
            name="filter-list-off"
            size={18}
            color={adminTheme.onSurfaceVariant}
          />
          <Text
            className={userClassNames.clearButtonText}
            style={{ color: adminTheme.onSurfaceVariant }}>
            Temizle
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
