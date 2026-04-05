import React from 'react';
import { router } from 'expo-router';
import { Platform, ScrollView, Text, View, useWindowDimensions } from 'react-native';

import ActionButton from '@/components/panel/super-admin/ActionButton';
import PanelTopBar from '@/components/panel/super-admin/PanelTopBar';
import UserActivityLogCard from '@/components/panel/super-admin/user-profile/UserActivityLogCard';
import UserAppointmentsSection from '@/components/panel/super-admin/user-profile/UserAppointmentsSection';
import UserEarningsSection from '@/components/panel/super-admin/user-profile/UserEarningsSection';
import UserExpertiseCard from '@/components/panel/super-admin/user-profile/UserExpertiseCard';
import UserMetricsSection from '@/components/panel/super-admin/user-profile/UserMetricsSection';
import UserProfileHero from '@/components/panel/super-admin/user-profile/UserProfileHero';
import UserQuickActionsCard from '@/components/panel/super-admin/user-profile/UserQuickActionsCard';
import UserWorkInfoCard from '@/components/panel/super-admin/user-profile/UserWorkInfoCard';
import { userProfileClassNames } from '@/components/panel/super-admin/user-profile/presentation';
import { useUserProfile } from '@/components/panel/super-admin/user-profile/use-user-profile';
import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { buildPanelSalonDetailRoute, panelRoutes } from '@/constants/routes';
import { cn } from '@/utils/cn';

export default function SuperAdminUserProfile({ userId }: { userId?: string }) {
  const { width } = useWindowDimensions();
  const adminTheme = useSuperAdminTheme();
  const profile = useUserProfile(userId);
  const [query, setQuery] = React.useState('');

  const isWide = width >= 1160;
  const useDesktopAppointments = width >= 960;
  const paddingH = width < 768 ? 16 : 32;
  const metricBasis = width >= 1420 ? '24%' : width >= 880 ? '48.7%' : '100%';

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

  if (!profile) {
    return (
      <View className={userProfileClassNames.page} style={{ backgroundColor: adminTheme.pageBackground }}>
        <View className="absolute inset-0" style={overlayStyle} />
        <PanelTopBar query={query} onQueryChange={setQuery} />

        <View className="min-h-[260px] items-center justify-center gap-3 px-6">
          <Text className="text-base" style={{ color: adminTheme.onSurface, fontFamily: 'Manrope-Bold' }}>
            Kullanici bulunamadi
          </Text>
          <Text className="max-w-[420px] text-center text-sm leading-5" style={{ color: adminTheme.onSurfaceVariant }}>
            Secilen kullanici kaydi mevcut degil veya silinmis olabilir.
          </Text>
          <ActionButton label="Kullanicilar Listesine Don" onPress={() => router.push(panelRoutes.kullanicilar)} />
        </View>
      </View>
    );
  }

  return (
    <View className={userProfileClassNames.page} style={{ backgroundColor: adminTheme.pageBackground }}>
      <View className="absolute inset-0" style={overlayStyle} />
      <PanelTopBar query={query} onQueryChange={setQuery} />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: paddingH, paddingTop: 24, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}>
        <View className={userProfileClassNames.content}>
          <UserProfileHero
            profile={profile}
            isWide={isWide}
            onOpenSalon={
              profile.user.salonId ? () => router.push(buildPanelSalonDetailRoute(profile.user.salonId as string)) : undefined
            }
          />

          <UserMetricsSection metrics={profile.metrics} metricBasis={metricBasis} />

          <View className={cn('gap-6', isWide ? 'flex-row' : 'flex-col')}>
            <View className={cn(userProfileClassNames.column, isWide ? 'flex-[1.8]' : undefined)}>
              <UserWorkInfoCard profile={profile} />
              <UserAppointmentsSection appointments={profile.recentAppointments} useDesktopTable={useDesktopAppointments} />
              <UserEarningsSection series={profile.earningsSeries} />
            </View>

            <View className={cn(userProfileClassNames.column, isWide ? 'flex-1' : undefined)}>
              <UserExpertiseCard expertise={profile.expertise} />
              <UserActivityLogCard activities={profile.activities} />
              <UserQuickActionsCard actions={profile.quickActions} />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
