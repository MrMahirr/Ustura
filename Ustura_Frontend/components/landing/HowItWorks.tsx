import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { useThemeColor } from '@/hooks/use-theme-color';
import { Typography } from '@/constants/typography';
import { getLandingLayout } from '@/components/landing/layout';

export default function HowItWorks() {
  const { width } = useWindowDimensions();
  const layout = getLandingLayout(width);
  const isWide = width >= 1180;

  const primary = useThemeColor({}, 'primary');
  const onSurface = useThemeColor({}, 'onSurface');
  const onSurfaceVariant = useThemeColor({}, 'onSurfaceVariant');
  const surfaceContainerLow = useThemeColor({}, 'surfaceContainerLow');
  const surfaceContainerHighest = useThemeColor({}, 'surfaceContainerHighest');

  const steps = [
    {
      icon: 'map' as const,
      title: 'Kuaforunu Sec',
      description: 'Favori salonunu veya konumuna en yakin olani bul. Harita uzerinden kolayca kesfet.',
    },
    {
      icon: 'content-cut' as const,
      title: 'Berberi Sec',
      description: 'Uzman berberlerin portfolyolarini ve gercek kullanici yorumlarini detaylica incele.',
    },
    {
      icon: 'schedule' as const,
      title: 'Saatini Rezerve Et',
      description: 'Musaitlik durumuna gore saniyeler icinde aninda randevunu guvenle al.',
    },
  ];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: surfaceContainerLow,
          paddingVertical: layout.sectionPaddingVertical,
          paddingHorizontal: layout.horizontalPadding,
        },
      ]}>
      <View style={[styles.content, { maxWidth: layout.contentMaxWidth }]}>
        <View style={[styles.header, { alignItems: layout.isCompact ? 'center' : 'flex-start' }]}>
          <Text style={[styles.label, { color: primary, textAlign: layout.isCompact ? 'center' : 'left' }]}>
            Surec
          </Text>
          <Text style={[styles.headline, { color: onSurface, textAlign: layout.isCompact ? 'center' : 'left' }]}>
            Nasil Calisir?
          </Text>
        </View>

        <View style={[styles.grid, { flexDirection: isWide ? 'row' : 'column', gap: isWide ? 48 : 32 }]}>
          {steps.map((step, index) => (
            <View
              key={index}
              style={[
                styles.stepCard,
                {
                  flex: isWide ? 1 : undefined,
                  alignItems: layout.isCompact ? 'center' : 'flex-start',
                },
              ]}>
              <View style={[styles.iconBox, { backgroundColor: surfaceContainerHighest, borderLeftColor: primary }]}>
                <MaterialIcons name={step.icon} size={32} color={primary} />
              </View>
              <Text style={[styles.stepTitle, { color: onSurface, textAlign: layout.isCompact ? 'center' : 'left' }]}>
                {step.title}
              </Text>
              <Text
                style={[
                  styles.stepDescription,
                  { color: onSurfaceVariant, textAlign: layout.isCompact ? 'center' : 'left' },
                ]}>
                {step.description}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  content: {
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    marginBottom: 64,
  },
  label: {
    ...Typography.labelLg,
    letterSpacing: 3,
    marginBottom: 16,
  },
  headline: {
    ...Typography.displayMd,
  },
  grid: {},
  stepCard: {
    alignItems: 'flex-start',
  },
  iconBox: {
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    borderLeftWidth: 4,
  },
  stepTitle: {
    ...Typography.headlineLg,
    fontSize: 24,
    marginBottom: 16,
  },
  stepDescription: {
    ...Typography.bodyLg,
    lineHeight: 28,
    maxWidth: 360,
  },
});
