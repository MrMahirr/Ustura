import React from 'react';
import { Text, View } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';
import { hexToRgba } from '@/utils/color';

import type { StorefrontTeamItem } from './presentation';
import StorefrontSection from './StorefrontSection';
import StorefrontTeamCard from './StorefrontTeamCard';

interface StorefrontTeamProps {
  team: StorefrontTeamItem[];
  isDesktop: boolean;
}

export default function StorefrontTeam({
  team,
  isDesktop,
}: StorefrontTeamProps) {
  const surface = useThemeColor({}, 'surface');
  const onSurface = useThemeColor({}, 'onSurface');
  const onSurfaceVariant = useThemeColor({}, 'onSurfaceVariant');
  const primary = useThemeColor({}, 'primary');
  const activeMembers = team.filter((member) => member.roleKey !== 'placeholder');
  const barberCount = activeMembers.filter((member) => member.roleKey === 'barber').length;
  const receptionistCount = activeMembers.filter(
    (member) => member.roleKey === 'receptionist',
  ).length;

  const summaryItems =
    activeMembers.length > 0
      ? [
          { id: 'active', label: 'Aktif personel', value: String(activeMembers.length) },
          { id: 'barber', label: 'Berber', value: String(barberCount) },
          { id: 'reception', label: 'Karsilama', value: String(receptionistCount) },
        ]
      : [{ id: 'pending', label: 'Durum', value: 'Yayin bekliyor' }];

  return (
    <StorefrontSection
      eyebrow="Personeller"
      title="Salonun aktif yuzleri"
      description="Bu alanda salonun yayinda olan personelleri gorunur. Kullanici isim, rol ve uzmanlik notlarini tek bakista okuyup randevu kararini daha hizli verir.">
      <View
        style={{
          flexDirection: isDesktop ? 'row' : 'column',
          gap: 12,
          marginBottom: 16,
        }}>
        {summaryItems.map((item) => (
          <View
            key={item.id}
            className="rounded-[22px] border px-4 py-4"
            style={{
              flex: isDesktop ? 1 : undefined,
              backgroundColor: surface,
              borderColor: hexToRgba(primary, 0.14),
            }}>
            <Text className="font-label text-[11px] uppercase tracking-[1.8px]" style={{ color: primary }}>
              {item.label}
            </Text>
            <Text
              className="mt-3 font-headline text-[28px] font-bold"
              style={{ color: onSurface }}>
              {item.value}
            </Text>
            <Text className="mt-2 text-sm leading-6" style={{ color: onSurfaceVariant }}>
              {item.id === 'pending'
                ? 'Salon sahibi ekip bilgisini yayinladiginda bu alan otomatik guncellenir.'
                : 'Detay vitrinde gorunen aktif kadro ozeti.'}
            </Text>
          </View>
        ))}
      </View>

      <View
        style={{
          flexDirection: isDesktop ? 'row' : 'column',
          flexWrap: 'wrap',
          gap: 14,
        }}>
        {team.map((member) => (
          <StorefrontTeamCard
            key={member.id}
            member={member}
            isDesktop={isDesktop}
          />
        ))}
      </View>
    </StorefrontSection>
  );
}
