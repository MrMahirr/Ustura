import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Platform, Pressable, Text, View } from 'react-native';

import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { hexToRgba } from '@/utils/color';

import type { PackageDefinition } from './types';

interface PackageCardProps {
  pkg: PackageDefinition;
  onEdit: () => void;
  onToggleActive: (nextIsActive: boolean) => void;
}

export default function PackageCard({ pkg, onEdit, onToggleActive }: PackageCardProps) {
  const adminTheme = useSuperAdminTheme();
  const isFeatured = pkg.isFeatured;
  const isActive = pkg.isActive;

  return (
    <View
      className="flex-1 p-7"
      style={[
        {
          backgroundColor: adminTheme.cardBackgroundMuted,
          minWidth: 280,
          borderTopWidth: isFeatured ? 4 : 0,
          borderTopColor: isFeatured ? adminTheme.primary : undefined,
        },
        Platform.OS === 'web'
          ? ({
              transition: 'transform 300ms ease',
              boxShadow: isFeatured
                ? `0 28px 60px ${hexToRgba(adminTheme.primary, 0.08)}`
                : undefined,
            } as any)
          : null,
      ]}>
      {/* Featured badge */}
      {isFeatured && (
        <View className="absolute -top-4 left-1/2" style={{ transform: [{ translateX: '-50%' as any }] }}>
          <LinearGradient
            colors={adminTheme.goldGradient as [string, string]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ paddingHorizontal: 14, paddingVertical: 5, borderRadius: 20 }}>
            <Text
              className="font-label text-[10px] uppercase tracking-[2px]"
              style={{ color: adminTheme.onPrimary, fontFamily: 'Manrope-Bold' }}>
              En Populer
            </Text>
          </LinearGradient>
        </View>
      )}

      <View className="mb-5 flex-row items-center justify-between gap-3">
        <Text
          className="font-label text-[10px] uppercase tracking-[3px]"
          style={{
            color: isFeatured ? adminTheme.primary : hexToRgba(adminTheme.onSurfaceVariant, 0.55),
            fontFamily: 'Manrope-Bold',
          }}>
          {pkg.tierLabel}
        </Text>
        <View
          className="rounded-full px-2.5 py-1"
          style={{
            backgroundColor: isActive
              ? hexToRgba(adminTheme.success, 0.1)
              : hexToRgba(adminTheme.error, 0.1),
          }}>
          <Text
            className="font-label text-[9px] uppercase tracking-[1.6px]"
            style={{
              color: isActive ? adminTheme.success : adminTheme.error,
              fontFamily: 'Manrope-Bold',
            }}>
            {isActive ? 'Aktif' : 'Pasif'}
          </Text>
        </View>
      </View>

      {/* Name */}
      <Text
        className="mb-2 font-headline text-[22px]"
        style={{ color: isFeatured ? adminTheme.primary : adminTheme.onSurface }}>
        {pkg.name}
      </Text>

      {/* Price */}
      <View className="mb-7 flex-row items-baseline gap-1">
        <Text
          className="font-headline text-[34px]"
          style={{ color: isFeatured ? adminTheme.primary : adminTheme.onSurface }}>
          ₺{new Intl.NumberFormat('tr-TR').format(pkg.pricePerMonth)}
        </Text>
        <Text
          className="font-body text-sm"
          style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.55) }}>
          /ay
        </Text>
      </View>

      {/* Features */}
      <View className="mb-8 flex-1 gap-3.5">
        {pkg.features.map((feature) => (
          <View key={feature.label} className="flex-row items-center gap-3">
            <MaterialIcons
              name={feature.included ? 'check-circle' : 'cancel'}
              size={18}
              color={
                feature.included
                  ? adminTheme.primary
                  : hexToRgba(adminTheme.onSurfaceVariant, 0.25)
              }
            />
            <Text
              className="font-body text-sm"
              style={{
                color: feature.included
                  ? adminTheme.onSurface
                  : hexToRgba(adminTheme.onSurfaceVariant, 0.35),
              }}>
              {feature.label}
            </Text>
          </View>
        ))}
      </View>

      {/* Usage */}
      <View className="gap-3.5">
        <View
          className="flex-row items-center justify-between rounded-md px-3.5 py-2.5"
          style={{
            backgroundColor: isFeatured
              ? hexToRgba(adminTheme.primary, 0.05)
              : adminTheme.cardBackgroundStrong,
            borderWidth: isFeatured ? 1 : 0,
            borderColor: isFeatured ? hexToRgba(adminTheme.primary, 0.1) : undefined,
          }}>
          <Text
            className="font-label text-[10px] uppercase tracking-widest"
            style={{
              color: isFeatured
                ? hexToRgba(adminTheme.primary, 0.7)
                : hexToRgba(adminTheme.onSurfaceVariant, 0.55),
              fontFamily: 'Manrope-Bold',
            }}>
            KULLANIM
          </Text>
          <Text
            className="font-body text-xs"
            style={{ color: adminTheme.primary, fontFamily: 'Manrope-Bold' }}>
            {pkg.activeSalonCount} SALON
          </Text>
        </View>

        {/* Actions */}
        <View className="flex-row gap-2">
          <Pressable
            onPress={onEdit}
            className="flex-1 min-h-[44px] items-center justify-center rounded-md border"
            style={({ hovered }) => [
              {
                borderColor: isFeatured
                  ? 'transparent'
                  : hexToRgba(adminTheme.outlineVariant, hovered ? 0.5 : 0.3),
                backgroundColor: isFeatured
                  ? undefined
                  : hovered
                    ? hexToRgba(adminTheme.primary, 0.08)
                    : 'transparent',
                overflow: 'hidden',
              },
              Platform.OS === 'web'
                ? ({ transition: 'border-color 180ms ease, background-color 180ms ease' } as any)
                : null,
            ]}>
            {isFeatured ? (
              <LinearGradient
                colors={adminTheme.goldGradient as [string, string]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  flex: 1,
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 6,
                }}>
                <Text
                  className="font-label text-[10px] uppercase tracking-widest"
                  style={{ color: adminTheme.onPrimary, fontFamily: 'Manrope-Bold' }}>
                  DUZENLE
                </Text>
              </LinearGradient>
            ) : (
              <Text
                className="font-label text-[10px] uppercase tracking-widest"
                style={{ color: adminTheme.onSurface, fontFamily: 'Manrope-Bold' }}>
                DUZENLE
              </Text>
            )}
          </Pressable>

          <Pressable
            onPress={() => onToggleActive(!pkg.isActive)}
            className="min-h-[44px] w-[44px] items-center justify-center rounded-md border"
            style={({ hovered }) => [
              {
                borderColor: hexToRgba(
                  hovered ? adminTheme.error : adminTheme.outlineVariant,
                  0.3,
                ),
              },
              Platform.OS === 'web'
                ? ({ transition: 'border-color 180ms ease, color 180ms ease' } as any)
                : null,
            ]}>
            {({ hovered }) => (
              <MaterialIcons
                name={isActive ? 'block' : 'autorenew'}
                size={18}
                color={
                  hovered
                    ? adminTheme.error
                    : isFeatured
                      ? adminTheme.primary
                      : hexToRgba(adminTheme.onSurfaceVariant, 0.6)
                }
              />
            )}
          </Pressable>
        </View>
      </View>
    </View>
  );
}
