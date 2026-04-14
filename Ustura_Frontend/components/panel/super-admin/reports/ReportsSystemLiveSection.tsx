import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, Text, View, useWindowDimensions } from 'react-native';

import { hexToRgba } from '@/utils/color';

import type { LiveActivityItem } from './types';
import ReportsSectionTitle from './ReportsSectionTitle';

const BLUE = '#60a5fa';

interface ReportsSystemLiveSectionProps {
  feed: LiveActivityItem[];
  system: { apiUptimePct: number; responseTimeMs: number; errorRatePct: number };
  primary: string;
  success: string;
  error: string;
  onSurface: string;
  onSurfaceVariant: string;
  surfaceContainerHighest: string;
  surfaceContainerLow: string;
}

function iconColor(tone: LiveActivityItem['tone'], primary: string, success: string, onSurfaceVariant: string) {
  switch (tone) {
    case 'success':
      return success;
    case 'info':
      return BLUE;
    case 'muted':
      return onSurfaceVariant;
    default:
      return primary;
  }
}

export default function ReportsSystemLiveSection({
  feed,
  system,
  primary,
  success,
  error,
  onSurface,
  onSurfaceVariant,
  surfaceContainerHighest,
  surfaceContainerLow,
}: ReportsSystemLiveSectionProps) {
  const { width } = useWindowDimensions();
  const isWide = width >= 1024;

  const metric = (
    label: string,
    value: string,
    border: string,
    icon: React.ComponentProps<typeof MaterialIcons>['name'],
    iconColorValue: string,
  ) => (
    <View
      className="flex-row items-center justify-between rounded-sm p-5"
      style={{
        backgroundColor: surfaceContainerLow,
        borderLeftWidth: 4,
        borderLeftColor: border,
      }}>
      <View>
        <Text className="font-label text-[10px] font-bold uppercase tracking-widest" style={{ color: onSurfaceVariant }}>
          {label}
        </Text>
        <Text className="mt-1 text-2xl font-bold" style={{ color: onSurface }}>
          {value}
        </Text>
      </View>
      <MaterialIcons name={icon} size={28} color={iconColorValue} />
    </View>
  );

  return (
    <View className="gap-6" style={{ flexDirection: isWide ? 'row' : 'column' }}>
      <View className="min-w-0 flex-1 gap-4">
        <ReportsSectionTitle title="Sistem Durumu" borderColor={primary} onSurface={onSurface} />
        {metric('API Uptime', `${system.apiUptimePct.toFixed(1)}%`, success, 'check-circle', success)}
        {metric('Response Time', `${Math.round(system.responseTimeMs)}ms`, primary, 'speed', primary)}
        {metric('Error Rate', `${system.errorRatePct.toFixed(2)}%`, error, 'warning', error)}
      </View>

      <View className="min-w-0 flex-[2] rounded-sm p-6" style={{ backgroundColor: surfaceContainerLow }}>
        <View className="mb-6 flex-row items-end justify-between gap-3">
          <View className="min-w-0 flex-1 flex-row items-center gap-3">
            <View style={{ width: 4, alignSelf: 'stretch', backgroundColor: primary, borderRadius: 1 }} />
            <Text className="flex-1 font-headline text-xl font-bold uppercase italic tracking-tighter" style={{ color: onSurface }}>
              Canli Platform Akisi
            </Text>
          </View>
          <View className="flex-row items-center gap-1 pb-0.5">
            <View className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: '#ef4444' }} />
            <Text className="font-label text-[10px] font-bold uppercase tracking-widest" style={{ color: '#ef4444' }}>
              Canli
            </Text>
          </View>
        </View>
        <View className="gap-0">
          {feed.map((item, index) => (
            <View
              key={item.id}
              className="flex-row gap-3 pb-4"
              style={{
                borderBottomWidth: index < feed.length - 1 ? 1 : 0,
                borderBottomColor: hexToRgba(onSurface, 0.06),
              }}>
              <View
                className="h-10 w-10 items-center justify-center rounded-full"
                style={{ backgroundColor: surfaceContainerHighest }}>
                <MaterialIcons
                  name={(item.icon as React.ComponentProps<typeof MaterialIcons>['name']) || 'info'}
                  size={22}
                  color={iconColor(item.tone, primary, success, onSurfaceVariant)}
                />
              </View>
              <View className="min-w-0 flex-1">
                <Text className="text-sm leading-5" style={{ color: onSurface }}>
                  {item.title}
                </Text>
                <Text className="font-label mt-1 text-[10px] font-bold uppercase tracking-widest" style={{ color: onSurfaceVariant }}>
                  {item.subtitle}
                </Text>
              </View>
              <Pressable hitSlop={8}>
                <Text className="font-label text-[10px] font-bold uppercase" style={{ color: primary }}>
                  Detay
                </Text>
              </Pressable>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
