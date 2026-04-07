import React from 'react';
import { Platform, ScrollView, Text, View, useWindowDimensions } from 'react-native';

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
  const paddingHorizontal = width < 768 ? 16 : 32;

  const filtered = recentAppointments.filter((appointment) =>
    matchesQuery(query, [appointment.salon, appointment.user, appointment.barber, appointment.time, appointment.status]),
  );

  return (
    <View className="relative flex-1 overflow-hidden" style={{ backgroundColor: neutral }}>
      <View
        className="absolute inset-0"
        pointerEvents="none"
        style={
          Platform.OS === 'web'
            ? ({
                opacity: 1,
                backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(230, 195, 100, 0.05) 1px, transparent 0)',
                backgroundSize: '40px 40px',
              } as any)
            : { opacity: 0 }
        }
      />

      <PanelTopBar query={query} onQueryChange={setQuery} />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal, paddingTop: 24, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}>
        <View className="w-full max-w-[1600px] self-center gap-7">
          <View className="max-w-[720px] gap-2.5">
            <Text className="font-headline text-[34px] font-bold tracking-tight" style={{ color: onSurface }}>
              Randevu Yonetimi
            </Text>
            <Text style={[Typography.bodyLg, { color: onSurfaceVariant, fontWeight: '300' }]}>
              Tum platform randevularinin ozeti. Takvim ve durum aksiyonlari API baglantisi ile genisletilecek.
            </Text>
          </View>

          <ReservationTable rows={filtered} title="Randevu Listesi" />
        </View>
      </ScrollView>
    </View>
  );
}
