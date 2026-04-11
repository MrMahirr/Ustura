import React from 'react';
import { Text, View, useWindowDimensions } from 'react-native';

import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { hexToRgba } from '@/utils/color';

import ApprovalQueueSummary from './ApprovalQueueSummary';
import ApprovalStatusTabs from './ApprovalStatusTabs';
import PackageApprovalCard from './PackageApprovalCard';
import PackageApprovalEmptyState from './PackageApprovalEmptyState';
import PackageApprovalFocusPanel from './PackageApprovalFocusPanel';
import {
  getPackageApprovalPanelShadow,
  packageApprovalClassNames,
} from './presentation';
import type { PackageApprovalRecord } from './types';
import { usePackageApprovalManagement } from './use-package-approval-management';

export default function PackageApprovalsSection({
  query,
  records,
  onApprove,
  onReject,
}: {
  query: string;
  records: PackageApprovalRecord[];
  onApprove: (recordId: string) => void;
  onReject: (recordId: string) => void;
}) {
  const { width } = useWindowDimensions();
  const adminTheme = useSuperAdminTheme();
  const approvalManagement = usePackageApprovalManagement(query, records);
  const isWide = width >= 1320;

  return (
    <View className="gap-6">
      <ApprovalQueueSummary
        counts={approvalManagement.counts}
        selectedRecord={approvalManagement.selectedRecord}
      />

      <View
        className={packageApprovalClassNames.shell}
        style={[
          {
            backgroundColor: adminTheme.cardBackgroundMuted,
            borderColor: adminTheme.borderSubtle,
          },
          getPackageApprovalPanelShadow(adminTheme.theme),
        ]}>
        <View
          className="gap-5 border-b p-5"
          style={{ borderBottomColor: adminTheme.borderSubtle }}>
          <View
            className="justify-between gap-4"
            style={{
              flexDirection: width >= 1024 ? 'row' : 'column',
              alignItems: width >= 1024 ? 'flex-end' : 'flex-start',
            }}>
            <View className="max-w-[780px] gap-2">
              <Text
                className={packageApprovalClassNames.label}
                style={{ color: adminTheme.primary, fontFamily: 'Manrope-Bold' }}>
                Inceleme Kuyrugu
              </Text>
              <Text
                className="font-headline text-[32px] tracking-[-0.8px]"
                style={{ color: adminTheme.onSurface }}>
                Paket secimi onay ekranini moduler bir akis olarak kuruyoruz.
              </Text>
              <Text
                className="font-body text-sm"
                style={{ color: hexToRgba(adminTheme.onSurfaceVariant, 0.78) }}>
                Arama cubugu, durum sekmeleri ve kart bazli karar aksiyonlari tek bir domain altinda
                ayrildi. Bu sayede servis baglantisi geldiginde sadece hook katmani degisecek.
              </Text>
            </View>

            <View
              className="rounded-full px-3 py-2"
              style={{ backgroundColor: adminTheme.cardBackgroundStrong }}>
              <Text
                className="font-label text-[10px] uppercase tracking-[2px]"
                style={{
                  color: hexToRgba(adminTheme.onSurfaceVariant, 0.76),
                  fontFamily: 'Manrope-Bold',
                }}>
                {approvalManagement.filteredRecords.length} Kayit Gosteriliyor
              </Text>
            </View>
          </View>

          <ApprovalStatusTabs
            value={approvalManagement.activeStatus}
            counts={approvalManagement.counts}
            onChange={approvalManagement.setActiveStatus}
          />
        </View>

        <View
          className="gap-5 p-5"
          style={{ flexDirection: isWide ? 'row' : 'column' }}>
          <View className="min-w-0 flex-1 gap-4">
            {approvalManagement.filteredRecords.length === 0 ? (
              <PackageApprovalEmptyState
                activeStatus={approvalManagement.activeStatus}
                hasQuery={query.trim().length > 0}
              />
            ) : (
              approvalManagement.filteredRecords.map((record) => (
                <PackageApprovalCard
                  key={record.id}
                  record={record}
                  isSelected={record.id === approvalManagement.selectedRecord?.id}
                  onPreview={() => approvalManagement.setSelectedRecordId(record.id)}
                  onApprove={() => onApprove(record.id)}
                  onReject={() => onReject(record.id)}
                />
              ))
            )}
          </View>

          <View style={{ width: isWide ? 380 : '100%' }}>
            <PackageApprovalFocusPanel
              record={approvalManagement.selectedRecord}
              onApprove={() => {
                if (!approvalManagement.selectedRecord) return;
                onApprove(approvalManagement.selectedRecord.id);
              }}
              onReject={() => {
                if (!approvalManagement.selectedRecord) return;
                onReject(approvalManagement.selectedRecord.id);
              }}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
