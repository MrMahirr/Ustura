import { MaterialIcons } from '@expo/vector-icons';
import { Platform, Pressable, Text, View } from 'react-native';

import { hexToRgba } from '@/utils/color';

import type { NotificationFilterKey, NotificationTheme } from './types';

interface NotificationFiltersProps {
  toneFilter: NotificationFilterKey;
  readFilter: 'all' | 'unread' | 'read';
  onToneChange: (tone: NotificationFilterKey) => void;
  onReadChange: (read: 'all' | 'unread' | 'read') => void;
  onReset: () => void;
  theme: NotificationTheme;
}

const TONE_OPTIONS: { key: NotificationFilterKey; label: string }[] = [
  { key: 'all', label: 'Tumu' },
  { key: 'primary', label: 'Bilgi' },
  { key: 'success', label: 'Basarili' },
  { key: 'warning', label: 'Uyari' },
  { key: 'error', label: 'Kritik' },
];

const READ_OPTIONS: { key: 'all' | 'unread' | 'read'; label: string }[] = [
  { key: 'all', label: 'Hepsi' },
  { key: 'unread', label: 'Okunmamis' },
  { key: 'read', label: 'Okunmus' },
];

function FilterChip({
  label,
  isActive,
  onPress,
  theme: adminTheme,
}: {
  label: string;
  isActive: boolean;
  onPress: () => void;
  theme: NotificationTheme;
}) {

  return (
    <Pressable
      onPress={onPress}
      className="items-center justify-center rounded-lg border px-3 py-1.5"
      style={({ hovered }) => [
        {
          backgroundColor: isActive
            ? hexToRgba(adminTheme.primary, 0.12)
            : hovered
              ? adminTheme.cardBackgroundMuted
              : 'transparent',
          borderColor: isActive
            ? hexToRgba(adminTheme.primary, 0.3)
            : adminTheme.borderSubtle,
        },
        Platform.OS === 'web'
          ? ({
              cursor: 'pointer',
              transition: 'background-color 180ms ease, border-color 180ms ease',
            } as any)
          : null,
      ]}>
      <Text
        className="font-label text-[10px] uppercase tracking-[1.2px]"
        style={{
          color: isActive ? adminTheme.primary : adminTheme.onSurfaceVariant,
          fontFamily: isActive ? 'Manrope-SemiBold' : 'Manrope-Medium',
        }}>
        {label}
      </Text>
    </Pressable>
  );
}

export default function NotificationFilters({
  toneFilter,
  readFilter,
  onToneChange,
  onReadChange,
  onReset,
  theme: adminTheme,
}: NotificationFiltersProps) {
  const hasActiveFilter = toneFilter !== 'all' || readFilter !== 'all';

  return (
    <View className="gap-3">
      <View className="flex-row flex-wrap items-center gap-2">
        <Text
          className="mr-1 font-label text-[9px] uppercase tracking-wide"
          style={{ color: adminTheme.onSurfaceVariant }}>
          Tur:
        </Text>
        {TONE_OPTIONS.map((opt) => (
          <FilterChip
            key={opt.key}
            label={opt.label}
            isActive={toneFilter === opt.key}
            onPress={() => onToneChange(opt.key)}
            theme={adminTheme}
          />
        ))}

        <View className="mx-2 h-5 w-px" style={{ backgroundColor: adminTheme.borderSubtle }} />

        <Text
          className="mr-1 font-label text-[9px] uppercase tracking-wide"
          style={{ color: adminTheme.onSurfaceVariant }}>
          Durum:
        </Text>
        {READ_OPTIONS.map((opt) => (
          <FilterChip
            key={opt.key}
            label={opt.label}
            isActive={readFilter === opt.key}
            onPress={() => onReadChange(opt.key)}
            theme={adminTheme}
          />
        ))}

        {hasActiveFilter ? (
          <Pressable
            onPress={onReset}
            className="ml-2 flex-row items-center gap-1"
            style={Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null}>
            <MaterialIcons name="close" size={14} color={adminTheme.onSurfaceVariant} />
            <Text
              className="font-label text-[10px] uppercase tracking-wide"
              style={{ color: adminTheme.onSurfaceVariant }}>
              Sifirla
            </Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
