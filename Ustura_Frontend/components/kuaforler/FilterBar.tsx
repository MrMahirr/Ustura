import React, { useState } from 'react';
import { View, Text, useWindowDimensions, Pressable, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import { useThemeColor } from '@/hooks/use-theme-color';
import { hexToRgba } from '@/utils/color';

export default function FilterBar() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const primary = useThemeColor({}, 'primary');
  const onSurface = useThemeColor({}, 'onSurface');
  const onSurfaceVariant = useThemeColor({}, 'onSurfaceVariant');
  const surface = useThemeColor({}, 'surface');
  const outlineVariant = useThemeColor({}, 'outlineVariant');

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCity, setActiveCity] = useState('Tumu');

  const cities = ['Tumu', 'Istanbul', 'Ankara', 'Izmir'];

  return (
    <View className="my-12 w-full gap-6">
      <View
        className="justify-between gap-6"
        style={{ flexDirection: isDesktop ? 'row' : 'column', alignItems: isDesktop ? 'flex-end' : 'flex-start' }}>
        <View className="gap-2">
          <Text className="font-label text-base uppercase tracking-[2px]" style={{ color: primary }}>
            KESFET
          </Text>
          <Text className="font-headline text-5xl font-bold" style={{ color: onSurface }}>
            Kuaforler
          </Text>
        </View>

        <View className="self-stretch" style={{ width: isDesktop ? 384 : '100%' }}>
          <Input
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Salon veya hizmet ara..."
            iconLeft="search"
            containerStyle={{ marginTop: 0, borderBottomWidth: 2 }}
          />
        </View>
      </View>

      <View
        className="w-full justify-between py-4"
        style={{ flexDirection: isDesktop ? 'row' : 'column', alignItems: isDesktop ? 'center' : 'flex-start' }}>
        <View className="flex-row flex-wrap gap-3">
          {cities.map((city) => (
            <Badge key={city} label={city} isActive={activeCity === city} onPress={() => setActiveCity(city)} />
          ))}
        </View>

        <View className="flex-row items-center gap-4" style={{ marginTop: isDesktop ? 0 : 24 }}>
          <Text className="font-label text-base uppercase tracking-[1.2px]" style={{ color: onSurfaceVariant }}>
            SIRALAMA:
          </Text>
          <Pressable
            style={({ hovered, pressed }) => [
              {
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
                borderWidth: 1,
                borderRadius: 999,
                paddingHorizontal: 14,
                paddingVertical: 10,
                backgroundColor: hovered || pressed ? hexToRgba(primary, 0.08) : surface,
                borderColor: hovered || pressed ? hexToRgba(primary, 0.28) : outlineVariant,
              },
              Platform.OS === 'web'
                ? ({ transition: 'background-color 220ms ease, border-color 220ms ease' } as any)
                : null,
            ]}>
            <Text className="font-body text-base font-bold" style={{ color: primary }}>
              Puana Gore
            </Text>
            <MaterialIcons name="expand-more" size={20} color={primary} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}
