import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import type { StaffSalonOption } from '@/components/auth/staff-access/presentation';
import { useAuthAccessTheme } from '@/components/auth/shared/use-auth-access-theme';
import Modal from '@/components/ui/Modal';
import { hexToRgba } from '@/utils/color';

interface StaffAccessSalonModalProps {
  visible: boolean;
  options: StaffSalonOption[];
  selectedSalonId: string;
  onClose: () => void;
  onSelect: (salonId: string) => void;
}

export default function StaffAccessSalonModal({
  visible,
  options,
  selectedSalonId,
  onClose,
  onSelect,
}: StaffAccessSalonModalProps) {
  const theme = useAuthAccessTheme();

  return (
    <Modal visible={visible} onClose={onClose}>
      <View className="px-5 py-5" style={{ backgroundColor: theme.surfaceContainerLow }}>
        <View className="mb-4">
          <Text className="font-headline text-2xl font-bold tracking-[-0.4px]" style={{ color: theme.onSurface }}>
            Salon Sec
          </Text>
          <Text className="mt-1 font-body text-sm" style={{ color: hexToRgba(theme.onSurfaceVariant, 0.78) }}>
            Giris yapilacak salonu sec. Gercek yetki kontrolu backend auth ile birlikte eklenecek.
          </Text>
        </View>

        <View style={{ gap: 10 }}>
          {options.map((option) => {
            const isSelected = option.id === selectedSalonId;

            return (
              <Pressable
                key={option.id}
                accessibilityRole="button"
                onPress={() => onSelect(option.id)}
                className="rounded-md border px-4 py-4"
                style={({ hovered, pressed }) => ({
                  backgroundColor: hovered || pressed ? hexToRgba(theme.primary, 0.1) : theme.surface,
                  borderColor: isSelected
                    ? hexToRgba(theme.primary, 0.34)
                    : hexToRgba(theme.onSurfaceVariant, 0.14),
                })}>
                {({ hovered, pressed }) => (
                  <View className="flex-row items-center justify-between" style={{ gap: 12 }}>
                    <View className="flex-1">
                      <Text
                        className="font-body text-sm font-semibold"
                        style={{ color: hovered || pressed || isSelected ? theme.onSurface : theme.onSurfaceVariant }}>
                        {option.label}
                      </Text>
                    </View>

                    <MaterialIcons
                      name={isSelected ? 'radio-button-checked' : 'radio-button-unchecked'}
                      size={20}
                      color={isSelected ? theme.primary : hexToRgba(theme.onSurfaceVariant, 0.7)}
                    />
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      </View>
    </Modal>
  );
}
