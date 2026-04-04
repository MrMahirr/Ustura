import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, useWindowDimensions, Animated } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Typography } from '@/constants/typography';
import { MaterialIcons } from '@expo/vector-icons';
import { getLandingLayout } from '@/components/landing/layout';

import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import AudienceSwitcher, { type Audience } from '../../components/hizmetler/AudienceSwitcher';
import ServiceCard from '../../components/hizmetler/ServiceCard';
import FeatureShowcase from '../../components/hizmetler/FeatureShowcase';
import Button from '@/components/ui/Button';

/* ─── Data ─── */

const CUSTOMER_SERVICES = [
  { icon: 'store' as const, title: 'Kuaförünü Seç', desc: 'Şehrindeki en kaliteli salonları keşfet ve sana en yakın olanı saniyeler içinde bul.' },
  { icon: 'content-cut' as const, title: 'Berberi Seç', desc: 'Tarzını en iyi yansıtacak usta berberi portfolyolarına bakarak kendin belirle.' },
  { icon: 'calendar-month' as const, title: 'Saatini Belirle', desc: "Berberinin canlı takvimini gör ve sana en uygun boş saati anında rezerve et." },
  { icon: 'done-all' as const, title: 'Anında Onay Al', desc: 'Telefon trafiğine girmeden, randevun için anlık dijital onay bildirimini al.' },
  { icon: 'favorite' as const, title: 'Favori Berberler', desc: 'Sürekli gittiğin ustaları favorilerine ekle, bir sonraki randevunu daha hızlı al.' },
  { icon: 'notifications-active' as const, title: 'Hatırlatmalar', desc: 'Randevu saatin yaklaşırken USTURA seni SMS ve bildirimlerle otomatik uyarır.' },
];

const OWNER_SERVICES = [
  { icon: 'book-online' as const, title: 'Online Randevu Yönetimi', desc: '24/7 randevu alabilen müşterilerinizle ajandanız her an güncel kalsın.' },
  { icon: 'badge' as const, title: 'Personel Takibi', desc: 'Barberlerinizin performansını ve çalışma saatlerini tek panelden yönetin.' },
  { icon: 'payments' as const, title: 'Hizmet & Fiyat Yönetimi', desc: 'Hizmetlerinizi, fiyatlarınızı ve süreleri dilediğiniz an güncelleyin.' },
  { icon: 'groups' as const, title: 'Müşteri Yönetimi', desc: 'Müşteri veritabanınızı oluşturun, tercihleri kaydedin ve sadakati artırın.' },
  { icon: 'monitor' as const, title: 'Raporlama & Analiz', desc: 'Gelirlerinizi ve popüler hizmetlerinizi detaylı grafiklerle takip edin.' },
  { icon: 'sms-failed' as const, title: 'Bildirim Sistemi', desc: 'Randevu iptallerini önlemek için müşterilere otomatik SMS/Hatırlatma gönderin.' },
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

  const handleSwitchAudience = (newAudience: Audience) => {
    if (newAudience === audience) return;
    setAudience(newAudience); // Update switcher immediately
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setDisplayAudience(newAudience); // Change content while invisible
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
        style={[styles.container, { backgroundColor: surface }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Header */}
        <View
          style={[
            styles.heroSection,
            {
              paddingHorizontal: layout.horizontalPadding,
              paddingTop: layout.sectionPaddingVertical + 40,
            },
          ]}
        >
          <View style={[styles.heroInner, { maxWidth: layout.contentMaxWidth }]}>
            <Text style={[styles.heroTitle, { color: onSurface }]}>Hizmetlerimiz</Text>
            <Text style={[styles.heroDescription, { color: onSurfaceVariant }]}>
              USTURA ile hem müşteriler hem de kuaförler için güçlü bir deneyim.
            </Text>
          </View>
        </View>

        {/* Audience Switcher */}
        <AudienceSwitcher active={audience} onSwitch={handleSwitchAudience} />

        {/* Fading Content */}
        <Animated.View style={{ opacity: fadeAnim }}>
          {/* Section Header */}
          <View
            style={[
              styles.sectionHeader,
              {
                paddingHorizontal: layout.horizontalPadding,
                flexDirection: layout.isDesktop ? 'row' : 'column',
                alignItems: layout.isDesktop ? 'flex-end' : 'flex-start',
              },
            ]}
          >
            <View style={[styles.sectionHeaderInner, { maxWidth: layout.contentMaxWidth }]}>
              <Text style={[styles.sectionTitle, { color: onSurface }]}>
                {isCustomer ? 'Randevu Almanın En Kolay Yolu' : 'Salonunu Dijitale Taşı'}
              </Text>
              <View style={styles.tagRow}>
                {isCustomer ? (
                  <>
                    <View style={[styles.tag, { backgroundColor: surfaceContainerLow }]}>
                      <MaterialIcons name="verified" size={16} color={primary} />
                      <Text style={[styles.tagText, { color: onSurfaceVariant }]}>Bekleme yok</Text>
                    </View>
                    <View style={[styles.tag, { backgroundColor: surfaceContainerLow }]}>
                      <MaterialIcons name="schedule" size={16} color={primary} />
                      <Text style={[styles.tagText, { color: onSurfaceVariant }]}>Anında rezervasyon</Text>
                    </View>
                  </>
                ) : (
                  <>
                    <View style={[styles.tag, { backgroundColor: surfaceContainerLow }]}>
                      <Text style={[styles.tagText, { color: onSurfaceVariant }]}>Daha fazla müşteri</Text>
                    </View>
                    <View style={[styles.tag, { backgroundColor: surfaceContainerLow }]}>
                      <Text style={[styles.tagText, { color: onSurfaceVariant }]}>Zaman yönetimi</Text>
                    </View>
                  </>
                )}
              </View>
            </View>
          </View>

          {/* Service Cards Grid */}
          <View
            style={[
              styles.gridContainer,
              { paddingHorizontal: layout.horizontalPadding },
            ]}
          >
            <View
              style={[
                styles.grid,
                { maxWidth: layout.contentMaxWidth },
              ]}
            >
              {services.map((svc, index) => (
                <View
                  key={`${displayAudience}-${index}`}
                  style={[
                    styles.gridItem,
                    {
                      width: cols === 1 ? '100%' : cols === 2 ? '48%' : '31.33%',
                    },
                  ]}
                >
                  <ServiceCard icon={svc.icon} title={svc.title} description={svc.desc} />
                </View>
              ))}
            </View>
          </View>

          {/* CTA Section */}
          <View style={styles.ctaSection}>
            <Button
              title={isCustomer ? 'Hemen Randevu Al' : 'Salonunu Kaydet'}
              variant={isCustomer ? 'primary' : 'outline'}
              style={{ paddingHorizontal: 48, paddingVertical: 20 }}
            />
            <View style={styles.ctaNote}>
              <MaterialIcons
                name={isCustomer ? 'reviews' : 'rocket'}
                size={16}
                color={primary}
              />
              <Text style={[styles.ctaNoteText, { color: onSurfaceVariant }]}>
                {isCustomer
                  ? 'Gerçek kullanıcı yorumları ile güvenle seçin'
                  : 'Kolay kullanım ve hızlı kurulum desteği'}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Feature Showcase */}
        <FeatureShowcase />

        {/* Footer */}
        <Footer />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  heroSection: {
    paddingBottom: 64,
  },
  heroInner: {
    width: '100%',
    alignSelf: 'center',
  },
  heroTitle: {
    ...Typography.displayLg,
    fontSize: 56,
    letterSpacing: -0.5,
    marginBottom: 16,
  },
  heroDescription: {
    ...Typography.titleLg,
    fontFamily: 'Manrope-Regular',
    fontSize: 20,
    maxWidth: 640,
  },
  sectionHeader: {
    justifyContent: 'space-between',
    gap: 24,
    marginBottom: 48,
  },
  sectionHeaderInner: {
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: 24,
  },
  sectionTitle: {
    ...Typography.displayMd,
    flex: 1,
    minWidth: 280,
  },
  tagRow: {
    flexDirection: 'row',
    gap: 16,
    flexWrap: 'wrap',
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
  },
  tagText: {
    ...Typography.labelMd,
    fontFamily: 'Manrope-Bold',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  gridContainer: {
    marginBottom: 80,
  },
  grid: {
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
  },
  gridItem: {
    marginBottom: 0,
  },
  ctaSection: {
    alignItems: 'center',
    marginBottom: 80,
    gap: 24,
  },
  ctaNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ctaNoteText: {
    ...Typography.labelMd,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
});
