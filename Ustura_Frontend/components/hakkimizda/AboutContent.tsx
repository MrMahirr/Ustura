import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Typography } from '@/constants/typography';
import { MaterialIcons } from '@expo/vector-icons';
import { getLandingLayout } from '@/components/landing/layout';
import Button from '@/components/ui/Button';

interface FeatureItem {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
}

const FEATURES: FeatureItem[] = [
  { icon: 'event-busy', label: 'Beklemeden randevu' },
  { icon: 'content-cut', label: 'İstediğin berberi seç' },
  { icon: 'schedule', label: 'Zamanını kontrol et' },
  { icon: 'bolt', label: 'Kolay ve hızlı kullanım' },
];

export default function AboutContent() {
  const { width } = useWindowDimensions();
  const layout = getLandingLayout(width);

  const primary = useThemeColor({}, 'primary');
  const primaryContainer = useThemeColor({}, 'primaryContainer');
  const onSurface = useThemeColor({}, 'onSurface');
  const onSurfaceVariant = useThemeColor({}, 'onSurfaceVariant');
  const outlineVariant = useThemeColor({}, 'outlineVariant');

  return (
    <View style={styles.container}>
      {/* Pre-label */}
      <Text style={[styles.preLabel, { color: primaryContainer }]}>Hakkımızda</Text>

      {/* Headline */}
      <Text style={[styles.headline, { color: onSurface }]}>
        Zamanını Değerli Kılan Bir Deneyim
      </Text>

      {/* Body paragraphs */}
      <View style={styles.bodySection}>
        <Text style={[styles.bodyText, { color: onSurfaceVariant }]}>
          Günün en değerli varlığı zaman, ancak klasik berber deneyimi çoğu zaman saatlerce süren bekleme salonu sessizliğiyle çalınıyor.{' '}
          <Text style={{ color: onSurface, fontFamily: 'Manrope-Bold' }}>USTURA</Text>, bu geleneksel kaosu ortadan kaldırmak için doğdu.
        </Text>
        <Text style={[styles.bodyText, { color: onSurfaceVariant }]}>
          Modern erkeğin ritmine ayak uyduran dijital çözümümüzle, koltuğa ne zaman oturacağınızı siz seçersiniz. Bekleme salonlarını değil, yaşamın kendisini merkeze alan bir yaklaşım sunuyoruz.
        </Text>
      </View>

      {/* Feature List */}
      <View style={[styles.featureGrid, { borderColor: `${outlineVariant}26` }]}>
        {FEATURES.map((feat, i) => (
          <View key={i} style={[styles.featureItem, { width: layout.isDesktop ? '45%' : '100%' }]}>
            <MaterialIcons name={feat.icon} size={22} color={primary} />
            <Text style={[styles.featureLabel, { color: onSurface }]}>{feat.label}</Text>
          </View>
        ))}
      </View>

      {/* CTAs */}
      <View style={[styles.ctaRow, { flexDirection: layout.isTablet ? 'row' : 'column' }]}>
        <Button
          title="Hemen Randevu Al"
          style={{ flex: layout.isTablet ? undefined : 1, width: layout.isTablet ? undefined : '100%' }}
        />
        <Button
          title="Salonunu Kaydet"
          variant="outline"
          style={{ flex: layout.isTablet ? undefined : 1, width: layout.isTablet ? undefined : '100%' }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: 880,
    gap: 12,
  },
  preLabel: {
    ...Typography.labelLg,
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  headline: {
    ...Typography.displayLg,
    fontSize: 48,
    lineHeight: 56,
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  bodySection: {
    gap: 24,
    marginBottom: 8,
  },
  bodyText: {
    ...Typography.bodyLg,
    fontSize: 18,
    lineHeight: 28,
    fontFamily: 'Manrope-Regular',
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
    paddingVertical: 32,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    marginVertical: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  featureLabel: {
    ...Typography.bodyMd,
    fontFamily: 'Manrope-Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  ctaRow: {
    gap: 24,
    paddingTop: 16,
  },
});
