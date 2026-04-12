import React, { useState } from 'react';
import { Platform, ScrollView, View, useWindowDimensions } from 'react-native';

import PanelTopBar from '@/components/panel/super-admin/PanelTopBar';
import PackageApprovalsSection from '@/components/panel/super-admin/package-approvals/PackageApprovalsSection';
import AllSubscriptionsModal from '@/components/panel/super-admin/packages/AllSubscriptionsModal';
import PackageCardsGrid from '@/components/panel/super-admin/packages/PackageCardsGrid';
import PackageCreateModal from '@/components/panel/super-admin/packages/PackageCreateModal';
import PackageEditModal from '@/components/panel/super-admin/packages/PackageEditModal';
import PackagePageHeader from '@/components/panel/super-admin/packages/PackagePageHeader';
import PackageStatsRow from '@/components/panel/super-admin/packages/PackageStatsRow';
import SubscriptionListSection from '@/components/panel/super-admin/packages/SubscriptionListSection';
import { packageClassNames } from '@/components/panel/super-admin/packages/presentation';
import { usePackageManagement } from '@/components/panel/super-admin/packages/use-package-management';
import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';

export default function SuperAdminPackages() {
  const { width } = useWindowDimensions();
  const adminTheme = useSuperAdminTheme();
  const packageManagement = usePackageManagement();
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [editingPackageId, setEditingPackageId] = useState<string | null>(null);
  const [isAllSubscriptionsModalVisible, setIsAllSubscriptionsModalVisible] = useState(false);

  const isWide = width >= 1100;
  const useDesktopTable = width >= 1180;
  const paddingH = width < 768 ? 16 : 32;

  const overlayStyle =
    Platform.OS === 'web'
      ? ({
          backgroundImage: `radial-gradient(circle at 1px 1px, ${adminTheme.gridDot} 1px, transparent 0)`,
          backgroundSize: '40px 40px',
          opacity: 1,
          pointerEvents: 'none',
        } as any)
      : ({
          opacity: 0,
          pointerEvents: 'none',
        } as const);

  return (
    <View
      className={packageClassNames.page}
      style={{ backgroundColor: adminTheme.pageBackground }}>
      <View className="absolute inset-0" style={overlayStyle} />

      <PanelTopBar
        query={packageManagement.query}
        onQueryChange={packageManagement.setQuery}
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: paddingH,
          paddingTop: 24,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}>
        <View className={packageClassNames.content}>
          <PackagePageHeader 
            isWide={isWide} 
            onOpenCreateModal={() => setIsCreateModalVisible(true)} 
          />

          <PackageStatsRow overview={packageManagement.overview} />

          <PackageApprovalsSection
            query={packageManagement.query}
            records={packageManagement.approvals}
            onApprove={(recordId) => {
              void packageManagement.approvePackageSelection(recordId);
            }}
            onReject={(recordId) => {
              void packageManagement.rejectPackageSelection(recordId);
            }}
          />

          <PackageCardsGrid
            packages={packageManagement.packages}
            onEditPackage={(pkgId) => {
              setEditingPackageId(pkgId);
            }}
            onTogglePackageState={(pkgId, nextIsActive) => {
              void packageManagement.updatePackage(pkgId, {
                isActive: nextIsActive,
              });
            }}
          />

          <SubscriptionListSection
            subscriptions={packageManagement.subscriptions}
            useDesktopTable={useDesktopTable}
            onViewAll={() => setIsAllSubscriptionsModalVisible(true)}
          />
        </View>
      </ScrollView>

      <PackageCreateModal
        visible={isCreateModalVisible}
        onClose={() => setIsCreateModalVisible(false)}
        onSubmit={packageManagement.createPackage}
        isSubmitting={packageManagement.isMutating}
        errorMessage={packageManagement.error}
      />

      <PackageEditModal
        packageId={editingPackageId}
        onClose={() => setEditingPackageId(null)}
        onSaved={() => {
          void packageManagement.refresh();
        }}
      />

      <AllSubscriptionsModal
        visible={isAllSubscriptionsModalVisible}
        onClose={() => setIsAllSubscriptionsModalVisible(false)}
        subscriptions={packageManagement.subscriptions}
      />
    </View>
  );
}
