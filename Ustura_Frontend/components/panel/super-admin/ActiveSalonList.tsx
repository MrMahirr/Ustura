import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import type { ActiveSalon } from '@/components/panel/super-admin/data';
import { Typography } from '@/constants/typography';
import { hexToRgba } from '@/utils/color';

import { useSuperAdminTheme } from './theme';

function initials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

export default function ActiveSalonList({ salons }: { salons: ActiveSalon[] }) {
  const adminTheme = useSuperAdminTheme();

  const imageWebStyle = Platform.OS === 'web' ? ({ filter: 'grayscale(1)' } as any) : {};

  return (
    <View style={[styles.card, { backgroundColor: adminTheme.cardBackground }]}>
      <Text style={[styles.title, { color: adminTheme.onSurface }]}>En Aktif Salonlar</Text>

      <View style={styles.list}>
        {salons.length === 0 ? (
          <Text style={[styles.empty, { color: adminTheme.onSurfaceVariant }]}>
            Arama ile eslesen salon bulunamadi.
          </Text>
        ) : (
          salons.map((salon, index) => (
            <View
              key={salon.id}
              style={[
                styles.row,
                {
                  borderBottomColor: index === salons.length - 1 ? 'transparent' : adminTheme.borderSubtle,
                },
              ]}>
              <View style={styles.identity}>
                {salon.imageUrl ? (
                  <Image
                    source={{ uri: salon.imageUrl }}
                    style={[styles.logoImg, imageWebStyle]}
                    contentFit="cover"
                  />
                ) : (
                  <View style={[styles.logo, { backgroundColor: hexToRgba(adminTheme.primary, 0.12) }]}>
                    <Text style={[styles.logoText, { color: adminTheme.primary }]}>{initials(salon.name)}</Text>
                  </View>
                )}
                <View style={styles.meta}>
                  <Text style={[styles.name, { color: adminTheme.onSurface }]}>{salon.name}</Text>
                  <Text style={[styles.appointments, { color: adminTheme.onSurfaceVariant }]}>{salon.appointments}</Text>
                </View>
              </View>

              <View style={styles.ratingWrap}>
                <MaterialIcons name="star" size={14} color={adminTheme.primary} />
                <Text style={[styles.rating, { color: adminTheme.primary }]}>{salon.rating}</Text>
              </View>
            </View>
          ))
        )}
      </View>

      <Pressable
        style={({ hovered }) => [
          styles.footerButton,
          { borderColor: hovered ? adminTheme.borderStrong : adminTheme.borderSubtle },
        ]}>
        <Text style={[styles.footerLabel, { color: adminTheme.onSurfaceVariant }]}>Tum Salonlari Gor</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 4,
    padding: 28,
    minHeight: 380,
  },
  title: {
    fontFamily: 'NotoSerif-Bold',
    fontSize: 20,
    marginBottom: 24,
  },
  list: {
    gap: 0,
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 18,
    borderBottomWidth: 1,
  },
  identity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImg: {
    width: 40,
    height: 40,
    borderRadius: 4,
  },
  logoText: {
    ...Typography.labelLg,
    fontFamily: 'Manrope-Bold',
  },
  meta: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: 14,
    fontFamily: 'Manrope-Bold',
  },
  appointments: {
    ...Typography.labelSm,
    fontSize: 10,
  },
  ratingWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 12,
    fontFamily: 'Manrope-Bold',
  },
  footerButton: {
    marginTop: 24,
    paddingVertical: 14,
    borderWidth: 1,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : {}),
  },
  footerLabel: {
    ...Typography.labelMd,
    fontSize: 10,
    fontFamily: 'Manrope-Bold',
  },
  empty: {
    ...Typography.bodyMd,
    paddingVertical: 12,
  },
});
