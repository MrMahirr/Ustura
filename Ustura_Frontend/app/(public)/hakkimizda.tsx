import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, View, useWindowDimensions, Platform } from 'react-native';

import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import AboutContent from '@/components/hakkimizda/AboutContent';
import PhoneMockup from '@/components/hakkimizda/PhoneMockup';
import { useAppTheme } from '@/contexts/ThemeContext';
import { useThemeColor } from '@/hooks/use-theme-color';
import { getLandingLayout } from '@/components/landing/layout';
import { hexToRgba } from '@/utils/color';

export default function HakkimizdaPage() {
  const { theme } = useAppTheme();
  const surfaceContainerLow = useThemeColor({}, 'surfaceContainerLow');
  const surfaceContainerLowest = useThemeColor({}, 'surfaceContainerLowest');
  const primary = useThemeColor({}, 'primary');
  const tertiary = useThemeColor({}, 'tertiary');
  const outlineVariant = useThemeColor({}, 'outlineVariant');
  const { width } = useWindowDimensions();
  const layout = getLandingLayout(width);

  return (
    <>
      <Navbar />
      <ScrollView
        className="flex-1"
        style={[
          { backgroundColor: surfaceContainerLow },
          Platform.OS === 'web' ? ({ transition: 'background-color 360ms ease' } as any) : null,
        ]}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}>
        <View
          className="flex-1"
          style={[
            {
              backgroundColor: surfaceContainerLow,
              minHeight: '100%',
            },
            Platform.OS === 'web' ? ({ transition: 'background-color 360ms ease' } as any) : null,
          ]}>
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              inset: 0,
              overflow: 'hidden',
            }}>
            <LinearGradient
              colors={[
                hexToRgba(primary, theme === 'light' ? 0.14 : 0.18),
                hexToRgba(surfaceContainerLow, 0),
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                position: 'absolute',
                top: -120,
                left: -80,
                width: width < 768 ? 280 : 420,
                height: width < 768 ? 280 : 420,
                borderRadius: 999,
              }}
            />

            <View
              style={{
                position: 'absolute',
                top: width < 768 ? 220 : 180,
                right: -120,
                width: width < 768 ? 260 : 420,
                height: width < 768 ? 260 : 420,
                borderRadius: 999,
                backgroundColor: hexToRgba(tertiary, theme === 'light' ? 0.12 : 0.1),
                opacity: 0.9,
                ...(Platform.OS === 'web'
                  ? ({ filter: 'blur(90px)' } as any)
                  : {}),
              }}
            />

            <View
              style={{
                position: 'absolute',
                bottom: 120,
                left: width < 768 ? -90 : 80,
                width: width < 768 ? 220 : 340,
                height: width < 768 ? 220 : 340,
                borderRadius: 999,
                backgroundColor: hexToRgba(primary, theme === 'light' ? 0.1 : 0.09),
                ...(Platform.OS === 'web'
                  ? ({ filter: 'blur(110px)' } as any)
                  : {}),
              }}
            />

            <View
              style={{
                position: 'absolute',
                top: 140,
                left: layout.horizontalPadding,
                right: layout.horizontalPadding,
                height: 1,
                backgroundColor: hexToRgba(primary, 0.14),
                transform: [{ rotate: '-4deg' }],
              }}
            />

            <View
              style={{
                position: 'absolute',
                bottom: 220,
                left: layout.horizontalPadding * 0.8,
                width: '82%',
                height: 1,
                backgroundColor: hexToRgba(outlineVariant, 0.22),
                transform: [{ rotate: '5deg' }],
              }}
            />
          </View>

          <View
            className="pb-24"
            style={{
              paddingHorizontal: layout.horizontalPadding,
              paddingTop: layout.sectionPaddingVertical + 40,
            }}>
            <View
              className="w-full self-center items-center gap-12"
              style={{
                maxWidth: layout.contentMaxWidth,
                flexDirection: layout.isDesktop ? 'row' : 'column',
              }}>
              <View style={{ flex: layout.isDesktop ? 2 : undefined, width: layout.isDesktop ? undefined : '100%' }}>
                <View
                  className="overflow-hidden rounded-[36px] border p-6"
                  style={{
                    backgroundColor: hexToRgba(
                      surfaceContainerLowest,
                      theme === 'light' ? 0.7 : 0.54,
                    ),
                    borderColor: hexToRgba(primary, 0.14),
                    ...(Platform.OS === 'web'
                      ? ({
                          backdropFilter: 'blur(18px)',
                          boxShadow: `0 24px 56px ${hexToRgba(primary, 0.08)}`,
                        } as any)
                      : {}),
                  }}>
                  <AboutContent />
                </View>
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

          <Footer />
        </View>
      </ScrollView>
    </>
  );
}
