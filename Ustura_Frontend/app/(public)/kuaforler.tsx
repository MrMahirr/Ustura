import React from 'react';
import { useRouter } from 'expo-router';
import { ScrollView, Text, View, useWindowDimensions, Platform } from 'react-native';

import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import FilterBar, { type SalonSortOption } from '@/components/kuaforler/FilterBar';
import PaginationBar from '@/components/kuaforler/PaginationBar';
import PromoBanner from '@/components/kuaforler/PromoBanner';
import SalonCard from '@/components/kuaforler/SalonCard';
import { mapSalonToListItem } from '@/components/kuaforler/salon-listing';
import { getLandingLayout } from '@/components/landing/layout';
import Button from '@/components/ui/Button';
import { buildPublicSalonDetailRoute } from '@/constants/routes';
import { useSalonCities, useSalons } from '@/hooks/use-salons';
import { useBookingEntry } from '@/hooks/use-booking-entry';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function KuaforlerPage() {
  const router = useRouter();
  const surface = useThemeColor({}, 'surface');
  const surfaceContainerLow = useThemeColor({}, 'surfaceContainerLow');
  const onSurface = useThemeColor({}, 'onSurface');
  const onSurfaceVariant = useThemeColor({}, 'onSurfaceVariant');
  const { width } = useWindowDimensions();
  const layout = getLandingLayout(width);
  const { openBooking } = useBookingEntry();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeCity, setActiveCity] = React.useState('Tumu');
  const [activeSort, setActiveSort] = React.useState<SalonSortOption>('default');
  const [page, setPage] = React.useState(1);
  const deferredSearchQuery = React.useDeferredValue(searchQuery);
  const selectedCity = activeCity === 'Tumu' ? undefined : activeCity;
  const { cities: availableCities } = useSalonCities();
  const { salons, pagination, isLoading, error, reload } = useSalons({
    city: selectedCity,
    search: deferredSearchQuery,
    page,
    pageSize: 9,
  });

  const isDesktop = width >= 1024;
  const isTablet = width >= 768 && width < 1024;
  const cities = React.useMemo(() => ['Tumu', ...availableCities], [availableCities]);
  const salonCards = React.useMemo(() => {
    const items = salons.map(mapSalonToListItem);

    if (activeSort === 'name-asc') {
      return [...items].sort((left, right) => left.name.localeCompare(right.name, 'tr'));
    }

    if (activeSort === 'name-desc') {
      return [...items].sort((left, right) => right.name.localeCompare(left.name, 'tr'));
    }

    return items;
  }, [activeSort, salons]);

  React.useEffect(() => {
    setPage(1);
  }, [deferredSearchQuery, selectedCity, activeSort]);

  return (
    <>
      <Navbar />
      <ScrollView
        className="flex-1"
        style={[
          { backgroundColor: surface },
          Platform.OS === 'web' ? ({ transition: 'background-color 360ms ease' } as any) : null,
        ]}
        contentContainerStyle={{ flexGrow: 1, paddingTop: 80 }}
        showsVerticalScrollIndicator={false}>
        <View
          className="pb-16"
          style={[
            {
              backgroundColor: surfaceContainerLow,
              paddingHorizontal: layout.horizontalPadding,
            },
            Platform.OS === 'web' ? ({ transition: 'background-color 360ms ease' } as any) : null,
          ]}>
          <View className="w-full self-center" style={{ maxWidth: layout.contentMaxWidth }}>
            <View style={{ position: 'relative', zIndex: 50 }}>
              <FilterBar
                searchQuery={searchQuery}
                activeCity={activeCity}
                cities={cities}
                activeSort={activeSort}
                onSearchChange={setSearchQuery}
                onCityChange={setActiveCity}
                onSortChange={setActiveSort}
              />
            </View>

            {isLoading ? (
              <View style={{ paddingBottom: 48 }}>
                <Text className="font-headline text-3xl font-bold" style={{ color: onSurface }}>
                  Salonlar yukleniyor
                </Text>
                <Text className="font-body text-base" style={{ marginTop: 8, color: onSurfaceVariant }}>
                  Arama ve filtrelere gore aktif salonlar backend uzerinden sayfali getiriliyor.
                </Text>
              </View>
            ) : error ? (
              <View style={{ gap: 14, paddingBottom: 48 }}>
                <Text className="font-headline text-3xl font-bold" style={{ color: onSurface }}>
                  Salonlar alinmadi
                </Text>
                <Text className="font-body text-base" style={{ maxWidth: 540, color: onSurfaceVariant }}>
                  {error}
                </Text>
                <Button
                  title="Tekrar Dene"
                  variant="outline"
                  interactionPreset="outlineCta"
                  onPress={() => {
                    void reload();
                  }}
                  style={{ width: 220 }}
                />
              </View>
            ) : salonCards.length > 0 ? (
              <View className="flex-wrap justify-start gap-8" style={{ flexDirection: isDesktop || isTablet ? 'row' : 'column' }}>
                {salonCards.map((salon) => (
                  <View
                    key={salon.id}
                    className="mb-8"
                    style={[
                      isDesktop ? { width: '31.33%' } : null,
                      isTablet ? { width: '48%' } : null,
                      !isDesktop && !isTablet ? { width: '100%' } : null,
                    ]}>
                    <SalonCard
                      {...salon}
                      onPress={() => router.push(buildPublicSalonDetailRoute(salon.id))}
                      onBookPress={() => openBooking(salon)}
                    />
                  </View>
                ))}
              </View>
            ) : (
              <View style={{ paddingBottom: 48 }}>
                <Text className="font-headline text-3xl font-bold" style={{ color: onSurface }}>
                  Uygun salon bulunamadi
                </Text>
                <Text className="font-body text-base" style={{ marginTop: 8, color: onSurfaceVariant }}>
                  Filtreleri degistirerek tekrar deneyebilirsin.
                </Text>
              </View>
            )}

            {!isLoading && !error && salonCards.length > 0 ? (
              <PaginationBar
                page={pagination.page}
                pageSize={pagination.pageSize}
                total={pagination.total}
                totalPages={pagination.totalPages}
                onPageChange={setPage}
              />
            ) : null}
          </View>
        </View>

        <PromoBanner />
        <Footer />
      </ScrollView>
    </>
  );
}
