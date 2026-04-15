import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { ActivityIndicator, Modal, Pressable, Text, View } from 'react-native';

import { useBarberAdminTheme } from '@/components/panel/barber-admin/theme';
import { hexToRgba } from '@/utils/color';

import type { StaffDirectoryItem } from './types';

interface StaffDeleteDialogProps {
  visible: boolean;
  staff: StaffDirectoryItem | null;
  mutating: boolean;
  onClose: () => void;
  onConfirm: (staff: StaffDirectoryItem) => Promise<void>;
}

export default function StaffDeleteDialog({
  visible,
  staff,
  mutating,
  onClose,
  onConfirm,
}: StaffDeleteDialogProps) {
  const theme = useBarberAdminTheme();
  const [localError, setLocalError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (visible) {
      setLocalError(null);
    }
  }, [staff, visible]);

  if (!staff) {
    return null;
  }

  const handleConfirm = async () => {
    try {
      setLocalError(null);
      await onConfirm(staff);
      onClose();
    } catch (error) {
      setLocalError(
        error instanceof Error ? error.message : 'Erisim kaldirilirken bir hata olustu.',
      );
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      <Pressable
        className="flex-1 items-center justify-center px-4"
        style={{ backgroundColor: 'rgba(10, 10, 15, 0.72)' }}
        onPress={onClose}>
        <Pressable
          onPress={(event) => event.stopPropagation()}
          className="w-full max-w-[440px] overflow-hidden rounded-[24px] border"
          style={{
            borderColor: theme.borderSubtle,
            backgroundColor: theme.cardBackground,
          }}>
          <View className="items-center gap-4 px-6 py-7">
            <View
              className="h-16 w-16 items-center justify-center rounded-[22px]"
              style={{ backgroundColor: hexToRgba(theme.error, 0.12) }}>
              <MaterialIcons name="person-remove" size={30} color={theme.error} />
            </View>

            <View className="gap-2">
              <Text
                style={{
                  color: theme.onSurface,
                  fontFamily: 'Manrope-Bold',
                  fontSize: 18,
                  textAlign: 'center',
                }}>
                Personel erisimi kaldirilsin mi?
              </Text>
              <Text
                style={{
                  color: hexToRgba(theme.onSurfaceVariant, 0.72),
                  fontSize: 13,
                  lineHeight: 21,
                  textAlign: 'center',
                }}>
                {`${staff.displayName} icin aktif salon erisimi sonlandirilacak. Bu islem hesap baglantisini degil, bu salon icindeki personel kaydini pasiflestirir.`}
              </Text>
            </View>

            <View
              className="w-full rounded-2xl border px-4 py-3"
              style={{
                borderColor: theme.borderSubtle,
                backgroundColor: hexToRgba(theme.onSurfaceVariant, 0.04),
              }}>
              <Text
                style={{
                  color: theme.onSurface,
                  fontFamily: 'Manrope-Bold',
                  fontSize: 14,
                }}>
                {staff.displayName}
              </Text>
              <Text
                style={{
                  color: hexToRgba(theme.onSurfaceVariant, 0.66),
                  fontSize: 12,
                  marginTop: 4,
                }}>
                {staff.roleLabel}
              </Text>
            </View>

            {localError ? (
              <View
                className="w-full rounded-2xl border px-4 py-3"
                style={{
                  borderColor: hexToRgba(theme.error, 0.22),
                  backgroundColor: hexToRgba(theme.error, 0.08),
                }}>
                <Text
                  style={{
                    color: theme.error,
                    fontFamily: 'Manrope-SemiBold',
                    fontSize: 13,
                  }}>
                  {localError}
                </Text>
              </View>
            ) : null}
          </View>

          <View
            className="flex-row items-center justify-end gap-3 border-t px-5 py-4"
            style={{ borderTopColor: theme.borderSubtle }}>
            <Pressable
              onPress={onClose}
              disabled={mutating}
              className="min-h-[44px] items-center justify-center rounded-full px-5 py-3"
              style={{ backgroundColor: theme.cardBackgroundMuted }}>
              <Text
                style={{
                  color: theme.onSurface,
                  fontFamily: 'Manrope-Bold',
                  fontSize: 13,
                }}>
                Vazgec
              </Text>
            </Pressable>

            <Pressable
              onPress={() => {
                void handleConfirm();
              }}
              disabled={mutating}
              className="min-h-[44px] min-w-[170px] flex-row items-center justify-center gap-2 rounded-full px-5 py-3"
              style={{ backgroundColor: theme.error }}>
              {mutating ? <ActivityIndicator size="small" color="#FFFFFF" /> : null}
              <Text
                style={{
                  color: '#FFFFFF',
                  fontFamily: 'Manrope-Bold',
                  fontSize: 13,
                }}>
                Erisimi kaldir
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
