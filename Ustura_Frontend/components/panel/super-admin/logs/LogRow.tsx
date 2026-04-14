import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Platform, Pressable, Text, View } from 'react-native';

import { hexToRgba } from '@/utils/color';

import { useSuperAdminTheme } from '../theme';
import { getSeverityPalette } from './presentation';
import type { LogListItem } from './types';

const cellActionStyle = { flex: 2.6 } as const;
const cellActorStyle = { flex: 1.6, paddingRight: 16 } as const;
const cellEntityStyle = { flex: 1.2, paddingRight: 16 } as const;
const cellDetailStyle = { flex: 2.2, paddingRight: 16 } as const;
const cellTimeStyle = { flex: 1.4, alignItems: 'flex-end' as const } as const;

interface LogRowProps {
  log: LogListItem;
  onPress?: () => void;
}

export default function LogRow({ log, onPress }: LogRowProps) {
  const adminTheme = useSuperAdminTheme();
  const severity = getSeverityPalette(log.severity, adminTheme);

  return (
    <Pressable
      onPress={onPress}
      className="min-h-[72px] flex-row items-center px-6"
      style={({ hovered }) => [
        {
          backgroundColor: hovered ? adminTheme.cardBackgroundMuted : 'transparent',
        },
        Platform.OS === 'web'
          ? ({
              transition: 'background-color 180ms ease',
              cursor: onPress ? 'pointer' : 'default',
            } as any)
          : null,
      ]}>
      <View className="min-w-0 justify-center py-[14px]" style={cellActionStyle}>
        <View className="min-w-0 flex-row items-center gap-3">
          <View
            className="h-9 w-9 shrink-0 items-center justify-center rounded-lg"
            style={{ backgroundColor: severity.backgroundColor }}>
            <MaterialIcons
              name={log.actionIcon as any}
              size={18}
              color={severity.color}
            />
          </View>
          <View className="min-w-0 flex-1 gap-0.5">
            <Text
              className="font-body text-sm"
              style={{ color: adminTheme.onSurface, fontFamily: 'Manrope-SemiBold' }}
              numberOfLines={1}>
              {log.actionLabel}
            </Text>
            <View className="flex-row items-center gap-1.5">
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
          </View>
        </View>
      </View>

      <View className="min-w-0 justify-center py-[14px]" style={cellActorStyle}>
        <Text
          className="font-body text-sm"
          style={{ color: adminTheme.onSurface, fontFamily: 'Manrope-SemiBold' }}
          numberOfLines={1}>
          {log.actorName}
        </Text>
        <Text
          className="mt-0.5 font-body text-[11px]"
          style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.8) }}
          numberOfLines={1}>
          {log.actorRole}
        </Text>
      </View>

      <View className="min-w-0 justify-center py-[14px]" style={cellEntityStyle}>
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

      <View className="min-w-0 justify-center py-[14px]" style={cellDetailStyle}>
        <Text
          className="font-body text-xs leading-[18px]"
          style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.88) }}
          numberOfLines={2}>
          {log.detail || '—'}
        </Text>
      </View>

      <View className="min-w-0 justify-center py-[14px]" style={cellTimeStyle}>
        <Text
          className="font-body text-xs"
          style={{
            color: hexToRgba(adminTheme.onSurfaceVariant, 0.72),
            fontFamily: 'Manrope-SemiBold',
          }}
          numberOfLines={1}>
          {log.relativeTime}
        </Text>
        <Text
          className="mt-0.5 font-body text-[10px]"
          style={{
            color: hexToRgba(adminTheme.onSurfaceVariant, 0.52),
            fontFamily: adminTheme.monoFont,
          }}
          numberOfLines={1}>
          {log.timestamp}
        </Text>
      </View>
    </Pressable>
  );
}
