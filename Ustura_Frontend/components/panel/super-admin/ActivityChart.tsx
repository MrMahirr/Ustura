import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Platform, Pressable, Text, View } from 'react-native';

import type { ActivitySnapshot } from '@/components/panel/super-admin/data';
import { hexToRgba } from '@/utils/color';

import { useSuperAdminTheme } from './theme';

export default function ActivityChart({ snapshots }: { snapshots: ActivitySnapshot[] }) {
  const [selectedKey, setSelectedKey] = React.useState<ActivitySnapshot['key']>(snapshots[0]?.key ?? 'weekly');
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);

  const adminTheme = useSuperAdminTheme();

  const current = snapshots.find((item) => item.key === selectedKey) ?? snapshots[0];
  const maxValue = Math.max(...current.points.map((point) => point.value), 1);
  const trackHeight = 220;

  return (
    <View className="overflow-hidden rounded-sm p-7" style={{ backgroundColor: adminTheme.cardBackground }}>
      <View className="mb-7 flex-row flex-wrap items-center justify-between gap-3">
        <Text className="font-headline text-xl" style={{ color: adminTheme.onSurface }}>
          Platform Aktivitesi
        </Text>
        <View className="flex-row gap-5">
          {snapshots.map((snapshot) => {
            const active = snapshot.key === selectedKey;
            return (
              <Pressable key={snapshot.key} onPress={() => setSelectedKey(snapshot.key)}>
                <Text
                  className="font-label text-[10px] uppercase tracking-wide"
                  style={{
                    color: active ? adminTheme.primary : adminTheme.onSurfaceVariant,
                    fontFamily: active ? 'Manrope-Bold' : 'Manrope-SemiBold',
                  }}>
                  {snapshot.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View className="flex-row items-end gap-2" style={{ height: trackHeight }}>
        {current.points.map((point, index) => {
          const pct = point.value / maxValue;
          const barH = Math.max(28, pct * (trackHeight - 8));
          const active = hoveredIndex === index;

          return (
            <Pressable
              key={`${current.key}-${point.label}`}
              className="flex-1 items-stretch"
              onHoverIn={Platform.OS === 'web' ? () => setHoveredIndex(index) : undefined}
              onHoverOut={Platform.OS === 'web' ? () => setHoveredIndex(null) : undefined}>
              <View
                className="w-full justify-end overflow-hidden rounded-sm"
                style={{
                  backgroundColor: hexToRgba(
                    adminTheme.surfaceContainerHighest,
                    adminTheme.theme === 'dark' ? 0.2 : 0.42
                  ),
                  height: trackHeight,
                }}>
                <LinearGradient
                  colors={adminTheme.goldGradient as [string, string]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{ width: '100%', height: barH, borderRadius: 4, opacity: active ? 1 : 0.42 }}
                />
              </View>
            </Pressable>
          );
        })}
      </View>

      <View className="mt-[14px] flex-row justify-between px-0.5">
        {current.points.map((point) => (
          <Text
            key={point.label}
            className="flex-1 text-center font-label text-[10px] uppercase tracking-wide"
            style={{ color: adminTheme.onSurfaceVariant }}>
            {point.label}
          </Text>
        ))}
      </View>
    </View>
  );
}
