import React from 'react';
import { useRouter } from 'expo-router';
import {
  Linking,
  Platform,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';

import Footer from '@/components/landing/Footer';
import { getLandingLayout } from '@/components/landing/layout';
import Navbar from '@/components/landing/Navbar';
import Button from '@/components/ui/Button';
import Loading from '@/components/ui/Loading';
import { publicRoutes } from '@/constants/routes';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useBookingEntry } from '@/hooks/use-booking-entry';
import { useSalonStorefront } from '@/hooks/use-salon-storefront';
import { hexToRgba } from '@/utils/color';

import {
  buildSalonStorefrontViewModel,
  formatSalonLocation,
} from './presentation';
import StorefrontHero from './StorefrontHero';
import StorefrontSection from './StorefrontSection';
import StorefrontServices from './StorefrontServices';
import StorefrontSidebar from './StorefrontSidebar';
import StorefrontTeam from './StorefrontTeam';

interface SalonStorefrontPageProps {
  salonId?: string | null;
}

export default function SalonStorefrontPage({
  salonId,
}: SalonStorefrontPageProps) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const layout = getLandingLayout(width);
  const surface = useThemeColor({}, 'surface');
  const surfaceContainerLow = useThemeColor({}, 'surfaceContainerLow');
  const onSurface = useThemeColor({}, 'onSurface');
  const onSurfaceVariant = useThemeColor({}, 'onSurfaceVariant');
  const primary = useThemeColor({}, 'primary');
  const { openBooking } = useBookingEntry();
  const { salon, staff, services, isLoading, error, reload } = useSalonStorefront(salonId);

  const viewModel = React.useMemo(
    () => (salon ? buildSalonStorefrontViewModel(salon, staff, services) : null),
    [salon, staff, services],
  );

  const handleBack = React.useCallback(() => {
    router.push(publicRoutes.kuaforler);
  }, [router]);

  const handleBook = React.useCallback(() => {
    if (!salon || !viewModel) {
      return;
    }

    openBooking({
      id: salon.id,
      name: salon.name,
      location: formatSalonLocation(salon),
    });
  }, [openBooking, salon, viewModel]);

  const handleOpenMaps = React.useCallback(() => {
    if (!viewModel) {
      return;
    }

    void Linking.openURL(viewModel.mapsUrl);
  }, [viewModel]);

  return (
    <>
      <Navbar />
      <ScrollView
        className="flex-1"
        style={[
          { backgroundColor: surface },
          Platform.OS === 'web'
            ? ({ transition: 'background-color 360ms ease' } as any)
            : null,
        ]}
        contentContainerStyle={{ flexGrow: 1, paddingTop: 80 }}
        showsVerticalScrollIndicator={false}>
        <View
          style={{
            backgroundColor: surfaceContainerLow,
            paddingHorizontal: layout.horizontalPadding,
            paddingBottom: 72,
          }}>
          <View
            className="w-full self-center pt-8"
            style={{ maxWidth: layout.contentMaxWidth }}>
            {isLoading ? (
              <View
                className="rounded-[32px] border px-6 py-12"
                style={{
                  backgroundColor: surface,
                  borderColor: hexToRgba(primary, 0.12),
                }}>
                <Loading />
                <Text
                  className="mt-4 text-center text-base"
                  style={{ color: onSurfaceVariant }}>
                  Salon vitrinini, ekip bilgilerini ve mesai akisini hazirliyoruz.
                </Text>
              </View>
            ) : error || !viewModel ? (
              <View
                className="rounded-[32px] border px-6 py-10"
                style={{
                  backgroundColor: surface,
                  borderColor: hexToRgba(primary, 0.12),
                }}>
                <Text
                  className="font-headline text-[34px] font-bold"
                  style={{ color: onSurface }}>
                  Salon detayi bulunamadi
                </Text>
                <Text
                  className="mt-4 max-w-[680px] text-base leading-7"
                  style={{ color: onSurfaceVariant }}>
                  {error ||
                    'Goruntulemek istedigin vitrin kaydi simdilik ulasilamiyor. Listeye donup baska bir salon deneyebilirsin.'}
                </Text>
                <View
                  className="mt-8"
                  style={{ flexDirection: layout.isTablet ? 'row' : 'column', gap: 12 }}>
                  <Button
                    title="Kuafor listesine don"
                    interactionPreset="cta"
                    onPress={handleBack}
                  />
                  <Button
                    title="Tekrar dene"
                    variant="outline"
                    interactionPreset="outlineCta"
                    onPress={() => {
                      void reload();
                    }}
                  />
                </View>
              </View>
            ) : (
              <>
                <StorefrontHero
                  viewModel={viewModel}
                  isDesktop={layout.isDesktop}
                  isTablet={layout.isTablet}
                  onBackPress={handleBack}
                  onBookPress={handleBook}
                />

                <View
                  style={{
                    flexDirection: layout.isDesktop ? 'row' : 'column',
                    alignItems: 'flex-start',
                    gap: 18,
                  }}>
                  <View style={{ flex: layout.isDesktop ? 1.05 : undefined, gap: 18 }}>
                    <StorefrontSection
                      eyebrow="Vitrin oykusu"
                      title={viewModel.storyTitle}
                      description={viewModel.storyBody}>
                      <View
                        className="rounded-[26px] border px-5 py-5"
                        style={{
                          backgroundColor: surface,
                          borderColor: hexToRgba(primary, 0.14),
                        }}>
                        <Text className="font-label text-[11px] uppercase tracking-[2px]" style={{ color: primary }}>
                          Karar vermeyi hizlandiran detaylar
                        </Text>
                        <Text
                          className="mt-3 text-base leading-7"
                          style={{ color: onSurfaceVariant }}>
                          Bu sayfa; salon kimligi, aktif ekip bilgisi, haftalik mesai ve randevuya donuk deneyim kartlarini tek ritimde toplar. Liste ekranindan detay vitrine gecildiginde kullanici artik sadece isim degil, operasyon hissi de gorur.
                        </Text>
                      </View>
                    </StorefrontSection>

                    <StorefrontServices
                      services={viewModel.services}
                      isDesktop={layout.isDesktop}
                    />
                    <StorefrontTeam
                      team={viewModel.team}
                      isDesktop={layout.isDesktop}
                    />
                  </View>

                  <View style={{ width: layout.isDesktop ? 360 : '100%' }}>
                    <StorefrontSidebar
                      location={viewModel.location}
                      address={viewModel.address}
                      quickFacts={viewModel.quickFacts}
                      workingDays={viewModel.workingDays}
                      onOpenMaps={handleOpenMaps}
                    />
                  </View>
                </View>
              </>
            )}
          </View>
        </View>
        <Footer />
      </ScrollView>
    </>
  );
}
