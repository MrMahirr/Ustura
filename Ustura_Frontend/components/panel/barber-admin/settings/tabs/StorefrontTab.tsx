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

import { hexToRgba } from '@/utils/color';
import type { SalonRecord } from '@/services/salon.service';

import { useBarberAdminTheme } from '../../theme';
import SettingsSection from '../SettingsSection';
import { getBarberInputStyle, getBarberInputWebStyle, getBarberWebTransition } from '../presentation';

interface StorefrontTabProps {
  salon: SalonRecord;
  saving: boolean;
  saveSuccess: boolean;
  saveError: string | null;
  onSavePhoto: (url: string | null) => Promise<void>;
}

export default function StorefrontTab({
  salon,
  saving,
  saveSuccess,
  saveError,
  onSavePhoto,
}: StorefrontTabProps) {
  const { width } = useWindowDimensions();
  const theme = useBarberAdminTheme();
  const isMobile = width < 640;

  const [photoUrl, setPhotoUrl] = React.useState(salon.photoUrl ?? '');
  const [previewError, setPreviewError] = React.useState(false);

  React.useEffect(() => {
    setPhotoUrl(salon.photoUrl ?? '');
    setPreviewError(false);
  }, [salon.photoUrl]);

  const inputStyle = getBarberInputStyle(theme);
  const webStyle = getBarberInputWebStyle();
  const hasChanges = (photoUrl || '') !== (salon.photoUrl || '');

  const handleSave = () => {
    void onSavePhoto(photoUrl.trim() || null);
  };

  const handleRemove = () => {
    setPhotoUrl('');
    void onSavePhoto(null);
  };

  return (
    <View className="gap-5">
      <SettingsSection
        title="Kapak Fotoğrafı"
        icon="photo-camera"
        description="Salon vitrin sayfanızda görünecek ana kapak fotoğrafı.">
        <CoverPreview
          url={photoUrl}
          hasError={previewError}
          onError={() => setPreviewError(true)}
          theme={theme}
          isMobile={isMobile}
        />

        <View className="gap-2">
          <Text
            style={{
              color: hexToRgba(theme.onSurfaceVariant, 0.8),
              fontFamily: 'Manrope-Bold',
              fontSize: 12,
              letterSpacing: 0.4,
              textTransform: 'uppercase' as const,
            }}>
            Fotoğraf URL
          </Text>
          <TextInput
            value={photoUrl}
            onChangeText={(text) => {
              setPhotoUrl(text);
              setPreviewError(false);
            }}
            placeholder="https://ornek.com/kapak-foto.jpg"
            placeholderTextColor={hexToRgba(theme.onSurfaceVariant, 0.4)}
            autoCapitalize="none"
            style={[inputStyle, webStyle]}
          />
          <Text style={{ color: hexToRgba(theme.onSurfaceVariant, 0.5), fontSize: 11 }}>
            Önerilen boyut: 1200×600 piksel. JPEG veya PNG formatı.
          </Text>
        </View>

        {salon.photoUrl && (
          <Pressable
            onPress={handleRemove}
            disabled={saving}
            className="flex-row items-center gap-2 self-start rounded-md border px-4 py-2"
            style={[
              { borderColor: hexToRgba(theme.error, 0.3) },
              getBarberWebTransition(),
            ]}>
            <MaterialIcons name="delete-outline" size={16} color={theme.error} />
            <Text style={{ color: theme.error, fontFamily: 'Manrope-Bold', fontSize: 12 }}>
              Fotoğrafı Kaldır
            </Text>
          </Pressable>
        )}
      </SettingsSection>

      <SettingsSection
        title="Galeri Fotoğrafları"
        icon="collections"
        description="Salonunuzun iç mekan ve hizmet fotoğraflarını sergileyebilirsiniz.">
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
            Yakında kullanılabilir olacak
          </Text>
          <Text style={{ color: hexToRgba(theme.onSurfaceVariant, 0.3), fontSize: 11, marginTop: 4 }}>
            Birden fazla fotoğraf yükleme özelliği geliştirme aşamasında.
          </Text>
        </View>
      </SettingsSection>

      {(hasChanges || saveError || saveSuccess) && (
        <View className="flex-row items-center justify-between gap-3">
          <View className="flex-1">
            {saveError && (
              <Text style={{ color: theme.error, fontSize: 12, fontFamily: 'Manrope-Bold' }}>
                {saveError}
              </Text>
            )}
            {saveSuccess && (
              <View className="flex-row items-center gap-2">
                <MaterialIcons name="check-circle" size={16} color={theme.success} />
                <Text style={{ color: theme.success, fontSize: 12, fontFamily: 'Manrope-Bold' }}>
                  Fotoğraf güncellendi.
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
          borderStyle: 'dashed' as any,
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
          {hasError ? 'Fotoğraf yüklenemedi' : 'Kapak fotoğrafı yok'}
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
