import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';

import Modal from '@/components/ui/Modal';
import { hexToRgba } from '@/utils/color';

import BarberTopBar from '../BarberTopBar';
import { useBarberAdminTheme } from '../theme';
import CurrentPlanBanner from './CurrentPlanBanner';
import PlanComparisonGrid from './PlanComparisonGrid';
import { packagesClassNames } from './presentation';
import { useBarberPackages } from './use-barber-packages';

export default function BarberAdminPackages() {
  const { width } = useWindowDimensions();
  const theme = useBarberAdminTheme();
  const state = useBarberPackages();
  const [query, setQuery] = React.useState('');
  const [confirmPackageId, setConfirmPackageId] = React.useState<string | null>(null);
  const {
    loading,
    error,
    currentPlan,
    planCards,
    requesting,
    hasPendingRequest,
    requestError,
    requestSubscription,
  } = state;

  const plansSectionRef = React.useRef<View>(null);

  const paddingH = width < 480 ? 12 : width < 768 ? 20 : width < 1280 ? 28 : 40;

  const selectedPlan = React.useMemo(
    () => (confirmPackageId ? planCards.find((p) => p.id === confirmPackageId) : null),
    [confirmPackageId, planCards],
  );

  const handleSelectPlan = React.useCallback((packageId: string) => {
    setConfirmPackageId(packageId);
  }, []);

  const handleConfirm = React.useCallback(async () => {
    if (!confirmPackageId) return;
    const success = await requestSubscription(confirmPackageId);
    if (success) {
      setConfirmPackageId(null);
    }
  }, [confirmPackageId, requestSubscription]);

  const handleCloseModal = React.useCallback(() => {
    if (!requesting) {
      setConfirmPackageId(null);
    }
  }, [requesting]);

  if (loading) {
    return (
      <View className={packagesClassNames.page} style={{ backgroundColor: theme.pageBackground }}>
        <BarberTopBar query={query} onQueryChange={setQuery} />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View className={packagesClassNames.page} style={{ backgroundColor: theme.pageBackground }}>
        <BarberTopBar query={query} onQueryChange={setQuery} />
        <View className="flex-1 items-center justify-center gap-2 px-6">
          <Text className="font-headline text-base font-bold text-center" style={{ color: theme.error }}>
            {error}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className={packagesClassNames.page} style={{ backgroundColor: theme.pageBackground }}>
      <View
        className="absolute inset-0"
        pointerEvents="none"
        style={
          Platform.OS === 'web'
            ? ({
                opacity: 1,
                backgroundImage: `radial-gradient(circle at 1px 1px, ${theme.dotOverlay} 1px, transparent 0)`,
                backgroundSize: '40px 40px',
              } as any)
            : { opacity: 0 }
        }
      />

      <BarberTopBar query={query} onQueryChange={setQuery} />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: paddingH,
          paddingTop: width < 768 ? 20 : 32,
          paddingBottom: 80,
        }}
        showsVerticalScrollIndicator={false}>
        <View
          className="w-full self-center"
          style={{ maxWidth: 1100, gap: width < 768 ? 40 : 64 }}>
          <PageHeader />

          {currentPlan && (
            <CurrentPlanBanner plan={currentPlan} />
          )}

          {planCards.length > 0 && (
            <View ref={plansSectionRef}>
              <PlansHeader />
              <PlanComparisonGrid
                plans={planCards}
                onSelectPlan={handleSelectPlan}
                disabled={requesting || hasPendingRequest}
              />
            </View>
          )}
        </View>
      </ScrollView>

      <ConfirmationModal
        visible={confirmPackageId !== null}
        onClose={handleCloseModal}
        onConfirm={handleConfirm}
        plan={selectedPlan}
        requesting={requesting}
        requestError={requestError}
      />
    </View>
  );
}

function PageHeader() {
  const { width } = useWindowDimensions();
  const theme = useBarberAdminTheme();
  const isMobile = width < 768;

  return (
    <View className="gap-3">
      <Text
        className="font-bold tracking-tight"
        style={{
          color: theme.onSurface,
          fontFamily: theme.serifFont,
          fontSize: isMobile ? 28 : width < 1024 ? 36 : 42,
          lineHeight: isMobile ? 34 : width < 1024 ? 42 : 46,
        }}>
        Üyelik ve Planlar
      </Text>
      <Text
        className="max-w-[640px]"
        style={{
          color: hexToRgba(theme.onSurfaceVariant, 0.92),
          fontFamily: theme.bodyFont,
          fontSize: isMobile ? 14 : 18,
          lineHeight: isMobile ? 22 : 28,
        }}>
        Salonunuzun büyüklüğüne göre özelleştirilmiş, şeffaf fiyatlandırma modellerimizi inceleyin.
      </Text>
    </View>
  );
}

function PlansHeader() {
  const { width } = useWindowDimensions();
  const theme = useBarberAdminTheme();
  const isMobile = width < 768;

  return (
    <View className="gap-2">
      <Text
        className="font-bold"
        style={{
          color: theme.onSurface,
          fontFamily: theme.serifFont,
          fontSize: isMobile ? 22 : 30,
        }}>
        Paket Seçenekleri
      </Text>
      <Text
        style={{
          color: hexToRgba(theme.onSurfaceVariant, 0.8),
          fontFamily: theme.bodyFont,
          fontSize: isMobile ? 13 : 15,
        }}>
        İşletmeniz için en uygun paketi seçin. Seçiminiz admin onayından sonra aktif olacaktır.
      </Text>
    </View>
  );
}

function ConfirmationModal({
  visible,
  onClose,
  onConfirm,
  plan,
  requesting,
  requestError,
}: {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  plan: ReturnType<typeof useBarberPackages>['planCards'][number] | null | undefined;
  requesting: boolean;
  requestError: string | null;
}) {
  const theme = useBarberAdminTheme();
  const { width } = useWindowDimensions();
  const isMobile = width < 640;

  if (!plan) return null;

  return (
    <Modal visible={visible} onClose={onClose}>
      <View style={{ gap: 20, padding: isMobile ? 4 : 8 }}>
        <View className="items-center gap-3">
          <View
            className="h-14 w-14 items-center justify-center rounded-full"
            style={{ backgroundColor: hexToRgba(theme.primary, 0.1) }}>
            <MaterialIcons name="workspace-premium" size={28} color={theme.primary} />
          </View>
          <Text
            className="text-center font-bold"
            style={{
              color: theme.onSurface,
              fontFamily: theme.serifFont,
              fontSize: isMobile ? 20 : 24,
            }}>
            Paket Değişikliği
          </Text>
        </View>

        <View
          className="gap-4 rounded-lg p-4"
          style={{
            backgroundColor: hexToRgba(theme.primary, 0.04),
            borderWidth: 1,
            borderColor: hexToRgba(theme.primary, 0.1),
          }}>
          <View className="flex-row items-center justify-between">
            <Text
              className="font-bold"
              style={{
                color: theme.onSurface,
                fontFamily: theme.bodyFont,
                fontSize: 16,
              }}>
              {plan.name}
            </Text>
            <Text
              className="font-bold"
              style={{
                color: theme.primary,
                fontFamily: theme.bodyFont,
                fontSize: 18,
              }}>
              {plan.priceLabel}
              <Text className="text-sm font-normal" style={{ color: theme.onSurfaceVariant }}>
                {plan.priceSuffix}
              </Text>
            </Text>
          </View>

          <View className="gap-2">
            {plan.features
              .filter((f) => f.included)
              .slice(0, 4)
              .map((feature, i) => (
                <View key={i} className="flex-row items-center gap-2">
                  <MaterialIcons name="check" size={14} color={theme.primary} />
                  <Text
                    className="text-sm"
                    style={{ color: theme.onSurfaceVariant, fontFamily: theme.bodyFont }}>
                    {feature.label}
                  </Text>
                </View>
              ))}
          </View>
        </View>

        <View
          className="flex-row items-start gap-3 rounded-md p-3"
          style={{ backgroundColor: hexToRgba(theme.warning, 0.06) }}>
          <MaterialIcons name="info-outline" size={18} color={theme.warning} />
          <Text
            className="flex-shrink text-xs leading-5"
            style={{ color: theme.onSurfaceVariant, fontFamily: theme.bodyFont }}>
            Paket talebiniz platform yöneticisi tarafından incelenecek ve onaylandığında otomatik
            olarak aktif hale gelecektir.
          </Text>
        </View>

        {requestError && (
          <View
            className="flex-row items-center gap-2 rounded-md p-3"
            style={{ backgroundColor: hexToRgba(theme.error, 0.08) }}>
            <MaterialIcons name="error-outline" size={16} color={theme.error} />
            <Text
              className="flex-shrink text-xs"
              style={{ color: theme.error, fontFamily: theme.bodyFont }}>
              {requestError}
            </Text>
          </View>
        )}

        <View className="flex-row gap-3 pt-2">
          <Pressable
            className="flex-1 items-center rounded-md py-3.5"
            onPress={onClose}
            disabled={requesting}
            style={{
              borderWidth: 1,
              borderColor: hexToRgba(theme.onSurfaceVariant, 0.2),
              opacity: requesting ? 0.5 : 1,
            }}>
            <Text
              className="font-bold text-sm"
              style={{ color: theme.onSurfaceVariant, fontFamily: theme.bodyFont }}>
              Vazgeç
            </Text>
          </Pressable>

          <Pressable
            className="flex-1 flex-row items-center justify-center gap-2 rounded-md py-3.5"
            onPress={onConfirm}
            disabled={requesting}
            style={({ hovered }) => [
              { backgroundColor: theme.primary },
              Platform.OS === 'web'
                ? ({
                    backgroundImage: `linear-gradient(to top right, ${theme.primary}, ${theme.primaryContainer})`,
                    boxShadow: hovered && !requesting
                      ? `0 8px 24px ${hexToRgba(theme.primary, 0.3)}`
                      : `0 4px 12px ${hexToRgba(theme.primary, 0.15)}`,
                    transition: 'box-shadow 200ms ease',
                    cursor: requesting ? 'wait' : 'pointer',
                  } as any)
                : null,
              requesting ? { opacity: 0.7 } : null,
            ]}>
            {requesting && <ActivityIndicator size="small" color={theme.onPrimary} />}
            <Text
              className="font-bold text-sm"
              style={{ color: theme.onPrimary, fontFamily: theme.bodyFont }}>
              {requesting ? 'Gönderiliyor...' : 'Talep Oluştur'}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
