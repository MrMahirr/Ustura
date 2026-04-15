import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Platform, Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { hexToRgba } from '@/utils/color';

import { useSuperAdminTheme } from '../theme';
import type { LogFilterOption } from './types';

interface LogFiltersProps {
  selectedActionLabel: string;
  selectedEntityLabel: string;
  actionOptions: LogFilterOption[];
  entityOptions: LogFilterOption[];
  onActionChange: (value: string | undefined) => void;
  onEntityChange: (value: string | undefined) => void;
  onReset: () => void;
}

export default function LogFilters({
  selectedActionLabel,
  selectedEntityLabel,
  actionOptions,
  entityOptions,
  onActionChange,
  onEntityChange,
  onReset,
}: LogFiltersProps) {
  const adminTheme = useSuperAdminTheme();

  return (
    <View className="flex-row flex-wrap items-center gap-3">
      <DropdownFilter
        label="İşlem"
        selectedLabel={selectedActionLabel}
        options={actionOptions}
        onSelect={onActionChange}
      />
      <DropdownFilter
        label="Varlık Tipi"
        selectedLabel={selectedEntityLabel}
        options={entityOptions}
        onSelect={onEntityChange}
      />
      <Pressable
        onPress={onReset}
        className="flex-row items-center gap-1.5 rounded-md border px-3 py-2.5"
        style={({ hovered }) => [
          {
            borderColor: hovered
              ? hexToRgba(adminTheme.primary, 0.3)
              : adminTheme.borderSubtle,
            backgroundColor: hovered
              ? hexToRgba(adminTheme.primary, 0.06)
              : 'transparent',
          },
          Platform.OS === 'web'
            ? ({
                transition: 'background-color 160ms ease, border-color 160ms ease',
                cursor: 'pointer',
              } as any)
            : null,
        ]}>
        <MaterialIcons name="restart-alt" size={14} color={adminTheme.onSurfaceVariant} />
        <Text
          className="font-label text-[10px] uppercase tracking-[1.5px]"
          style={{ color: adminTheme.onSurfaceVariant, fontFamily: 'Manrope-SemiBold' }}>
          Sıfırla
        </Text>
      </Pressable>
    </View>
  );
}

const DROPDOWN_MAX_HEIGHT = 240;

function DropdownFilter({
  label,
  selectedLabel,
  options,
  onSelect,
}: {
  label: string;
  selectedLabel: string;
  options: LogFilterOption[];
  onSelect: (value: string | undefined) => void;
}) {
  const adminTheme = useSuperAdminTheme();
  const [open, setOpen] = React.useState(false);

  const toggle = React.useCallback(() => setOpen((p) => !p), []);

  return (
    <View style={{ minWidth: 160, zIndex: open ? 50 : 1 }}>
      <Pressable
        onPress={toggle}
        className="flex-row items-center justify-between gap-2 rounded-md border px-3 py-2.5"
        style={[
          {
            backgroundColor: open
              ? hexToRgba(adminTheme.primary, 0.06)
              : adminTheme.cardBackground,
            borderColor: open
              ? hexToRgba(adminTheme.primary, 0.3)
              : adminTheme.borderSubtle,
          },
          Platform.OS === 'web'
            ? ({
                transition: 'background-color 160ms ease, border-color 160ms ease',
                cursor: 'pointer',
              } as any)
            : null,
        ]}>
        <View className="flex-row items-center gap-2">
          <Text
            className="font-label text-[9px] uppercase tracking-[1.5px]"
            style={{
              color: hexToRgba(adminTheme.onSurfaceVariant, 0.65),
              fontFamily: 'Manrope-Bold',
            }}>
            {label}:
          </Text>
          <Text
            className="font-body text-xs"
            style={{ color: adminTheme.onSurface, fontFamily: 'Manrope-SemiBold' }}>
            {selectedLabel}
          </Text>
        </View>
        <MaterialIcons
          name="expand-more"
          size={18}
          color={adminTheme.onSurfaceVariant}
          style={
            Platform.OS === 'web'
              ? ({
                  transition: 'transform 200ms ease',
                  transform: [{ rotate: open ? '180deg' : '0deg' }],
                } as any)
              : { transform: [{ rotate: open ? '180deg' : '0deg' }] }
          }
        />
      </Pressable>

      {open && (
        <>
          {Platform.OS === 'web' && (
            <Pressable
              onPress={() => setOpen(false)}
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
                marginTop: 4,
                backgroundColor: adminTheme.cardBackground,
                borderWidth: 1,
                borderColor: adminTheme.borderSubtle,
                borderRadius: 8,
                zIndex: 50,
                overflow: 'hidden',
              },
              Platform.OS === 'web'
                ? ({ boxShadow: '0 12px 32px rgba(0,0,0,0.22)' } as any)
                : { elevation: 8 },
            ]}>
            <ScrollView
              style={{ maxHeight: DROPDOWN_MAX_HEIGHT }}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled>
              {options.map((option, idx) => {
                const isSelected = option.label === selectedLabel;
                return (
                  <Pressable
                    key={option.value ?? `all-${idx}`}
                    onPress={() => {
                      onSelect(option.value);
                      setOpen(false);
                    }}
                    className="px-3 py-2.5"
                    style={({ hovered }) => [
                      {
                        backgroundColor: isSelected
                          ? hexToRgba(adminTheme.primary, 0.1)
                          : hovered
                            ? hexToRgba(adminTheme.onSurface, 0.04)
                            : 'transparent',
                      },
                      Platform.OS === 'web'
                        ? ({
                            transition: 'background-color 120ms ease',
                            cursor: 'pointer',
                          } as any)
                        : null,
                    ]}>
                    <Text
                      className="font-body text-xs"
                      style={{
                        color: isSelected ? adminTheme.primary : adminTheme.onSurface,
                        fontFamily: isSelected ? 'Manrope-Bold' : 'Manrope-Regular',
                      }}>
                      {option.label}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </Animated.View>
        </>
      )}
    </View>
  );
}
