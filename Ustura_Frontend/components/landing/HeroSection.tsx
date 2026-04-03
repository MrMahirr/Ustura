import React from 'react';
import { View, Text, StyleSheet, Image, useWindowDimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import Button from '@/components/ui/Button';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Typography } from '@/constants/typography';
import { getLandingLayout } from '@/components/landing/layout';

export default function HeroSection() {
  const { width } = useWindowDimensions();
  const layout = getLandingLayout(width);
  const isDesktop = layout.isDesktop;
  const isCompact = layout.isCompact;
  const isTablet = layout.isTablet;

  const primary = useThemeColor({}, 'primary');
  const onSurface = useThemeColor({}, 'onSurface');
  const onSurfaceVariant = useThemeColor({}, 'onSurfaceVariant');
  const surfaceContainerLow = useThemeColor({}, 'surfaceContainerLow');
  const surfaceContainerHighest = useThemeColor({}, 'surfaceContainerHighest');
  const onPrimary = useThemeColor({}, 'onPrimary');

  return (
    <View
      style={[
        styles.container,
        {
          paddingHorizontal: layout.horizontalPadding,
          paddingTop: isTablet ? 120 : 104,
          paddingBottom: width < 768 ? 56 : 72,
        },
      ]}>
      <View
        style={[
          styles.content,
          {
            maxWidth: layout.contentMaxWidth,
            flexDirection: isDesktop ? 'row' : 'column',
            gap: isDesktop ? 48 : 40,
            alignItems: isDesktop ? 'center' : 'stretch',
          },
        ]}>
        <View
          style={[
            styles.textContent,
            {
              flex: isDesktop ? 7 : undefined,
              paddingRight: isDesktop ? 32 : 0,
              alignItems: isCompact ? 'center' : 'flex-start',
            },
          ]}>
          <Text
            style={[
              styles.headline,
              {
                color: onSurface,
                textAlign: isCompact ? 'center' : 'left',
                lineHeight: width < 768 ? 44 : 52,
                maxWidth: isCompact ? 820 : 640,
              },
            ]}>
            Erkek Kuaforunde{'\n'}
            <Text style={{ color: primary }}>Randevu, Artik Kolayca.</Text>
          </Text>

          <Text
            style={[
              styles.description,
              {
                color: onSurfaceVariant,
                textAlign: isCompact ? 'center' : 'left',
                maxWidth: isCompact ? 760 : 600,
              },
            ]}>
            Ustura ile en iyi berberleri kesfedin ve saniyeler icinde randevunuzu olusturun. Modern bakimin dijital adresi.
          </Text>

          <View
            style={[
              styles.actionButtons,
              {
                flexDirection: isDesktop ? 'row' : 'column',
                alignSelf: isCompact ? 'center' : 'flex-start',
                width: isDesktop ? 'auto' : '100%',
                maxWidth: isDesktop ? undefined : 420,
              },
            ]}>
            <Button
              title="Randevu Al"
              icon="calendar-month"
              interactionPreset="cta"
              style={isDesktop ? { marginRight: 16 } : { marginBottom: 16 }}
            />
            <Button
              title="Salonunu Kaydet"
              variant="outline"
              interactionPreset="outlineCta"
            />
          </View>
        </View>

        <View
          style={[
            styles.imageContainer,
            {
              flex: isDesktop ? 5 : undefined,
              width: '100%',
              maxWidth: isDesktop ? undefined : 760,
              alignSelf: 'center',
            },
          ]}>
          <View style={[styles.imageWrapper, { backgroundColor: surfaceContainerLow }]}>
            <Image
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQAFGExDLMXdObkEKDhvhAaZ59gJ_Dc0c2OwcwhFxiVzAvYpa2xT4jdFEfAZb8qhu_2sE8tARQLy42nRaD4cod5Y_Q0NTPtIggI2xZ9Vpxwg0zkpXK8QLwD9J20nCYJdhuwptetN7qERG57GoVe-Om80ea2gDplgrWgOxt8owoJ4fK5Bs9pQlEedALb-QlWureGhCrJYU15cDeKdvboA_tDTknCfqX_r7hKfnrGX9xkyE_M0fkpQINIOsaQCPjH0fyIznSnhjb-5k' }}
              style={styles.mainImage}
              resizeMode="cover"
            />

            <LinearGradient
              colors={['transparent', 'rgba(19, 19, 24, 1)']}
              style={StyleSheet.absoluteFillObject}
            />

            <View
              style={[
                styles.mockupCard,
                {
                  backgroundColor: Platform.OS === 'web' ? 'rgba(53, 52, 58, 0.9)' : surfaceContainerHighest,
                  borderColor: 'rgba(230, 195, 100, 0.2)',
                  left: width < 768 ? 20 : 32,
                  right: width < 768 ? 20 : 32,
                  bottom: width < 768 ? 20 : 32,
                  padding: width < 768 ? 20 : 24,
                },
              ]}>
              <View style={styles.mockupHeader}>
                <Image
                  source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDX2Ybc6uR2gVs56Ln4AmF09y4OJyQ_EWwI3LL3-v3sYitIGL7AizrAdqxXBoXTDDOBC_CH0D4uJwuRBBItS7wEFMeFDxms2mzN4pSSPYtFaFs-urIDjT9EJIRM6z0U5ingK4EfjxNRzHLTeILoEgOAyIMvxDGoE51vRy25ZlPRwXuzyZasMbxrp3-Vyfod-tlhJeFn2tJYwEOKUvAR5la9ca2qSo1T5Jb0HPES2nzmJHdW_S0fYiun3HZ9xWwYY-PLDiBfS7IKSug' }}
                  style={styles.mockupAvatar}
                />
                <View>
                  <Text style={[styles.mockupLabel, { color: primary }]}>MASTER BARBER</Text>
                  <Text style={[styles.mockupName, { color: onSurface }]}>Murat Yilmaz</Text>
                </View>
              </View>

              <View style={styles.timeSlots}>
                <View style={[styles.timeSlot, { backgroundColor: primary }]}>
                  <Text style={[styles.timeText, { color: onPrimary, fontFamily: 'Manrope-Bold' }]}>10:30</Text>
                </View>
                <View style={[styles.timeSlot, { backgroundColor: surfaceContainerLow }]}>
                  <Text style={[styles.timeText, { color: onSurfaceVariant }]}>11:00</Text>
                </View>
                <View style={[styles.timeSlot, { backgroundColor: surfaceContainerLow }]}>
                  <Text style={[styles.timeText, { color: onSurfaceVariant }]}>11:30</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 800,
    justifyContent: 'center',
  },
  content: {
    width: '100%',
    alignSelf: 'center',
  },
  textContent: {
    width: '100%',
    zIndex: 10,
  },
  headline: {
    ...Typography.displayLg,
    marginBottom: 32,
  },
  description: {
    ...Typography.titleLg,
    fontFamily: 'Manrope-Regular',
    marginBottom: 48,
  },
  actionButtons: {
    width: '100%',
  },
  imageContainer: {
    position: 'relative',
  },
  imageWrapper: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(153, 144, 126, 0.2)',
  },
  mainImage: {
    width: '100%',
    height: '100%',
    opacity: 0.6,
  },
  mockupCard: {
    position: 'absolute',
    borderRadius: 8,
    borderWidth: 1,
    ...(Platform.OS === 'web' && { backdropFilter: 'blur(8px)' } as any),
  },
  mockupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  mockupAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 16,
  },
  mockupLabel: {
    ...Typography.labelSm,
  },
  mockupName: {
    ...Typography.bodyLg,
    fontFamily: 'Manrope-Bold',
  },
  timeSlots: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  timeSlot: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 4,
  },
  timeText: {
    ...Typography.labelLg,
    fontSize: 12,
  },
});
