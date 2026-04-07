import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { Platform, Pressable, Text, View } from 'react-native';

import type { ActiveSalon } from '@/components/panel/super-admin/data';
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
    <View className="min-h-[380px] rounded-sm p-7" style={{ backgroundColor: adminTheme.cardBackground }}>
      <Text className="mb-6 font-headline text-xl" style={{ color: adminTheme.onSurface }}>
        En Aktif Salonlar
      </Text>

      <View className="flex-1">
        {salons.length === 0 ? (
          <Text className="py-3 font-body text-sm" style={{ color: adminTheme.onSurfaceVariant }}>
            Arama ile eslesen salon bulunamadi.
          </Text>
        ) : (
          salons.map((salon, index) => (
            <View
              key={salon.id}
              style={[
                { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12, paddingVertical: 18, borderBottomWidth: 1 },
                {
                  borderBottomColor: index === salons.length - 1 ? 'transparent' : adminTheme.borderSubtle,
                },
              ]}>
              <View className="flex-1 flex-row items-center gap-3">
                {salon.imageUrl ? (
                  <Image
                    source={{ uri: salon.imageUrl }}
                    style={[{ width: 40, height: 40, borderRadius: 4 }, imageWebStyle]}
                    contentFit="cover"
                  />
                ) : (
                  <View className="h-10 w-10 items-center justify-center rounded-sm" style={{ backgroundColor: hexToRgba(adminTheme.primary, 0.12) }}>
                    <Text className="font-label text-base font-bold" style={{ color: adminTheme.primary }}>
                      {initials(salon.name)}
                    </Text>
                  </View>
                )}
                <View className="flex-1 gap-1">
                  <Text className="font-body text-sm font-bold" style={{ color: adminTheme.onSurface }}>
                    {salon.name}
                  </Text>
                  <Text className="font-label text-[10px] uppercase tracking-wide" style={{ color: adminTheme.onSurfaceVariant }}>
                    {salon.appointments}
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center gap-1">
                <MaterialIcons name="star" size={14} color={adminTheme.primary} />
                <Text className="font-body text-xs font-bold" style={{ color: adminTheme.primary }}>
                  {salon.rating}
                </Text>
              </View>
            </View>
          ))
        )}
      </View>

      <Pressable
        className="mt-6 items-center justify-center rounded-sm border py-[14px]"
        style={({ hovered }) => [
          {
            borderColor: hovered ? adminTheme.borderStrong : adminTheme.borderSubtle,
          },
          Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null,
        ]}>
        <Text className="font-label text-[10px] uppercase tracking-wide" style={{ color: adminTheme.onSurfaceVariant }}>
          Tum Salonlari Gor
        </Text>
      </Pressable>
    </View>
  );
}
