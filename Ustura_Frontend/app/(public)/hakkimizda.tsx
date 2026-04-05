import React from 'react';
import { ScrollView, View, useWindowDimensions, Platform } from 'react-native';

import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import AboutContent from '@/components/hakkimizda/AboutContent';
import PhoneMockup from '@/components/hakkimizda/PhoneMockup';
import { useThemeColor } from '@/hooks/use-theme-color';
import { getLandingLayout } from '@/components/landing/layout';

export default function HakkimizdaPage() {
  const surface = useThemeColor({}, 'surface');
  const surfaceContainerLow = useThemeColor({}, 'surfaceContainerLow');
  const { width } = useWindowDimensions();
  const layout = getLandingLayout(width);

  return (
    <>
      <Navbar />
      <ScrollView
        className="flex-1"
        style={[
          { backgroundColor: surface },
          Platform.OS === 'web' ? ({ transition: 'background-color 360ms ease' } as any) : null,
        ]}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}>
        <View
          className="pb-24"
          style={[
            {
              backgroundColor: surfaceContainerLow,
              paddingHorizontal: layout.horizontalPadding,
              paddingTop: layout.sectionPaddingVertical + 40,
            },
            Platform.OS === 'web' ? ({ transition: 'background-color 360ms ease' } as any) : null,
          ]}>
          <View
            className="w-full self-center items-center gap-12"
            style={{
              maxWidth: layout.contentMaxWidth,
              flexDirection: layout.isDesktop ? 'row' : 'column',
            }}>
            <View style={{ flex: layout.isDesktop ? 2 : undefined, width: layout.isDesktop ? undefined : '100%' }}>
              <AboutContent />
            </View>

            <View
              className="items-center"
              style={{
                flex: layout.isDesktop ? 1 : undefined,
                width: layout.isDesktop ? undefined : '100%',
                marginTop: layout.isDesktop ? 0 : 64,
              }}>
              <PhoneMockup />
            </View>
          </View>
        </View>

        <View style={{ backgroundColor: surface }}>
          <Footer />
        </View>
      </ScrollView>
    </>
  );
}
