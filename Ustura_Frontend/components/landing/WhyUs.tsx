import React from 'react';
import { View, Text, Image, useWindowDimensions, Pressable, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { useThemeColor } from '@/hooks/use-theme-color';
import { useAppTheme } from '@/contexts/ThemeContext';
import { getLandingLayout } from '@/components/landing/layout';
import { hexToRgba } from '@/utils/color';

export default function WhyUs() {
  const { width } = useWindowDimensions();
  const layout = getLandingLayout(width);
  const isWide = width >= 1240;
  const isTablet = width >= 720;

  const primary = useThemeColor({}, 'primary');
  const onSurface = useThemeColor({}, 'onSurface');
  const onSurfaceVariant = useThemeColor({}, 'onSurfaceVariant');
  const surfaceContainerLowest = useThemeColor({}, 'surfaceContainerLowest');
  const surfaceContainerLow = useThemeColor({}, 'surfaceContainerLow');
  const surface = useThemeColor({}, 'surface');
  const outlineVariant = useThemeColor({}, 'outlineVariant');
  const { theme } = useAppTheme();

  const advantages = [
    { icon: 'event-available' as const, title: '7/24 Rezervasyon', desc: 'Istediginiz zaman, her yerden randevu alin.' },
    { icon: 'badge' as const, title: 'Berber Secimi', desc: 'Uzmanlar arasindan size en uygun olani secin.' },
    { icon: 'dashboard-customize' as const, title: 'Kolay Yonetim', desc: 'Randevularinizi tek bir yerden takip edin.' },
    { icon: 'notifications-active' as const, title: 'Anlik Bildirim', desc: 'Hatirlaticilar ile randevunuzu asla kacirmayin.' },
  ];

  return (
    <View
      style={{
        backgroundColor: surface,
        paddingVertical: layout.sectionPaddingVertical,
        paddingHorizontal: layout.horizontalPadding,
      }}>
      <View
        className="w-full self-center items-stretch"
        style={{
          maxWidth: layout.contentMaxWidth,
          flexDirection: isWide ? 'row' : 'column',
          gap: isWide ? 64 : 40,
        }}>
        <View
          style={{
            flex: 1,
            paddingRight: isWide ? 32 : 0,
            alignItems: layout.isCompact ? 'center' : 'flex-start',
          }}>
          <Text
            className="mb-4 font-label text-base uppercase tracking-[3px]"
            style={{ color: primary, textAlign: layout.isCompact ? 'center' : 'left' }}>
            Avantajlar
          </Text>
          <Text
            className="mb-8 font-headline text-5xl font-bold"
            style={{ color: onSurface, textAlign: layout.isCompact ? 'center' : 'left', lineHeight: 52 }}>
            Neden Ustura?
          </Text>
          <Text
            style={[
              { fontFamily: 'Manrope-Regular', fontSize: 18, marginBottom: 48, maxWidth: 760 },
              { color: onSurfaceVariant, textAlign: layout.isCompact ? 'center' : 'left' },
            ]}>
            Modern erkegin bakim rituelini teknolojiyle birlestiriyoruz. Zamaninizin degerini biliyor, size daha akici bir deneyim sunuyoruz.
          </Text>

          <View
            className="flex-wrap gap-4"
            style={{ flexDirection: isTablet ? 'row' : 'column', justifyContent: isTablet ? 'space-between' : 'flex-start' }}>
            {advantages.map((adv, index) => (
              <Pressable
                key={index}
                className="w-full"
                style={{ width: isTablet ? '48%' : '100%' }}>
                {({ hovered, pressed }) => (
                  <View
                    style={[
                      {
                        padding: 24,
                        borderRadius: 18,
                        marginBottom: 16,
                        borderWidth: 1,
                        borderBottomWidth: 3,
                      },
                      {
                        backgroundColor: surfaceContainerLowest,
                        borderColor: hovered ? hexToRgba(primary, 0.22) : outlineVariant,
                        borderBottomColor: hovered ? primary : 'transparent',
                        transform: [{ translateY: hovered ? -4 : pressed ? -1 : 0 }],
                      },
                      Platform.OS === 'web'
                        ? ({
                            boxShadow: hovered
                              ? `0 16px 32px ${hexToRgba(primary, 0.10)}`
                              : '0 8px 24px rgba(27, 27, 32, 0.05)',
                          } as any)
                        : {
                            shadowColor: '#000000',
                            shadowOpacity: hovered ? 0.10 : 0.05,
                            shadowRadius: hovered ? 16 : 10,
                            shadowOffset: { width: 0, height: hovered ? 10 : 5 },
                          elevation: hovered ? 7 : 3,
                        },
                    ]}>
                    <View
                      className="mb-4 h-[52px] w-[52px] items-center justify-center rounded-[14px]"
                      style={{ backgroundColor: hovered ? hexToRgba(primary, 0.14) : surfaceContainerLow }}>
                      <MaterialIcons name={adv.icon} size={24} color={primary} />
                    </View>
                    <Text className="mb-2 font-body text-xl font-bold" style={{ color: onSurface }}>
                      {adv.title}
                    </Text>
                    <Text className="font-body text-base" style={{ color: onSurfaceVariant }}>
                      {adv.desc}
                    </Text>
                  </View>
                )}
              </Pressable>
            ))}
          </View>
        </View>

        {isWide && (
          <View className="relative min-h-[600px]" style={{ flex: 0.95 }}>
            <View
              style={[
                { flex: 1, borderRadius: 24, overflow: 'hidden', borderWidth: 1 },
                { backgroundColor: surfaceContainerLow, borderColor: outlineVariant },
                Platform.OS === 'web'
                  ? ({
                      boxShadow:
                        theme === 'light'
                          ? '0 24px 54px rgba(27, 27, 32, 0.10)'
                          : '0 24px 54px rgba(0, 0, 0, 0.30)',
                    } as any)
                  : {
                      shadowColor: '#000000',
                      shadowOpacity: theme === 'light' ? 0.12 : 0.22,
                      shadowRadius: 24,
                      shadowOffset: { width: 0, height: 12 },
                    elevation: 10,
                  },
              ]}>
              <Image
                source={require('../../assets/images/landing/landing_why.png')}
                className="h-full w-full"
                style={{ opacity: theme === 'light' ? 0.92 : 0.62 }}
                resizeMode="cover"
              />
              <LinearGradient
                colors={
                  theme === 'light'
                    ? ['rgba(253, 251, 255, 0)', 'rgba(253, 251, 255, 0.18)', 'rgba(253, 251, 255, 0.82)']
                    : ['rgba(17, 17, 24, 0)', 'rgba(17, 17, 24, 0.16)', 'rgba(17, 17, 24, 0.92)']
                }
                style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
              />
            </View>
            <View
              className="absolute bottom-[-40px] left-[-40px] z-[-1] h-64 w-64 border-[8px]"
              style={{ borderColor: primary, opacity: 0.2 }}
            />
            <View
              style={[
                {
                  position: 'absolute',
                  left: 48,
                  right: 48,
                  bottom: 40,
                  padding: 32,
                  borderWidth: 1,
                  borderRadius: 18,
                },
                {
                  backgroundColor: theme === 'light' ? 'rgba(255, 255, 255, 0.94)' : 'rgba(24, 24, 30, 0.92)',
                  borderColor: outlineVariant,
                },
                Platform.OS === 'web' ? ({ backdropFilter: 'blur(18px)' } as any) : null,
              ]}>
              <Text className="font-headline text-2xl italic" style={{ color: onSurface }}>
                Ustura, kaliteyi ve kolayligi bir araya getiren tek platform.
              </Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}
