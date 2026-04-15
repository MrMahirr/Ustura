import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import {
  ActivityIndicator,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';

import { useBarberAdminTheme } from '@/components/panel/barber-admin/theme';
import { STAFF_ROLE_LABELS } from '@/components/panel/barber-admin/staff/presentation';
import { validateManagedImageFile } from '@/components/panel/barber-admin/shared/media-upload';
import { hexToRgba } from '@/utils/color';

import StaffPhotoField from './StaffPhotoField';
import type { StaffDirectoryItem, StaffEditorMode, StaffEditorValues } from './types';

interface StaffEditorModalProps {
  visible: boolean;
  mode: StaffEditorMode;
  staff?: StaffDirectoryItem | null;
  mutating: boolean;
  onClose: () => void;
  onSubmit: (values: StaffEditorValues) => Promise<void>;
}

const EMPTY_VALUES: StaffEditorValues = {
  fullName: '',
  email: '',
  phone: '',
  password: '',
  role: 'barber',
  bio: '',
  photoUrl: null,
  photoFile: null,
  photoFileName: null,
  removePhoto: false,
};

function buildInitialValues(mode: StaffEditorMode, staff?: StaffDirectoryItem | null): StaffEditorValues {
  if (mode === 'edit' && staff) {
    return {
      ...EMPTY_VALUES,
      fullName: staff.displayName,
      email: staff.email,
      phone: staff.phone,
      role: staff.role,
      bio: staff.bio ?? '',
      photoUrl: staff.photoUrl,
    };
  }

  return EMPTY_VALUES;
}

function validate(values: StaffEditorValues) {
  if (values.fullName.trim().length < 2) {
    return 'Ad soyad en az 2 karakter olmali.';
  }

  if (!values.email.includes('@')) {
    return 'Gecerli bir e-posta girin.';
  }

  if (values.phone.trim().length < 10) {
    return 'Telefon numarasi eksik gorunuyor.';
  }

  if (values.password.trim() && values.password.trim().length < 8) {
    return 'Parola giriyorsaniz en az 8 karakter olmali.';
  }

  return null;
}

export default function StaffEditorModal({
  visible,
  mode,
  staff,
  mutating,
  onClose,
  onSubmit,
}: StaffEditorModalProps) {
  const { width } = useWindowDimensions();
  const theme = useBarberAdminTheme();
  const [values, setValues] = React.useState<StaffEditorValues>(() => buildInitialValues(mode, staff));
  const [localError, setLocalError] = React.useState<string | null>(null);
  const isCreateMode = mode === 'create';
  const isCompact = width < 720;
  const modalWidth = isCompact ? width - 24 : Math.min(720, width - 64);

  React.useEffect(() => {
    if (!visible) {
      return;
    }

    setValues(buildInitialValues(mode, staff));
    setLocalError(null);
  }, [mode, staff, visible]);

  const updateField = <K extends keyof StaffEditorValues>(key: K, value: StaffEditorValues[K]) => {
    setValues((currentValues) => ({
      ...currentValues,
      [key]: value,
    }));
  };

  const handlePhotoFileChange = (file: File) => {
    const validationMessage = validateManagedImageFile(file);

    if (validationMessage) {
      setLocalError(validationMessage);
      return;
    }

    setLocalError(null);
    setValues((currentValues) => ({
      ...currentValues,
      photoFile: file,
      photoFileName: file.name,
      removePhoto: false,
    }));
  };

  const handleRemovePhoto = () => {
    setLocalError(null);
    setValues((currentValues) => ({
      ...currentValues,
      photoUrl: null,
      photoFile: null,
      photoFileName: null,
      removePhoto: true,
    }));
  };

  const handleSubmit = async () => {
    const validationMessage = validate(values);

    if (validationMessage) {
      setLocalError(validationMessage);
      return;
    }

    try {
      setLocalError(null);
      await onSubmit(values);
      onClose();
    } catch (submitError) {
      setLocalError(
        submitError instanceof Error ? submitError.message : 'Islem tamamlanamadi.',
      );
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      <Pressable
        className="flex-1 items-center justify-center px-3 py-6"
        style={{ backgroundColor: 'rgba(10, 10, 15, 0.72)' }}
        onPress={onClose}>
        <Pressable
          onPress={(event) => event.stopPropagation()}
          style={[
            {
              width: modalWidth,
              maxHeight: '92%',
              borderRadius: 22,
              overflow: 'hidden',
              backgroundColor: theme.cardBackground,
              borderWidth: 1,
              borderColor: theme.borderSubtle,
            },
            Platform.OS === 'web'
              ? ({ boxShadow: '0 28px 70px rgba(0, 0, 0, 0.24)' } as any)
              : {
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 12 },
                  shadowOpacity: 0.24,
                  shadowRadius: 28,
                  elevation: 14,
                },
          ]}>
          <View
            className="flex-row items-center justify-between border-b px-5 py-4"
            style={{ borderBottomColor: theme.borderSubtle }}>
            <View className="flex-row items-center gap-3">
              <View
                className="h-12 w-12 items-center justify-center rounded-2xl"
                style={{ backgroundColor: hexToRgba(theme.primary, 0.12) }}>
                <MaterialIcons
                  name={isCreateMode ? 'person-add-alt-1' : 'manage-accounts'}
                  size={22}
                  color={theme.primary}
                />
              </View>
              <View className="gap-1">
                <Text
                  style={{
                    color: theme.onSurface,
                    fontFamily: 'Manrope-Bold',
                    fontSize: 18,
                  }}>
                  {isCreateMode ? 'Personel yetkisi ver' : 'Personel kaydini duzenle'}
                </Text>
                <Text
                  style={{
                    color: hexToRgba(theme.onSurfaceVariant, 0.66),
                    fontSize: 13,
                  }}>
                  {isCreateMode
                    ? 'Yeni bir ekip hesabi acip rol atamasi yapin.'
                    : 'Hesap, rol ve panel alanlarini tek ekrandan guncelleyin.'}
                </Text>
              </View>
            </View>

            <Pressable
              onPress={onClose}
              className="h-10 w-10 items-center justify-center rounded-full"
              style={({ hovered }) => [
                {
                  backgroundColor: hovered ? hexToRgba(theme.onSurfaceVariant, 0.1) : 'transparent',
                },
              ]}>
              <MaterialIcons name="close" size={20} color={theme.onSurfaceVariant} />
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={{ padding: 20, gap: 18 }} showsVerticalScrollIndicator={false}>
            <View className="gap-4">
              <TextField
                label="Ad soyad"
                value={values.fullName}
                placeholder="Orn. Mehmet Yilmaz"
                onChangeText={(value) => updateField('fullName', value)}
              />

              <View
                style={{
                  flexDirection: isCompact ? 'column' : 'row',
                  gap: 14,
                }}>
                <View style={{ flex: 1 }}>
                  <TextField
                    label="E-posta"
                    value={values.email}
                    placeholder="personel@salon.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onChangeText={(value) => updateField('email', value)}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <TextField
                    label="Telefon"
                    value={values.phone}
                    placeholder="05xx xxx xx xx"
                    keyboardType="phone-pad"
                    onChangeText={(value) => updateField('phone', value)}
                  />
                </View>
              </View>

              <TextField
                label={isCreateMode ? 'Gecici parola' : 'Yeni parola'}
                value={values.password}
                placeholder={
                  isCreateMode
                    ? 'Bos birakirsan sistem e-posta ile gecici parola yollar'
                    : 'Bos birakirsan mevcut parola degismez'
                }
                secureTextEntry
                onChangeText={(value) => updateField('password', value)}
              />
            </View>

            <View className="gap-4">
              {!isCreateMode ? (
                <View
                  className="rounded-2xl border px-4 py-3"
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
                    Parola guncellenirse personel ilk giriste yeni sifre belirlemeye yonlendirilir.
                  </Text>
                  <Text
                    style={{
                      color: hexToRgba(theme.onSurfaceVariant, 0.66),
                      fontSize: 12,
                      marginTop: 4,
                    }}>
                    Hesap bilgileri, rol ve panel notlari ayni kayit uzerinden guncellenir.
                  </Text>
                </View>
              ) : null}

              <View className="gap-3">
                <Text
                  style={{
                    color: theme.onSurface,
                    fontFamily: 'Manrope-Bold',
                    fontSize: 14,
                  }}>
                  Rol secimi
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {(['barber', 'receptionist'] as const).map((role) => {
                    const isActive = values.role === role;

                    return (
                      <Pressable
                        key={role}
                        onPress={() => updateField('role', role)}
                        className="min-h-[42px] rounded-full px-4 py-2.5"
                        style={({ hovered }) => ({
                          backgroundColor: isActive
                            ? theme.primaryContainer
                            : hovered
                              ? hexToRgba(theme.primary, 0.05)
                              : theme.cardBackgroundMuted,
                          borderWidth: 1,
                          borderColor: isActive
                            ? hexToRgba(theme.primary, 0.36)
                            : theme.borderSubtle,
                        })}>
                        <Text
                          style={{
                            color: isActive ? theme.primary : theme.onSurface,
                            fontFamily: isActive ? 'Manrope-Bold' : 'Manrope-SemiBold',
                            fontSize: 12,
                          }}>
                          {STAFF_ROLE_LABELS[role]}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              <TextField
                label="Panel notu"
                value={values.bio}
                placeholder="Uzmanlik, vardiya notu veya salon ici rol aciklamasi"
                multiline
                numberOfLines={4}
                onChangeText={(value) => updateField('bio', value)}
              />

              <StaffPhotoField
                photoUrl={values.photoUrl}
                photoFile={values.photoFile}
                disabled={mutating}
                errorText={null}
                title="Profil fotografi"
                description={
                  isCreateMode
                    ? 'Yetki kaydi olustuktan hemen sonra lokal profil fotografi staff hesabina baglanir.'
                    : 'Guncel profil gorseli personel kartlari ve salon vitrinine otomatik yansir.'
                }
                onFileChange={handlePhotoFileChange}
                onRemove={handleRemovePhoto}
              />
            </View>

            {localError ? (
              <View
                className="rounded-2xl border px-4 py-3"
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
          </ScrollView>

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
                void handleSubmit();
              }}
              disabled={mutating}
              className="min-h-[44px] min-w-[190px] flex-row items-center justify-center gap-2 rounded-full px-5 py-3"
              style={{ backgroundColor: theme.primary }}>
              {mutating ? <ActivityIndicator size="small" color={theme.onPrimary} /> : null}
              <Text
                style={{
                  color: theme.onPrimary,
                  fontFamily: 'Manrope-Bold',
                  fontSize: 13,
                }}>
                {isCreateMode ? 'Yetkiyi olustur' : 'Degisiklikleri kaydet'}
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function TextField({
  label,
  value,
  placeholder,
  multiline,
  numberOfLines,
  onChangeText,
  ...props
}: React.ComponentProps<typeof TextInput> & {
  label: string;
}) {
  const theme = useBarberAdminTheme();

  return (
    <View className="gap-2">
      <Text
        style={{
          color: hexToRgba(theme.onSurfaceVariant, 0.72),
          fontFamily: 'Manrope-Bold',
          fontSize: 11,
          textTransform: 'uppercase',
          letterSpacing: 1.4,
        }}>
        {label}
      </Text>
      <TextInput
        value={value}
        placeholder={placeholder}
        placeholderTextColor={hexToRgba(theme.onSurfaceVariant, 0.48)}
        multiline={multiline}
        numberOfLines={numberOfLines}
        onChangeText={onChangeText}
        style={[
          {
            minHeight: multiline ? 108 : 52,
            borderRadius: 18,
            borderWidth: 1,
            borderColor: theme.borderSubtle,
            backgroundColor: theme.cardBackgroundMuted,
            color: theme.onSurface,
            paddingHorizontal: 16,
            paddingVertical: multiline ? 14 : 0,
            textAlignVertical: multiline ? 'top' : 'center',
            fontSize: 14,
          },
          Platform.OS === 'web'
            ? ({
                outlineWidth: 0,
                outlineStyle: 'none',
              } as any)
            : null,
        ]}
        {...props}
      />
    </View>
  );
}
