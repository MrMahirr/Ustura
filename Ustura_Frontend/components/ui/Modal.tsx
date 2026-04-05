import React, { type ReactNode } from 'react';
import { Modal as RNModal, Pressable, View } from 'react-native';

import { useAppTheme } from '@/contexts/ThemeContext';
import { useThemeColor } from '@/hooks/use-theme-color';
import { hexToRgba } from '@/utils/color';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ visible, onClose, children }: ModalProps) {
  const surface = useThemeColor({}, 'surface');
  const surfaceContainerLow = useThemeColor({}, 'surfaceContainerLow');
  const outlineVariant = useThemeColor({}, 'outlineVariant');
  const { theme } = useAppTheme();

  return (
    <RNModal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <Pressable className="flex-1 items-center justify-center bg-black/55 px-4" onPress={onClose}>
        <Pressable
          className="w-full max-w-[560px] overflow-hidden rounded-xl border p-6"
          onPress={() => undefined}
          style={[
            {
              backgroundColor: hexToRgba(surfaceContainerLow, theme === 'light' ? 0.94 : 0.82),
              borderColor: outlineVariant,
            },
            theme === 'light'
              ? ({
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.18)',
                } as any)
              : ({
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                } as any),
          ]}>
          <View style={{ backgroundColor: surface }}>{children}</View>
        </Pressable>
      </Pressable>
    </RNModal>
  );
}
