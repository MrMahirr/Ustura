import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import type { ActivitySnapshot } from '@/components/panel/super-admin/data';
import { Typography } from '@/constants/typography';
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
    <View style={[styles.card, { backgroundColor: adminTheme.cardBackground }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: adminTheme.onSurface }]}>Platform Aktivitesi</Text>
        <View style={styles.tabs}>
          {snapshots.map((snapshot) => {
            const active = snapshot.key === selectedKey;
            return (
              <Pressable key={snapshot.key} onPress={() => setSelectedKey(snapshot.key)}>
                <Text
                  style={[
                    styles.tab,
                    {
                      color: active ? adminTheme.primary : adminTheme.onSurfaceVariant,
                      fontFamily: active ? 'Manrope-Bold' : 'Manrope-SemiBold',
                    },
                  ]}>
                  {snapshot.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={[styles.chartRow, { height: trackHeight }]}>
        {current.points.map((point, index) => {
          const pct = point.value / maxValue;
          const barH = Math.max(28, pct * (trackHeight - 8));
          const active = hoveredIndex === index;

          return (
            <Pressable
              key={`${current.key}-${point.label}`}
              style={styles.barColumn}
              onHoverIn={Platform.OS === 'web' ? () => setHoveredIndex(index) : undefined}
              onHoverOut={Platform.OS === 'web' ? () => setHoveredIndex(null) : undefined}>
              <View
                style={[
                  styles.track,
                  {
                    backgroundColor: hexToRgba(
                      adminTheme.surfaceContainerHighest,
                      adminTheme.theme === 'dark' ? 0.2 : 0.42
                    ),
                    height: trackHeight,
                  },
                ]}>
                <LinearGradient
                  colors={adminTheme.goldGradient as [string, string]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[
                    styles.barFill,
                    {
                      height: barH,
                      opacity: active ? 1 : 0.42,
                    },
                  ]}
                />
              </View>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.axis}>
        {current.points.map((point) => (
          <Text key={point.label} style={[styles.axisLabel, { color: adminTheme.onSurfaceVariant }]}>
            {point.label}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 4,
    padding: 28,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
    flexWrap: 'wrap',
    gap: 12,
  },
  title: {
    fontFamily: 'NotoSerif-Bold',
    fontSize: 20,
  },
  tabs: {
    flexDirection: 'row',
    gap: 20,
  },
  tab: {
    ...Typography.labelSm,
    fontSize: 10,
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  barColumn: {
    flex: 1,
    alignItems: 'stretch',
  },
  track: {
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    borderRadius: 2,
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: 2,
  },
  axis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingHorizontal: 2,
  },
  axisLabel: {
    ...Typography.labelSm,
    fontSize: 10,
    flex: 1,
    textAlign: 'center',
  },
});
