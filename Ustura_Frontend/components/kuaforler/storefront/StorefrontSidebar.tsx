import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Platform, Text, View } from 'react-native';

import Button from '@/components/ui/Button';
import { useThemeColor } from '@/hooks/use-theme-color';
import { hexToRgba } from '@/utils/color';

import type {
  StorefrontQuickFact,
  StorefrontWorkingDay,
} from './presentation';

interface StorefrontSidebarProps {
  location: string;
  address: string;
  quickFacts: StorefrontQuickFact[];
  workingDays: StorefrontWorkingDay[];
  onOpenMaps: () => void;
}

export default function StorefrontSidebar({
  location,
  address,
  quickFacts,
  workingDays,
  onOpenMaps,
}: StorefrontSidebarProps) {
  const surfaceContainerLowest = useThemeColor({}, 'surfaceContainerLowest');
  const surfaceContainerLow = useThemeColor({}, 'surfaceContainerLow');
  const onSurface = useThemeColor({}, 'onSurface');
  const onSurfaceVariant = useThemeColor({}, 'onSurfaceVariant');
  const outlineVariant = useThemeColor({}, 'outlineVariant');
  const primary = useThemeColor({}, 'primary');

  return (
    <View style={{ gap: 16 }}>
      <SidebarCard title="Hizli bakis">
        <View style={{ gap: 12 }}>
          {quickFacts.map((fact) => (
            <View
              key={fact.id}
              className="rounded-[22px] border px-4 py-4"
              style={{
                backgroundColor: surfaceContainerLow,
                borderColor: hexToRgba(primary, 0.14),
              }}>
              <View className="flex-row items-start gap-3">
                <View
                  className="mt-0.5 h-10 w-10 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: hexToRgba(primary, 0.14) }}>
                  <MaterialIcons name={fact.icon} size={18} color={primary} />
                </View>
                <View className="flex-1">
                  <Text className="font-label text-[11px] uppercase tracking-[1.8px]" style={{ color: onSurfaceVariant }}>
                    {fact.label}
                  </Text>
                  <Text className="mt-1 text-base font-semibold" style={{ color: onSurface }}>
                    {fact.value}
                  </Text>
                  <Text className="mt-1 text-sm leading-5" style={{ color: onSurfaceVariant }}>
                    {fact.hint}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </SidebarCard>

      <SidebarCard title="Calisma saatleri">
        <View style={{ gap: 10 }}>
          {workingDays.map((day) => (
            <View
              key={day.key}
              className="flex-row items-center justify-between rounded-[18px] border px-4 py-3"
              style={{
                backgroundColor: day.isToday
                  ? hexToRgba(primary, 0.12)
                  : surfaceContainerLow,
                borderColor: day.isToday
                  ? hexToRgba(primary, 0.22)
                  : hexToRgba(outlineVariant, 0.86),
              }}>
              <View>
                <Text className="text-sm font-semibold" style={{ color: onSurface }}>
                  {day.label}
                </Text>
                {day.isToday ? (
                  <Text className="mt-1 text-[11px] uppercase tracking-[1.6px]" style={{ color: primary }}>
                    Bugun
                  </Text>
                ) : null}
              </View>
              <Text
                className="text-sm font-semibold"
                style={{ color: day.isClosed ? onSurfaceVariant : onSurface }}>
                {day.range}
              </Text>
            </View>
          ))}
        </View>
      </SidebarCard>

      <SidebarCard title="Konum ve ulasim">
        <Text className="text-sm uppercase tracking-[1.8px]" style={{ color: primary }}>
          {location}
        </Text>
        <Text className="mt-3 text-base leading-7" style={{ color: onSurfaceVariant }}>
          {address}
        </Text>
        <View className="mt-5">
          <Button
            title="Haritada ac"
            variant="outline"
            interactionPreset="outlineCta"
            icon="open-in-new"
            onPress={onOpenMaps}
          />
        </View>
      </SidebarCard>
    </View>
  );

  function SidebarCard({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) {
    return (
      <View
        className="rounded-[30px] border p-6"
        style={[
          {
            backgroundColor: surfaceContainerLowest,
            borderColor: outlineVariant,
          },
          Platform.OS === 'web'
            ? ({
                boxShadow: `0 18px 40px ${hexToRgba(primary, 0.08)}`,
                transition:
                  'background-color 360ms ease, border-color 360ms ease, box-shadow 240ms ease',
              } as any)
            : {
                shadowColor: primary,
                shadowOpacity: 0.08,
                shadowRadius: 20,
                shadowOffset: { width: 0, height: 10 },
                elevation: 5,
              },
        ]}>
        <Text className="font-headline text-[24px] font-bold" style={{ color: onSurface }}>
          {title}
        </Text>
        <View className="mt-5">{children}</View>
      </View>
    );
  }
}
