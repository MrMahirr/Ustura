import React from 'react';
import { View, Text, useWindowDimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import Button from '@/components/ui/Button';
import { getLandingLayout } from '@/components/landing/layout';
import { useThemeColor } from '@/hooks/use-theme-color';

interface FeatureItem {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
}

const FEATURES: FeatureItem[] = [
  { icon: 'event-busy', label: 'Beklemeden randevu' },
  { icon: 'content-cut', label: 'Istedigin berberi sec' },
  { icon: 'schedule', label: 'Zamanini kontrol et' },
  { icon: 'bolt', label: 'Kolay ve hizli kullanim' },
];

export default function AboutContent() {
  const { width } = useWindowDimensions();
  const layout = getLandingLayout(width);

  const primaryContainer = useThemeColor({}, 'primaryContainer');
  const primary = useThemeColor({}, 'primary');
  const onSurface = useThemeColor({}, 'onSurface');
  const onSurfaceVariant = useThemeColor({}, 'onSurfaceVariant');
  const outlineVariant = useThemeColor({}, 'outlineVariant');

  return (
    <View className="max-w-[880px] gap-3">
      <Text className="mb-1 font-label text-base uppercase tracking-[3px]" style={{ color: primaryContainer }}>
        Hakkimizda
      </Text>

      <Text className="mb-3 font-headline text-5xl font-bold tracking-tight" style={{ color: onSurface, lineHeight: 56 }}>
        Zamanini Degerli Kilan Bir Deneyim
      </Text>

      <View className="mb-2 gap-6">
        <Text className="font-body text-lg" style={{ color: onSurfaceVariant, lineHeight: 28 }}>
          Gunun en degerli varligi zaman, ancak klasik berber deneyimi cogu zaman saatlerce suren bekleme salonu sessizligiyle caliniyor.{' '}
          <Text style={{ color: onSurface, fontFamily: 'Manrope-Bold' }}>USTURA</Text>, bu geleneksel kaosu ortadan kaldirmak icin dogdu.
        </Text>
        <Text className="font-body text-lg" style={{ color: onSurfaceVariant, lineHeight: 28 }}>
          Modern erkegin ritmine ayak uyduran dijital cozumumuzle, koltuga ne zaman oturacaginizi siz secersiniz. Bekleme salonlarini degil, yasamin kendisini merkeze alan bir yaklasim sunuyoruz.
        </Text>
      </View>

      <View className="my-4 flex-row flex-wrap gap-6 border-y py-8" style={{ borderColor: `${outlineVariant}26` }}>
        {FEATURES.map((feature, index) => (
          <View
            key={feature.label}
            className="flex-row items-center gap-4"
            style={{ width: layout.isDesktop ? '45%' : '100%' }}>
            <MaterialIcons name={feature.icon} size={22} color={primary} />
            <Text className="font-body text-base font-bold uppercase tracking-[0.5px]" style={{ color: onSurface }}>
              {feature.label}
            </Text>
          </View>
        ))}
      </View>

      <View className="gap-6 pt-4" style={{ flexDirection: layout.isTablet ? 'row' : 'column' }}>
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
