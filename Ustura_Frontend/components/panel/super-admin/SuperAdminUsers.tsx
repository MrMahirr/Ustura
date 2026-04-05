import React from 'react';
import { router } from 'expo-router';
import { Platform, ScrollView, View, useWindowDimensions } from 'react-native';

import PanelTopBar from '@/components/panel/super-admin/PanelTopBar';
import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import UserFilters from '@/components/panel/super-admin/users/UserFilters';
import UserInsightsSection from '@/components/panel/super-admin/users/UserInsightsSection';
import UserListSection from '@/components/panel/super-admin/users/UserListSection';
import UserOverviewBar from '@/components/panel/super-admin/users/UserOverviewBar';
import UserPageHeader from '@/components/panel/super-admin/users/UserPageHeader';
import { styles } from '@/components/panel/super-admin/users/styles';
import { useUserManagement } from '@/components/panel/super-admin/users/use-user-management';
import { buildPanelSalonDetailRoute, buildPanelUserDetailRoute } from '@/constants/routes';

export default function SuperAdminUsers() {
  const { width } = useWindowDimensions();
  const adminTheme = useSuperAdminTheme();
  const userManagement = useUserManagement();

  const isWide = width >= 1080;
  const useDesktopTable = width >= 1180;
  const paddingH = width < 768 ? 16 : 32;

  return (
    <View style={[styles.page, { backgroundColor: adminTheme.pageBackground }]}>
      <View
        style={[
          styles.gridOverlay,
          Platform.OS === 'web'
            ? ({ backgroundImage: `radial-gradient(circle at 1px 1px, ${adminTheme.gridDot} 1px, transparent 0)` } as any)
            : null,
        ]}
      />

      <PanelTopBar query={userManagement.query} onQueryChange={userManagement.setQuery} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingHorizontal: paddingH, paddingTop: 24, paddingBottom: 40 },
        ]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <UserPageHeader isWide={isWide} selectedViewMode={userManagement.viewMode} />

          <UserOverviewBar
            isWide={isWide}
            selectedViewMode={userManagement.viewMode}
            onViewModeChange={userManagement.setViewMode}
          />

          <UserFilters
            selectedRole={userManagement.selectedRole}
            selectedStatus={userManagement.selectedStatus}
            selectedSalon={userManagement.selectedSalon}
            selectedCity={userManagement.selectedCity}
            onCycleRole={userManagement.cycleRole}
            onCycleStatus={userManagement.cycleStatus}
            onCycleSalon={userManagement.cycleSalon}
            onCycleCity={userManagement.cycleCity}
            onReset={userManagement.resetFilters}
          />

          <UserListSection
            users={userManagement.visibleUsers}
            groupedSalons={userManagement.groupedSalons}
            filteredUsersCount={userManagement.filteredUsersCount}
            viewMode={userManagement.viewMode}
            page={userManagement.page}
            totalPages={userManagement.totalPages}
            startRow={userManagement.startRow}
            endRow={userManagement.endRow}
            useDesktopTable={useDesktopTable}
            onPageChange={userManagement.setPage}
            onOpenSalon={(salonId) => router.push(buildPanelSalonDetailRoute(salonId))}
            onOpenUser={(userId) => router.push(buildPanelUserDetailRoute(userId))}
            onAddUser={() => undefined}
          />

          {userManagement.viewMode === 'all' ? <UserInsightsSection isWide={isWide} /> : null}
        </View>
      </ScrollView>
    </View>
  );
}
