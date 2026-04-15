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
import {
  extractUploadedFileName,
  selectImageFilesFromBrowser,
  validateManagedImageFile,
} from '../../shared/media-upload';
import SettingsSection from '../SettingsSection';
import {
  getBarberInputStyle,
  getBarberInputWebStyle,
  getBarberWebTransition,
} from '../presentation';
import StorefrontUploadDropzone from './StorefrontUploadDropzone';

interface StorefrontTabProps {
  salon: SalonRecord;
  saving: boolean;
  saveSuccess: boolean;
  saveError: string | null;
  onSavePhoto: (url: string | null) => Promise<void>;
  onUploadPhoto: (file: File) => Promise<void>;
  onRemovePhoto: () => Promise<void>;
  onUploadGallery: (files: File[]) => Promise<void>;
  onRemoveGalleryPhoto: (photoUrl: string) => Promise<void>;
}

const MAX_GALLERY_IMAGES = 8;

export default function StorefrontTab({
  salon,
  saving,
  saveSuccess,
  saveError,
  onSavePhoto,
  onUploadPhoto,
  onRemovePhoto,
  onUploadGallery,
  onRemoveGalleryPhoto,
}: StorefrontTabProps) {
  const { width } = useWindowDimensions();
  const theme = useBarberAdminTheme();
  const isMobile = width < 640;

  const [photoUrl, setPhotoUrl] = React.useState(salon.photoUrl ?? '');
  const [previewError, setPreviewError] = React.useState(false);
  const [uploadError, setUploadError] = React.useState<string | null>(null);
  const [galleryError, setGalleryError] = React.useState<string | null>(null);
  const [lastUploadedFileName, setLastUploadedFileName] = React.useState<string | null>(
    extractUploadedFileName(salon.photoUrl),
  );
  const [galleryPreviewErrors, setGalleryPreviewErrors] = React.useState<string[]>([]);

  React.useEffect(() => {
    setPhotoUrl(salon.photoUrl ?? '');
    setPreviewError(false);
    setUploadError(null);
    setGalleryError(null);
    setLastUploadedFileName(extractUploadedFileName(salon.photoUrl));
    setGalleryPreviewErrors([]);
  }, [salon.galleryUrls, salon.photoUrl]);

  const inputStyle = getBarberInputStyle(theme);
  const webStyle = getBarberInputWebStyle();
  const hasChanges = (photoUrl || '') !== (salon.photoUrl || '');
  const galleryFileNames = salon.galleryUrls
    .map((item) => extractUploadedFileName(item))
    .filter((value): value is string => Boolean(value));

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
      const validationMessage = validateManagedImageFile(file);

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

  const handleUploadGalleryFiles = React.useCallback(
    async (files: File[]) => {
      if (files.length === 0) {
        return;
      }

      if (salon.galleryUrls.length + files.length > MAX_GALLERY_IMAGES) {
        setGalleryError(`Galeride en fazla ${MAX_GALLERY_IMAGES} gorsel tutulabilir.`);
        return;
      }

      for (const file of files) {
        const validationMessage = validateManagedImageFile(file);

        if (validationMessage) {
          setGalleryError(validationMessage);
          return;
        }
      }

      setGalleryError(null);
      await onUploadGallery(files);
    },
    [onUploadGallery, salon.galleryUrls.length],
  );

  const handleLocalUpload = React.useCallback(() => {
    void (async () => {
      const files = await selectImageFilesFromBrowser();
      const file = files[0];

      if (!file) {
        return;
      }

      await handleUploadFile(file);
    })();
  }, [handleUploadFile]);

  const handleLocalGalleryUpload = React.useCallback(() => {
    void (async () => {
      const files = await selectImageFilesFromBrowser({ multiple: true });

      if (files.length === 0) {
        return;
      }

      await handleUploadGalleryFiles(files);
    })();
  }, [handleUploadGalleryFiles]);

  const handleGalleryPreviewError = React.useCallback((photoUrlValue: string) => {
    setGalleryPreviewErrors((previous) =>
      previous.includes(photoUrlValue) ? previous : [...previous, photoUrlValue],
    );
  }, []);

  const handleRemoveGallery = React.useCallback(
    (photoUrlValue: string) => {
      setGalleryError(null);
      void onRemoveGalleryPhoto(photoUrlValue);
    },
    [onRemoveGalleryPhoto],
  );

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
          fileNames={lastUploadedFileName ? [lastUploadedFileName] : []}
          helperText="Web panelde dosyayi surukleyip birakabilir veya butonla secerek yukleyebilirsin."
          errorText={uploadError}
          onPickFiles={handleLocalUpload}
          onDropFiles={async (files) => {
            const file = files[0];

            if (!file) {
              return;
            }

            await handleUploadFile(file);
          }}
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
        description="Salonunuzun ic mekan ve hizmet fotograflarini surukle birak ile coklu olarak yukleyin.">
        <GalleryPreviewGrid
          galleryUrls={salon.galleryUrls}
          failedUrls={galleryPreviewErrors}
          isMobile={isMobile}
          saving={saving}
          onImageError={handleGalleryPreviewError}
          onRemove={handleRemoveGallery}
        />

        <StorefrontUploadDropzone
          disabled={saving}
          isWeb={Platform.OS === 'web'}
          fileNames={galleryFileNames}
          multiple
          title="Galeri gorsellerini surukleyip birak veya sec"
          description="Kapak fotografi akisinin aynisi burada coklu dosya mantigiyla calisir. Yuklenen gorseller detail vitrinde kullanilabilir."
          helperText={`Ayni anda birden fazla gorsel yukleyebilirsin. Toplam limit ${MAX_GALLERY_IMAGES} fotograf.`}
          errorText={galleryError}
          onPickFiles={handleLocalGalleryUpload}
          onDropFiles={handleUploadGalleryFiles}
        />
      </SettingsSection>

      {(hasChanges || saveError || saveSuccess || uploadError || galleryError) && (
        <View className="flex-row items-center justify-between gap-3">
          <View className="flex-1">
            {(saveError || uploadError || galleryError) && (
              <Text style={{ color: theme.error, fontSize: 12, fontFamily: 'Manrope-Bold' }}>
                {galleryError ?? uploadError ?? saveError}
              </Text>
            )}
            {saveSuccess && (
              <View className="flex-row items-center gap-2">
                <MaterialIcons name="check-circle" size={16} color={theme.success} />
                <Text style={{ color: theme.success, fontSize: 12, fontFamily: 'Manrope-Bold' }}>
                  Medya guncellendi.
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

function GalleryPreviewGrid({
  galleryUrls,
  failedUrls,
  isMobile,
  saving,
  onImageError,
  onRemove,
}: {
  galleryUrls: string[];
  failedUrls: string[];
  isMobile: boolean;
  saving: boolean;
  onImageError: (photoUrl: string) => void;
  onRemove: (photoUrl: string) => void;
}) {
  const theme = useBarberAdminTheme();

  if (galleryUrls.length === 0) {
    return (
      <View
        className="items-center justify-center rounded-xl border-2 border-dashed py-10"
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
          Galeriye henuz gorsel eklenmedi
        </Text>
        <Text
          style={{
            color: hexToRgba(theme.onSurfaceVariant, 0.3),
            fontSize: 11,
            marginTop: 4,
          }}>
          Asagidaki alanla birden fazla fotograf yukleyebilirsin.
        </Text>
      </View>
    );
  }

  return (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
      }}>
      {galleryUrls.map((photoUrl) => {
        const hasError = failedUrls.includes(photoUrl);

        return (
          <View
            key={photoUrl}
            className="overflow-hidden rounded-xl border"
            style={{
              width: isMobile ? '100%' : '31.5%',
              borderColor: hexToRgba(theme.onSurfaceVariant, 0.12),
              backgroundColor: hexToRgba(theme.onSurfaceVariant, 0.03),
            }}>
            <View style={{ height: isMobile ? 180 : 150 }}>
              {hasError ? (
                <View
                  className="h-full items-center justify-center"
                  style={{ backgroundColor: hexToRgba(theme.onSurfaceVariant, 0.05) }}>
                  <MaterialIcons
                    name="broken-image"
                    size={32}
                    color={hexToRgba(theme.onSurfaceVariant, 0.35)}
                  />
                  <Text
                    style={{
                      marginTop: 8,
                      color: hexToRgba(theme.onSurfaceVariant, 0.48),
                      fontFamily: 'Manrope-Bold',
                      fontSize: 12,
                    }}>
                    Gorsel onizlenemedi
                  </Text>
                </View>
              ) : (
                <Image
                  source={{ uri: photoUrl }}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="cover"
                  onError={() => onImageError(photoUrl)}
                />
              )}
            </View>

            <View className="flex-row items-center justify-between px-3 py-3">
              <Text
                numberOfLines={1}
                style={{
                  flex: 1,
                  color: theme.onSurface,
                  fontFamily: 'Manrope-SemiBold',
                  fontSize: 12,
                }}>
                {extractUploadedFileName(photoUrl) ?? 'Galeri gorseli'}
              </Text>
              <Pressable
                onPress={() => onRemove(photoUrl)}
                disabled={saving}
                className="ml-3 h-8 w-8 items-center justify-center rounded-full"
                style={{ backgroundColor: hexToRgba(theme.error, 0.12), opacity: saving ? 0.6 : 1 }}>
                <MaterialIcons name="delete-outline" size={16} color={theme.error} />
              </Pressable>
            </View>
          </View>
        );
      })}
    </View>
  );
}
