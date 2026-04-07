import React, { useState } from 'react';
import { ScrollView, View, Text, useWindowDimensions, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import AudienceSwitcher, { type Audience } from '@/components/hizmetler/AudienceSwitcher';
import FeatureShowcase from '@/components/hizmetler/FeatureShowcase';
import ServiceCard from '@/components/hizmetler/ServiceCard';
import Button from '@/components/ui/Button';
import { getLandingLayout } from '@/components/landing/layout';
import { useThemeColor } from '@/hooks/use-theme-color';

const CUSTOMER_SERVICES = [
  { icon: 'store' as const, title: 'Kuaforunu Sec', desc: 'Sehrindeki kaliteli salonlari kesfet ve sana en yakin olani saniyeler icinde bul.' },
  { icon: 'content-cut' as const, title: 'Berberi Sec', desc: 'Tarzini en iyi yansitacak usta berberi portfolyolarina bakarak belirle.' },
  { icon: 'calendar-month' as const, title: 'Saatini Belirle', desc: 'Berberinin canli takvimini gor ve sana en uygun bos saati aninda rezerve et.' },
  { icon: 'done-all' as const, title: 'Aninda Onay Al', desc: 'Telefon trafigine girmeden randevun icin dijital onay bildirimini al.' },
  { icon: 'favorite' as const, title: 'Favori Berberler', desc: 'Sik gittigin ustalari favorilerine ekle, sonraki randevunu daha hizli al.' },
  { icon: 'notifications-active' as const, title: 'Hatirlatmalar', desc: 'Randevu saatin yaklasirken USTURA seni SMS ve bildirimlerle otomatik uyarir.' },
];

const OWNER_SERVICES = [
  { icon: 'book-online' as const, title: 'Online Randevu Yonetimi', desc: '24/7 randevu alabilen musterilerinizle ajandaniz her an guncel kalsin.' },
  { icon: 'badge' as const, title: 'Personel Takibi', desc: 'Barberlerinizin performansini ve calisma saatlerini tek panelden yonetin.' },
  { icon: 'payments' as const, title: 'Hizmet ve Fiyat Yonetimi', desc: 'Hizmetlerinizi, fiyatlarinizi ve sureleri dilediginiz an guncelleyin.' },
  { icon: 'groups' as const, title: 'Musteri Yonetimi', desc: 'Musteri veritabaninizi olusturun, tercihleri kaydedin ve sadakati artirin.' },
  { icon: 'monitor' as const, title: 'Raporlama ve Analiz', desc: 'Gelirlerinizi ve populer hizmetlerinizi detayli grafiklerle takip edin.' },
  { icon: 'sms-failed' as const, title: 'Bildirim Sistemi', desc: 'Randevu iptallerini azaltmak icin musterilere otomatik SMS ve hatirlatma gonderin.' },
];

export default function HizmetlerPage() {
  const surface = useThemeColor({}, 'surface');
  const primary = useThemeColor({}, 'primary');
  const onSurface = useThemeColor({}, 'onSurface');
  const onSurfaceVariant = useThemeColor({}, 'onSurfaceVariant');
  const surfaceContainerLow = useThemeColor({}, 'surfaceContainerLow');

  const { width } = useWindowDimensions();
  const layout = getLandingLayout(width);
  const cols = layout.isDesktop ? 3 : layout.isTablet ? 2 : 1;

  const [audience, setAudience] = useState<Audience>('customers');
  const [displayAudience, setDisplayAudience] = useState<Audience>('customers');
  const fadeAnim = React.useRef(new Animated.Value(1)).current;

  const handleSwitchAudience = (nextAudience: Audience) => {
    if (nextAudience === audience) {
      return;
    }

    setAudience(nextAudience);
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setDisplayAudience(nextAudience);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start();
    });
  };

  const services = displayAudience === 'customers' ? CUSTOMER_SERVICES : OWNER_SERVICES;
  const isCustomer = displayAudience === 'customers';

  return (
    <>
      <Navbar />
      <ScrollView
        className="flex-1"
        style={{ backgroundColor: surface }}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}>
        <View
          className="pb-16"
          style={{
            paddingHorizontal: layout.horizontalPadding,
            paddingTop: layout.sectionPaddingVertical + 40,
          }}>
          <View className="w-full self-center" style={{ maxWidth: layout.contentMaxWidth }}>
            <Text className="mb-4 font-headline text-[56px] font-bold tracking-tight" style={{ color: onSurface }}>
              Hizmetlerimiz
            </Text>
            <Text className="max-w-[640px] font-body text-xl" style={{ color: onSurfaceVariant }}>
              USTURA ile hem musteriler hem de kuaforler icin guclu bir deneyim.
            </Text>
          </View>
        </View>

        <AudienceSwitcher active={audience} onSwitch={handleSwitchAudience} />

        <Animated.View style={{ opacity: fadeAnim }}>
          <View
            className="mb-12 justify-between gap-6"
            style={{
              paddingHorizontal: layout.horizontalPadding,
              flexDirection: layout.isDesktop ? 'row' : 'column',
              alignItems: layout.isDesktop ? 'flex-end' : 'flex-start',
            }}>
            <View
              className="w-full self-center flex-row flex-wrap items-end justify-between gap-6"
              style={{ maxWidth: layout.contentMaxWidth }}>
              <Text className="min-w-[280px] flex-1 font-headline text-5xl font-bold" style={{ color: onSurface }}>
                {isCustomer ? 'Randevu Almanin En Kolay Yolu' : 'Salonunu Dijitale Tasi'}
              </Text>
              <View className="flex-row flex-wrap gap-4">
                {isCustomer ? (
                  <>
                    <View className="flex-row items-center gap-2 rounded-full px-4 py-2" style={{ backgroundColor: surfaceContainerLow }}>
                      <MaterialIcons name="verified" size={16} color={primary} />
                      <Text className="font-label text-sm uppercase tracking-[1.5px]" style={{ color: onSurfaceVariant }}>
                        Bekleme yok
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-2 rounded-full px-4 py-2" style={{ backgroundColor: surfaceContainerLow }}>
                      <MaterialIcons name="schedule" size={16} color={primary} />
                      <Text className="font-label text-sm uppercase tracking-[1.5px]" style={{ color: onSurfaceVariant }}>
                        Aninda rezervasyon
                      </Text>
                    </View>
                  </>
                ) : (
                  <>
                    <View className="rounded-full px-4 py-2" style={{ backgroundColor: surfaceContainerLow }}>
                      <Text className="font-label text-sm uppercase tracking-[1.5px]" style={{ color: onSurfaceVariant }}>
                        Daha fazla musteri
                      </Text>
                    </View>
                    <View className="rounded-full px-4 py-2" style={{ backgroundColor: surfaceContainerLow }}>
                      <Text className="font-label text-sm uppercase tracking-[1.5px]" style={{ color: onSurfaceVariant }}>
                        Zaman yonetimi
                      </Text>
                    </View>
                  </>
                )}
              </View>
            </View>
          </View>

          <View className="mb-20" style={{ paddingHorizontal: layout.horizontalPadding }}>
            <View className="w-full self-center flex-row flex-wrap gap-6" style={{ maxWidth: layout.contentMaxWidth }}>
              {services.map((service, index) => (
                <View
                  key={`${displayAudience}-${index}`}
                  style={{ width: cols === 1 ? '100%' : cols === 2 ? '48%' : '31.33%' }}>
                  <ServiceCard icon={service.icon} title={service.title} description={service.desc} />
                </View>
              ))}
            </View>
          </View>

          <View className="mb-20 items-center gap-6">
            <Button
              title={isCustomer ? 'Hemen Randevu Al' : 'Salonunu Kaydet'}
              variant={isCustomer ? 'primary' : 'outline'}
              style={{ paddingHorizontal: 48, paddingVertical: 20 }}
            />
            <View className="flex-row items-center gap-2">
              <MaterialIcons name={isCustomer ? 'reviews' : 'rocket'} size={16} color={primary} />
              <Text className="font-label text-sm uppercase tracking-[1.5px]" style={{ color: onSurfaceVariant }}>
                {isCustomer ? 'Gercek kullanici yorumlari ile guvenle secin' : 'Kolay kullanim ve hizli kurulum destegi'}
              </Text>
            </View>
          </View>
        </Animated.View>

        <FeatureShowcase />
        <Footer />
      </ScrollView>
    </>
  );
}
