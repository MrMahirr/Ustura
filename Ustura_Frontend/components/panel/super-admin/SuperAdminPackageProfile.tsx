import React from 'react';
import { router } from 'expo-router';
import { Platform, ScrollView, Text, View, useWindowDimensions } from 'react-native';

import ActionButton from '@/components/panel/super-admin/ActionButton';
import PanelTopBar from '@/components/panel/super-admin/PanelTopBar';
import PackageFeaturesSection from '@/components/panel/super-admin/package-profile/PackageFeaturesSection';
import PackageIdentityCard from '@/components/panel/super-admin/package-profile/PackageIdentityCard';
import PackageProfileFooter from '@/components/panel/super-admin/package-profile/PackageProfileFooter';
import PackageProfileHero from '@/components/panel/super-admin/package-profile/PackageProfileHero';
import { packageProfileClassNames } from '@/components/panel/super-admin/package-profile/presentation';
import { usePackageProfile } from '@/components/panel/super-admin/package-profile/use-package-profile';
import SubscriptionListSection from '@/components/panel/super-admin/packages/SubscriptionListSection';
import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { panelRoutes } from '@/constants/routes';
import { cn } from '@/utils/cn';

export default function SuperAdminPackageProfile({ packageId }: { packageId?: string }) {
  const { width } = useWindowDimensions();
  const adminTheme = useSuperAdminTheme();
  const { profile, isLoading, formState, handleSave } = usePackageProfile(packageId);
  const [query, setQuery] = React.useState('');

  const isWide = width >= 1160;
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

  if (isLoading) {
    return (
      <View className={packageProfileClassNames.page} style={{ backgroundColor: adminTheme.pageBackground }}>
        <View className="absolute inset-0" style={overlayStyle} />
        <PanelTopBar query={query} onQueryChange={setQuery} />
        <View className="flex-1 items-center justify-center">
          <Text style={{ color: adminTheme.onSurfaceVariant }}>Yukleniyor...</Text>
        </View>
      </View>
    );
  }

  if (!profile) {
    return (
      <View className={packageProfileClassNames.page} style={{ backgroundColor: adminTheme.pageBackground }}>
        <View className="absolute inset-0" style={overlayStyle} />
        <PanelTopBar query={query} onQueryChange={setQuery} />

        <View className="flex-1 items-center justify-center gap-4 px-6 py-12">
          <Text className="text-center font-headline text-[28px] tracking-[-0.5px]" style={{ color: adminTheme.onSurface }}>
            Paket bulunamadi
          </Text>
          <Text className="max-w-[420px] text-center text-sm leading-5" style={{ color: adminTheme.onSurfaceVariant }}>
            Secilen paket kaydi mevcut degil veya silinmis olabilir.
          </Text>
          <ActionButton label="Paketler Listesine Don" onPress={() => router.push(panelRoutes.paketler)} />
        </View>
      </View>
    );
  }

  return (
    <View className={packageProfileClassNames.page} style={{ backgroundColor: adminTheme.pageBackground }}>
      <View className="absolute inset-0" style={overlayStyle} />

      <PanelTopBar query={query} onQueryChange={setQuery} />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: paddingH, paddingTop: 24, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}>
        <View className={packageProfileClassNames.content}>
          <PackageProfileHero profile={profile} isWide={isWide} onGoBack={() => router.push(panelRoutes.paketler)} />

          <View className={cn('gap-6 mb-8', isWide ? 'flex-row items-stretch' : 'flex-col')}>
            <View className={cn(packageProfileClassNames.column, isWide ? 'flex-1' : undefined)}>
              <PackageIdentityCard formState={formState} />
            </View>

            <View className={cn(packageProfileClassNames.column, isWide ? 'flex-[1.5]' : undefined)}>
              <PackageFeaturesSection formState={formState} />
            </View>
          </View>

          <View className="mt-4">
             <Text className="font-headline text-xl text-center mb-6" style={{color: adminTheme.onSurface}}>Pakete Abone Olan Guncel Salonlar</Text>
             <SubscriptionListSection
               subscriptions={profile.subscribers}
               useDesktopTable={useDesktopTable}
             />
          </View>

          <PackageProfileFooter onSave={handleSave} />
        </View>
      </ScrollView>
    </View>
  );
}
