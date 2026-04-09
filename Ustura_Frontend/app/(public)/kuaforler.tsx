import React from 'react';
import { ScrollView, Text, View, useWindowDimensions, Platform } from 'react-native';

import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import FilterBar from '@/components/kuaforler/FilterBar';
import PromoBanner from '@/components/kuaforler/PromoBanner';
import SalonCard from '@/components/kuaforler/SalonCard';
import type { SalonListItem } from '@/components/kuaforler/presentation';
import { getLandingLayout } from '@/components/landing/layout';
import Button from '@/components/ui/Button';
import { useSalons } from '@/hooks/use-salons';
import { useBookingEntry } from '@/hooks/use-booking-entry';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { SalonRecord } from '@/services/salon.service';

const DEFAULT_SALON_IMAGE_URI =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuD9Du-0fH-CtOES4K9J2gCbufPekyrfYgqnoSqpyBFSICffXD1Hq0yV4ZAXttFWnFbNWs54sw8l1OxVvOIyOHIMgTuUNPUAEM9zsJ2ObgDLjRT34nDBJa4X4GvqawVJAo9-3Exs_vX4AUVghCuqqpV_CyjY2YJcjL6SaFOW9AGkRJhFcBI4ewkS02nE3_K-HnqyxfKjnWQPyoPqcBMEcUWiBjrpKGJ-G01xbC1wbtfE2kTBaxSYk9wtsXnAsmfhae-5iCyPUFjNmYY';

function mapSalonToListItem(salon: SalonRecord): SalonListItem {
  const location = salon.district ? `${salon.district}, ${salon.city}` : salon.city;

  return {
    id: salon.id,
    name: salon.name,
    location,
    rating: 4.9,
    reviewCount: 0,
    imageUrl: salon.photoUrl ?? DEFAULT_SALON_IMAGE_URI,
    barbers: [],
  };
}

export default function KuaforlerPage() {
  const surface = useThemeColor({}, 'surface');
  const surfaceContainerLow = useThemeColor({}, 'surfaceContainerLow');
  const onSurface = useThemeColor({}, 'onSurface');
  const onSurfaceVariant = useThemeColor({}, 'onSurfaceVariant');
  const { width } = useWindowDimensions();
  const layout = getLandingLayout(width);
  const { openBooking } = useBookingEntry();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeCity, setActiveCity] = React.useState('Tumu');
  const deferredSearchQuery = React.useDeferredValue(searchQuery);
  const { salons, isLoading, error, reload } = useSalons({
    search: deferredSearchQuery,
  });

  const isDesktop = width >= 1024;
  const isTablet = width >= 768 && width < 1024;
  const cities = React.useMemo(
    () => ['Tumu', ...new Set(salons.map((salon) => salon.city).filter(Boolean))],
    [salons]
  );
  const visibleSalons = React.useMemo(
    () => (activeCity === 'Tumu' ? salons : salons.filter((salon) => salon.city === activeCity)),
    [activeCity, salons]
  );
  const salonCards = React.useMemo(
    () => visibleSalons.map(mapSalonToListItem),
    [visibleSalons]
  );

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
            <FilterBar
              searchQuery={searchQuery}
              activeCity={activeCity}
              cities={cities}
              onSearchChange={setSearchQuery}
              onCityChange={setActiveCity}
            />

            {isLoading ? (
              <View style={{ paddingBottom: 48 }}>
                <Text className="font-headline text-3xl font-bold" style={{ color: onSurface }}>
                  Salonlar yukleniyor
                </Text>
                <Text className="font-body text-base" style={{ marginTop: 8, color: onSurfaceVariant }}>
                  Arama sonucuna gore aktif salonlar backend uzerinden getiriliyor.
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
                    <SalonCard {...salon} onBookPress={() => openBooking(salon)} />
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
          </View>
        </View>

        <PromoBanner />
        <Footer />
      </ScrollView>
    </>
  );
}
