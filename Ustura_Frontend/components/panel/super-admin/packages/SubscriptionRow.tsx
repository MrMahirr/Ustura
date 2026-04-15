import React from 'react';
import { Platform, Pressable, Text, View } from 'react-native';

import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { hexToRgba } from '@/utils/color';

import type { SubscriptionRecord } from './types';

function StatusBadge({ status }: { status: SubscriptionRecord['status'] }) {
  const adminTheme = useSuperAdminTheme();

  const colorMap = {
    Aktif: adminTheme.success,
    'Suresi Doldu': adminTheme.error,
    Beklemede: adminTheme.warning,
    'Iptal Edildi': adminTheme.error,
  };

  const color = colorMap[status];

  return (
    <View
      className="flex-row items-center gap-1.5 self-start rounded-full px-2 py-0.5"
      style={{ backgroundColor: hexToRgba(color, 0.1) }}>
      <View
        className="h-1 w-1 rounded-full"
        style={{ backgroundColor: color }}
      />
      <Text
        className="font-label text-[10px] uppercase"
        style={{ color, fontFamily: 'Manrope-Bold' }}>
        {status}
      </Text>
    </View>
  );
}

function PackageBadge({ packageName, tier }: { packageName: string; tier: SubscriptionRecord['packageTier'] }) {
  const adminTheme = useSuperAdminTheme();

  const isKurumsal = tier === 'kurumsal';
  const isProfesyonel = tier === 'profesyonel';

  return (
    <View
      className="self-start rounded-sm px-2 py-1"
      style={{
        backgroundColor: isKurumsal
          ? adminTheme.primary
          : isProfesyonel
            ? hexToRgba(adminTheme.primary, 0.1)
            : adminTheme.cardBackgroundStrong,
      }}>
      <Text
        className="font-body text-xs"
        style={{
          color: isKurumsal
            ? adminTheme.onPrimary
            : isProfesyonel
              ? adminTheme.primary
              : hexToRgba(adminTheme.onSurfaceVariant, 0.7),
          fontFamily: 'Manrope-Bold',
        }}>
        {packageName}
      </Text>
    </View>
  );
}

export default function SubscriptionRow({
  subscription,
  onCancelSubscription,
  cancelDisabled,
}: {
  subscription: SubscriptionRecord;
  onCancelSubscription?: () => void;
  cancelDisabled?: boolean;
}) {
  const adminTheme = useSuperAdminTheme();
  const showCancel = subscription.canCancel && onCancelSubscription;

  return (
    <View className="min-h-[60px] flex-row items-center px-5">
      {/* Salon */}
      <View className="flex-row items-center gap-3" style={{ flex: 2 }}>
        <View
          className="h-8 w-8 items-center justify-center rounded-sm"
          style={{ backgroundColor: hexToRgba(adminTheme.primary, 0.1) }}>
          <Text className="font-body text-sm" style={{ color: adminTheme.primary, fontFamily: 'Manrope-Bold' }}>
            {subscription.salonInitial}
          </Text>
        </View>
        <Text className="font-body text-sm" style={{ color: adminTheme.onSurface, fontFamily: 'Manrope-Bold' }}>
          {subscription.salonName}
        </Text>
      </View>

      {/* Package */}
      <View style={{ flex: 1.2 }}>
        <PackageBadge packageName={subscription.packageName} tier={subscription.packageTier} />
      </View>

      {/* Start */}
      <Text
        className="font-body text-xs"
        style={{ flex: 1, color: hexToRgba(adminTheme.onSurfaceVariant, 0.6) }}>
        {subscription.startDate}
      </Text>

      {/* End */}
      <Text
        className="font-body text-xs"
        style={{ flex: 1, color: hexToRgba(adminTheme.onSurfaceVariant, 0.6) }}>
        {subscription.endDate ?? '-'}
      </Text>

      {/* Status */}
      <View style={{ flex: 1 }}>
        <StatusBadge status={subscription.status} />
      </View>

      {/* Action */}
      <View className="min-w-[100px] items-end justify-center" style={{ flex: 1 }}>
        {showCancel ? (
          <Pressable
            disabled={cancelDisabled}
            onPress={onCancelSubscription}
            accessibilityLabel="Aboneligi iptal et"
            className="min-h-[32px] items-center justify-center rounded-md border px-2.5 py-1"
            style={({ hovered, pressed }) => [
              {
                opacity: cancelDisabled ? 0.45 : 1,
                borderColor: hexToRgba(adminTheme.error, hovered || pressed ? 0.55 : 0.35),
                backgroundColor:
                  hovered || pressed ? hexToRgba(adminTheme.error, 0.08) : 'transparent',
              },
              Platform.OS === 'web'
                ? ({ transition: 'border-color 150ms ease, background-color 150ms ease' } as any)
                : null,
            ]}>
            <Text
              className="font-label text-[9px] uppercase tracking-wide"
              style={{ color: adminTheme.error, fontFamily: 'Manrope-Bold' }}>
              Abonelik Iptali
            </Text>
          </Pressable>
        ) : (
          <Text
            className="font-body text-xs"
            style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.35) }}>
            —
          </Text>
        )}
      </View>
    </View>
  );
}

export { StatusBadge, PackageBadge };
