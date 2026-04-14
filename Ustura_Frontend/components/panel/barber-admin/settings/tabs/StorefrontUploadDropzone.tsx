import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  Text,
  View,
} from 'react-native';

import { hexToRgba } from '@/utils/color';

import { useBarberAdminTheme } from '../../theme';

interface StorefrontUploadDropzoneProps {
  disabled: boolean;
  isWeb: boolean;
  fileName: string | null;
  helperText?: string | null;
  errorText?: string | null;
  onPickFile: () => void;
  onDropFile: (file: File) => void | Promise<void>;
}

type WebDropEvent = {
  preventDefault: () => void;
  stopPropagation: () => void;
  dataTransfer?: {
    files?: FileList;
  };
};

const DropZoneContainer = View as unknown as React.ComponentType<any>;

function getDroppedFile(event: WebDropEvent): File | null {
  const fileList = event.dataTransfer?.files;

  if (!fileList || fileList.length === 0) {
    return null;
  }

  return fileList[0] ?? null;
}

export default function StorefrontUploadDropzone({
  disabled,
  isWeb,
  fileName,
  helperText,
  errorText,
  onPickFile,
  onDropFile,
}: StorefrontUploadDropzoneProps) {
  const theme = useBarberAdminTheme();
  const [isDragActive, setIsDragActive] = React.useState(false);

  const handleDragOver = React.useCallback((event: WebDropEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (!disabled) {
      setIsDragActive(true);
    }
  }, [disabled]);

  const handleDragLeave = React.useCallback((event: WebDropEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragActive(false);
  }, []);

  const handleDrop = React.useCallback((event: WebDropEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragActive(false);

    if (disabled) {
      return;
    }

    const file = getDroppedFile(event);

    if (!file) {
      return;
    }

    void onDropFile(file);
  }, [disabled, onDropFile]);

  const dropZoneProps =
    isWeb
      ? ({
          onDragOver: handleDragOver,
          onDragEnter: handleDragOver,
          onDragLeave: handleDragLeave,
          onDrop: handleDrop,
        } as const)
      : {};

  return (
    <DropZoneContainer
      {...dropZoneProps}
      className="rounded-xl border-2 border-dashed p-5"
      style={[
        {
          gap: 16,
          borderColor: errorText
            ? hexToRgba(theme.error, 0.35)
            : isDragActive
              ? hexToRgba(theme.primary, 0.52)
              : hexToRgba(theme.primary, 0.18),
          backgroundColor: errorText
            ? hexToRgba(theme.error, 0.05)
            : isDragActive
              ? hexToRgba(theme.primary, 0.1)
              : hexToRgba(theme.primary, 0.04),
        },
        Platform.OS === 'web'
          ? ({ transition: 'border-color 180ms ease, background-color 180ms ease' } as any)
          : null,
      ]}>
      <View className="flex-row items-start justify-between" style={{ gap: 16 }}>
        <View style={{ flex: 1, gap: 8 }}>
          <View
            className="h-12 w-12 items-center justify-center rounded-[14px]"
            style={{ backgroundColor: hexToRgba(theme.primary, 0.12) }}>
            {disabled ? (
              <ActivityIndicator size="small" color={theme.primary} />
            ) : (
              <MaterialIcons name={isDragActive ? 'file-download-done' : 'cloud-upload'} size={24} color={theme.primary} />
            )}
          </View>

          <View style={{ gap: 4 }}>
            <Text style={{ color: theme.onSurface, fontFamily: 'Manrope-Bold', fontSize: 15 }}>
              {isWeb ? 'Dosyayi surukleyip birak veya sec' : 'Dosya secerek yukle'}
            </Text>
            <Text style={{ color: hexToRgba(theme.onSurfaceVariant, 0.72), fontSize: 12, lineHeight: 18 }}>
              Kapak fotografi backendde lokal olarak saklanir ve salon kaydina otomatik baglanir.
            </Text>
          </View>
        </View>

        <Pressable
          onPress={onPickFile}
          disabled={disabled || !isWeb}
          className="flex-row items-center gap-2 rounded-lg px-4 py-3"
          style={({ hovered, pressed }) => [
            {
              backgroundColor: theme.primary,
              opacity: disabled || !isWeb ? 0.6 : 1,
              transform: [{ scale: pressed ? 0.98 : 1 }],
            },
            Platform.OS === 'web'
              ? ({
                  transition: 'transform 160ms ease, opacity 180ms ease',
                  cursor: disabled || !isWeb ? 'not-allowed' : 'pointer',
                } as any)
              : null,
          ]}>
          {disabled ? (
            <ActivityIndicator size="small" color={theme.onPrimary} />
          ) : (
            <MaterialIcons name="upload-file" size={18} color={theme.onPrimary} />
          )}
          <Text style={{ color: theme.onPrimary, fontFamily: 'Manrope-Bold', fontSize: 12 }}>
            Dosya Sec
          </Text>
        </Pressable>
      </View>

      <View style={{ gap: 6 }}>
        <Text style={{ color: hexToRgba(theme.onSurfaceVariant, 0.64), fontSize: 11 }}>
          Desteklenen formatlar: PNG, JPEG, WEBP. Maksimum 5 MB.
        </Text>
        {fileName ? (
          <View className="flex-row items-center gap-2">
            <MaterialIcons name="description" size={16} color={theme.primary} />
            <Text style={{ color: theme.onSurface, fontFamily: 'Manrope-SemiBold', fontSize: 12 }}>
              {fileName}
            </Text>
          </View>
        ) : null}
        {helperText ? (
          <Text style={{ color: hexToRgba(theme.onSurfaceVariant, 0.64), fontSize: 11 }}>
            {helperText}
          </Text>
        ) : null}
        {errorText ? (
          <Text style={{ color: theme.error, fontFamily: 'Manrope-Bold', fontSize: 11 }}>
            {errorText}
          </Text>
        ) : null}
      </View>
    </DropZoneContainer>
  );
}
