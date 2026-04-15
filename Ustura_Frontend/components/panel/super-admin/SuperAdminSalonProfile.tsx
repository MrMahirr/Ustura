import React from 'react';
import { router } from 'expo-router';
import { ActivityIndicator, Platform, ScrollView, Text, View, useWindowDimensions } from 'react-native';

import ActionButton from '@/components/panel/super-admin/ActionButton';
import PanelTopBar from '@/components/panel/super-admin/PanelTopBar';
import SalonIdentityCard from '@/components/panel/super-admin/salon-profile/SalonIdentityCard';
import SalonProfileDangerZone from '@/components/panel/super-admin/salon-profile/SalonProfileDangerZone';
import SalonProfileEditSection from '@/components/panel/super-admin/salon-profile/SalonProfileEditSection';
import SalonProfileFooter from '@/components/panel/super-admin/salon-profile/SalonProfileFooter';
import SalonProfileHero from '@/components/panel/super-admin/salon-profile/SalonProfileHero';
import { salonProfileClassNames } from '@/components/panel/super-admin/salon-profile/presentation';
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
  const paddingH = width < 768 ? 16 : 32;

  const overlayStyle =
    Platform.OS === 'web'
      ? ({
          backgroundImage: `radial-gradient(circle at 1px 1px, ${adminTheme.gridDot} 1px, transparent 0)`,
          backgroundSize: '40px 40px',
          opacity: 1,
          pointerEvents: 'none',
        } as object)
      : ({
          opacity: 0,
          pointerEvents: 'none',
        } as const);

  const goList = () => router.push(panelRoutes.salonlar);

  if (!salonId) {
    return (
      <View className={salonProfileClassNames.page} style={{ backgroundColor: adminTheme.pageBackground }}>
        <View className="absolute inset-0" style={overlayStyle} />
        <PanelTopBar query={query} onQueryChange={setQuery} />
        <View className="flex-1 items-center justify-center gap-4 px-6 py-12">
          <Text className="text-center font-headline text-[28px] tracking-[-0.5px]" style={{ color: adminTheme.onSurface }}>
            Gecersiz baglanti
          </Text>
          <ActionButton label="Salon Listesine Don" onPress={goList} />
        </View>
      </View>
    );
  }

  if (profile.status === 'loading' || profile.status === 'idle') {
    return (
      <View className={salonProfileClassNames.page} style={{ backgroundColor: adminTheme.pageBackground }}>
        <View className="absolute inset-0" style={overlayStyle} />
        <PanelTopBar query={query} onQueryChange={setQuery} />
        <View className="flex-1 items-center justify-center py-16">
          <ActivityIndicator size="large" color={adminTheme.primary} />
        </View>
      </View>
    );
  }

  if (profile.status === 'error' || !profile.detail) {
    return (
      <View className={salonProfileClassNames.page} style={{ backgroundColor: adminTheme.pageBackground }}>
        <View className="absolute inset-0" style={overlayStyle} />
        <PanelTopBar query={query} onQueryChange={setQuery} />

        <View className="flex-1 items-center justify-center gap-4 px-6 py-12">
          <Text className="text-center font-headline text-[28px] tracking-[-0.5px]" style={{ color: adminTheme.onSurface }}>
            Salon bulunamadi
          </Text>
          <Text className="max-w-[420px] text-center text-sm leading-5" style={{ color: adminTheme.onSurfaceVariant }}>
            {profile.errorMessage ?? 'Secilen salon kaydi mevcut degil veya silinmis olabilir.'}
          </Text>
          <ActionButton label="Salon Listesine Don" onPress={goList} />
        </View>
      </View>
    );
  }

  const d = profile.detail;
  const heroModel = {
    name: d.name,
    address: d.address,
    city: d.city,
    district: d.district,
    isActive: d.isActive,
    photoUrl: d.photoUrl,
  };

  return (
    <View className={salonProfileClassNames.page} style={{ backgroundColor: adminTheme.pageBackground }}>
      <View className="absolute inset-0" style={overlayStyle} />

      <PanelTopBar query={query} onQueryChange={setQuery} />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: paddingH, paddingTop: 24, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}>
        <View className={salonProfileClassNames.content}>
          <SalonProfileHero model={heroModel} isWide={isWide} onGoBack={goList} />

          <View className={cn('gap-6', isWide ? 'flex-row items-stretch' : 'flex-col')}>
            <View className={cn(salonProfileClassNames.column, isWide ? 'min-w-0 flex-[0.95]' : undefined)}>
              <SalonIdentityCard detail={d} />
            </View>

            <View className={cn(salonProfileClassNames.column, isWide ? 'min-w-0 flex-[1.15]' : undefined)}>
              <SalonProfileEditSection detail={d} onSave={profile.updateSalon} isSaving={profile.isSaving} />
              <SalonProfileDangerZone
                salonName={d.name}
                onDelete={async () => {
                  const result = await profile.removeSalon();
                  if (result.ok) {
                    goList();
                  }
                  return result;
                }}
                isDeleting={profile.isDeleting}
              />
            </View>
          </View>

          <SalonProfileFooter />
        </View>
      </ScrollView>
    </View>
  );
}
