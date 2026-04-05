import React from 'react';
import { router } from 'expo-router';
import { Platform, ScrollView, Text, View, useWindowDimensions } from 'react-native';

import PanelTopBar from '@/components/panel/super-admin/PanelTopBar';
import SalonIdentityCard from '@/components/panel/super-admin/salon-profile/SalonIdentityCard';
import SalonPerformanceSection from '@/components/panel/super-admin/salon-profile/SalonPerformanceSection';
import SalonProfileFooter from '@/components/panel/super-admin/salon-profile/SalonProfileFooter';
import SalonProfileHero from '@/components/panel/super-admin/salon-profile/SalonProfileHero';
import SalonServicesSection from '@/components/panel/super-admin/salon-profile/SalonServicesSection';
import SalonStaffSection from '@/components/panel/super-admin/salon-profile/SalonStaffSection';
import SalonSubscriptionCard from '@/components/panel/super-admin/salon-profile/SalonSubscriptionCard';
import { styles } from '@/components/panel/super-admin/salon-profile/styles';
import { useSalonProfile } from '@/components/panel/super-admin/salon-profile/use-salon-profile';
import ActionButton from '@/components/panel/super-admin/ActionButton';
import { panelRoutes } from '@/constants/routes';
import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';

export default function SuperAdminSalonProfile({ salonId }: { salonId?: string }) {
  const { width } = useWindowDimensions();
  const adminTheme = useSuperAdminTheme();
  const profile = useSalonProfile(salonId);
  const [query, setQuery] = React.useState('');

  const isWide = width >= 1160;
  const useDesktopStaffTable = width >= 980;
  const paddingH = width < 768 ? 16 : 32;
  const metricBasis = width >= 1440 ? '24.2%' : width >= 920 ? '48.8%' : '100%';
  const serviceBasis = width >= 1180 ? '49.92%' : '100%';

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
          <Text style={[styles.emptyTitle, { color: adminTheme.onSurface }]}>Salon bulunamadi</Text>
          <Text style={[styles.emptyDescription, { color: adminTheme.onSurfaceVariant }]}>
            Secilen salon kaydi mevcut degil veya silinmis olabilir.
          </Text>
          <ActionButton label="Salon Listesine Don" onPress={() => router.push(panelRoutes.salonlar)} />
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
          <SalonProfileHero
            profile={profile}
            isWide={isWide}
            onGoBack={() => router.push(panelRoutes.salonlar)}
          />

          <View style={[styles.contentGrid, { flexDirection: isWide ? 'row' : 'column' }]}>
            <View style={[styles.leftColumn, { flex: isWide ? 1.05 : undefined }]}>
              <SalonIdentityCard profile={profile} />
              <SalonSubscriptionCard profile={profile} />
            </View>

            <View style={[styles.rightColumn, { flex: isWide ? 1.95 : undefined }]}>
              <SalonPerformanceSection metrics={profile.metrics} metricBasis={metricBasis} />
              <SalonStaffSection staffMembers={profile.staffMembers} useDesktopTable={useDesktopStaffTable} />
              <SalonServicesSection
                services={profile.services}
                totalServices={profile.totalServices}
                itemBasis={serviceBasis}
              />
            </View>
          </View>

          <SalonProfileFooter />
        </View>
      </ScrollView>
    </View>
  );
}
