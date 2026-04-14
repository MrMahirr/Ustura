import React from 'react';
import { router } from 'expo-router';
import { Platform, ScrollView, Text, View, useWindowDimensions } from 'react-native';

import ActionButton from '@/components/panel/super-admin/ActionButton';
import PanelTopBar from '@/components/panel/super-admin/PanelTopBar';
import UserActivityLogCard from '@/components/panel/super-admin/user-profile/UserActivityLogCard';
import UserAppointmentsSection from '@/components/panel/super-admin/user-profile/UserAppointmentsSection';
import UserEarningsSection from '@/components/panel/super-admin/user-profile/UserEarningsSection';
import UserEditModal from '@/components/panel/super-admin/user-profile/UserEditModal';
import type { UserEditFormData } from '@/components/panel/super-admin/user-profile/UserEditModal';
import UserExpertiseCard from '@/components/panel/super-admin/user-profile/UserExpertiseCard';
import UserMetricsSection from '@/components/panel/super-admin/user-profile/UserMetricsSection';
import UserProfileHero from '@/components/panel/super-admin/user-profile/UserProfileHero';
import UserQuickActionsCard from '@/components/panel/super-admin/user-profile/UserQuickActionsCard';
import UserWorkInfoCard from '@/components/panel/super-admin/user-profile/UserWorkInfoCard';
import { userProfileClassNames } from '@/components/panel/super-admin/user-profile/presentation';
import { useUserProfile } from '@/components/panel/super-admin/user-profile/use-user-profile';
import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { buildPanelSalonDetailRoute, panelRoutes } from '@/constants/routes';
import { useAuth } from '@/hooks/use-auth';
import { UserService } from '@/services/user.service';
import { cn } from '@/utils/cn';
import { confirmDestructive, showErrorFlash, showSuccessFlash, showWarningFlash } from '@/utils/flash';

export default function SuperAdminUserProfile({ userId }: { userId?: string }) {
  const { width } = useWindowDimensions();
  const adminTheme = useSuperAdminTheme();
  const { profile, rawUser, isLoading, error, refresh } = useUserProfile(userId);
  const { user: authUser } = useAuth();
  const [query, setQuery] = React.useState('');
  const [editModalVisible, setEditModalVisible] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  const isWide = width >= 1160;
  const useDesktopAppointments = width >= 960;
  const paddingH = width < 768 ? 16 : 32;
  const metricBasis = width >= 1420 ? '24%' : width >= 880 ? '48.7%' : '100%';

  const isUserDisabled = rawUser?.status === 'inactive' || rawUser?.status === 'suspended';

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

  const handleEdit = () => {
    setEditModalVisible(true);
  };

  const handleSaveEdit = async (data: UserEditFormData) => {
    if (!userId) return;

    setIsSaving(true);
    try {
      await UserService.patchAdminUserProfile(userId, {
        name: data.name,
        phone: data.phone,
      });
      showSuccessFlash('Basarili', 'Kullanici bilgileri guncellendi.');
      setEditModalVisible(false);
      refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Guncelleme basarisiz oldu.';
      showErrorFlash('Hata', message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDisable = async () => {
    if (!userId) return;

    if (!isUserDisabled && authUser?.id === userId) {
      showWarningFlash('Islem yapilamadi', 'Kendi hesabinizi bu ekrandan durduramazsiniz.');
      return;
    }

    const nextActive = isUserDisabled;
    const actionLabel = nextActive ? 'aktif hale getirmek' : 'durdurmak';

    confirmDestructive(
      nextActive ? 'Kullaniciyi Aktif Et' : 'Kullaniciyi Durdur',
      `Bu kullaniciyi ${actionLabel} istediginize emin misiniz?`,
      nextActive ? 'Aktif Et' : 'Durdur',
      async () => {
        try {
          await UserService.patchAdminUserStatus(userId, nextActive);
          showSuccessFlash(
            'Basarili',
            nextActive ? 'Kullanici yeniden aktif edildi.' : 'Kullanici durduruldu.',
          );
          refresh();
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Islem basarisiz oldu.';
          showErrorFlash('Hata', message);
        }
      },
    );
  };

  const handleDelete = () => {
    if (!userId) return;

    if (authUser?.id === userId) {
      showWarningFlash('Islem yapilamadi', 'Kendi hesabinizi silemezsiniz.');
      return;
    }

    confirmDestructive(
      'Kullaniciyi Sil',
      'Bu kullanici kalici olarak devre disi birakilacak. Devam etmek istiyor musunuz?',
      'Sil',
      async () => {
        try {
          await UserService.deleteAdminUser(userId);
          showSuccessFlash('Basarili', 'Kullanici silindi.');
          router.push(panelRoutes.kullanicilar);
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Silme islemi basarisiz oldu.';
          showErrorFlash('Hata', message);
        }
      },
    );
  };

  if (!profile) {
    return (
      <View className={userProfileClassNames.page} style={{ backgroundColor: adminTheme.pageBackground }}>
        <View className="absolute inset-0" style={overlayStyle} />
        <PanelTopBar query={query} onQueryChange={setQuery} />

        <View className="min-h-[260px] items-center justify-center gap-3 px-6">
          <Text className="text-base" style={{ color: adminTheme.onSurface, fontFamily: 'Manrope-Bold' }}>
            {isLoading ? 'Kullanici yukleniyor' : 'Kullanici bulunamadi'}
          </Text>
          <Text className="max-w-[420px] text-center text-sm leading-5" style={{ color: adminTheme.onSurfaceVariant }}>
            {isLoading
              ? 'Secilen kullanici profili getiriliyor.'
              : error ?? 'Secilen kullanici kaydi mevcut degil veya silinmis olabilir.'}
          </Text>
          {!isLoading ? (
            <ActionButton label="Kullanicilar Listesine Don" onPress={() => router.push(panelRoutes.kullanicilar)} />
          ) : null}
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
            isDisabled={isUserDisabled}
            onOpenSalon={
              profile.user.salonId ? () => router.push(buildPanelSalonDetailRoute(profile.user.salonId as string)) : undefined
            }
            onEdit={handleEdit}
            onDisable={handleDisable}
            onDelete={handleDelete}
          />

          <UserMetricsSection metrics={profile.metrics} metricBasis={metricBasis} />

          <View className={cn('gap-6', isWide ? 'flex-row' : 'flex-col')}>
            <View className={cn(userProfileClassNames.column, isWide ? 'flex-[1.8]' : undefined)}>
              <UserWorkInfoCard profile={profile} />
              {profile.recentAppointments.length > 0 && (
                <UserAppointmentsSection appointments={profile.recentAppointments} useDesktopTable={useDesktopAppointments} />
              )}
              {profile.earningsSeries.length > 0 && (
                <UserEarningsSection series={profile.earningsSeries} />
              )}
            </View>

            <View className={cn(userProfileClassNames.column, isWide ? 'flex-1' : undefined)}>
              <UserExpertiseCard expertise={profile.expertise} />
              <UserActivityLogCard activities={profile.activities} />
              <UserQuickActionsCard actions={profile.quickActions} />
            </View>
          </View>
        </View>
      </ScrollView>

      <UserEditModal
        visible={editModalVisible}
        userName={profile.user.name}
        initialData={{
          name: rawUser?.name ?? profile.user.name,
          phone: rawUser?.phone ?? '',
        }}
        isSaving={isSaving}
        onSave={handleSaveEdit}
        onClose={() => setEditModalVisible(false)}
      />
    </View>
  );
}
