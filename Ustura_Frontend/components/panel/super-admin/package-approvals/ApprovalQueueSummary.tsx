import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Text, View, useWindowDimensions } from 'react-native';

import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { hexToRgba } from '@/utils/color';

import { getPackageApprovalPanelShadow } from './presentation';
import type { PackageApprovalCounts, PackageApprovalRecord } from './types';

function SummaryMetric({
  icon,
  label,
  value,
  hint,
  accent,
}: {
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  label: string;
  value: string;
  hint: string;
  accent: string;
}) {
  const adminTheme = useSuperAdminTheme();

  return (
    <View
      className="min-h-[108px] flex-1 rounded-[12px] border p-4"
      style={{
        backgroundColor: adminTheme.cardBackground,
        borderColor: adminTheme.borderSubtle,
      }}>
      <View className="mb-4 flex-row items-center justify-between">
        <Text
          className="font-label text-[10px] uppercase tracking-[2.4px]"
          style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.68), fontFamily: 'Manrope-Bold' }}>
          {label}
        </Text>
        <View
          className="h-9 w-9 items-center justify-center rounded-full"
          style={{ backgroundColor: hexToRgba(accent, 0.14) }}>
          <MaterialIcons name={icon} size={18} color={accent} />
        </View>
      </View>
      <Text
        className="font-headline text-[28px] tracking-[-0.6px]"
        style={{ color: adminTheme.onSurface }}>
        {value}
      </Text>
      <Text
        className="mt-1 font-body text-xs"
        style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.72) }}>
        {hint}
      </Text>
    </View>
  );
}

export default function ApprovalQueueSummary({
  counts,
  selectedRecord,
}: {
  counts: PackageApprovalCounts;
  selectedRecord: PackageApprovalRecord | null;
}) {
  const { width } = useWindowDimensions();
  const adminTheme = useSuperAdminTheme();
  const reviewedCount = counts.approved + counts.rejected;
  const metricBasis = width >= 1280 ? '31.8%' : width >= 768 ? '48%' : '100%';

  return (
    <View
      className="rounded-[14px] border p-5"
      style={[
        {
          backgroundColor: adminTheme.cardBackgroundMuted,
          borderColor: adminTheme.borderSubtle,
        },
        getPackageApprovalPanelShadow(adminTheme.theme),
      ]}>
      <View className="gap-4">
        <View className="gap-2">
          <Text
            className="font-label text-[10px] uppercase tracking-[2.8px]"
            style={{ color: adminTheme.primary, fontFamily: 'Manrope-Bold' }}>
            Paket Basvurulari
          </Text>
          <Text
            className="font-headline text-[34px] tracking-[-0.8px]"
            style={{ color: adminTheme.onSurface }}>
            Salonlarin paket secimlerini kontrollu bir kuyrukta yonet.
          </Text>
          <Text
            className="max-w-[760px] font-body text-sm"
            style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.8) }}>
            Bu alan, super admin tarafinda paket degisim ve ust seviye abonelik taleplerini
            hizli karar verebilecegin bir operasyon paneli olarak tasarlandi.
          </Text>
        </View>

        <View className="flex-row flex-wrap gap-4">
          <View style={{ width: metricBasis as any, minWidth: 220 }}>
            <SummaryMetric
              icon="pending-actions"
              label="Bekleyen Kuyruk"
              value={String(counts.pending)}
              hint="Acil inceleme bekleyen paket talepleri"
              accent={adminTheme.primary}
            />
          </View>
          <View style={{ width: metricBasis as any, minWidth: 220 }}>
            <SummaryMetric
              icon="verified"
              label="Incelenen Talep"
              value={String(reviewedCount)}
              hint="Onaylanan ve reddedilen toplam islem"
              accent={adminTheme.success}
            />
          </View>
          <View style={{ width: metricBasis as any, minWidth: 220 }}>
            <SummaryMetric
              icon="sell"
              label="Secili Paket"
              value={
                selectedRecord
                  ? `TRY ${new Intl.NumberFormat('tr-TR').format(
                      selectedRecord.pricePerMonth,
                    )}`
                  : '-'
              }
              hint={
                selectedRecord
                  ? `${selectedRecord.packageName} icin aylik teklif`
                  : 'Goruntulenecek talep secilmedi'
              }
              accent={adminTheme.warning}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
