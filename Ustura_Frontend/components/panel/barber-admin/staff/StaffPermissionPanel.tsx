import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import Card from '@/components/ui/Card';
import { useBarberAdminTheme } from '@/components/panel/barber-admin/theme';
import { STAFF_ROLE_ICONS } from '@/components/panel/barber-admin/staff/presentation';
import { hexToRgba } from '@/utils/color';

import type { StaffRoleInsight } from './types';

interface StaffPermissionPanelProps {
  insights: StaffRoleInsight[];
}

export default function StaffPermissionPanel({ insights }: StaffPermissionPanelProps) {
  const theme = useBarberAdminTheme();

  return (
    <Card variant="glass" contentStyle={{ gap: 18 }}>
      <View className="gap-2">
        <Text
          style={{
            color: theme.onSurface,
            fontFamily: 'Manrope-Bold',
            fontSize: 18,
          }}>
          Yetki sablonlari
        </Text>
        <Text
          style={{
            color: hexToRgba(theme.onSurfaceVariant, 0.7),
            fontSize: 13,
            lineHeight: 20,
          }}>
          Rol dagilimini tek ekranda gorup ekip dengesini koruyun.
        </Text>
      </View>

      <View className="gap-3">
        {insights.map((insight) => {
          const accentColor = insight.role === 'barber' ? theme.primary : theme.warning;

          return (
            <View
              key={insight.role}
              className="rounded-2xl border p-4"
              style={{
                borderColor: hexToRgba(accentColor, 0.2),
                backgroundColor: hexToRgba(accentColor, 0.08),
                gap: 12,
              }}>
              <View className="flex-row items-center justify-between gap-3">
                <View className="flex-row items-center gap-3">
                  <View
                    className="h-11 w-11 items-center justify-center rounded-2xl"
                    style={{ backgroundColor: hexToRgba(accentColor, 0.14) }}>
                    <MaterialIcons name={STAFF_ROLE_ICONS[insight.role]} size={20} color={accentColor} />
                  </View>
                  <View className="gap-1">
                    <Text
                      style={{
                        color: theme.onSurface,
                        fontFamily: 'Manrope-Bold',
                        fontSize: 15,
                      }}>
                      {insight.label}
                    </Text>
                    <Text
                      style={{
                        color: hexToRgba(theme.onSurfaceVariant, 0.72),
                        fontSize: 12,
                        maxWidth: 320,
                      }}>
                      {insight.description}
                    </Text>
                  </View>
                </View>

                <View className="items-end gap-1">
                  <Text
                    style={{
                      color: accentColor,
                      fontFamily: 'Manrope-Bold',
                      fontSize: 24,
                    }}>
                    {insight.count}
                  </Text>
                  <Text
                    style={{
                      color: hexToRgba(theme.onSurfaceVariant, 0.58),
                      fontFamily: 'Manrope-SemiBold',
                      fontSize: 11,
                      textTransform: 'uppercase',
                      letterSpacing: 1.2,
                    }}>
                    {insight.actionLabel}
                  </Text>
                </View>
              </View>

              <View className="gap-2">
                {insight.highlights.map((highlight) => (
                  <View key={highlight} className="flex-row items-start gap-2">
                    <MaterialIcons
                      name="check-circle"
                      size={16}
                      color={accentColor}
                      style={{ marginTop: 1 }}
                    />
                    <Text
                      style={{
                        color: theme.onSurface,
                        fontSize: 13,
                        lineHeight: 20,
                        flex: 1,
                      }}>
                      {highlight}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          );
        })}
      </View>
    </Card>
  );
}
