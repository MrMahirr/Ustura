import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Typography } from '@/constants/typography';
import { MaterialIcons } from '@expo/vector-icons';

export default function PromoBanner() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const primary = useThemeColor({}, 'primary');
  const onSurface = useThemeColor({}, 'onSurface');
  const onSurfaceVariant = useThemeColor({}, 'onSurfaceVariant');
  const surfaceContainerLow = useThemeColor({}, 'surfaceContainerLow');
  const surface = useThemeColor({}, 'surface');

  const features = [
    {
      icon: 'schedule' as const,
      title: 'Zaman Kaybetme',
      desc: 'Sıra beklemeden, dilediğin saatte randevunu saniyeler içinde oluştur.'
    },
    {
      icon: 'content-cut' as const,
      title: 'Berberini Seç',
      desc: 'Uzman kadroyu incele, yorumları oku ve sana en uygun ustayı seç.'
    },
    {
      icon: 'verified' as const,
      title: 'Anında Onayla',
      desc: 'Telefon trafiğine girmeden onaylı randevunun keyfini çıkar.'
    }
  ];

  return (
    <View style={[styles.container, { backgroundColor: surfaceContainerLow }]}>
      
      {/* Decorative Blur blob - approximate native styling */}
      <View style={[styles.blurBlob, { backgroundColor: primary }]} />

      <View style={styles.content}>
        
        <View style={styles.header}>
          <Text style={[styles.headline, { color: onSurface }]}>Neden Ustura Kullanmalısın?</Text>
          <Text style={[styles.description, { color: onSurfaceVariant }]}>Bakımlı olmanın en modern ve hızlı yoluyla tanışın.</Text>
        </View>

        <View style={[styles.grid, { flexDirection: isDesktop ? 'row' : 'column' }]}>
          {features.map((feat, index) => (
            <View key={index} style={[styles.featureCard, { flex: isDesktop ? 1 : undefined }]}>
              <View style={[styles.iconWrapper, { backgroundColor: surface }]}>
                <MaterialIcons name={feat.icon} size={32} color={primary} />
              </View>
              <Text style={[styles.featTitle, { color: onSurface }]}>{feat.title}</Text>
              <Text style={[styles.featDesc, { color: onSurfaceVariant }]}>{feat.desc}</Text>
            </View>
          ))}
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    paddingVertical: 80,
    paddingHorizontal: 32,
    overflow: 'hidden',
  },
  blurBlob: {
    position: 'absolute',
    top: -128,
    right: -128,
    width: 256,
    height: 256,
    borderRadius: 128,
    opacity: 0.05,
    // Note: CSS blur is not easily supported natively without expo-blur or dedicated libraries overlaying images, simulating fading blob here
  },
  content: {
    maxWidth: 896,
    width: '100%',
    alignSelf: 'center',
    position: 'relative',
    zIndex: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 64,
  },
  headline: {
    ...Typography.displayMd,
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    ...Typography.bodyLg,
    textAlign: 'center',
  },
  grid: {
    gap: 48,
  },
  featureCard: {
    alignItems: 'center',
    textAlign: 'center',
  },
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  featTitle: {
    ...Typography.titleLg,
    fontFamily: 'Manrope-Bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  featDesc: {
    ...Typography.bodyMd,
    textAlign: 'center',
    lineHeight: 22,
  },
});
