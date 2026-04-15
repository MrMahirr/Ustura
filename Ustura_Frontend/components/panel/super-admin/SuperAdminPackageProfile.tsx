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
import type { SubscriptionRecord } from '@/components/panel/super-admin/packages/types';
import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { panelRoutes } from '@/constants/routes';
import { PackageService, type Subscription } from '@/services/package.service';
import { cn } from '@/utils/cn';
import { hexToRgba } from '@/utils/color';
import { confirmDestructive, showErrorFlash } from '@/utils/flash';

export default function SuperAdminPackageProfile({ packageId }: { packageId?: string }) {
  const { width } = useWindowDimensions();
  const adminTheme = useSuperAdminTheme();
  const { profile, isLoading, formState, handleSave, refresh } = usePackageProfile(packageId);
  const [query, setQuery] = React.useState('');
  const [isCancellingSubscription, setIsCancellingSubscription] = React.useState(false);
  const packageSubscribers = React.useMemo<SubscriptionRecord[]>(
    () =>
      (profile?.subscribers ?? []).map((subscription: Subscription) => ({
        id: subscription.id,
        salonName: subscription.salonName,
        salonInitial:
          subscription.salonInitial ??
          subscription.salonName.slice(0, 1).toLocaleUpperCase('tr-TR'),
        packageName: subscription.packageName,
        packageTier: subscription.packageTier,
        startDate: new Intl.DateTimeFormat('tr-TR').format(
          new Date(subscription.startDate),
        ),
        endDate: subscription.endDate
          ? new Intl.DateTimeFormat('tr-TR').format(new Date(subscription.endDate))
          : null,
        status:
          subscription.status === 'active'
            ? 'Aktif'
            : subscription.status === 'expired'
              ? 'Suresi Doldu'
              : subscription.status === 'cancelled'
                ? 'Iptal Edildi'
                : 'Beklemede',
        canCancel:
          subscription.status === 'active' || subscription.status === 'pending',
      })),
    [profile?.subscribers],
  );

  const handleCancelSubscription = React.useCallback(
    async (sub: SubscriptionRecord) => {
      if (!sub.canCancel) {
        return;
      }

      const msg = `"${sub.salonName}" salonunun bu paket aboneligini iptal etmek istiyor musunuz?`;
      const ok = await confirmDestructive('Aboneligi iptal et', msg);

      if (!ok) {
        return;
      }

      setIsCancellingSubscription(true);
      try {
        await PackageService.updateSubscriptionStatus(sub.id, 'cancelled');
        await refresh();
      } catch (err: any) {
        showErrorFlash(
          'Hata',
          typeof err?.message === 'string' && err.message.trim()
            ? err.message
            : 'Abonelik iptal edilemedi.',
        );
      } finally {
        setIsCancellingSubscription(false);
      }
    },
    [refresh],
  );

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
             <Text className="font-headline text-xl text-center mb-4" style={{color: adminTheme.onSurface}}>Pakete Abone Olan Guncel Salonlar</Text>
             {packageSubscribers.length > 0 ? (
               <View
                 className="mb-4 rounded-md border px-3 py-2.5"
                 style={{
                   backgroundColor: hexToRgba(adminTheme.warning, 0.08),
                   borderColor: hexToRgba(adminTheme.warning, 0.25),
                 }}>
                 <Text className="font-body text-xs leading-5" style={{ color: adminTheme.onSurface }}>
                   <Text style={{ fontFamily: 'Manrope-Bold' }}>Not: </Text>
                   Aktif veya beklemedeki abonelikleri sonlandirmak icin listedeki &quot;Abonelik Iptali&quot; dugmesini
                   kullanin. Abonelik iptali aninda uygulanir; paket adi, fiyat ve ozellikler icin &quot;Degisiklikleri
                   Kaydet&quot;e basin.
                 </Text>
               </View>
             ) : null}
             <SubscriptionListSection
               subscriptions={packageSubscribers}
               useDesktopTable={useDesktopTable}
               onCancelSubscription={handleCancelSubscription}
               cancelSubscriptionDisabled={isCancellingSubscription}
             />
          </View>

          <PackageProfileFooter onSave={handleSave} saveDisabled={isCancellingSubscription} />
        </View>
      </ScrollView>
    </View>
  );
}
