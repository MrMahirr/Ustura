import React from 'react';
import { router } from 'expo-router';
import { Platform, ScrollView, Text, View, useWindowDimensions } from 'react-native';

import ActionButton from '@/components/panel/super-admin/ActionButton';
import PanelTopBar from '@/components/panel/super-admin/PanelTopBar';
import SalonIdentityCard from '@/components/panel/super-admin/salon-profile/SalonIdentityCard';
import SalonPerformanceSection from '@/components/panel/super-admin/salon-profile/SalonPerformanceSection';
import SalonProfileFooter from '@/components/panel/super-admin/salon-profile/SalonProfileFooter';
import SalonProfileHero from '@/components/panel/super-admin/salon-profile/SalonProfileHero';
import { salonProfileClassNames } from '@/components/panel/super-admin/salon-profile/presentation';
import SalonServicesSection from '@/components/panel/super-admin/salon-profile/SalonServicesSection';
import SalonStaffSection from '@/components/panel/super-admin/salon-profile/SalonStaffSection';
import SalonSubscriptionCard from '@/components/panel/super-admin/salon-profile/SalonSubscriptionCard';
import { useSalonProfile } from '@/components/panel/super-admin/salon-profile/use-salon-profile';
import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { panelRoutes } from '@/constants/routes';
import { cn } from '@/utils/cn';

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
      <View className={salonProfileClassNames.page} style={{ backgroundColor: adminTheme.pageBackground }}>
        <View className="absolute inset-0" style={overlayStyle} />
        <PanelTopBar query={query} onQueryChange={setQuery} />

        <View className="flex-1 items-center justify-center gap-4 px-6 py-12">
          <Text className="text-center font-headline text-[28px] tracking-[-0.5px]" style={{ color: adminTheme.onSurface }}>
            Salon bulunamadi
          </Text>
          <Text className="max-w-[420px] text-center text-sm leading-5" style={{ color: adminTheme.onSurfaceVariant }}>
            Secilen salon kaydi mevcut degil veya silinmis olabilir.
          </Text>
          <ActionButton label="Salon Listesine Don" onPress={() => router.push(panelRoutes.salonlar)} />
        </View>
      </View>
    );
  }

  return (
    <View className={salonProfileClassNames.page} style={{ backgroundColor: adminTheme.pageBackground }}>
      <View className="absolute inset-0" style={overlayStyle} />

      <PanelTopBar query={query} onQueryChange={setQuery} />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: paddingH, paddingTop: 24, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}>
        <View className={salonProfileClassNames.content}>
          <SalonProfileHero profile={profile} isWide={isWide} onGoBack={() => router.push(panelRoutes.salonlar)} />

          <View className={cn('gap-6', isWide ? 'flex-row items-stretch' : 'flex-col')}>
            <View className={cn(salonProfileClassNames.column, isWide ? 'flex-[1.05]' : undefined)}>
              <SalonIdentityCard profile={profile} />
              <SalonSubscriptionCard profile={profile} />
            </View>

            <View className={cn(salonProfileClassNames.column, isWide ? 'flex-[1.95]' : undefined)}>
              <SalonPerformanceSection metrics={profile.metrics} metricBasis={metricBasis} />
              <SalonStaffSection staffMembers={profile.staffMembers} useDesktopTable={useDesktopStaffTable} />
              <SalonServicesSection services={profile.services} totalServices={profile.totalServices} itemBasis={serviceBasis} />
            </View>
          </View>

          <SalonProfileFooter />
        </View>
      </ScrollView>
    </View>
  );
}
