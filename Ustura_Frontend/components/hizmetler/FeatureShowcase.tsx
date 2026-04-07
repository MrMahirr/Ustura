import React from 'react';
import { View, Text, Image, useWindowDimensions, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { getLandingLayout } from '@/components/landing/layout';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function FeatureShowcase() {
  const { width } = useWindowDimensions();
  const layout = getLandingLayout(width);

  const surfaceContainerLow = useThemeColor({}, 'surfaceContainerLow');
  const surfaceContainerHighest = useThemeColor({}, 'surfaceContainerHighest');
  const onSurface = useThemeColor({}, 'onSurface');
  const onSurfaceVariant = useThemeColor({}, 'onSurfaceVariant');
  const primary = useThemeColor({}, 'primary');

  const checkItems = [
    'Ozel Secilmis Usta Berberler',
    'VIP Hizmet Secenekleri',
    'Odullu Randevu Arayuzu',
  ];

  return (
    <View className="overflow-hidden py-24" style={{ backgroundColor: surfaceContainerLow, paddingHorizontal: layout.horizontalPadding }}>
      <View
        className="w-full self-center items-center gap-20"
        style={{ maxWidth: layout.contentMaxWidth, flexDirection: layout.isDesktop ? 'row' : 'column' }}>
        <View className="relative" style={{ width: layout.isDesktop ? '48%' : '100%' }}>
          <View
            className="absolute left-[-40px] top-[-40px] h-40 w-40 rounded-full opacity-10"
            style={[
              { backgroundColor: primary },
              Platform.OS === 'web' ? ({ filter: 'blur(40px)' } as any) : null,
            ]}
          />
          <Image
            source={{
              uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkWCTeUgr0KcIB1brQYyv0W7cd3htaf9XD4se0NEizx2XCeBX8tzeSn1Hl17wyUbUduMhhxMSc9LFD5E43rZNviK9oXnJcRyEGxSsGSvL9qBV5ZbTQ7aFRjTPL3vlNgxSZwbw-KeykC7QNMnqJRkSalvumnuu7CggOVIHoUN34f_evEVtgyxN64gMIZ_CB9zcDloaZUAqj2pqC2Qf1-aygKVVeQuKjBWXzPeCOSdggWlmzJvEp561lmACpOMMZK30W52xW2nI2Mio',
            }}
            className="w-full rounded-md"
            style={{ aspectRatio: 1.25, opacity: 0.8 }}
            resizeMode="cover"
          />

          {layout.isDesktop && (
            <View className="absolute bottom-[-24px] right-[-24px] z-20 rounded-sm p-6" style={{ backgroundColor: surfaceContainerHighest }}>
              <Text className="font-headline text-[32px] font-bold" style={{ color: primary }}>
                +150
              </Text>
              <Text className="font-label text-sm uppercase tracking-[1.5px]" style={{ color: onSurfaceVariant }}>
                Premium Salon
              </Text>
            </View>
          )}
        </View>

        <View style={{ width: layout.isDesktop ? '48%' : '100%', marginTop: layout.isDesktop ? 0 : 48 }}>
          <Text className="mb-5 font-label text-base uppercase tracking-[3px]" style={{ color: primary }}>
            OBSIDIAN EXCELLENCE
          </Text>
          <Text className="mb-6 font-headline text-5xl font-bold" style={{ color: onSurface, lineHeight: 48 }}>
            Bir Berberden Daha Fazlasi, Bir Deneyim.
          </Text>
          <Text className="mb-8 font-body text-lg" style={{ color: onSurfaceVariant, lineHeight: 28 }}>
            USTURA sadece bir yazilim degil, berberlik sanatini dijital cagin hiziyla birlestiren bir koprudur. En kaliteli kesimlerin ve en profesyonel salonlarin bulusma noktasi.
          </Text>

          <View className="gap-4">
            {checkItems.map((item) => (
              <View key={item} className="flex-row items-center gap-4">
                <MaterialIcons name="check-circle" size={22} color={primary} />
                <Text className="font-body text-lg" style={{ color: onSurface }}>
                  {item}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}
