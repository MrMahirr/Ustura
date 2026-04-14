import React from 'react';
import { router } from 'expo-router';
import { Alert, Platform, ScrollView, View, useWindowDimensions } from 'react-native';

import PanelTopBar from '@/components/panel/super-admin/PanelTopBar';
import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import UserFilters from '@/components/panel/super-admin/users/UserFilters';
import UserInsightsSection from '@/components/panel/super-admin/users/UserInsightsSection';
import UserListSection from '@/components/panel/super-admin/users/UserListSection';
import UserOverviewBar from '@/components/panel/super-admin/users/UserOverviewBar';
import UserPageHeader from '@/components/panel/super-admin/users/UserPageHeader';
import { userClassNames } from '@/components/panel/super-admin/users/presentation';
import { useUserManagement } from '@/components/panel/super-admin/users/use-user-management';
import type { UserActionIconName } from '@/components/panel/super-admin/users/utils';
import { buildPanelSalonDetailRoute, buildPanelUserDetailRoute } from '@/constants/routes';
import { useAuth } from '@/hooks/use-auth';
import { UserService } from '@/services/user.service';

export default function SuperAdminUsers() {
  const { width } = useWindowDimensions();
  const adminTheme = useSuperAdminTheme();
  const userManagement = useUserManagement();
  const { user: authUser } = useAuth();

  const handleUserRowAction = async (userId: string, icon: UserActionIconName) => {
    if (icon === 'block') {
      if (authUser?.id === userId) {
        Alert.alert('Islem yapilamadi', 'Kendi hesabinizi bu ekrandan durduramazsiniz.');
        return;
      }

      try {
        await UserService.patchAdminUserStatus(userId, false);
        userManagement.refreshUsers();
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Kullanici durdurulamadi.';
        Alert.alert('Hata', message);
      }

      return;
    }

    if (icon === 'restore') {
      try {
        await UserService.patchAdminUserStatus(userId, true);
        userManagement.refreshUsers();
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Kullanici yeniden acilamadi.';
        Alert.alert('Hata', message);
      }

      return;
    }

    router.push(buildPanelUserDetailRoute(userId));
  };

  const isWide = width >= 1080;
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
    <View className={userClassNames.page} style={{ backgroundColor: adminTheme.pageBackground }}>
      <View className="absolute inset-0" style={overlayStyle} />

      <PanelTopBar query={userManagement.query} onQueryChange={userManagement.setQuery} />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: paddingH, paddingTop: 24, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}>
        <View className={userClassNames.content}>
          <UserPageHeader isWide={isWide} selectedViewMode={userManagement.viewMode} />

          <UserOverviewBar
            isWide={isWide}
            selectedViewMode={userManagement.viewMode}
            overview={userManagement.overview}
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
            isLoading={userManagement.isLoading}
            error={userManagement.error}
            page={userManagement.page}
            totalPages={userManagement.totalPages}
            startRow={userManagement.startRow}
            endRow={userManagement.endRow}
            useDesktopTable={useDesktopTable}
            onPageChange={userManagement.setPage}
            onOpenSalon={(salonId) => router.push(buildPanelSalonDetailRoute(salonId))}
            onOpenUser={(userId) => router.push(buildPanelUserDetailRoute(userId))}
            onUserRowAction={handleUserRowAction}
            onAddUser={() => undefined}
          />

          {userManagement.viewMode === 'all' ? (
            <UserInsightsSection isWide={isWide} overview={userManagement.overview} />
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}
