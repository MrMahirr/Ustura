import React from 'react';
import { View, Text, Image, StyleSheet, useWindowDimensions, Platform } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Typography } from '@/constants/typography';
import { MaterialIcons } from '@expo/vector-icons';
import { getLandingLayout } from '@/components/landing/layout';

export default function FeatureShowcase() {
  const { width } = useWindowDimensions();
  const layout = getLandingLayout(width);

  const surfaceContainerLow = useThemeColor({}, 'surfaceContainerLow');
  const surfaceContainerHighest = useThemeColor({}, 'surfaceContainerHighest');
  const onSurface = useThemeColor({}, 'onSurface');
  const onSurfaceVariant = useThemeColor({}, 'onSurfaceVariant');
  const primary = useThemeColor({}, 'primary');

  const checkItems = [
    'Özel Seçilmiş Usta Berberler',
    'VIP Hizmet Seçenekleri',
    'Ödüllü Randevu Arayüzü',
  ];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: surfaceContainerLow,
          paddingHorizontal: layout.horizontalPadding,
        },
      ]}
    >
      <View
        style={[
          styles.content,
          {
            maxWidth: layout.contentMaxWidth,
            flexDirection: layout.isDesktop ? 'row' : 'column',
          },
        ]}
      >
        {/* Image side */}
        <View style={[styles.imageSection, { width: layout.isDesktop ? '48%' : '100%' }]}>
          {/* Decorative blur blob */}
          <View style={[styles.decorBlob, { backgroundColor: primary }]} />
          <Image
            source={{
              uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkWCTeUgr0KcIB1brQYyv0W7cd3htaf9XD4se0NEizx2XCeBX8tzeSn1Hl17wyUbUduMhhxMSc9LFD5E43rZNviK9oXnJcRyEGxSsGSvL9qBV5ZbTQ7aFRjTPL3vlNgxSZwbw-KeykC7QNMnqJRkSalvumnuu7CggOVIHoUN34f_evEVtgyxN64gMIZ_CB9zcDloaZUAqj2pqC2Qf1-aygKVVeQuKjBWXzPeCOSdggWlmzJvEp561lmACpOMMZK30W52xW2nI2Mio',
            }}
            style={styles.image}
            resizeMode="cover"
          />
          {/* Stats badge */}
          {layout.isDesktop && (
            <View style={[styles.statsBadge, { backgroundColor: surfaceContainerHighest }]}>
              <Text style={[styles.statsNumber, { color: primary }]}>+150</Text>
              <Text style={[styles.statsLabel, { color: onSurfaceVariant }]}>Premium Salon</Text>
            </View>
          )}
        </View>

        {/* Text side */}
        <View style={[styles.textSection, { width: layout.isDesktop ? '48%' : '100%', marginTop: layout.isDesktop ? 0 : 48 }]}>
          <Text style={[styles.preLabel, { color: primary }]}>OBSIDIAN EXCELLENCE</Text>
          <Text style={[styles.headline, { color: onSurface }]}>
            Bir Berberden Daha Fazlası, Bir Deneyim.
          </Text>
          <Text style={[styles.body, { color: onSurfaceVariant }]}>
            USTURA sadece bir yazılım değil, berberlik sanatını dijital çağın hızıyla birleştiren bir köprüdür. En kaliteli kesimlerin ve en profesyonel salonların buluşma noktası.
          </Text>

          <View style={styles.checkList}>
            {checkItems.map((item, i) => (
              <View key={i} style={styles.checkRow}>
                <MaterialIcons name="check-circle" size={22} color={primary} />
                <Text style={[styles.checkText, { color: onSurface }]}>{item}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 96,
    overflow: 'hidden',
  },
  content: {
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    gap: 80,
  },
  imageSection: {
    position: 'relative',
  },
  decorBlob: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    opacity: 0.1,
    top: -40,
    left: -40,
    ...(Platform.OS === 'web' && { filter: 'blur(40px)' } as any),
  },
  image: {
    width: '100%',
    aspectRatio: 1.25,
    borderRadius: 8,
    opacity: 0.8,
  },
  statsBadge: {
    position: 'absolute',
    bottom: -24,
    right: -24,
    padding: 24,
    borderRadius: 4,
    zIndex: 20,
  },
  statsNumber: {
    ...Typography.displayMd,
    fontSize: 32,
  },
  statsLabel: {
    ...Typography.labelMd,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  textSection: {},
  preLabel: {
    ...Typography.labelLg,
    letterSpacing: 3,
    fontFamily: 'Manrope-Bold',
    marginBottom: 20,
  },
  headline: {
    ...Typography.displayMd,
    lineHeight: 48,
    marginBottom: 24,
  },
  body: {
    ...Typography.bodyLg,
    fontSize: 18,
    lineHeight: 28,
    marginBottom: 32,
  },
  checkList: {
    gap: 16,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  checkText: {
    ...Typography.bodyLg,
  },
});
