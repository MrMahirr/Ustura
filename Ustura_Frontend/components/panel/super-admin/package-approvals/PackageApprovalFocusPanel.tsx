import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { Platform, Text, View } from 'react-native';

import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { hexToRgba } from '@/utils/color';

import PackageApprovalActionButton from './PackageApprovalActionButton';
import PackageApprovalFeatureChips from './PackageApprovalFeatureChips';
import {
  getApprovalStatusPalette,
  getPackageApprovalPanelShadow,
  packageApprovalClassNames,
} from './presentation';
import type { PackageApprovalRecord } from './types';

function QuickFact({
  icon,
  label,
  value,
}: {
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  label: string;
  value: string;
}) {
  const adminTheme = useSuperAdminTheme();

  return (
    <View
      className="flex-1 rounded-[10px] border p-3"
      style={{
        minWidth: 120,
        backgroundColor: adminTheme.cardBackgroundStrong,
        borderColor: adminTheme.borderSubtle,
      }}>
      <View className="mb-2 flex-row items-center gap-2">
        <MaterialIcons
          name={icon}
          size={16}
          color={hexToRgba(adminTheme.onSurfaceVariant, 0.84)}
        />
        <Text
          className="font-label text-[9px] uppercase tracking-[1.8px]"
          style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.7), fontFamily: 'Manrope-Bold' }}>
          {label}
        </Text>
      </View>
      <Text className="font-body text-sm" style={{ color: adminTheme.onSurface, fontFamily: 'Manrope-Bold' }}>
        {value}
      </Text>
    </View>
  );
}

export default function PackageApprovalFocusPanel({
  record,
  onApprove,
  onReject,
}: {
  record: PackageApprovalRecord | null;
  onApprove: () => void;
  onReject: () => void;
}) {
  const adminTheme = useSuperAdminTheme();

  if (!record) {
    return (
      <View
        className="rounded-[12px] border p-5"
        style={{
          backgroundColor: adminTheme.cardBackground,
          borderColor: adminTheme.borderSubtle,
        }}>
        <Text
          className="font-headline text-[24px]"
          style={{ color: adminTheme.onSurface }}>
          Secili basvuru yok
        </Text>
        <Text
          className="mt-2 font-body text-sm"
          style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.78) }}>
          Sol taraftan bir kayit secildiginde paket ozetini ve hizli aksiyonlari burada goreceksin.
        </Text>
      </View>
    );
  }

  const palette = getApprovalStatusPalette(record.status, {
    primary: adminTheme.primary,
    success: adminTheme.success,
    error: adminTheme.error,
    warning: adminTheme.warning,
    onSurfaceVariant: adminTheme.onSurfaceVariant,
  });

  return (
    <View
      className="rounded-[12px] border"
      style={[
        {
          overflow: 'hidden',
          backgroundColor: adminTheme.cardBackground,
          borderColor: adminTheme.borderSubtle,
        },
        getPackageApprovalPanelShadow(adminTheme.theme),
        Platform.OS === 'web'
          ? ({ position: 'sticky', top: 24, alignSelf: 'flex-start' } as any)
          : null,
      ]}>
      <LinearGradient
        colors={[
          hexToRgba(adminTheme.primary, 0.2),
          hexToRgba(adminTheme.surfaceContainerHighest, 0.96),
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ padding: 18 }}>
        <View className="gap-4">
          <View className="flex-row items-center justify-between gap-3">
            <Text
              className="font-label text-[10px] uppercase tracking-[2.6px]"
              style={{ color: adminTheme.primary, fontFamily: 'Manrope-Bold' }}>
              Onay Masasi
            </Text>
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

          <View className="flex-row items-center gap-4">
            <Image
              source={{ uri: record.heroImageUri }}
              style={{ width: 72, height: 72, borderRadius: 12 }}
              contentFit="cover"
            />
            <View className="min-w-0 flex-1 gap-1">
              <Text
                className={packageApprovalClassNames.serifTitle}
                style={{ color: adminTheme.onSurface, fontSize: 28 }}>
                {record.packageName}
              </Text>
              <Text
                className="font-body text-sm"
                style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.82) }}>
                {record.salonName} · {record.city}
              </Text>
              <Text
                className="font-body text-xs"
                style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.72) }}>
                {record.ownerName} / {record.ownerRole}
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <View className="gap-5 p-5">
        <View className="gap-2">
          <Text
            className={packageApprovalClassNames.label}
            style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.68), fontFamily: 'Manrope-Bold' }}>
            Paket Ozeti
          </Text>
          <Text
            className="font-body text-sm leading-6"
            style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.82) }}>
            {record.packageSummary}
          </Text>
        </View>

        <View className="flex-row flex-wrap gap-3">
          <QuickFact icon="groups-2" label="Ekip" value={`${record.staffCount} Berber`} />
          <QuickFact
            icon="event-available"
            label="Aylik Hacim"
            value={`${new Intl.NumberFormat('tr-TR').format(record.monthlyReservations)}+`}
          />
          <QuickFact icon="schedule" label="Isletme" value={record.businessDurationLabel} />
        </View>

        <View className="gap-3">
          <Text
            className={packageApprovalClassNames.label}
            style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.68), fontFamily: 'Manrope-Bold' }}>
            Talep Icerigi
          </Text>
          <PackageApprovalFeatureChips items={record.highlights} />
          <Text
            className="font-body text-xl"
            style={{ color: adminTheme.onSurface, fontFamily: 'Manrope-Bold' }}>
            TRY {new Intl.NumberFormat('tr-TR').format(record.pricePerMonth)}
            <Text
              className="font-body text-xs"
              style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.72), fontFamily: 'Manrope-Regular' }}>
              {' '}
              / aylik teklif
            </Text>
          </Text>
        </View>

        <View
          className="rounded-[10px] border p-4"
          style={{
            backgroundColor: adminTheme.cardBackgroundStrong,
            borderColor: adminTheme.borderSubtle,
          }}>
          <Text
            className={packageApprovalClassNames.label}
            style={{ color: adminTheme.primary, fontFamily: 'Manrope-Bold' }}>
            Inceleme Notu
          </Text>
          <Text
            className="mt-2 font-body text-sm leading-6"
            style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.84) }}>
            {record.reviewerNote}
          </Text>
        </View>

        <View className="gap-3">
          {record.status !== 'approved' ? (
            <PackageApprovalActionButton
              label={record.status === 'rejected' ? 'Tekrar Onayla' : 'Talebi Onayla'}
              variant="approve"
              fullWidth
              onPress={onApprove}
            />
          ) : null}
          {record.status !== 'rejected' ? (
            <PackageApprovalActionButton
              label={record.status === 'approved' ? 'Onayi Geri Cek' : 'Talebi Reddet'}
              variant="danger"
              fullWidth
              onPress={onReject}
            />
          ) : null}
        </View>
      </View>
    </View>
  );
}
