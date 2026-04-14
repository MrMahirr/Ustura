import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Platform, Pressable, Text, View } from 'react-native';

import { hexToRgba } from '@/utils/color';

import { useSuperAdminTheme } from '../theme';
import { getSeverityPalette } from './presentation';
import type { LogListItem } from './types';

interface LogMobileCardProps {
  log: LogListItem;
  onPress?: () => void;
}

export default function LogMobileCard({ log, onPress }: LogMobileCardProps) {
  const adminTheme = useSuperAdminTheme();
  const severity = getSeverityPalette(log.severity, adminTheme);

  return (
    <Pressable
      onPress={onPress}
      className="gap-3.5 rounded-[10px] border p-4"
      style={[
        {
          backgroundColor: adminTheme.cardBackground,
          borderColor: adminTheme.borderSubtle,
        },
        Platform.OS === 'web' && onPress ? ({ cursor: 'pointer' } as any) : null,
      ]}>
      <View className="flex-row items-start justify-between gap-3">
        <View className="min-w-0 flex-1 flex-row items-center gap-3">
          <View
            className="h-9 w-9 shrink-0 items-center justify-center rounded-lg"
            style={{ backgroundColor: severity.backgroundColor }}>
            <MaterialIcons
              name={log.actionIcon as any}
              size={18}
              color={severity.color}
            />
          </View>
          <View className="min-w-0 flex-1 gap-1">
            <Text
              className="font-body text-sm"
              style={{ color: adminTheme.onSurface, fontFamily: 'Manrope-Bold' }}
              numberOfLines={1}>
              {log.actionLabel}
            </Text>
            <Text
              className="font-body text-xs"
              style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.82) }}
              numberOfLines={1}>
              {log.actorName} · {log.actorRole}
            </Text>
          </View>
        </View>

        <View
          className="rounded-full border px-2 py-0.5"
          style={{
            backgroundColor: severity.backgroundColor,
            borderColor: severity.borderColor,
          }}>
          <Text
            className="font-label text-[8px] uppercase tracking-[1px]"
            style={{ color: severity.color, fontFamily: 'Manrope-Bold' }}>
            {log.severity === 'info'
              ? 'BİLGİ'
              : log.severity === 'success'
                ? 'BAŞARILI'
                : log.severity === 'warning'
                  ? 'UYARI'
                  : 'KRİTİK'}
          </Text>
        </View>
      </View>

      <View className="flex-row flex-wrap gap-3.5">
        <View className="min-w-[120px] flex-1 gap-1">
          <Text
            className="font-label text-[10px] uppercase tracking-widest"
            style={{
              color: hexToRgba(adminTheme.onSurfaceVariant, 0.72),
              fontFamily: 'Manrope-Bold',
            }}>
            Varlık
          </Text>
          <View
            className="self-start rounded-full border px-2.5 py-1"
            style={{
              backgroundColor: hexToRgba(adminTheme.primary, 0.06),
              borderColor: hexToRgba(adminTheme.primary, 0.12),
            }}>
            <Text
              className="font-label text-[10px] uppercase tracking-wide"
              style={{ color: adminTheme.primary, fontFamily: 'Manrope-Bold' }}>
              {log.entityTypeLabel}
            </Text>
          </View>
        </View>
        {log.detail ? (
          <View className="min-w-[150px] flex-[2] gap-1">
            <Text
              className="font-label text-[10px] uppercase tracking-widest"
              style={{
                color: hexToRgba(adminTheme.onSurfaceVariant, 0.72),
                fontFamily: 'Manrope-Bold',
              }}>
              Detay
            </Text>
            <Text
              className="font-body text-[13px] leading-5"
              style={{ color: adminTheme.onSurface }}
              numberOfLines={2}>
              {log.detail}
            </Text>
          </View>
        ) : null}
      </View>

      <View className="flex-row items-center justify-between border-t pt-3" style={{ borderTopColor: adminTheme.borderSubtle }}>
        <Text
          className="font-body text-xs"
          style={{
            color: hexToRgba(adminTheme.onSurfaceVariant, 0.72),
            fontFamily: 'Manrope-SemiBold',
          }}>
          {log.relativeTime}
        </Text>
        <Text
          className="font-body text-[10px]"
          style={{
            color: hexToRgba(adminTheme.onSurfaceVariant, 0.52),
            fontFamily: adminTheme.monoFont,
          }}>
          {log.timestamp}
        </Text>
      </View>
    </Pressable>
  );
}
