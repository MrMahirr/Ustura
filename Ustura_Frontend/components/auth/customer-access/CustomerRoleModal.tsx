import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import type { CustomerRoleOption } from '@/components/auth/customer-access/presentation';
import { useAuthAccessTheme } from '@/components/auth/shared/use-auth-access-theme';
import Modal from '@/components/ui/Modal';
import { hexToRgba } from '@/utils/color';

interface CustomerRoleModalProps {
  visible: boolean;
  options: CustomerRoleOption[];
  selectedRoleId: CustomerRoleOption['id'];
  onClose: () => void;
  onSelect: (roleId: CustomerRoleOption['id']) => void;
}

export default function CustomerRoleModal({
  visible,
  options,
  selectedRoleId,
  onClose,
  onSelect,
}: CustomerRoleModalProps) {
  const theme = useAuthAccessTheme();

  return (
    <Modal visible={visible} onClose={onClose}>
      <View className="px-5 py-5" style={{ backgroundColor: theme.surfaceContainerLow }}>
        <View className="mb-4">
          <Text className="font-headline text-2xl font-bold tracking-[-0.4px]" style={{ color: theme.onSurface }}>
            Hesap Tipi Sec
          </Text>
          <Text className="mt-1 font-body text-sm" style={{ color: hexToRgba(theme.onSurfaceVariant, 0.78) }}>
            Musteri kaydi self-service olarak ilerler. Diger roller dogru auth yoluna yonlendirme icin listelenir.
          </Text>
        </View>

        <View style={{ gap: 10 }}>
          {options.map((option) => {
            const isSelected = option.id === selectedRoleId;

            return (
              <Pressable
                key={option.id}
                accessibilityRole="button"
                onPress={() => onSelect(option.id)}
                className="rounded-md border px-4 py-4"
                style={({ hovered, pressed }) => ({
                  backgroundColor: hovered || pressed ? hexToRgba(theme.primary, 0.08) : theme.surface,
                  borderColor: isSelected
                    ? hexToRgba(theme.primary, 0.34)
                    : hexToRgba(theme.onSurfaceVariant, 0.14),
                })}>
                {({ hovered, pressed }) => (
                  <View className="flex-row items-start justify-between" style={{ gap: 12 }}>
                    <View className="flex-1" style={{ gap: 6 }}>
                      <View className="flex-row items-center" style={{ gap: 10 }}>
                        <Text
                          className="font-body text-sm font-semibold"
                          style={{
                            color: hovered || pressed || isSelected ? theme.onSurface : theme.onSurfaceVariant,
                          }}>
                          {option.label}
                        </Text>
                        <View
                          className="rounded-full px-2 py-1"
                          style={{
                            backgroundColor:
                              option.availability === 'self-service'
                                ? hexToRgba(theme.primary, 0.12)
                                : hexToRgba(theme.onSurfaceVariant, 0.12),
                          }}>
                          <Text
                            className="font-label text-[9px] uppercase tracking-[1.6px]"
                            style={{
                              color:
                                option.availability === 'self-service'
                                  ? theme.primary
                                  : hexToRgba(theme.onSurfaceVariant, 0.8),
                            }}>
                            {option.availability === 'self-service' ? 'Self Service' : 'Yonlendirme'}
                          </Text>
                        </View>
                      </View>

                      <Text className="font-body text-xs leading-5" style={{ color: hexToRgba(theme.onSurfaceVariant, 0.78) }}>
                        {option.description}
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
