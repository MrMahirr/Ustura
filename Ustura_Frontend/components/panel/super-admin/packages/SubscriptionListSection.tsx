import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Platform, Pressable, Text, View } from 'react-native';

import { getPackagePanelShadow, packageClassNames } from '@/components/panel/super-admin/packages/presentation';
import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { hexToRgba } from '@/utils/color';

import SubscriptionMobileCard from './SubscriptionMobileCard';
import SubscriptionRow from './SubscriptionRow';
import type { SubscriptionRecord } from './types';

interface SubscriptionListSectionProps {
  subscriptions: SubscriptionRecord[];
  useDesktopTable: boolean;
  onViewAll?: () => void;
}

function EmptyState() {
  const adminTheme = useSuperAdminTheme();

  return (
    <View
      className="m-5 min-h-[200px] items-center justify-center gap-3 rounded-[10px] border px-6"
      style={{
        backgroundColor: adminTheme.cardBackgroundMuted,
        borderColor: adminTheme.borderSubtle,
      }}>
      <MaterialIcons
        name="search-off"
        size={32}
        color={hexToRgba(adminTheme.onSurfaceVariant, 0.8)}
      />
      <Text
        className={packageClassNames.emptyTitle}
        style={{ color: adminTheme.onSurface, fontFamily: 'Manrope-Bold' }}>
        Abonelik hareketi bulunamadi
      </Text>
      <Text
        className={packageClassNames.emptyDescription}
        style={{ color: adminTheme.onSurfaceVariant }}>
        Arama kelimesini degistirerek listeyi genisletebilirsiniz.
      </Text>
    </View>
  );
}

function DesktopTable({ subscriptions }: { subscriptions: SubscriptionRecord[] }) {
  const adminTheme = useSuperAdminTheme();

  return (
    <>
      {/* Table header */}
      <View
        className="min-h-[52px] flex-row items-center border-b px-5"
        style={{
          backgroundColor: adminTheme.tableHeaderBackground,
          borderBottomColor: adminTheme.borderSubtle,
        }}>
        <Text
          className={packageClassNames.headerText}
          style={{ flex: 2, color: hexToRgba(adminTheme.onSurfaceVariant, 0.7), fontFamily: 'Manrope-Bold' }}>
          Salon Adi
        </Text>
        <Text
          className={packageClassNames.headerText}
          style={{ flex: 1.2, color: hexToRgba(adminTheme.onSurfaceVariant, 0.7), fontFamily: 'Manrope-Bold' }}>
          Paket
        </Text>
        <Text
          className={packageClassNames.headerText}
          style={{ flex: 1, color: hexToRgba(adminTheme.onSurfaceVariant, 0.7), fontFamily: 'Manrope-Bold' }}>
          Baslangic
        </Text>
        <Text
          className={packageClassNames.headerText}
          style={{ flex: 1, color: hexToRgba(adminTheme.onSurfaceVariant, 0.7), fontFamily: 'Manrope-Bold' }}>
          Bitis
        </Text>
        <Text
          className={packageClassNames.headerText}
          style={{ flex: 1, color: hexToRgba(adminTheme.onSurfaceVariant, 0.7), fontFamily: 'Manrope-Bold' }}>
          Durum
        </Text>
        <Text
          className={packageClassNames.headerText}
          style={{
            flex: 0.5,
            color: hexToRgba(adminTheme.onSurfaceVariant, 0.7),
            textAlign: 'right',
            fontFamily: 'Manrope-Bold',
          }}>
          Islem
        </Text>
      </View>

      {/* Rows */}
      <View>
        {subscriptions.map((sub, index) => (
          <View
            key={sub.id}
            style={
              index < subscriptions.length - 1
                ? { borderBottomColor: adminTheme.borderSubtle, borderBottomWidth: 1 }
                : undefined
            }>
            <SubscriptionRow subscription={sub} />
          </View>
        ))}
      </View>
    </>
  );
}

export default function SubscriptionListSection({
  subscriptions,
  useDesktopTable,
  onViewAll,
}: SubscriptionListSectionProps) {
  const adminTheme = useSuperAdminTheme();

  return (
    <View className="gap-5">
      {/* Section header */}
      <View className="flex-row items-end justify-between">
        <View>
          <Text
            className="font-headline text-xl tracking-[-0.3px]"
            style={{ color: adminTheme.onSurface }}>
            Son Abonelik Hareketleri
          </Text>
          <Text
            className="mt-1 font-body text-sm"
            style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.65) }}>
            Tum salonlarin paket durumlarini takip edin.
          </Text>
        </View>
        {onViewAll && (
          <Pressable
            onPress={onViewAll}
            style={({ hovered }) => [
              Platform.OS === 'web'
                ? ({ cursor: 'pointer', textDecoration: hovered ? 'underline' : 'none' } as any)
                : null,
            ]}>
            <Text
              className="font-label text-xs uppercase tracking-widest"
              style={{ color: adminTheme.primary, fontFamily: 'Manrope-Bold' }}>
              Tumunu Gor
            </Text>
          </Pressable>
        )}
      </View>

      {/* Table shell */}
      <View
        className={packageClassNames.tableShell}
        style={[
          {
            backgroundColor: adminTheme.cardBackground,
            borderColor: adminTheme.borderSubtle,
          },
          getPackagePanelShadow(adminTheme.theme),
        ]}>
        {subscriptions.length === 0 ? (
          <EmptyState />
        ) : useDesktopTable ? (
          <DesktopTable subscriptions={subscriptions} />
        ) : (
          <View className="gap-3 p-4">
            {subscriptions.map((sub) => (
              <SubscriptionMobileCard key={sub.id} subscription={sub} />
            ))}
          </View>
        )}
      </View>
    </View>
  );
}
