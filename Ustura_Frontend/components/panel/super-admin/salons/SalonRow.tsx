import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Platform, Pressable, Text, View } from 'react-native';

import type { SalonRecord } from '@/components/panel/super-admin/salon-management.data';
import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { hexToRgba } from '@/utils/color';

import SalonActionIcon from './SalonActionIcon';
import { styles } from './styles';
import { getPlanPalette, getRowActions, getStatusPalette } from './utils';

export default function SalonRow({ salon, onPress }: { salon: SalonRecord; onPress?: () => void }) {
  const adminTheme = useSuperAdminTheme();
  const statusPalette = getStatusPalette(salon.status, adminTheme);
  const planPalette = getPlanPalette(salon.plan, adminTheme);
  const actions = getRowActions(salon.status, adminTheme);

  return (
    <Pressable
      onPress={onPress}
      style={({ hovered }) => [
        styles.row,
        { backgroundColor: hovered ? adminTheme.cardBackgroundStrong : 'transparent' },
        Platform.OS === 'web'
          ? [styles.webRowTransition, { cursor: onPress ? 'pointer' : 'default' } as any]
          : null,
      ]}>
      {({ hovered }) => (
        <>
          <View style={[styles.cell, styles.cellSalon]}>
            <View style={styles.salonInfo}>
              <View
                style={[
                  styles.salonThumbFrame,
                  {
                    borderColor: adminTheme.borderSubtle,
                    backgroundColor: adminTheme.cardBackgroundStrong,
                  },
                ]}>
                <Image
                  source={{ uri: salon.imageUrl }}
                  style={[
                    styles.salonThumb,
                    Platform.OS === 'web' && salon.mutedImage ? ({ filter: 'grayscale(1)' } as any) : null,
                  ]}
                  contentFit="cover"
                />
              </View>
              <View style={styles.salonCopy}>
                <Text style={[styles.salonName, { color: adminTheme.onSurface }]} numberOfLines={1}>
                  {salon.name}
                </Text>
                <Text style={[styles.salonId, { color: hexToRgba(adminTheme.onSurfaceVariant, 0.82) }]}>
                  ID: {salon.reference}
                </Text>
              </View>
            </View>
          </View>

          <View style={[styles.cell, styles.cellOwner]}>
            <Text style={[styles.ownerName, { color: adminTheme.onSurface }]} numberOfLines={1}>
              {salon.owner}
            </Text>
            <Text style={[styles.ownerEmail, { color: hexToRgba(adminTheme.onSurfaceVariant, 0.8) }]} numberOfLines={1}>
              {salon.ownerEmail}
            </Text>
          </View>

          <View style={[styles.cell, styles.cellLocation]}>
            <View style={styles.locationRow}>
              <MaterialIcons name="location-on" size={16} color={hexToRgba(adminTheme.onSurfaceVariant, 0.74)} />
              <Text style={[styles.locationText, { color: hexToRgba(adminTheme.onSurfaceVariant, 0.92) }]} numberOfLines={1}>
                {salon.location}
              </Text>
            </View>
          </View>

          <View style={[styles.cell, styles.cellStatus]}>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: statusPalette.backgroundColor,
                  borderColor: statusPalette.borderColor,
                },
              ]}>
              <Text style={[styles.statusText, { color: statusPalette.color }]}>{salon.status}</Text>
            </View>
          </View>

          <View style={[styles.cell, styles.cellPlan]}>
            <View style={styles.planRow}>
              <View
                style={[
                  styles.planDot,
                  {
                    backgroundColor: planPalette.dot,
                    ...(Platform.OS === 'web' && planPalette.glow !== 'transparent'
                      ? ({ boxShadow: `0 0 12px ${planPalette.glow}` } as any)
                      : null),
                  },
                ]}
              />
              <Text style={[styles.planText, { color: planPalette.text }]}>{salon.plan}</Text>
            </View>
          </View>

          <View style={[styles.cell, styles.cellActions]}>
            <View style={[styles.actionsRow, { opacity: hovered ? 1 : 0.18 }]}>
              {actions.map((action) => (
                <SalonActionIcon
                  key={`${salon.id}-${action.icon}`}
                  icon={action.icon}
                  label={action.label}
                  color={action.color}
                />
              ))}
            </View>
          </View>
        </>
      )}
    </Pressable>
  );
}
