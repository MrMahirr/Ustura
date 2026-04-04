import React from 'react';
import { Platform, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import PanelTopBar from '@/components/panel/super-admin/PanelTopBar';
import ReservationTable from '@/components/panel/ReservationTable';
import { recentAppointments } from '@/components/panel/super-admin/data';
import { Typography } from '@/constants/typography';
import { useThemeColor } from '@/hooks/use-theme-color';
import { matchesQuery } from '@/utils/matches-query';

export default function RandevularPage() {
  const { width } = useWindowDimensions();
  const [query, setQuery] = React.useState('');

  const neutral = useThemeColor({}, 'neutral');
  const onSurface = useThemeColor({}, 'onSurface');
  const onSurfaceVariant = useThemeColor({}, 'onSurfaceVariant');

  const paddingH = width < 768 ? 16 : 32;

  const filtered = recentAppointments.filter((appointment) =>
    matchesQuery(query, [appointment.salon, appointment.user, appointment.barber, appointment.time, appointment.status])
  );

  return (
    <View style={[styles.page, { backgroundColor: neutral }]}>
      <View style={styles.gridOverlay} />

      <PanelTopBar query={query} onQueryChange={setQuery} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingHorizontal: paddingH, paddingTop: 24, paddingBottom: 40 }]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: onSurface }]}>Randevu Yonetimi</Text>
            <Text style={[styles.description, { color: onSurfaceVariant }]}>
              Tum platform randevularinin ozeti. Takvim ve durum aksiyonlari API baglantisi ile genisletilecek.
            </Text>
          </View>

          <ReservationTable rows={filtered} title="Randevu Listesi" />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: Platform.OS === 'web' ? 1 : 0,
    backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(230, 195, 100, 0.05) 1px, transparent 0)',
    backgroundSize: '40px 40px',
    pointerEvents: 'none',
  } as any,
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    width: '100%',
    maxWidth: 1600,
    alignSelf: 'center',
    gap: 28,
  },
  header: {
    gap: 10,
    maxWidth: 720,
  },
  title: {
    fontFamily: 'NotoSerif-Bold',
    fontSize: 34,
    letterSpacing: -0.5,
  },
  description: {
    ...Typography.bodyLg,
    fontWeight: '300',
  },
});
