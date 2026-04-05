import React from 'react';
import { ScrollView, View, useWindowDimensions, Platform } from 'react-native';

import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import FilterBar from '@/components/kuaforler/FilterBar';
import PromoBanner from '@/components/kuaforler/PromoBanner';
import SalonCard from '@/components/kuaforler/SalonCard';
import { getLandingLayout } from '@/components/landing/layout';
import { useThemeColor } from '@/hooks/use-theme-color';

const MOCK_SALONS = [
  {
    id: '1',
    name: 'The Obsidian Studio',
    location: 'Besiktas, Istanbul',
    rating: 4.9,
    reviewCount: 124,
    barbers: ['Ahmet Y.', 'Can B.'],
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCseDKZ2RW_yXwKVIbQZkSeyg-6phq9rtZJQejyro2ceP8n2ZqC28t-shv1f2JJsnUBHUc8KxN43KhUy6aB5WWuSzrOuzRBvRcLuvL7nB4HivUnTyMyr73YayqISXOEjTBxhGIeTuk9ottl_lXvqzU-048hmLpPSqyqRmsBlc5aCU-NfWN0UTLJWdjXBW2ipRO8U6JpLIIMiX5QXErtsOeLJPW1UGd8XGZJKAINnONwvdHYckobT5Ayv-X2LO737wbGa41QoPfqBj4',
  },
  {
    id: '2',
    name: 'Heritage Grooming',
    location: 'Cankaya, Ankara',
    rating: 4.8,
    reviewCount: 89,
    barbers: ['Murat K.', 'Emre S.', 'Selim D.'],
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA1z2xN3sr_r_S_tS84GUvWVFa6ALsUKMyOFkgSpbC5g3zoY6tNJuF7hxsQkIm9bRsnqhVQzD7rP3t4H2XOhBjD7nH986ZfIUUXdF_UazKi2uwfCaB08Dh3yDgWgJ-HbX6wUvykempM050mVRISevpb618jUmgMSThdqaltRIWEr4bffpbOOgJHMGJVzw4ITtaME0t6g3K4g-Qbgeq8BxjxmLui9odmQGINt4oZUyZCT61amhC_dDy1GnSCDpTP2_7mHcC4mLneOyg',
  },
  {
    id: '3',
    name: 'Sharp & Co.',
    location: 'Bornova, Izmir',
    rating: 5.0,
    reviewCount: 215,
    barbers: ['Volkan T.', 'Deniz A.'],
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD9Du-0fH-CtOES4K9J2gCbufPekyrfYgqnoSqpyBFSICffXD1Hq0yV4ZAXttFWnFbNWs54sw8l1OxVvOIyOHIMgTuUNPUAEM9zsJ2ObgDLjRT34nDBJa4X4GvqawVJAo9-3Exs_vX4AUVghCuqqpV_CyjY2YJcjL6SaFOW9AGkRJhFcBI4ewkS02nE3_K-HnqyxfKjnWQPyoPqcBMEcUWiBjrpKGJ-G01xbC1wbtfE2kTBaxSYk9wtsXnAsmfhae-5iCyPUFjNmYY',
  },
];

export default function KuaforlerPage() {
  const surface = useThemeColor({}, 'surface');
  const surfaceContainerLow = useThemeColor({}, 'surfaceContainerLow');
  const { width } = useWindowDimensions();
  const layout = getLandingLayout(width);

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
              {MOCK_SALONS.map((salon) => (
                <View
                  key={salon.id}
                  className="mb-8"
                  style={[
                    isDesktop ? { width: '31.33%' } : null,
                    isTablet ? { width: '48%' } : null,
                    !isDesktop && !isTablet ? { width: '100%' } : null,
                  ]}>
                  <SalonCard {...salon} />
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
