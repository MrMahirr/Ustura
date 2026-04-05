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
import { styles } from '@/components/panel/super-admin/user-profile/styles';
import { useUserProfile } from '@/components/panel/super-admin/user-profile/use-user-profile';
import { buildPanelSalonDetailRoute, panelRoutes } from '@/constants/routes';
import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';

export default function SuperAdminUserProfile({ userId }: { userId?: string }) {
  const { width } = useWindowDimensions();
  const adminTheme = useSuperAdminTheme();
  const profile = useUserProfile(userId);
  const [query, setQuery] = React.useState('');

  const isWide = width >= 1160;
  const useDesktopAppointments = width >= 960;
  const paddingH = width < 768 ? 16 : 32;
  const metricBasis = width >= 1420 ? '24%' : width >= 880 ? '48.7%' : '100%';

  if (!profile) {
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

        <PanelTopBar query={query} onQueryChange={setQuery} />

        <View style={styles.emptyState}>
          <Text style={[styles.emptyTitle, { color: adminTheme.onSurface }]}>Kullanici bulunamadi</Text>
          <Text style={[styles.emptyDescription, { color: adminTheme.onSurfaceVariant }]}>
            Secilen kullanici kaydi mevcut degil veya silinmis olabilir.
          </Text>
          <ActionButton label="Kullanicilar Listesine Don" onPress={() => router.push(panelRoutes.kullanicilar)} />
        </View>
      </View>
    );
  }

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

      <PanelTopBar query={query} onQueryChange={setQuery} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingHorizontal: paddingH, paddingTop: 24, paddingBottom: 40 }]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <UserProfileHero
            profile={profile}
            isWide={isWide}
            onOpenSalon={
              profile.user.salonId ? () => router.push(buildPanelSalonDetailRoute(profile.user.salonId as string)) : undefined
            }
          />

          <UserMetricsSection metrics={profile.metrics} metricBasis={metricBasis} />

          <View style={[styles.contentGrid, { flexDirection: isWide ? 'row' : 'column' }]}>
            <View style={[styles.leftColumn, { flex: isWide ? 1.8 : undefined }]}>
              <UserWorkInfoCard profile={profile} />
              <UserAppointmentsSection appointments={profile.recentAppointments} useDesktopTable={useDesktopAppointments} />
              <UserEarningsSection series={profile.earningsSeries} />
            </View>

            <View style={[styles.rightColumn, { flex: isWide ? 1 : undefined }]}>
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
