import React from 'react';
import { ScrollView, View, StyleSheet, useWindowDimensions, Platform } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { getLandingLayout } from '@/components/landing/layout';

import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import AboutContent from '../../components/hakkimizda/AboutContent';
import PhoneMockup from '../../components/hakkimizda/PhoneMockup';

export default function HakkimizdaPage() {
  const surface = useThemeColor({}, 'surface');
  const surfaceContainerLow = useThemeColor({}, 'surfaceContainerLow');
  const { width } = useWindowDimensions();
  const layout = getLandingLayout(width);

  return (
    <>
      <Navbar />
      <ScrollView
        style={[styles.container, { backgroundColor: surface }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Split Layout */}
        <View
          style={[
            styles.heroSection,
            {
              backgroundColor: surfaceContainerLow,
              paddingHorizontal: layout.horizontalPadding,
              paddingTop: layout.sectionPaddingVertical + 40,
            },
          ]}
        >
          <View
            style={[
              styles.heroInner,
              {
                maxWidth: layout.contentMaxWidth,
                flexDirection: layout.isDesktop ? 'row' : 'column',
              },
            ]}
          >
            {/* Left: Text (2/3) */}
            <View style={[styles.heroLeft, { flex: layout.isDesktop ? 2 : undefined, width: layout.isDesktop ? undefined : '100%' }]}>
              <AboutContent />
            </View>

            {/* Right: Phone Mockup (1/3) */}
            <View
              style={[
                styles.heroRight,
                {
                  flex: layout.isDesktop ? 1 : undefined,
                  width: layout.isDesktop ? undefined : '100%',
                  marginTop: layout.isDesktop ? 0 : 64,
                },
              ]}
            >
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...(Platform.OS === 'web' ? ({ transition: 'background-color 360ms ease' } as any) : {}),
  },
  scrollContent: {
    flexGrow: 1,
  },
  heroSection: {
    paddingBottom: 96,
    ...(Platform.OS === 'web' ? ({ transition: 'background-color 360ms ease' } as any) : {}),
  },
  heroInner: {
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    gap: 48,
  },
  heroLeft: {},
  heroRight: {
    alignItems: 'center',
  },
});
