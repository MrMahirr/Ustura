import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import {
  Image,
  Platform,
  Pressable,
  Text,
  View,
} from 'react-native';

import MediaUploadDropzone from '@/components/panel/barber-admin/shared/MediaUploadDropzone';
import {
  extractUploadedFileName,
  selectImageFilesFromBrowser,
} from '@/components/panel/barber-admin/shared/media-upload';
import { hexToRgba } from '@/utils/color';

import { useBarberAdminTheme } from '../theme';

interface StaffPhotoFieldProps {
  title?: string;
  description?: string;
  photoUrl: string | null;
  photoFile: File | null;
  disabled: boolean;
  errorText?: string | null;
  helperText?: string | null;
  onFileChange: (file: File) => void | Promise<void>;
  onRemove: () => void;
}

export default function StaffPhotoField({
  title = 'Personel Fotografi',
  description = 'Profil gorseli salon vitrini ve personel kartlarinda kullanilir.',
  photoUrl,
  photoFile,
  disabled,
  errorText,
  helperText,
  onFileChange,
  onRemove,
}: StaffPhotoFieldProps) {
  const theme = useBarberAdminTheme();
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (Platform.OS !== 'web' || !photoFile || typeof URL === 'undefined') {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(photoFile);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [photoFile]);

  const resolvedFileName = photoFile?.name ?? extractUploadedFileName(photoUrl);
  const resolvedPreviewUrl = previewUrl ?? photoUrl;

  const handleFiles = React.useCallback(
    async (files: File[]) => {
      const file = files[0];

      if (!file) {
        return;
      }

      await onFileChange(file);
    },
    [onFileChange],
  );

  const handlePickFile = React.useCallback(() => {
    void (async () => {
      const files = await selectImageFilesFromBrowser();
      await handleFiles(files);
    })();
  }, [handleFiles]);

  const handleDropFiles = React.useCallback(
    async (files: File[]) => {
      await handleFiles(files);
    },
    [handleFiles],
  );

  return (
    <View className="gap-4">
      <View
        className="overflow-hidden rounded-[24px] border"
        style={{
          minHeight: 188,
          borderColor: hexToRgba(theme.primary, 0.16),
          backgroundColor: theme.cardBackgroundMuted,
        }}>
        {resolvedPreviewUrl ? (
          <Image
            source={{ uri: resolvedPreviewUrl }}
            resizeMode="cover"
            style={{ width: '100%', height: 188 }}
          />
        ) : (
          <View
            className="items-center justify-center"
            style={{ minHeight: 188, gap: 10 }}>
            <View
              className="h-16 w-16 items-center justify-center rounded-[20px]"
              style={{ backgroundColor: hexToRgba(theme.primary, 0.12) }}>
              <MaterialIcons name="portrait" size={28} color={theme.primary} />
            </View>
            <View className="items-center gap-1 px-5">
              <Text
                style={{
                  color: theme.onSurface,
                  fontFamily: 'Manrope-Bold',
                  fontSize: 14,
                }}>
                Fotograf henuz eklenmedi
              </Text>
              <Text
                className="text-center"
                style={{
                  color: hexToRgba(theme.onSurfaceVariant, 0.68),
                  fontSize: 12,
                  lineHeight: 18,
                }}>
                Yuklenen profil gorseli personel listesi ve salon detay vitriniyle otomatik senkronize olur.
              </Text>
            </View>
          </View>
        )}
      </View>

      <MediaUploadDropzone
        disabled={disabled}
        isWeb={Platform.OS === 'web'}
        fileNames={resolvedFileName ? [resolvedFileName] : []}
        title={title}
        description={description}
        helperText={
          helperText ??
          'Web panelde gorseli surukleyip birakabilir veya butonla secerek yukleyebilirsin.'
        }
        errorText={errorText}
        onPickFiles={handlePickFile}
        onDropFiles={handleDropFiles}
      />

      {(photoUrl || photoFile) && (
        <Pressable
          onPress={onRemove}
          disabled={disabled}
          className="flex-row items-center gap-2 self-start rounded-full border px-4 py-2.5"
          style={{
            borderColor: hexToRgba(theme.error, 0.26),
            backgroundColor: hexToRgba(theme.error, 0.05),
            opacity: disabled ? 0.6 : 1,
          }}>
          <MaterialIcons name="delete-outline" size={16} color={theme.error} />
          <Text
            style={{
              color: theme.error,
              fontFamily: 'Manrope-Bold',
              fontSize: 12,
            }}>
            Fotografi kaldir
          </Text>
        </Pressable>
      )}
    </View>
  );
}
