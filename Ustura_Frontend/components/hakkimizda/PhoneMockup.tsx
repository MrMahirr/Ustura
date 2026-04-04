import React from 'react';
import { View, Text, Image, StyleSheet, Platform } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Typography } from '@/constants/typography';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { hexToRgba } from '@/utils/color';

export default function PhoneMockup() {
  const { theme } = useAppTheme();
  const surfaceContainerLowest = useThemeColor({}, 'surfaceContainerLowest');
  const surfaceContainerHighest = useThemeColor({}, 'surfaceContainerHighest');
  const surfaceContainerHigh = useThemeColor({}, 'surfaceContainerHigh');
  const surfaceContainerLow = useThemeColor({}, 'surfaceContainerLow');
  const surface = useThemeColor({}, 'surface');
  const primary = useThemeColor({}, 'primary');
  const onSurface = useThemeColor({}, 'onSurface');
  const onSurfaceVariant = useThemeColor({}, 'onSurfaceVariant');
  const onPrimary = useThemeColor({}, 'onPrimary');

  return (
    <View style={styles.wrapper}>
      {/* Decorative glow */}
      <View
        style={[
          styles.glowOrb,
          {
            backgroundColor: primary,
            opacity: theme === 'light' ? 0.09 : 0.05,
          },
        ]}
      />

      {/* Decorative lines */}
      <View style={[styles.decorLine1, { backgroundColor: primary }]} />
      <View style={[styles.decorLine2, { backgroundColor: primary }]} />

      {/* Phone Frame */}
      <View
        style={[
          styles.phone,
          {
            backgroundColor: surfaceContainerLowest,
            borderColor: surfaceContainerHighest,
            ...(Platform.OS === 'web'
              ? ({
                  boxShadow:
                    theme === 'light'
                      ? `0 0 80px -20px ${hexToRgba(primary, 0.18)}`
                      : '0 0 80px -20px rgba(230, 195, 100, 0.15)',
                } as any)
              : {}),
          },
        ]}>
        <View
          style={[
            styles.phoneInner,
            {
              backgroundColor: theme === 'light' ? surface : '#0A0A0F',
            },
          ]}>
          {/* Status Bar */}
          <View style={styles.statusBar}>
            <Text style={[styles.statusTime, { color: onSurface }]}>9:41</Text>
            <View style={styles.statusIcons}>
              <View style={[styles.statusDot, { borderColor: `${onSurface}4D` }]} />
              <View style={[styles.statusBattery, { backgroundColor: `${onSurface}CC` }]} />
            </View>
          </View>

          {/* App Header */}
          <View style={styles.appHeader}>
            <Text style={[styles.appBrand, { color: primary }]}>USTURA</Text>
            <Text style={[styles.appGreeting, { color: onSurface }]}>Hoş Geldin, Selim</Text>
          </View>

          {/* Active Appointment Card */}
          <View style={[styles.appointmentCard, { backgroundColor: surfaceContainerLow }]}>
            <View style={styles.appointmentRow}>
              <Text style={[styles.appointmentTime, { color: onSurfaceVariant }]}>Bugün 14:30</Text>
              <Text style={[styles.appointmentStatus, { color: primary }]}>Aktif Randevu</Text>
            </View>
            <View style={styles.barberRow}>
              <Image
                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvAohro_1BtsnRN0LFcA4Cf-kD3H8lEQaVXoDDKqEH4YsaK0FlRKXrcdWDGb92DNysbFKeOQSQ9ih9QieMqqXL0VFZMPtDwL5cU1g03ntgU0ibUt4D2YnUpX0VxvU-bgygz3LSHpfu1JbGq5epNbhQv7e2k4TWveQ9uNDkQisAKXimiBR2ZnMtce9hhl_kN0VIyFGuN1M9u2QeEbHdDjUG3ExqmyNRtBflPVNT2euoP0V6VCvne9mOnyCZytIlypakeRzX8NePjbg' }}
                style={styles.barberAvatar}
              />
              <View>
                <Text style={[styles.barberName, { color: onSurface }]}>Caner Yılmaz</Text>
                <Text style={[styles.barberService, { color: onSurfaceVariant }]}>Klasik Kesim & Sakal</Text>
              </View>
            </View>
          </View>

          {/* Barber Selection */}
          <View style={styles.selectionSection}>
            <Text style={[styles.selectionLabel, { color: onSurfaceVariant }]}>Berberini Seç</Text>
            <View style={styles.barberGrid}>
              {(['Ahmet', 'Murat', 'Kerem'] as const).map((name, i) => (
                <View
                  key={name}
                  style={[
                    styles.barberCard,
                    { backgroundColor: surfaceContainerHigh },
                    i === 0 && { borderColor: `${primary}66`, borderWidth: 1 },
                    i > 0 && { opacity: 0.4 },
                  ]}
                >
                  <Image
                    source={{
                      uri: i === 0
                        ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuCPKm3KIOyf4JpfZAc584yszQ0euMqk-dFlcXk652aXJSlM7LwD6k5cIJ1JVvdOOSjU4Ed-rnx8SFAJBk5Im4MEYt0a1730FQjfNWl7SMXKrRRALexPb7QMplKyJo5VyOH61jk8tTbN0WBTqaW-ptXELTGTlkX-ZRDtuISEm3cNdw_pn-E5DUIurM5gOm4wKAiwz5WOjuETTzkNP9mfisTl-xyQm2i6QN3LbKjMXviQpldbDBWPhfwA42aQORcs3efyCqQQALM3ytk'
                        : i === 1
                        ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuCajfiCIhJc3bABWr87OFWDJw4HFUDt02C20582eoPUC1LLJYm4jznlAiJLR_p44XyiODaYVumIpvGKGnEpafgL45ha56N4i9szjNXsXm0Y4z8FCmyjjqSvsbMuu7KLnteWzpjvMBuO8iM1tLO1Bx46KWwL79Tnie93s5CFL9UEb3tc79Yo7FW0nr-VYn4xvOAlwXGR7QF0koBlpuW1hnvSdEZkyI4bk9vYuzLNz6zD0ydeojFo5vfL-q-nkHeiFjx32NyOf0O502s'
                        : 'https://lh3.googleusercontent.com/aida-public/AB6AXuCMDsSXO10so6IeCYVVcoOua7_XmZ62SjUNzOWXjzyJ918CYzWV_Ivm3kWb6T9lGHl0CvqTftcDlgKfSZ665mLoHRVuGr3haFiACuXyWLE3bONvajr9fzRrbFLlLGiwyjWGf1R-fA3Q4a1_z6kTW8V8sqlaqp6vcOoXCYNpuUGJpgbnwlmrXKbaIgMHaWJHBpt9IaNKV8_lRbt_uZoaRu--cbny1uDKDDVtzx3RIyC_Clm_9qpaaeHOEvS-iRiyfFHm36wULE0ustA',
                    }}
                    style={styles.barberSmallAvatar}
                  />
                  <Text style={[styles.barberSmallName, { color: onSurface }]}>{name}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* CTA Button */}
          <View style={[styles.phoneCtaWrapper, { backgroundColor: surfaceContainerLowest }]}>
            <LinearGradient
              colors={[primary, '#c9a84c']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.phoneCta}
            >
              <Text style={[styles.phoneCtaText, { color: onPrimary }]}>RANDEVU AL</Text>
            </LinearGradient>
          </View>
        </View>
      </View>

      {/* Floating Badge */}
          <View
            style={[
              styles.floatingBadge,
              {
                backgroundColor:
                  theme === 'light'
                    ? Platform.OS === 'web'
                      ? 'rgba(255, 255, 255, 0.92)'
                      : surfaceContainerLowest
                    : Platform.OS === 'web'
                      ? 'rgba(53, 52, 58, 0.8)'
                      : surfaceContainerHighest,
                borderColor: `${primary}33`,
              },
              Platform.OS === 'web'
                ? ({
                    boxShadow:
                      theme === 'light'
                        ? '0 20px 40px rgba(27, 27, 32, 0.12)'
                        : '0 25px 50px rgba(0, 0, 0, 0.5)',
                  } as any)
                : {},
            ]}>
        <View style={[styles.badgeIconBox, { backgroundColor: `${primary}33` }]}>
          <MaterialIcons name="verified" size={24} color={primary} />
        </View>
        <View>
          <Text style={[styles.badgeNumber, { color: onSurface }]}>500+</Text>
          <Text style={[styles.badgeLabel, { color: onSurfaceVariant }]}>AKTİF SALON</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    height: 700,
  },
  glowOrb: {
    position: 'absolute',
    width: 500,
    height: 500,
    borderRadius: 250,
    ...(Platform.OS === 'web' && { filter: 'blur(120px)' } as any),
  },
  decorLine1: {
    position: 'absolute',
    top: '25%',
    right: 0,
    width: '100%',
    height: 1,
    opacity: 0.3,
    transform: [{ rotate: '-12deg' }],
  },
  decorLine2: {
    position: 'absolute',
    bottom: '33%',
    right: 0,
    width: '66%',
    height: 1,
    opacity: 0.2,
    transform: [{ rotate: '35deg' }],
  },
  phone: {
    width: 300,
    height: 600,
    borderRadius: 48,
    borderWidth: 8,
    overflow: 'hidden',
    zIndex: 10,
  } as any,
  phoneInner: {
    flex: 1,
    ...(Platform.OS === 'web'
      ? ({ transition: 'background-color 360ms ease, color 360ms ease' } as any)
      : {}),
  },
  statusBar: {
    height: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 24,
  },
  statusTime: {
    fontSize: 10,
    fontFamily: 'Manrope-Bold',
  },
  statusIcons: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
  },
  statusBattery: {
    width: 16,
    height: 12,
    borderRadius: 2,
  },
  appHeader: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 24,
  },
  appBrand: {
    fontSize: 10,
    letterSpacing: 3,
    fontFamily: 'Manrope-Bold',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  appGreeting: {
    ...Typography.headlineLg,
    fontSize: 20, // intentional override of headlineLg size for phone mockup scale
  },
  appointmentCard: {
    marginHorizontal: 24,
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    gap: 12,
  },
  appointmentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appointmentTime: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  appointmentStatus: {
    fontSize: 10,
    textTransform: 'uppercase',
    fontFamily: 'Manrope-Bold',
  },
  barberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  barberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  barberName: {
    fontSize: 12,
    fontFamily: 'Manrope-Bold',
  },
  barberService: {
    fontSize: 10,
  },
  selectionSection: {
    paddingHorizontal: 24,
    gap: 16,
  },
  selectionLabel: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  barberGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  barberCard: {
    width: 64,
    height: 64,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  barberSmallAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginBottom: 4,
  },
  barberSmallName: {
    fontSize: 8,
    fontFamily: 'Manrope-Bold',
  },
  phoneCtaWrapper: {
    marginTop: 'auto',
    padding: 24,
  },
  phoneCta: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneCtaText: {
    fontSize: 10,
    fontFamily: 'Manrope-Bold',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  floatingBadge: {
    position: 'absolute',
    bottom: 80,
    left: 10,
    zIndex: 20,
    padding: 24,
    borderWidth: 1,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    ...(Platform.OS === 'web'
      ? ({
          backdropFilter: 'blur(12px)',
          transition: 'background-color 360ms ease, border-color 360ms ease, box-shadow 360ms ease',
        } as any)
      : {}),
  } as any,
  badgeIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeNumber: {
    fontSize: 24,
    fontFamily: 'Manrope-Bold',
    lineHeight: 28,
  },
  badgeLabel: {
    fontSize: 10,
    fontFamily: 'Manrope-Bold',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
});
