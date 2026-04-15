import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Platform, Pressable, Text, View, useWindowDimensions } from 'react-native';

import { useBarberAdminTheme } from '@/components/panel/barber-admin/theme';
import { hexToRgba } from '@/utils/color';

interface StaffPageHeaderProps {
  salonName?: string;
  totalCount: number;
  onRefresh: () => void;
  onCreate: () => void;
}

export default function StaffPageHeader({
  salonName,
  totalCount,
  onRefresh,
  onCreate,
}: StaffPageHeaderProps) {
  const { width } = useWindowDimensions();
  const theme = useBarberAdminTheme();
  const isMobile = width < 768;

  return (
    <View
      style={{
        gap: 14,
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'flex-start' : 'flex-end',
        justifyContent: 'space-between',
      }}>
      <View className="gap-2">
        <View
          className="self-start rounded-full border px-3 py-1.5"
          style={{
            borderColor: hexToRgba(theme.primary, 0.22),
            backgroundColor: hexToRgba(theme.primary, 0.08),
          }}>
          <Text
            style={{
              color: theme.primary,
              fontFamily: 'Manrope-Bold',
              fontSize: 10,
              textTransform: 'uppercase',
              letterSpacing: 1.8,
            }}>
            Personel Orkestrasyonu
          </Text>
        </View>

        <View className="gap-1">
          <Text
            style={{
              color: theme.onSurface,
              fontFamily: 'Manrope-Bold',
              fontSize: isMobile ? 24 : 30,
              letterSpacing: -0.5,
            }}>
            Ekip erisimi ve rol dagilimi
          </Text>
          <Text
            style={{
              color: hexToRgba(theme.onSurfaceVariant, 0.72),
              fontSize: 14,
              lineHeight: 22,
              maxWidth: 760,
            }}>
            {`${salonName ?? 'Salonunuz'} icin aktif ekip rollerini yonetin, yeni personel erisimi verin ve operasyon akisina uygun dagilimi koruyun.`}
          </Text>
        </View>

        <Text
          style={{
            color: hexToRgba(theme.onSurfaceVariant, 0.58),
            fontFamily: 'Manrope-SemiBold',
            fontSize: 12,
            textTransform: 'uppercase',
            letterSpacing: 1.5,
          }}>
          {`${totalCount} aktif ekip uyesi`}
        </Text>
      </View>

      <View
        style={{
          flexDirection: isMobile ? 'column' : 'row',
          width: isMobile ? '100%' : undefined,
          gap: 10,
        }}>
        <Pressable
          onPress={onRefresh}
          className="min-h-[46px] flex-row items-center justify-center gap-2 rounded-xl border px-4 py-3"
          style={({ hovered }) => [
            {
              borderColor: theme.borderSubtle,
              backgroundColor: hovered ? hexToRgba(theme.primary, 0.04) : theme.cardBackground,
            },
            Platform.OS === 'web'
              ? ({
                  cursor: 'pointer',
                  transition: 'background-color 180ms ease, border-color 180ms ease',
                } as any)
              : null,
          ]}>
          <MaterialIcons name="refresh" size={18} color={theme.primary} />
          <Text
            style={{
              color: theme.primary,
              fontFamily: 'Manrope-Bold',
              fontSize: 13,
            }}>
            Yenile
          </Text>
        </Pressable>

        <Pressable
          onPress={onCreate}
          className="min-h-[46px] flex-row items-center justify-center gap-2 overflow-hidden rounded-xl px-5 py-3"
          style={({ hovered }) => [
            {
              minWidth: isMobile ? '100%' : 220,
              borderWidth: 1,
              borderColor: hovered ? hexToRgba('#FFFFFF', 0.2) : hexToRgba(theme.primary, 0.18),
            },
            Platform.OS === 'web'
              ? ({
                  cursor: 'pointer',
                  transition: 'transform 180ms ease, box-shadow 220ms ease, border-color 180ms ease',
                  boxShadow: hovered
                    ? `0 18px 34px ${hexToRgba(theme.primary, 0.28)}`
                    : `0 12px 24px ${hexToRgba(theme.primary, 0.18)}`,
                } as any)
              : {
                  shadowColor: theme.primary,
                  shadowOpacity: hovered ? 0.24 : 0.16,
                  shadowRadius: hovered ? 16 : 12,
                  shadowOffset: { width: 0, height: hovered ? 8 : 6 },
                  elevation: hovered ? 8 : 5,
                },
            { transform: [{ translateY: hovered ? -1 : 0 }, { scale: hovered ? 1.01 : 1 }] },
          ]}>
          <LinearGradient
            colors={[theme.goldGradient[0], theme.goldGradient[1]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
            }}
          />
          <View
            pointerEvents="none"
            className="absolute inset-0"
            style={{
              backgroundColor: hexToRgba('#FFFFFF', 0.04),
            }}
          />
          <MaterialIcons name="person-add-alt-1" size={18} color={theme.onPrimary} />
          <Text
            style={{
              color: theme.onPrimary,
              fontFamily: 'Manrope-Bold',
              fontSize: 13,
              letterSpacing: 0.2,
            }}>
            Personel yetkisi ver
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
