import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions, Pressable, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { useThemeColor } from '@/hooks/use-theme-color';
import { Typography } from '@/constants/typography';
import { getLandingLayout } from '@/components/landing/layout';
import { hexToRgba } from '@/utils/color';

export default function HowItWorks() {
  const { width } = useWindowDimensions();
  const layout = getLandingLayout(width);
  const isWide = width >= 1180;

  const primary = useThemeColor({}, 'primary');
  const onSurface = useThemeColor({}, 'onSurface');
  const onSurfaceVariant = useThemeColor({}, 'onSurfaceVariant');
  const onPrimary = useThemeColor({}, 'onPrimary');
  const surface = useThemeColor({}, 'surface');
  const surfaceContainerLow = useThemeColor({}, 'surfaceContainerLow');
  const surfaceContainerHighest = useThemeColor({}, 'surfaceContainerHighest');
  const outlineVariant = useThemeColor({}, 'outlineVariant');

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

        <View style={[styles.grid, { flexDirection: isWide ? 'row' : 'column', gap: isWide ? 48 : 24 }]}>
          {steps.map((step, index) => (
            <Pressable
              key={index}
              style={[
                styles.stepPressable,
                {
                  flex: isWide ? 1 : undefined,
                },
              ]}>
              {({ hovered, pressed }) => (
                <View
                  style={[
                    styles.stepCard,
                    {
                      alignItems: layout.isCompact ? 'center' : 'flex-start',
                      backgroundColor: surface,
                      borderColor: hovered ? hexToRgba(primary, 0.22) : outlineVariant,
                      transform: [{ translateY: hovered ? -6 : pressed ? -2 : 0 }],
                    },
                    Platform.OS === 'web'
                      ? ({
                          boxShadow: hovered
                            ? `0 18px 34px ${hexToRgba(primary, 0.10)}`
                            : '0 10px 24px rgba(27, 27, 32, 0.06)',
                        } as any)
                      : {
                          shadowColor: '#000000',
                          shadowOpacity: hovered ? 0.10 : 0.05,
                          shadowRadius: hovered ? 18 : 12,
                          shadowOffset: { width: 0, height: hovered ? 10 : 6 },
                          elevation: hovered ? 8 : 4,
                        },
                  ]}>
                  <View
                    style={[
                      styles.iconBox,
                      {
                        backgroundColor: hovered ? primary : surfaceContainerHighest,
                        borderLeftColor: primary,
                      },
                    ]}>
                    <MaterialIcons name={step.icon} size={32} color={hovered ? onPrimary : primary} />
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
              )}
            </Pressable>
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
  stepPressable: {
    width: '100%',
  },
  stepCard: {
    alignItems: 'flex-start',
    padding: 28,
    borderRadius: 20,
    borderWidth: 1,
    ...(Platform.OS === 'web'
      ? ({
          transition: 'background-color 260ms ease, border-color 260ms ease, box-shadow 260ms ease, transform 220ms ease',
        } as any)
      : {}),
  },
  iconBox: {
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    borderLeftWidth: 4,
    borderRadius: 12,
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
