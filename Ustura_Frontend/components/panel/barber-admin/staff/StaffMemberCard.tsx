import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Platform, Pressable, Text, View } from 'react-native';

import Card from '@/components/ui/Card';
import { useBarberAdminTheme } from '@/components/panel/barber-admin/theme';
import { STAFF_ROLE_ICONS } from '@/components/panel/barber-admin/staff/presentation';
import { hexToRgba } from '@/utils/color';

import type { StaffDirectoryItem } from './types';

interface StaffMemberCardProps {
  item: StaffDirectoryItem;
  onEdit: (item: StaffDirectoryItem) => void;
  onDelete: (item: StaffDirectoryItem) => void;
}

export default function StaffMemberCard({ item, onEdit, onDelete }: StaffMemberCardProps) {
  const theme = useBarberAdminTheme();
  const accentColor = item.role === 'barber' ? theme.primary : theme.warning;

  return (
    <Card variant="glass" style={{ flex: 1, minWidth: 320 }} contentStyle={{ gap: 18 }}>
      <View className="flex-row items-start justify-between gap-4">
        <View className="flex-1 flex-row items-center gap-4">
          {item.photoUrl ? (
            <Image
              source={{ uri: item.photoUrl }}
              style={{ width: 64, height: 64, borderRadius: 20 }}
              contentFit="cover"
            />
          ) : (
            <View
              className="h-16 w-16 items-center justify-center rounded-[20px]"
              style={{ backgroundColor: hexToRgba(accentColor, 0.12) }}>
              <Text
                style={{
                  color: accentColor,
                  fontFamily: 'Manrope-Bold',
                  fontSize: 20,
                  letterSpacing: 0.5,
                }}>
                {item.initials}
              </Text>
            </View>
          )}

          <View className="min-w-0 flex-1 gap-1">
            <Text
              numberOfLines={1}
              style={{
                color: theme.onSurface,
                fontFamily: 'Manrope-Bold',
                fontSize: 18,
              }}>
              {item.displayName}
            </Text>
            <View className="flex-row flex-wrap items-center gap-2">
              <View
                className="flex-row items-center gap-1 rounded-full px-3 py-1.5"
                style={{
                  backgroundColor: hexToRgba(accentColor, 0.1),
                  borderWidth: 1,
                  borderColor: hexToRgba(accentColor, 0.22),
                }}>
                <MaterialIcons name={STAFF_ROLE_ICONS[item.role]} size={15} color={accentColor} />
                <Text
                  style={{
                    color: accentColor,
                    fontFamily: 'Manrope-Bold',
                    fontSize: 11,
                  }}>
                  {item.roleLabel}
                </Text>
              </View>
              <Text
                style={{
                  color: hexToRgba(theme.onSurfaceVariant, 0.58),
                  fontFamily: 'Manrope-SemiBold',
                  fontSize: 11,
                }}>
                {`Yetki acilisi: ${item.createdAtLabel}`}
              </Text>
            </View>
          </View>
        </View>

        <View
          className="h-11 w-11 items-center justify-center rounded-2xl"
          style={{ backgroundColor: hexToRgba(theme.onSurfaceVariant, 0.08) }}>
          <MaterialIcons name="verified-user" size={20} color={accentColor} />
        </View>
      </View>

      <Text
        style={{
          color: item.bio ? theme.onSurface : hexToRgba(theme.onSurfaceVariant, 0.6),
          fontSize: 13,
          lineHeight: 22,
          minHeight: 44,
        }}>
        {item.bio ?? 'Bu ekip uyesi icin aciklama girilmemis. Gorev akisina gore bir not ekleyebilirsiniz.'}
      </Text>

      <View className="gap-2">
        {item.permissionHighlights.map((highlight) => (
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

      <View
        className="flex-row items-center justify-between rounded-2xl border px-4 py-3"
        style={{
          borderColor: theme.borderSubtle,
          backgroundColor: hexToRgba(theme.onSurfaceVariant, 0.04),
        }}>
        <View className="gap-1">
          <Text
            style={{
              color: hexToRgba(theme.onSurfaceVariant, 0.56),
              fontFamily: 'Manrope-Bold',
              fontSize: 10,
              textTransform: 'uppercase',
              letterSpacing: 1.5,
            }}>
            Son duzenleme
          </Text>
          <Text
            style={{
              color: theme.onSurface,
              fontFamily: 'Manrope-SemiBold',
              fontSize: 13,
            }}>
            {item.updatedAtLabel}
          </Text>
        </View>

        <View className="flex-row items-center gap-2">
          <ActionButton
            icon="edit"
            label="Duzenle"
            color={theme.primary}
            onPress={() => onEdit(item)}
          />
          <ActionButton
            icon="delete-outline"
            label="Sil"
            color={theme.error}
            onPress={() => onDelete(item)}
          />
        </View>
      </View>
    </Card>
  );
}

function ActionButton({
  icon,
  label,
  color,
  onPress,
}: {
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  label: string;
  color: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="min-h-[38px] flex-row items-center gap-1 rounded-full px-3 py-2"
      style={({ hovered }) => [
        {
          backgroundColor: hexToRgba(color, hovered ? 0.14 : 0.1),
        },
        Platform.OS === 'web'
          ? ({
              cursor: 'pointer',
              transition: 'background-color 180ms ease',
            } as any)
          : null,
      ]}>
      <MaterialIcons name={icon} size={16} color={color} />
      <Text
        style={{
          color,
          fontFamily: 'Manrope-Bold',
          fontSize: 12,
        }}>
        {label}
      </Text>
    </Pressable>
  );
}
