import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Alert, Platform, Pressable, ScrollView, Switch, Text, View } from 'react-native';

import { usePackageProfile } from '@/components/panel/super-admin/package-profile/use-package-profile';
import SubscriptionListSection from '@/components/panel/super-admin/packages/SubscriptionListSection';
import type { SubscriptionRecord } from '@/components/panel/super-admin/packages/types';
import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import { hexToRgba } from '@/utils/color';
import { PackageService, type Subscription } from '@/services/package.service';

function showErrorAlert(message: string) {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    window.alert(message);
    return;
  }
  Alert.alert('Hata', message);
}

interface PackageEditModalProps {
  packageId: string | null;
  onClose: () => void;
  onSaved: () => void;
}

export default function PackageEditModal({
  packageId,
  onClose,
  onSaved,
}: PackageEditModalProps) {
  const adminTheme = useSuperAdminTheme();
  const { profile, isLoading, error, formState, handleSave, handleDeactivate, refresh } =
    usePackageProfile(packageId || undefined);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isCancellingSubscription, setIsCancellingSubscription] = React.useState(false);

  const mapSubscriptionRecord = React.useCallback(
    (subscription: Subscription): SubscriptionRecord => ({
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
    }),
    [],
  );

  const handleCancelSubscription = React.useCallback(
    async (sub: SubscriptionRecord) => {
      if (!packageId || !sub.canCancel) {
        return;
      }

      const msg = `"${sub.salonName}" salonunun bu paket aboneligini iptal etmek istiyor musunuz?`;
      let ok = false;
      if (
        Platform.OS === 'web' &&
        typeof window !== 'undefined' &&
        typeof window.confirm === 'function'
      ) {
        ok = window.confirm(msg);
      } else {
        ok = await new Promise<boolean>((resolve) => {
          Alert.alert('Aboneligi iptal et', msg, [
            { text: 'Vazgec', style: 'cancel', onPress: () => resolve(false) },
            { text: 'Iptal et', style: 'destructive', onPress: () => resolve(true) },
          ]);
        });
      }

      if (!ok) {
        return;
      }

      setIsCancellingSubscription(true);
      try {
        await PackageService.updateSubscriptionStatus(sub.id, 'cancelled');
        await refresh();
        onSaved();
      } catch (err: any) {
        showErrorAlert(
          typeof err?.message === 'string' && err.message.trim()
            ? err.message
            : 'Abonelik iptal edilemedi.',
        );
      } finally {
        setIsCancellingSubscription(false);
      }
    },
    [packageId, onSaved, refresh],
  );

  if (!packageId) return null;

  const submit = async () => {
    setIsSubmitting(true);
    try {
      const result = await handleSave();
      if (!result.ok) {
        showErrorAlert(result.message);
        return;
      }
      onSaved();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const deactivate = async () => {
    setIsSubmitting(true);
    try {
      const result = await handleDeactivate();
      if (!result.ok) {
        showErrorAlert(result.message);
        return;
      }
      onSaved();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <View className="items-center justify-center py-20">
          <Text style={{ color: adminTheme.onSurfaceVariant }}>Detaylar yukleniyor...</Text>
        </View>
      );
    }

    if (!profile) {
      return (
        <View className="items-center justify-center py-20">
          <Text style={{ color: adminTheme.error }}>Paket bulunamadi.</Text>
        </View>
      );
    }

    return (
      <View className="gap-8">
        <View>
          <Text
            className="mb-4 font-label text-[10px] uppercase tracking-widest"
            style={{ color: adminTheme.primary, fontFamily: 'Manrope-Bold' }}>
            TEMEL BILGILER
          </Text>
          <View className="gap-5">
            <Input
              label="Paket Adi (ornegin: Baslangic)"
              value={formState.name}
              onChangeText={formState.setName}
              iconLeft="title"
            />
            <View className="gap-3">
              <Text
                className="font-label text-[10px] uppercase tracking-widest"
                style={{ color: adminTheme.onSurfaceVariant, fontFamily: 'Manrope-Bold' }}>
                Paket Kademesi
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {[
                  { label: 'Baslangic', value: 'baslangic' as const },
                  { label: 'Profesyonel', value: 'profesyonel' as const },
                  { label: 'Kurumsal', value: 'kurumsal' as const },
                ].map((option) => {
                  const isSelected = option.value === formState.tier;

                  return (
                    <Pressable
                      key={option.value}
                      onPress={() => formState.setTier(option.value)}
                      className="rounded-full border px-4 py-2"
                      style={({ hovered }) => ({
                        backgroundColor: isSelected
                          ? hexToRgba(adminTheme.primary, 0.14)
                          : hovered
                            ? adminTheme.cardBackgroundStrong
                            : 'transparent',
                        borderColor: isSelected
                          ? hexToRgba(adminTheme.primary, 0.3)
                          : adminTheme.borderSubtle,
                      })}>
                      <Text
                        className="font-label text-[10px] uppercase tracking-[2px]"
                        style={{
                          color: isSelected
                            ? adminTheme.primary
                            : adminTheme.onSurfaceVariant,
                          fontFamily: 'Manrope-Bold',
                        }}>
                        {option.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
            <Input
              label="Tier Etiketi (ornegin: Standard Access)"
              value={formState.tierLabel}
              onChangeText={formState.setTierLabel}
              iconLeft="label"
            />
            <Input
              label="Aylik Fiyat (TL)"
              value={formState.pricePerMonth}
              onChangeText={formState.setPricePerMonth}
              iconLeft="payments"
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        <View className="h-px w-full" style={{ backgroundColor: adminTheme.borderSubtle }} />

        <View>
          <View className="flex-row items-center justify-between mb-4">
             <Text
               className="font-label text-[10px] uppercase tracking-widest"
               style={{ color: adminTheme.primary, fontFamily: 'Manrope-Bold' }}>
               OZELLIKLER & SERVISLER
             </Text>
             <Pressable
                onPress={formState.addFeature}
                className="flex-row items-center gap-1 rounded-md border px-2 py-1"
                style={({ hovered }) => [
                  {
                    backgroundColor: hovered ? hexToRgba(adminTheme.primary, 0.1) : 'transparent',
                    borderColor: hovered ? adminTheme.primary : hexToRgba(adminTheme.outlineVariant, 0.5),
                  },
                  Platform.OS === 'web' ? ({ transition: 'background-color 150ms ease, border-color 150ms ease', cursor: 'pointer' } as any) : null,
                ]}
              >
                <MaterialIcons name="add" size={14} color={adminTheme.primary} />
                <Text className="font-label text-[9px] uppercase tracking-widest" style={{ color: adminTheme.primary, fontFamily: 'Manrope-Bold' }}>
                  Yeni Ekle
                </Text>
              </Pressable>
          </View>
          
          <View className="gap-3">
            {formState.features.map((feature: any, index: number) => (
              <View
                key={index}
                className="flex-row items-center justify-between rounded-md border"
                style={{
                  backgroundColor: adminTheme.cardBackgroundMuted,
                  borderColor: feature.included ? hexToRgba(adminTheme.primary, 0.3) : adminTheme.borderSubtle,
                }}>
                 <View className="flex-1 flex-row items-center pl-4 pr-2 py-1">
                   <View className="flex-1 mr-3 relative -top-1.5">
                     <Input 
                       value={feature.label}
                       onChangeText={(text) => formState.handleFeatureLabelChange(text, index)}
                       containerStyle={{ marginTop: 0, borderBottomWidth: 0 }}
                       className="text-sm py-1 font-body bg-transparent"
                     />
                   </View>
                   <Switch
                     value={feature.included}
                     onValueChange={() => formState.handleToggleFeature(index)}
                     trackColor={{ false: adminTheme.cardBackgroundStrong, true: hexToRgba(adminTheme.primary, 0.5) }}
                     thumbColor={feature.included ? adminTheme.primary : hexToRgba(adminTheme.onSurfaceVariant, 0.4)}
                     ios_backgroundColor={adminTheme.cardBackgroundStrong}
                   />
                 </View>
                  <Pressable 
                    onPress={() => formState.removeFeature(index)}
                    className="h-full px-3 py-4 items-center justify-center border-l"
                    style={({ hovered }) => [
                      { 
                        borderLeftColor: adminTheme.borderSubtle,
                        backgroundColor: hovered ? hexToRgba(adminTheme.error, 0.1) : 'transparent' 
                      },
                      Platform.OS === 'web' ? ({ transition: 'background-color 150ms ease', cursor: 'pointer' } as any) : null
                    ]}>
                    {({ hovered }) => (
                       <MaterialIcons name="delete-outline" size={18} color={hovered ? adminTheme.error : hexToRgba(adminTheme.onSurfaceVariant, 0.6)} />
                    )}
                 </Pressable>
              </View>
            ))}
             {formState.features.length === 0 && (
                <Text className="text-center font-body text-sm py-2" style={{color: hexToRgba(adminTheme.onSurfaceVariant, 0.6)}}>
                  Henuz hic bir ozellik eklenmemis.
                </Text>
             )}
          </View>
        </View>

        <View className="h-px w-full" style={{ backgroundColor: adminTheme.borderSubtle }} />

        <View>
          <Text
            className="mb-4 font-label text-[10px] uppercase tracking-widest"
            style={{ color: adminTheme.primary, fontFamily: 'Manrope-Bold' }}>
            VITRIN AYARLARI
          </Text>
          
          <View className="flex-row items-center justify-between rounded-md border px-4 py-4"
                style={{
                  backgroundColor: formState.isFeatured ? hexToRgba(adminTheme.primary, 0.05) : adminTheme.cardBackgroundMuted,
                  borderColor: formState.isFeatured ? adminTheme.primary : adminTheme.borderSubtle,
                }}>
             <View className="flex-1 mr-4">
               <Text className="font-body font-bold mb-1" style={{color: adminTheme.onSurface}}>En Populer Paket Olarak Isaretle</Text>
               <Text className="font-body text-xs leading-5" style={{color: adminTheme.onSurfaceVariant}}>
                  Bu secenek aktif edildiginde, vitrinde altin detaylarla gosterilir.
               </Text>
             </View>
             <Switch
                  value={formState.isFeatured}
                  onValueChange={formState.setIsFeatured}
                  trackColor={{ false: adminTheme.cardBackgroundStrong, true: hexToRgba(adminTheme.primary, 0.5) }}
                  thumbColor={formState.isFeatured ? adminTheme.primary : hexToRgba(adminTheme.onSurfaceVariant, 0.4)}
                  ios_backgroundColor={adminTheme.cardBackgroundStrong}
              />
          </View>
        </View>

        <View className="h-px w-full" style={{ backgroundColor: adminTheme.borderSubtle }} />

        <View>
           <Text
            className="mb-4 font-label text-[10px] uppercase tracking-widest"
            style={{ color: adminTheme.primary, fontFamily: 'Manrope-Bold' }}>
            ABONELER ({profile.subscribers.length})
          </Text>
          {profile.subscribers.length > 0 ? (
            <>
              <View
                className="mb-3 rounded-md border px-3 py-2.5"
                style={{
                  backgroundColor: hexToRgba(adminTheme.warning, 0.08),
                  borderColor: hexToRgba(adminTheme.warning, 0.25),
                }}>
                <Text className="font-body text-xs leading-5" style={{ color: adminTheme.onSurface }}>
                  <Text style={{ fontFamily: 'Manrope-Bold' }}>Not: </Text>
                  Aktif veya beklemedeki abonelikleri sonlandirmak icin satirdaki &quot;Abonelik Iptali&quot;
                  dugmesini kullanin. Abonelik iptali aninda uygulanir; paket bilgilerini kaydetmek icin alttaki
                  &quot;Kaydet&quot;e basin.
                </Text>
              </View>
              <SubscriptionListSection
                subscriptions={profile.subscribers.map(mapSubscriptionRecord)}
                useDesktopTable={false}
                onCancelSubscription={handleCancelSubscription}
                cancelSubscriptionDisabled={isSubmitting || isCancellingSubscription}
              />
            </>
          ) : (
             <View className="items-center justify-center py-6 rounded-md border" style={{backgroundColor: adminTheme.cardBackgroundMuted, borderColor: adminTheme.borderSubtle}}>
                <Text style={{color: adminTheme.onSurfaceVariant, fontSize: 13}}>Bu pakete ait henuz abone bulunmuyor.</Text>
             </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <Modal visible={!!packageId} onClose={onClose}>
      {/* Header */}
      <View
        className="flex-row items-center justify-between border-b px-6 py-5"
        style={{ borderBottomColor: adminTheme.borderSubtle }}>
        <Text
          className="font-headline text-xl"
          style={{ color: adminTheme.onSurface }}>
          Paket Detay & Duzenle
        </Text>
        <Pressable
          onPress={onClose}
          className="h-8 w-8 items-center justify-center rounded-full"
          style={({ hovered }) => [
            {
              backgroundColor: hovered
                ? hexToRgba(adminTheme.onSurfaceVariant, 0.1)
                : 'transparent',
            },
            Platform.OS === 'web'
              ? ({ transition: 'background-color 150ms ease' } as any)
              : null,
          ]}>
          <MaterialIcons name="close" size={20} color={adminTheme.onSurface} />
        </Pressable>
      </View>

      {/* Body */}
      <ScrollView
        style={
          Platform.OS === 'web'
            ? ({ maxHeight: '70vh' } as any)
            : { maxHeight: 500 }
        }
        contentContainerStyle={{ padding: 24, paddingBottom: 40 }}>
        {renderContent()}
      </ScrollView>

      {/* Footer */}
      {!isLoading && profile && (
        <View
          className="gap-3 border-t px-6 py-5"
          style={{
            borderTopColor: adminTheme.borderSubtle,
            backgroundColor: adminTheme.cardBackgroundMuted,
          }}>
          {error ? (
            <Text className="font-body text-xs" style={{ color: adminTheme.error }}>
              {error}
            </Text>
          ) : null}
          <View className="flex-row flex-wrap items-center justify-between gap-3">
          <Pressable
            onPress={deactivate}
            disabled={isSubmitting || isCancellingSubscription}
            className="rounded-md border px-3 py-2"
            style={({ hovered }) => [
              {
                opacity: isSubmitting || isCancellingSubscription ? 0.45 : 1,
                backgroundColor: hovered ? hexToRgba(adminTheme.error, 0.05) : 'transparent',
                borderColor: hovered ? adminTheme.error : hexToRgba(adminTheme.outlineVariant, 0.3),
              },
              Platform.OS === 'web' ? ({ transition: 'all 150ms ease', cursor: 'pointer' } as any) : null,
            ]}>
            {({ hovered }) => (
              <Text
                className="font-label text-[10px] uppercase tracking-widest"
                style={{ color: hovered ? adminTheme.error : adminTheme.onSurface, fontFamily: 'Manrope-Bold' }}>
                Askiya Al
              </Text>
            )}
          </Pressable>

          <View className="flex-row gap-2">
            <Pressable
              onPress={onClose}
              disabled={isSubmitting || isCancellingSubscription}
              className="min-h-[44px] items-center justify-center rounded-md px-4"
              style={({ hovered }) => [
                {
                  opacity: isSubmitting || isCancellingSubscription ? 0.45 : 1,
                  backgroundColor: hovered ? hexToRgba(adminTheme.onSurfaceVariant, 0.08) : 'transparent',
                },
                Platform.OS === 'web' ? ({ transition: 'background-color 150ms ease' } as any) : null,
              ]}>
              <Text className="font-label text-xs uppercase tracking-widest" style={{ color: adminTheme.onSurface, fontFamily: 'Manrope-Bold' }}>
                Iptal
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {
                void submit();
              }}
              disabled={isSubmitting || isCancellingSubscription}
              className="overflow-hidden rounded-md"
              style={({ pressed, hovered }) => [
                {
                  opacity: isSubmitting || isCancellingSubscription ? 0.55 : 1,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                },
                Platform.OS === 'web' ? ({ transition: 'transform 150ms ease, box-shadow 150ms ease', boxShadow: hovered ? `0 12px 24px ${hexToRgba(adminTheme.primary, 0.25)}` : 'none' } as any) : null,
              ]}>
              <LinearGradient
                colors={adminTheme.goldGradient as [string, string]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ minHeight: 44, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center' }}>
                <Text className="font-label text-xs uppercase tracking-widest" style={{ color: adminTheme.onPrimary, fontFamily: 'Manrope-Bold' }}>
                  {isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}
                </Text>
              </LinearGradient>
            </Pressable>
          </View>
          </View>
        </View>
      )}
    </Modal>
  );
}
