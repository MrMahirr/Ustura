import React from 'react';
import { router } from 'expo-router';
import { Platform, ScrollView, View, useWindowDimensions } from 'react-native';

import PanelTopBar from '@/components/panel/super-admin/PanelTopBar';
import SalonFilters from '@/components/panel/super-admin/salons/SalonFilters';
import SalonInsightsSection from '@/components/panel/super-admin/salons/SalonInsightsSection';
import SalonListSection from '@/components/panel/super-admin/salons/SalonListSection';
import SalonPageHeader from '@/components/panel/super-admin/salons/SalonPageHeader';
import { salonClassNames } from '@/components/panel/super-admin/salons/presentation';
import { useSalonManagement } from '@/components/panel/super-admin/salons/use-salon-management';
import type { SalonRowActionKind } from '@/components/panel/super-admin/salons/utils';
import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { buildPanelSalonDetailRoute } from '@/constants/routes';
import { ApiError } from '@/services/api';
import { deleteAdminSalon, patchAdminSalonStatus } from '@/services/salon.service';
import { confirmDestructive, showErrorFlash } from '@/utils/flash';

function confirmSalonDelete(salonName: string): Promise<boolean> {
  const msg = `"${salonName}" salonu kalici olarak silinecek; bagli randevu ve personel kayitlari da silinir. Devam edilsin mi?`;
  return confirmDestructive('Salonu sil', msg);
}

export default function SuperAdminSalons() {
  const { width } = useWindowDimensions();
  const adminTheme = useSuperAdminTheme();
  const salonManagement = useSalonManagement();

  const isTablet = width >= 768;
  const isWide = width >= 1100;
  const useDesktopTable = width >= 1180;
  const paddingH = width < 768 ? 16 : 32;
  const filterBasis = width >= 1320 ? '23.6%' : width >= 860 ? '48.5%' : '100%';

  const handleSalonAction = React.useCallback(
    async (salonId: string, salonName: string, kind: SalonRowActionKind) => {
      if (kind === 'view') {
        router.push(buildPanelSalonDetailRoute(salonId));
        return;
      }
      try {
        if (kind === 'suspend') {
          await patchAdminSalonStatus(salonId, false);
        } else if (kind === 'restore') {
          await patchAdminSalonStatus(salonId, true);
        } else if (kind === 'delete') {
          const ok = await confirmSalonDelete(salonName);
          if (!ok) {
            return;
          }
          await deleteAdminSalon(salonId);
        }
        await salonManagement.reload();
      } catch (error) {
        const msg = error instanceof ApiError ? error.message : 'Islem tamamlanamadi.';
        showErrorFlash('Hata', msg);
      }
    },
    [salonManagement.reload],
  );

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
    <View className={salonClassNames.page} style={{ backgroundColor: adminTheme.pageBackground }}>
      <View className="absolute inset-0" style={overlayStyle} />

      <PanelTopBar query={salonManagement.query} onQueryChange={salonManagement.setQuery} />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: paddingH, paddingTop: 24, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}>
        <View className={salonClassNames.content}>
          <SalonPageHeader isWide={isWide} />

          <SalonFilters
            filterBasis={filterBasis}
            selectedStatus={salonManagement.selectedStatus}
            selectedCity={salonManagement.selectedCity}
            selectedSort={salonManagement.selectedSort}
            statusOptions={salonManagement.statusOptions}
            cityOptions={salonManagement.cityOptions}
            sortOptions={salonManagement.sortOptions}
            totalRecords={salonManagement.totalRecords}
            onStatusChange={salonManagement.setSelectedStatus}
            onCityChange={salonManagement.setSelectedCity}
            onSortChange={salonManagement.setSelectedSort}
          />

          <SalonListSection
            salons={salonManagement.visibleSalons}
            filteredSalonsCount={salonManagement.filteredSalonsCount}
            page={salonManagement.page}
            totalPages={salonManagement.totalPages}
            startRow={salonManagement.startRow}
            endRow={salonManagement.endRow}
            useDesktopTable={useDesktopTable}
            isLoading={salonManagement.isLoading}
            errorMessage={salonManagement.errorMessage}
            onPageChange={salonManagement.setPage}
            onRetry={salonManagement.reload}
            onOpenSalon={(salonId) => router.push(buildPanelSalonDetailRoute(salonId))}
            onSalonAction={handleSalonAction}
          />

          <SalonInsightsSection
            isTablet={isTablet}
            overview={salonManagement.overview}
            onRefresh={salonManagement.reload}
          />
        </View>
      </ScrollView>
    </View>
  );
}
