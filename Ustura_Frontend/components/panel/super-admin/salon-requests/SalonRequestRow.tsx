import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Platform, Pressable, Text, View } from 'react-native';

import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';

import { SALON_REQUEST_COPY } from './presentation';
import type { SalonRequestListItem } from './types';

interface SalonRequestRowProps {
  item: SalonRequestListItem;
  isSelected: boolean;
  onSelect: () => void;
}

function StatusBadge({ status }: { status: SalonRequestListItem['status'] }) {
  const t = useSuperAdminTheme();

  const config = {
    pending: {
      label: SALON_REQUEST_COPY.statusPending,
      color: t.warning,
      pulse: true,
    },
    approved: {
      label: SALON_REQUEST_COPY.statusApproved,
      color: t.success,
      pulse: false,
    },
    rejected: {
      label: SALON_REQUEST_COPY.statusRejected,
      color: t.error,
      pulse: false,
    },
  }[status];

  return (
    <View className="flex-row items-center gap-2">
      <View
        style={[
          {
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: config.color,
          },
          config.pulse && Platform.OS === 'web'
            ? ({ animation: 'pulse 2s infinite' } as any)
            : null,
        ]}
      />
      <Text
        style={{
          fontSize: 12,
          fontFamily: 'Manrope-Bold',
          color: config.color,
        }}>
        {config.label}
      </Text>
    </View>
  );
}

export default function SalonRequestRow({
  item,
  isSelected,
  onSelect,
}: SalonRequestRowProps) {
  const t = useSuperAdminTheme();

  return (
    <Pressable
      onPress={onSelect}
      style={({ hovered }) => [
        {
          flexDirection: 'row',
          alignItems: 'center',
          borderBottomWidth: 1,
          borderBottomColor: `${t.onSurface}10`,
          paddingVertical: 12,
          paddingHorizontal: 16,
          backgroundColor: isSelected
            ? `${t.surfaceContainerLow}80`
            : hovered
              ? t.surfaceContainerLow
              : 'transparent',
        },
        Platform.OS === 'web'
          ? ({ transition: 'background-color 150ms ease', cursor: 'pointer' } as any)
          : null,
      ]}>
      {/* Salon */}
      <View style={{ flex: 2, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <View
          style={{
            width: 40,
            height: 40,
            backgroundColor: t.surfaceContainerHighest,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 2,
          }}>
          <Text
            style={{
              color: t.primary,
              fontFamily: 'Manrope-Bold',
              fontSize: 14,
            }}>
            {item.salonInitials}
          </Text>
        </View>
        <View>
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'Manrope-Bold',
              color: t.onSurface,
            }}>
            {item.salonName}
          </Text>
          <Text
            style={{
              fontSize: 10,
              color: t.onSurfaceVariant,
            }}>
            {item.salonSlug}
          </Text>
        </View>
      </View>

      {/* Applicant */}
      <View style={{ flex: 1.5 }}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: '500',
            color: t.onSurface,
          }}>
          {item.applicantName}
        </Text>
        <Text style={{ fontSize: 10, color: t.onSurfaceVariant }}>
          {item.applicantEmail}
        </Text>
      </View>

      {/* City */}
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: '500',
            color: t.onSurface,
          }}>
          {item.city}
        </Text>
        {item.district ? (
          <Text style={{ fontSize: 10, color: t.onSurfaceVariant }}>
            {item.district}
          </Text>
        ) : null}
      </View>

      {/* Date */}
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: '500',
            color: t.onSurface,
          }}>
          {item.appliedAtLabel}
        </Text>
      </View>

      {/* Status */}
      <View style={{ flex: 1 }}>
        <StatusBadge status={item.status} />
      </View>

      {/* Actions */}
      <View style={{ width: 48, alignItems: 'flex-end' }}>
        <Pressable
          onPress={onSelect}
          style={{ padding: 8 }}
          accessibilityRole="button">
          <MaterialIcons
            name="more-vert"
            size={20}
            color={t.onSurfaceVariant}
          />
        </Pressable>
      </View>
    </Pressable>
  );
}
