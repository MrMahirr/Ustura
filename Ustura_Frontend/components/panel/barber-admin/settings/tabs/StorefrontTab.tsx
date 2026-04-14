import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import {
  ActivityIndicator,
  Image,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';

import type { SalonRecord } from '@/services/salon.service';
import { hexToRgba } from '@/utils/color';

import { useBarberAdminTheme } from '../../theme';
import SettingsSection from '../SettingsSection';
import { getBarberInputStyle, getBarberInputWebStyle, getBarberWebTransition } from '../presentation';
import StorefrontUploadDropzone from './StorefrontUploadDropzone';

interface StorefrontTabProps {
  salon: SalonRecord;
  saving: boolean;
  saveSuccess: boolean;
  saveError: string | null;
  onSavePhoto: (url: string | null) => Promise<void>;
  onUploadPhoto: (file: File) => Promise<void>;
  onRemovePhoto: () => Promise<void>;
}

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp']);

function getPhotoFileName(photoUrl: string | null): string | null {
  if (!photoUrl) {
    return null;
  }

  try {
    const pathname = new URL(photoUrl).pathname;
    const segments = pathname.split('/');
    return segments.at(-1) || null;
  } catch {
    const segments = photoUrl.split('/');
    return segments.at(-1) || null;
  }
}

function validateImageFile(file: File): string | null {
  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    return 'Sadece PNG, JPEG ve WEBP dosyalari yuklenebilir.';
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return 'Dosya boyutu 5 MB veya daha kucuk olmali.';
  }

  return null;
}

async function selectImageFileFromBrowser(): Promise<File | null> {
  if (Platform.OS !== 'web' || typeof document === 'undefined') {
    return null;
  }

  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/png,image/jpeg,image/webp';
    input.onchange = () => {
      resolve(input.files?.[0] ?? null);
      input.remove();
    };
    input.click();
  });
}

export default function StorefrontTab({
  salon,
  saving,
  saveSuccess,
  saveError,
  onSavePhoto,
  onUploadPhoto,
  onRemovePhoto,
}: StorefrontTabProps) {
  const { width } = useWindowDimensions();
  const theme = useBarberAdminTheme();
  const isMobile = width < 640;

  const [photoUrl, setPhotoUrl] = React.useState(salon.photoUrl ?? '');
  const [previewError, setPreviewError] = React.useState(false);
  const [uploadError, setUploadError] = React.useState<string | null>(null);
  const [lastUploadedFileName, setLastUploadedFileName] = React.useState<string | null>(
    getPhotoFileName(salon.photoUrl),
  );

  React.useEffect(() => {
    setPhotoUrl(salon.photoUrl ?? '');
    setPreviewError(false);
    setUploadError(null);
    setLastUploadedFileName(getPhotoFileName(salon.photoUrl));
  }, [salon.photoUrl]);

  const inputStyle = getBarberInputStyle(theme);
  const webStyle = getBarberInputWebStyle();
  const hasChanges = (photoUrl || '') !== (salon.photoUrl || '');

  const handleSave = React.useCallback(() => {
    setUploadError(null);
    void onSavePhoto(photoUrl.trim() || null);
  }, [onSavePhoto, photoUrl]);

  const handleRemove = React.useCallback(() => {
    setPhotoUrl('');
    setUploadError(null);
    setLastUploadedFileName(null);
    void onRemovePhoto();
  }, [onRemovePhoto]);

  const handleUploadFile = React.useCallback(
    async (file: File) => {
      const validationMessage = validateImageFile(file);

      if (validationMessage) {
        setUploadError(validationMessage);
        return;
      }

      setUploadError(null);
      setPreviewError(false);
      setLastUploadedFileName(file.name);
      await onUploadPhoto(file);
    },
    [onUploadPhoto],
  );

  const handleLocalUpload = React.useCallback(() => {
    void (async () => {
      const file = await selectImageFileFromBrowser();

      if (!file) {
        return;
      }

      await handleUploadFile(file);
    })();
  }, [handleUploadFile]);

  return (
    <View className="gap-5">
      <SettingsSection
        title="Kapak Fotografi"
        icon="photo-camera"
        description="Salon vitrin sayfanizda gorunecek ana kapak fotografi.">
        <CoverPreview
          url={photoUrl}
          hasError={previewError}
          onError={() => setPreviewError(true)}
          theme={theme}
          isMobile={isMobile}
        />

        <StorefrontUploadDropzone
          disabled={saving}
          isWeb={Platform.OS === 'web'}
          fileName={lastUploadedFileName}
          helperText="Web panelde dosyayi surukleyip birakabilir veya butonla secerek yukleyebilirsin."
          errorText={uploadError}
          onPickFile={handleLocalUpload}
          onDropFile={handleUploadFile}
        />

        <View className="gap-2">
          <Text
            style={{
              color: hexToRgba(theme.onSurfaceVariant, 0.8),
              fontFamily: 'Manrope-Bold',
              fontSize: 12,
              letterSpacing: 0.4,
              textTransform: 'uppercase',
            }}>
            Fotograf URL
          </Text>
          <TextInput
            value={photoUrl}
            onChangeText={(text) => {
              setPhotoUrl(text);
              setPreviewError(false);
              setUploadError(null);
            }}
            placeholder="https://ornek.com/kapak-foto.jpg"
            placeholderTextColor={hexToRgba(theme.onSurfaceVariant, 0.4)}
            autoCapitalize="none"
            style={[inputStyle, webStyle]}
          />
          <Text style={{ color: hexToRgba(theme.onSurfaceVariant, 0.5), fontSize: 11 }}>
            URL ile kaydetme secenegi korunuyor. Yerel yukleme kullanirsan backend URL&apos;yi otomatik olusturur.
          </Text>
        </View>

        {salon.photoUrl && (
          <Pressable
            onPress={handleRemove}
            disabled={saving}
            className="flex-row items-center gap-2 self-start rounded-md border px-4 py-2"
            style={[
              { borderColor: hexToRgba(theme.error, 0.3), opacity: saving ? 0.6 : 1 },
              getBarberWebTransition(),
            ]}>
            <MaterialIcons name="delete-outline" size={16} color={theme.error} />
            <Text style={{ color: theme.error, fontFamily: 'Manrope-Bold', fontSize: 12 }}>
              Fotografi Kaldir
            </Text>
          </Pressable>
        )}
      </SettingsSection>

      <SettingsSection
        title="Galeri Fotograflari"
        icon="collections"
        description="Salonunuzun ic mekan ve hizmet fotograflarini sergileyebilirsiniz.">
        <View
          className="items-center justify-center rounded-lg border-2 border-dashed py-10"
          style={{ borderColor: hexToRgba(theme.onSurfaceVariant, 0.15) }}>
          <MaterialIcons
            name="add-photo-alternate"
            size={40}
            color={hexToRgba(theme.onSurfaceVariant, 0.25)}
          />
          <Text
            style={{
              color: hexToRgba(theme.onSurfaceVariant, 0.4),
              fontSize: 13,
              marginTop: 8,
              fontFamily: 'Manrope-Bold',
            }}>
            Yakinda kullanilabilir olacak
          </Text>
          <Text style={{ color: hexToRgba(theme.onSurfaceVariant, 0.3), fontSize: 11, marginTop: 4 }}>
            Birden fazla fotograf yukleme ozelligi gelistirme asamasinda.
          </Text>
        </View>
      </SettingsSection>

      {(hasChanges || saveError || saveSuccess || uploadError) && (
        <View className="flex-row items-center justify-between gap-3">
          <View className="flex-1">
            {(saveError || uploadError) && (
              <Text style={{ color: theme.error, fontSize: 12, fontFamily: 'Manrope-Bold' }}>
                {uploadError ?? saveError}
              </Text>
            )}
            {saveSuccess && (
              <View className="flex-row items-center gap-2">
                <MaterialIcons name="check-circle" size={16} color={theme.success} />
                <Text style={{ color: theme.success, fontSize: 12, fontFamily: 'Manrope-Bold' }}>
                  Fotograf guncellendi.
                </Text>
              </View>
            )}
          </View>

          {hasChanges && (
            <Pressable
              onPress={handleSave}
              disabled={saving}
              className="flex-row items-center gap-2 rounded-lg px-6 py-3"
              style={{ backgroundColor: theme.primary, opacity: saving ? 0.6 : 1 }}>
              {saving ? (
                <ActivityIndicator size="small" color={theme.onPrimary} />
              ) : (
                <MaterialIcons name="save" size={16} color={theme.onPrimary} />
              )}
              <Text style={{ color: theme.onPrimary, fontFamily: 'Manrope-Bold', fontSize: 13 }}>
                Kaydet
              </Text>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
}

function CoverPreview({
  url,
  hasError,
  onError,
  theme,
  isMobile,
}: {
  url: string;
  hasError: boolean;
  onError: () => void;
  theme: ReturnType<typeof useBarberAdminTheme>;
  isMobile: boolean;
}) {
  const height = isMobile ? 160 : 220;

  if (!url || hasError) {
    return (
      <View
        className="items-center justify-center overflow-hidden rounded-xl"
        style={{
          height,
          backgroundColor: hexToRgba(theme.onSurfaceVariant, 0.04),
          borderWidth: 2,
          borderStyle: 'dashed',
          borderColor: hexToRgba(theme.onSurfaceVariant, 0.12),
        }}>
        <MaterialIcons
          name="image"
          size={48}
          color={hexToRgba(theme.onSurfaceVariant, 0.2)}
        />
        <Text
          style={{
            color: hexToRgba(theme.onSurfaceVariant, 0.35),
            fontSize: 13,
            marginTop: 8,
            fontFamily: 'Manrope-Bold',
          }}>
          {hasError ? 'Fotograf yuklenemedi' : 'Kapak fotografi yok'}
        </Text>
      </View>
    );
  }

  return (
    <View className="overflow-hidden rounded-xl" style={{ height }}>
      <Image
        source={{ uri: url }}
        style={{ width: '100%', height: '100%' }}
        resizeMode="cover"
        onError={onError}
      />
    </View>
  );
}
