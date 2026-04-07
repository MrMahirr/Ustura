import React from 'react';
import { ScrollView, View, useWindowDimensions, Platform } from 'react-native';

import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import FilterBar from '@/components/kuaforler/FilterBar';
import PromoBanner from '@/components/kuaforler/PromoBanner';
import SalonCard from '@/components/kuaforler/SalonCard';
import { SALON_LIST } from '@/components/kuaforler/presentation';
import { getLandingLayout } from '@/components/landing/layout';
import { useBookingEntry } from '@/hooks/use-booking-entry';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function KuaforlerPage() {
  const surface = useThemeColor({}, 'surface');
  const surfaceContainerLow = useThemeColor({}, 'surfaceContainerLow');
  const { width } = useWindowDimensions();
  const layout = getLandingLayout(width);
  const { openBooking } = useBookingEntry();

  const isDesktop = width >= 1024;
  const isTablet = width >= 768 && width < 1024;

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
            <FilterBar />

            <View className="flex-wrap justify-start gap-8" style={{ flexDirection: isDesktop || isTablet ? 'row' : 'column' }}>
              {SALON_LIST.map((salon) => (
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
          </View>
        </View>

        <PromoBanner />
        <Footer />
      </ScrollView>
    </>
  );
}
