import React from 'react';
import { View, Text, useWindowDimensions, Pressable, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { useThemeColor } from '@/hooks/use-theme-color';
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
      style={{
        backgroundColor: surfaceContainerLow,
        paddingVertical: layout.sectionPaddingVertical,
        paddingHorizontal: layout.horizontalPadding,
      }}>
      <View className="w-full self-center" style={{ maxWidth: layout.contentMaxWidth }}>
        <View className="mb-16" style={{ alignItems: layout.isCompact ? 'center' : 'flex-start' }}>
          <Text
            className="mb-4 font-label text-base uppercase tracking-[3px]"
            style={{ color: primary, textAlign: layout.isCompact ? 'center' : 'left' }}>
            Surec
          </Text>
          <Text
            className="font-headline text-5xl font-bold"
            style={{ color: onSurface, textAlign: layout.isCompact ? 'center' : 'left' }}>
            Nasil Calisir?
          </Text>
        </View>

        <View style={{ flexDirection: isWide ? 'row' : 'column', gap: isWide ? 48 : 24 }}>
          {steps.map((step, index) => (
            <Pressable
              key={index}
              className="w-full"
              style={{ flex: isWide ? 1 : undefined }}>
              {({ hovered, pressed }) => (
                <View
                  style={[
                    {
                      alignItems: layout.isCompact ? 'center' : 'flex-start',
                      padding: 28,
                      borderRadius: 20,
                      borderWidth: 1,
                    },
                    {
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
                    className="mb-8 h-16 w-16 items-center justify-center rounded-xl border-l-4"
                    style={{ backgroundColor: hovered ? primary : surfaceContainerHighest, borderLeftColor: primary }}>
                    <MaterialIcons name={step.icon} size={32} color={hovered ? onPrimary : primary} />
                  </View>
                  <Text
                    className="mb-4 font-headline text-2xl font-bold"
                    style={{ color: onSurface, textAlign: layout.isCompact ? 'center' : 'left' }}>
                    {step.title}
                  </Text>
                  <Text
                    style={[
                      { fontFamily: 'Manrope-Regular', fontSize: 18, lineHeight: 28, maxWidth: 360 },
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
