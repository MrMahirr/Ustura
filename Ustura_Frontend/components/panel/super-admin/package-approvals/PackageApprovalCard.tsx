import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Platform, Pressable, Text, View, useWindowDimensions } from 'react-native';

import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { hexToRgba } from '@/utils/color';

import PackageApprovalActionButton from './PackageApprovalActionButton';
import PackageApprovalFeatureChips from './PackageApprovalFeatureChips';
import { getApprovalStatusPalette } from './presentation';
import type { PackageApprovalRecord } from './types';

function MetaCell({ label, value }: { label: string; value: string }) {
  const adminTheme = useSuperAdminTheme();

  return (
    <View className="min-w-[88px] gap-1">
      <Text
        className="font-label text-[9px] uppercase tracking-[1.8px]"
        style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.62), fontFamily: 'Manrope-Bold' }}>
        {label}
      </Text>
      <Text className="font-body text-sm" style={{ color: adminTheme.onSurface }}>
        {value}
      </Text>
    </View>
  );
}

export default function PackageApprovalCard({
  record,
  isSelected,
  onPreview,
  onApprove,
  onReject,
}: {
  record: PackageApprovalRecord;
  isSelected: boolean;
  onPreview: () => void;
  onApprove: () => void;
  onReject: () => void;
}) {
  const { width } = useWindowDimensions();
  const adminTheme = useSuperAdminTheme();
  const palette = getApprovalStatusPalette(record.status, {
    primary: adminTheme.primary,
    success: adminTheme.success,
    error: adminTheme.error,
    warning: adminTheme.warning,
    onSurfaceVariant: adminTheme.onSurfaceVariant,
  });
  const isWide = width >= 1120;

  return (
    <Pressable
      onPress={onPreview}
      style={({ hovered }) => [
        {
          borderWidth: 1,
          borderRadius: 14,
          overflow: 'hidden',
          backgroundColor: adminTheme.cardBackgroundMuted,
          borderColor: isSelected
            ? hexToRgba(palette.accent, 0.42)
            : adminTheme.borderSubtle,
        },
        Platform.OS === 'web'
          ? ({
              transition: 'transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease',
              transform: hovered ? 'translateY(-1px)' : 'translateY(0px)',
              boxShadow:
                isSelected || hovered
                  ? `0 20px 40px ${hexToRgba(palette.accent, 0.12)}`
                  : '0 0 0 rgba(0,0,0,0)',
            } as any)
          : null,
      ]}>
      <View
        style={{
          height: '100%',
          borderLeftWidth: 3,
          borderLeftColor: palette.accent,
          padding: 20,
          gap: 18,
        }}>
        <View
          className="justify-between gap-5"
          style={{
            flexDirection: isWide ? 'row' : 'column',
            alignItems: isWide ? 'center' : 'flex-start',
          }}>
          <View
            className="gap-4"
            style={{
              flexDirection: width >= 720 ? 'row' : 'column',
              alignItems: width >= 720 ? 'center' : 'flex-start',
              minWidth: isWide ? 290 : undefined,
            }}>
            <Image
              source={{ uri: record.heroImageUri }}
              style={{
                width: 72,
                height: 72,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: hexToRgba(adminTheme.onSurfaceVariant, 0.12),
              }}
              contentFit="cover"
            />

            <View className="gap-1">
              <View className="flex-row flex-wrap items-center gap-2">
                <Text
                  className="font-body text-lg"
                  style={{ color: adminTheme.onSurface, fontFamily: 'Manrope-Bold' }}>
                  {record.salonName}
                </Text>
                <View
                  className="rounded-[6px] px-2 py-1"
                  style={{ backgroundColor: adminTheme.cardBackgroundStrong }}>
                  <Text
                    className="font-label text-[9px] uppercase tracking-[1.8px]"
                    style={{
                      color: hexToRgba(adminTheme.onSurfaceVariant, 0.82),
                      fontFamily: 'Manrope-Bold',
                    }}>
                    {record.city}
                  </Text>
                </View>
              </View>

              <Text
                className="font-body text-sm"
                style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.8) }}>
                {record.ownerName} · {record.ownerRole}
              </Text>
            </View>
          </View>

          <View
            className="rounded-full px-3 py-2"
            style={{
              backgroundColor: palette.accentSoft,
              borderWidth: 1,
              borderColor: palette.accentBorder,
            }}>
            <Text
              className="font-label text-[10px] uppercase tracking-[2px]"
              style={{ color: palette.textColor, fontFamily: 'Manrope-Bold' }}>
              {palette.label}
            </Text>
          </View>
        </View>

        <View
          className="gap-6"
          style={{
            flexDirection: isWide ? 'row' : 'column',
            alignItems: isWide ? 'center' : 'flex-start',
          }}>
          <View className="min-w-0 flex-1 gap-3">
            <View className="gap-2">
              <Text
                className="font-headline text-[26px] tracking-[-0.7px]"
                style={{ color: adminTheme.primary }}>
                {record.packageName}
              </Text>
              <Text
                className="font-body text-sm"
                style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.82) }}>
                {record.packageSummary}
              </Text>
            </View>

            <PackageApprovalFeatureChips items={record.highlights} />

            <Text
              className="font-body text-xl"
              style={{ color: adminTheme.onSurface, fontFamily: 'Manrope-Bold' }}>
              TRY {new Intl.NumberFormat('tr-TR').format(record.pricePerMonth)}
              <Text
                className="font-body text-xs"
                style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.76), fontFamily: 'Manrope-Regular' }}>
                {' '}
                / aylik
              </Text>
            </Text>
          </View>

          <View
            className="flex-row flex-wrap gap-x-8 gap-y-3"
            style={{
              minWidth: isWide ? 280 : '100%',
              borderLeftWidth: isWide ? 1 : 0,
              paddingLeft: isWide ? 24 : 0,
              borderLeftColor: hexToRgba(adminTheme.onSurfaceVariant, 0.12),
            }}>
            <MetaCell label="Basvuru" value={record.submittedAt} />
            <MetaCell label="Ekip" value={`${record.staffCount} Berber`} />
            <MetaCell
              label="Randevu"
              value={`${new Intl.NumberFormat('tr-TR').format(record.monthlyReservations)}+`}
            />
            <MetaCell label="Sure" value={record.businessDurationLabel} />
          </View>

          <View
            className="gap-3"
            style={{ width: isWide ? 220 : '100%' }}>
            <Pressable
              onPress={onPreview}
              className="h-11 flex-row items-center justify-center gap-2 rounded-[10px] border"
              style={({ hovered, pressed }) => ({
                borderColor: adminTheme.borderStrong,
                backgroundColor:
                  hovered || pressed ? adminTheme.cardBackgroundStrong : 'transparent',
              })}>
              <MaterialIcons
                name="visibility"
                size={18}
                color={hexToRgba(adminTheme.onSurfaceVariant, 0.86)}
              />
              <Text
                className="font-label text-[11px] uppercase tracking-[2px]"
                style={{
                  color: adminTheme.onSurfaceVariant,
                  fontFamily: 'Manrope-Bold',
                }}>
                Incele
              </Text>
            </Pressable>

            {record.status !== 'approved' ? (
              <PackageApprovalActionButton
                label={record.status === 'rejected' ? 'Tekrar Onayla' : 'Onayla'}
                variant="approve"
                fullWidth
                onPress={onApprove}
              />
            ) : null}

            {record.status !== 'rejected' ? (
              <PackageApprovalActionButton
                label={record.status === 'approved' ? 'Onayi Geri Cek' : 'Reddet'}
                variant="danger"
                fullWidth
                onPress={onReject}
              />
            ) : null}
          </View>
        </View>
      </View>
    </Pressable>
  );
}
