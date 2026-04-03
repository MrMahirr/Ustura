import React from 'react';
import { View, Text, StyleSheet, Image, useWindowDimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { useThemeColor } from '@/hooks/use-theme-color';
import { Typography } from '@/constants/typography';
import { getLandingLayout } from '@/components/landing/layout';

export default function WhyUs() {
  const { width } = useWindowDimensions();
  const layout = getLandingLayout(width);
  const isWide = width >= 1240;
  const isTablet = width >= 720;

  const primary = useThemeColor({}, 'primary');
  const onSurface = useThemeColor({}, 'onSurface');
  const onSurfaceVariant = useThemeColor({}, 'onSurfaceVariant');
  const surfaceContainerLow = useThemeColor({}, 'surfaceContainerLow');
  const surface = useThemeColor({}, 'surface');
  const outlineVariant = useThemeColor({}, 'outlineVariant');

  const advantages = [
    { icon: 'event-available' as const, title: '7/24 Rezervasyon', desc: 'Istediginiz zaman, her yerden randevu alin.' },
    { icon: 'badge' as const, title: 'Berber Secimi', desc: 'Uzmanlar arasindan size en uygun olani secin.' },
    { icon: 'dashboard-customize' as const, title: 'Kolay Yonetim', desc: 'Randevularinizi tek bir yerden takip edin.' },
    { icon: 'notifications-active' as const, title: 'Anlik Bildirim', desc: 'Hatirlaticilar ile randevunuzu asla kacirmayin.' },
  ];

  return (
    <View
      style={[
        styles.container,
        {
          paddingVertical: layout.sectionPaddingVertical,
          paddingHorizontal: layout.horizontalPadding,
        },
      ]}>
      <View
        style={[
          styles.content,
          {
            maxWidth: layout.contentMaxWidth,
            flexDirection: isWide ? 'row' : 'column',
            gap: isWide ? 64 : 40,
          },
        ]}>
        <View
          style={[
            styles.textColumn,
            {
              flex: 1,
              paddingRight: isWide ? 32 : 0,
              alignItems: layout.isCompact ? 'center' : 'flex-start',
            },
          ]}>
          <Text style={[styles.label, { color: primary, textAlign: layout.isCompact ? 'center' : 'left' }]}>
            Avantajlar
          </Text>
          <Text style={[styles.headline, { color: onSurface, textAlign: layout.isCompact ? 'center' : 'left' }]}>
            Neden Ustura?
          </Text>
          <Text
            style={[
              styles.description,
              { color: onSurfaceVariant, textAlign: layout.isCompact ? 'center' : 'left' },
            ]}>
            Modern erkegin bakim rituelini teknolojiyle birlestiriyoruz. Zamaninizin degerini biliyor, size daha akici bir deneyim sunuyoruz.
          </Text>

          <View
            style={[
              styles.grid,
              {
                flexDirection: isTablet ? 'row' : 'column',
                justifyContent: isTablet ? 'space-between' : 'flex-start',
              },
            ]}>
            {advantages.map((adv, index) => (
              <View
                key={index}
                style={[
                  styles.advCard,
                  {
                    backgroundColor: surfaceContainerLow,
                    width: isTablet ? '48%' : '100%',
                  },
                ]}>
                <MaterialIcons name={adv.icon} size={24} color={primary} style={{ marginBottom: 16 }} />
                <Text style={[styles.advTitle, { color: onSurface }]}>{adv.title}</Text>
                <Text style={[styles.advDesc, { color: onSurfaceVariant }]}>{adv.desc}</Text>
              </View>
            ))}
          </View>
        </View>

        {isWide && (
          <View style={[styles.imageContainer, { flex: 0.95 }]}>
            <Image
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBO-zbTEblsfldl_Pculz_hOVdNwn5KRBopi_dNgZ1xGoqGbgpezo9HuFntCOoNaT3fAzEDyQ4v0f2yPzI6-DEsNpHFDqa_atm-SqhXvMPhYxLykHPnr-H2pfvIWJX7k1uLyao4iwT1ZU06GiwsHnoRXg2oODcykYkrWUUaBCW0_992qqpvvqbfFwS9Ml3PnmdsKV7KBzdc209F9EKwUT8vAShNbXfqaf5hl8KAh5KUIEvgrO3NXCCSZSEcT9Zun5H8Gnoi9_2PbqM' }}
              style={styles.image}
              resizeMode="cover"
            />
            <View style={[styles.outlineBox, { borderColor: primary, opacity: 0.2 }]} />
            <View style={[styles.quoteCard, { backgroundColor: surface, borderColor: outlineVariant }]}>
              <Text style={[styles.quoteText, { color: onSurface }]}>
                "Ustura, kaliteyi ve kolayligi bir araya getiren tek platform."
              </Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  content: {
    width: '100%',
    alignSelf: 'center',
    alignItems: 'stretch',
  },
  textColumn: {},
  label: {
    ...Typography.labelLg,
    letterSpacing: 3,
    marginBottom: 16,
  },
  headline: {
    ...Typography.displayLg,
    lineHeight: 52,
    marginBottom: 32,
  },
  description: {
    ...Typography.bodyLg,
    fontSize: 18,
    marginBottom: 48,
    maxWidth: 760,
  },
  grid: {
    flexWrap: 'wrap',
    gap: 16,
  },
  advCard: {
    padding: 24,
    borderRadius: 4,
    marginBottom: 16,
  },
  advTitle: {
    ...Typography.titleMd,
    fontFamily: 'Manrope-Bold',
    marginBottom: 8,
  },
  advDesc: {
    ...Typography.bodyMd,
  },
  imageContainer: {
    position: 'relative',
    minHeight: 600,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    opacity: 0.4,
  },
  outlineBox: {
    position: 'absolute',
    bottom: -40,
    left: -40,
    width: 256,
    height: 256,
    borderWidth: 8,
    zIndex: -1,
  },
  quoteCard: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: '-50%' }, { translateY: '-50%' }],
    padding: 48,
    borderWidth: 1,
    width: '80%',
  },
  quoteText: {
    ...Typography.headlineLg,
    fontSize: 24,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});
