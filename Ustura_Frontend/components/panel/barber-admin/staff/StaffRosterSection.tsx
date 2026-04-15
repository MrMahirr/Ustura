import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, Text, View, useWindowDimensions } from 'react-native';

import Card from '@/components/ui/Card';
import { useBarberAdminTheme } from '@/components/panel/barber-admin/theme';
import { hexToRgba } from '@/utils/color';

import StaffMemberCard from './StaffMemberCard';
import type { StaffDirectoryItem } from './types';

interface StaffRosterSectionProps {
  items: StaffDirectoryItem[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onEdit: (item: StaffDirectoryItem) => void;
  onDelete: (item: StaffDirectoryItem) => void;
}

export default function StaffRosterSection({
  items,
  loading,
  error,
  onRetry,
  onEdit,
  onDelete,
}: StaffRosterSectionProps) {
  const { width } = useWindowDimensions();
  const theme = useBarberAdminTheme();
  const useSingleColumn = width < 1120;

  if (loading) {
    return (
      <Card
        variant="glass"
        contentStyle={{ alignItems: 'center', justifyContent: 'center', minHeight: 220, gap: 12 }}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text
          style={{
            color: hexToRgba(theme.onSurfaceVariant, 0.66),
            fontSize: 13,
          }}>
          Personel kayitlari getiriliyor...
        </Text>
      </Card>
    );
  }

  if (error && items.length === 0) {
    return (
      <Card
        variant="glass"
        contentStyle={{ alignItems: 'center', justifyContent: 'center', minHeight: 220, gap: 14 }}>
        <MaterialIcons name="error-outline" size={44} color={theme.error} />
        <Text
          style={{
            color: theme.error,
            fontFamily: 'Manrope-Bold',
            fontSize: 15,
            textAlign: 'center',
          }}>
          {error}
        </Text>
        <Pressable
          onPress={onRetry}
          className="rounded-full px-5 py-3"
          style={{ backgroundColor: theme.primary }}>
          <Text
            style={{
              color: theme.onPrimary,
              fontFamily: 'Manrope-Bold',
              fontSize: 13,
            }}>
            Tekrar dene
          </Text>
        </Pressable>
      </Card>
    );
  }

  if (items.length === 0) {
    return (
      <Card
        variant="glass"
        contentStyle={{ alignItems: 'center', justifyContent: 'center', minHeight: 220, gap: 14 }}>
        <View
          className="h-16 w-16 items-center justify-center rounded-[22px]"
          style={{ backgroundColor: hexToRgba(theme.primary, 0.1) }}>
          <MaterialIcons name="person-search" size={28} color={theme.primary} />
        </View>
        <View className="gap-2">
          <Text
            style={{
              color: theme.onSurface,
              fontFamily: 'Manrope-Bold',
              fontSize: 17,
              textAlign: 'center',
            }}>
            Filtreyle eslesen personel yok
          </Text>
          <Text
            style={{
              color: hexToRgba(theme.onSurfaceVariant, 0.7),
              fontSize: 13,
              textAlign: 'center',
              lineHeight: 20,
              maxWidth: 420,
            }}>
            Arama terimini veya rol filtresini degistirerek farkli kayitlara ulasin.
          </Text>
        </View>
      </Card>
    );
  }

  return (
    <View
      style={{
        flexDirection: useSingleColumn ? 'column' : 'row',
        flexWrap: 'wrap',
        gap: 16,
      }}>
      {items.map((item) => (
        <View
          key={item.id}
          style={{
            width: useSingleColumn ? '100%' : '49%',
          }}>
          <StaffMemberCard item={item} onEdit={onEdit} onDelete={onDelete} />
        </View>
      ))}
    </View>
  );
}
