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

import { useBarberAdminTheme } from '../theme';

interface MediaUploadDropzoneProps {
  disabled: boolean;
  isWeb: boolean;
  fileNames: string[];
  multiple?: boolean;
  helperText?: string | null;
  errorText?: string | null;
  title?: string;
  description?: string;
  onPickFiles: () => void;
  onDropFiles: (files: File[]) => void | Promise<void>;
}

type WebDropEvent = {
  preventDefault: () => void;
  stopPropagation: () => void;
  dataTransfer?: {
    files?: FileList;
  };
};

const DropZoneContainer = View as unknown as React.ComponentType<any>;

function getDroppedFiles(event: WebDropEvent): File[] {
  const fileList = event.dataTransfer?.files;

  if (!fileList || fileList.length === 0) {
    return [];
  }

  return Array.from(fileList);
}

export default function MediaUploadDropzone({
  disabled,
  isWeb,
  fileNames,
  multiple = false,
  helperText,
  errorText,
  title,
  description,
  onPickFiles,
  onDropFiles,
}: MediaUploadDropzoneProps) {
  const theme = useBarberAdminTheme();
  const [isDragActive, setIsDragActive] = React.useState(false);

  const handleDragOver = React.useCallback(
    (event: WebDropEvent) => {
      event.preventDefault();
      event.stopPropagation();

      if (!disabled) {
        setIsDragActive(true);
      }
    },
    [disabled],
  );

  const handleDragLeave = React.useCallback((event: WebDropEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragActive(false);
  }, []);

  const handleDrop = React.useCallback(
    (event: WebDropEvent) => {
      event.preventDefault();
      event.stopPropagation();
      setIsDragActive(false);

      if (disabled) {
        return;
      }

      const files = getDroppedFiles(event);

      if (files.length === 0) {
        return;
      }

      void onDropFiles(multiple ? files : files.slice(0, 1));
    },
    [disabled, multiple, onDropFiles],
  );

  const dropZoneProps =
    isWeb
      ? ({
          onDragOver: handleDragOver,
          onDragEnter: handleDragOver,
          onDragLeave: handleDragLeave,
          onDrop: handleDrop,
        } as const)
      : {};

  const resolvedTitle = title
    ? title
    : isWeb
      ? multiple
        ? 'Dosyalari surukleyip birak veya sec'
        : 'Dosyayi surukleyip birak veya sec'
      : multiple
        ? 'Dosya secerek yukle'
        : 'Dosya secerek yukle';
  const resolvedDescription =
    description ??
    (multiple
      ? 'Yuklenen gorseller lokal olarak saklanir ve ilgili kayda otomatik baglanir.'
      : 'Yuklenen gorsel lokal olarak saklanir ve ilgili kayda otomatik baglanir.');

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
              <MaterialIcons
                name={isDragActive ? 'file-download-done' : 'cloud-upload'}
                size={24}
                color={theme.primary}
              />
            )}
          </View>

          <View style={{ gap: 4 }}>
            <Text style={{ color: theme.onSurface, fontFamily: 'Manrope-Bold', fontSize: 15 }}>
              {resolvedTitle}
            </Text>
            <Text
              style={{
                color: hexToRgba(theme.onSurfaceVariant, 0.72),
                fontSize: 12,
                lineHeight: 18,
              }}>
              {resolvedDescription}
            </Text>
          </View>
        </View>

        <Pressable
          onPress={onPickFiles}
          disabled={disabled || !isWeb}
          className="flex-row items-center gap-2 rounded-lg px-4 py-3"
          style={{
            backgroundColor: theme.primary,
            opacity: disabled || !isWeb ? 0.6 : 1,
            ...(Platform.OS === 'web'
              ? ({
                  transition: 'transform 160ms ease, opacity 180ms ease',
                  cursor: disabled || !isWeb ? 'not-allowed' : 'pointer',
                } as any)
              : {}),
          }}>
          {disabled ? (
            <ActivityIndicator size="small" color={theme.onPrimary} />
          ) : (
            <MaterialIcons name="upload-file" size={18} color={theme.onPrimary} />
          )}
          <Text style={{ color: theme.onPrimary, fontFamily: 'Manrope-Bold', fontSize: 12 }}>
            {multiple ? 'Dosyalari Sec' : 'Dosya Sec'}
          </Text>
        </Pressable>
      </View>

      <View style={{ gap: 6 }}>
        <Text style={{ color: hexToRgba(theme.onSurfaceVariant, 0.64), fontSize: 11 }}>
          Desteklenen formatlar: PNG, JPEG, WEBP. Maksimum 5 MB.
        </Text>
        {fileNames.length > 0 ? (
          <View style={{ gap: 6 }}>
            {fileNames.map((fileName, index) => (
              <View key={`${fileName}-${index}`} className="flex-row items-center gap-2">
                <MaterialIcons name="description" size={16} color={theme.primary} />
                <Text
                  style={{
                    color: theme.onSurface,
                    fontFamily: 'Manrope-SemiBold',
                    fontSize: 12,
                  }}>
                  {fileName}
                </Text>
              </View>
            ))}
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
