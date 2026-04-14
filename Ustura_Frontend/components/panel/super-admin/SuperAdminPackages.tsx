import React, { useState } from 'react';
import { Alert, Platform, ScrollView, View, useWindowDimensions } from 'react-native';

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
import type { SubscriptionRecord } from '@/components/panel/super-admin/packages/types';
import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';

function showErrorAlert(message: string) {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    window.alert(message);
    return;
  }
  Alert.alert('Hata', message);
}

export default function SuperAdminPackages() {
  const { width } = useWindowDimensions();
  const adminTheme = useSuperAdminTheme();
  const packageManagement = usePackageManagement();
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [editingPackageId, setEditingPackageId] = useState<string | null>(null);
  const [isAllSubscriptionsModalVisible, setIsAllSubscriptionsModalVisible] = useState(false);

  const handleCancelSubscription = React.useCallback(
    async (sub: SubscriptionRecord) => {
      if (!sub.canCancel) {
        return;
      }

      const msg = `"${sub.salonName}" salonunun "${sub.packageName}" aboneligini iptal etmek istiyor musunuz?`;
      let ok = false;
      if (
        Platform.OS === 'web' &&
        typeof window !== 'undefined' &&
        typeof window.confirm === 'function'
      ) {
        ok = window.confirm(msg);
      } else {
        ok = await new Promise<boolean>((resolve) => {
          Alert.alert('Aboneligi iptal et', msg, [
            { text: 'Vazgec', style: 'cancel', onPress: () => resolve(false) },
            { text: 'Iptal et', style: 'destructive', onPress: () => resolve(true) },
          ]);
        });
      }

      if (!ok) {
        return;
      }

      const result = await packageManagement.cancelSubscription(sub.id);
      if (!result.ok) {
        showErrorAlert(result.message);
      }
    },
    [packageManagement],
  );

  const handleDeletePackage = React.useCallback(
    async (packageId: string) => {
      const pkg = packageManagement.packages.find((p) => p.id === packageId);
      if (pkg && pkg.linkedSubscriptionCount > 0) {
        showErrorAlert(
          'Bu pakete aktif veya beklemede abonelik var. Paket silinemez; once aboneligi sonlandirin veya baska pakete alin.',
        );
        return;
      }

      const name = pkg?.name ?? 'Bu paket';
      const msg = `"${name}" paketi kalici olarak silinecek. Bu islem geri alinamaz. Devam edilsin mi?`;
      let ok = false;
      if (
        Platform.OS === 'web' &&
        typeof window !== 'undefined' &&
        typeof window.confirm === 'function'
      ) {
        ok = window.confirm(msg);
      } else {
        ok = await new Promise<boolean>((resolve) => {
          Alert.alert('Paketi sil', msg, [
            { text: 'Iptal', style: 'cancel', onPress: () => resolve(false) },
            { text: 'Sil', style: 'destructive', onPress: () => resolve(true) },
          ]);
        });
      }

      if (!ok) {
        return;
      }

      const result = await packageManagement.deletePackage(packageId);
      if (!result.ok) {
        showErrorAlert(result.message);
        return;
      }

      setEditingPackageId((current) => (current === packageId ? null : current));
    },
    [packageManagement],
  );

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
            onDeletePackage={(pkgId) => {
              void handleDeletePackage(pkgId);
            }}
          />

          <SubscriptionListSection
            subscriptions={packageManagement.subscriptions}
            useDesktopTable={useDesktopTable}
            onViewAll={() => setIsAllSubscriptionsModalVisible(true)}
            onCancelSubscription={handleCancelSubscription}
            cancelSubscriptionDisabled={packageManagement.isMutating}
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
        onCancelSubscription={handleCancelSubscription}
        cancelSubscriptionDisabled={packageManagement.isMutating}
      />
    </View>
  );
}
