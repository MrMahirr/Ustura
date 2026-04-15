import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { useSuperAdminTheme } from '@/components/panel/super-admin/theme';
import { hexToRgba } from '@/utils/color';

export interface UserEditFormData {
  name: string;
  phone: string;
}

interface UserEditModalProps {
  visible: boolean;
  initialData: UserEditFormData;
  userName: string;
  isSaving: boolean;
  onSave: (data: UserEditFormData) => void;
  onClose: () => void;
}

const WEB_TRANSITION = Platform.OS === 'web'
  ? ({ transition: 'background-color 160ms ease, border-color 160ms ease, transform 160ms ease, opacity 160ms ease', cursor: 'pointer' } as any)
  : null;

export default function UserEditModal({
  visible,
  initialData,
  userName,
  isSaving,
  onSave,
  onClose,
}: UserEditModalProps) {
  const adminTheme = useSuperAdminTheme();
  const [name, setName] = React.useState(initialData.name);
  const [phone, setPhone] = React.useState(initialData.phone);

  React.useEffect(() => {
    if (visible) {
      setName(initialData.name);
      setPhone(initialData.phone);
    }
  }, [visible, initialData.name, initialData.phone]);

  const nameValid = name.trim().length >= 2;
  const hasChanges = name.trim() !== initialData.name || phone.trim() !== initialData.phone;
  const canSave = nameValid && hasChanges && !isSaving;

  const handleSave = () => {
    if (!canSave) return;
    onSave({ name: name.trim(), phone: phone.trim() });
  };

  if (Platform.OS === 'web') {
    return (
      <WebModalOverlay visible={visible} onClose={onClose}>
        <ModalContent
          userName={userName}
          name={name}
          phone={phone}
          isSaving={isSaving}
          canSave={canSave}
          onNameChange={setName}
          onPhoneChange={setPhone}
          onSave={handleSave}
          onClose={onClose}
          adminTheme={adminTheme}
        />
      </WebModalOverlay>
    );
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}>
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <Pressable
          onPress={onClose}
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.52)',
            padding: 24,
          }}>
          <Pressable onPress={(e) => e.stopPropagation()}>
            <ModalContent
              userName={userName}
              name={name}
              phone={phone}
              isSaving={isSaving}
              canSave={canSave}
              onNameChange={setName}
              onPhoneChange={setPhone}
              onSave={handleSave}
              onClose={onClose}
              adminTheme={adminTheme}
            />
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function WebModalOverlay({
  visible,
  onClose,
  children,
}: {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!visible) return null;

  return (
    <View
      style={[
        {
          position: 'fixed' as any,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 999,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 24,
        },
      ]}>
      <Pressable
        onPress={onClose}
        style={{
          position: 'absolute' as any,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.52)',
        }}
      />
      <Animated.View entering={FadeIn.duration(180)} exiting={FadeOut.duration(120)}>
        {children}
      </Animated.View>
    </View>
  );
}

function ModalContent({
  userName,
  name,
  phone,
  isSaving,
  canSave,
  onNameChange,
  onPhoneChange,
  onSave,
  onClose,
  adminTheme,
}: {
  userName: string;
  name: string;
  phone: string;
  isSaving: boolean;
  canSave: boolean;
  onNameChange: (v: string) => void;
  onPhoneChange: (v: string) => void;
  onSave: () => void;
  onClose: () => void;
  adminTheme: ReturnType<typeof useSuperAdminTheme>;
}) {
  return (
    <View
      style={[
        {
          width: '100%',
          maxWidth: 480,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: adminTheme.borderStrong,
          backgroundColor: adminTheme.cardBackground,
          overflow: 'hidden',
        },
        Platform.OS === 'web'
          ? ({
              boxShadow:
                adminTheme.theme === 'dark'
                  ? '0 24px 64px rgba(0,0,0,0.56)'
                  : '0 24px 64px rgba(27,27,32,0.18)',
            } as any)
          : {
              shadowColor: '#000',
              shadowOpacity: 0.3,
              shadowRadius: 24,
              shadowOffset: { width: 0, height: 12 },
              elevation: 16,
            },
      ]}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 24,
          paddingVertical: 18,
          borderBottomWidth: 1,
          borderBottomColor: adminTheme.borderSubtle,
        }}>
        <View style={{ gap: 4, flex: 1 }}>
          <Text
            style={{
              fontSize: 20,
              fontFamily: 'Manrope-Bold',
              color: adminTheme.onSurface,
              letterSpacing: -0.4,
            }}>
            Kullanici Duzenle
          </Text>
          <Text
            numberOfLines={1}
            style={{
              fontSize: 13,
              fontFamily: 'Manrope-Medium',
              color: adminTheme.onSurfaceVariant,
            }}>
            {userName}
          </Text>
        </View>
        <Pressable
          onPress={onClose}
          style={({ hovered }) => [
            {
              width: 36,
              height: 36,
              borderRadius: 18,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: hovered
                ? hexToRgba(adminTheme.onSurface, 0.08)
                : 'transparent',
            },
            WEB_TRANSITION,
          ]}>
          <MaterialIcons name="close" size={20} color={adminTheme.onSurfaceVariant} />
        </Pressable>
      </View>

      {/* Body */}
      <View style={{ padding: 24, gap: 20 }}>
        <FormField
          label="AD SOYAD"
          value={name}
          onChangeText={onNameChange}
          placeholder="Kullanici adi"
          autoCapitalize="words"
          adminTheme={adminTheme}
        />
        <FormField
          label="TELEFON"
          value={phone}
          onChangeText={onPhoneChange}
          placeholder="+90 (5XX) XXX XX XX"
          keyboardType="phone-pad"
          adminTheme={adminTheme}
        />
      </View>

      {/* Footer */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          gap: 12,
          paddingHorizontal: 24,
          paddingVertical: 18,
          borderTopWidth: 1,
          borderTopColor: adminTheme.borderSubtle,
        }}>
        <Pressable
          onPress={onClose}
          style={({ hovered }) => [
            {
              minHeight: 44,
              paddingHorizontal: 20,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: adminTheme.borderSubtle,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: hovered
                ? hexToRgba(adminTheme.onSurface, 0.04)
                : 'transparent',
            },
            WEB_TRANSITION,
          ]}>
          <Text
            style={{
              fontSize: 12,
              fontFamily: 'Manrope-Bold',
              color: adminTheme.onSurfaceVariant,
              textTransform: 'uppercase',
              letterSpacing: 1.6,
            }}>
            Iptal
          </Text>
        </Pressable>

        <Pressable
          onPress={onSave}
          disabled={!canSave}
          style={({ hovered, pressed }) => [
            {
              minHeight: 44,
              paddingHorizontal: 24,
              borderRadius: 8,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              gap: 8,
              backgroundColor: canSave
                ? hovered
                  ? hexToRgba(adminTheme.primary, 0.92)
                  : adminTheme.primary
                : hexToRgba(adminTheme.primary, 0.3),
              transform: [{ scale: pressed && canSave ? 0.98 : 1 }],
            },
            WEB_TRANSITION,
          ]}>
          {isSaving && (
            <MaterialIcons name="hourglass-top" size={16} color={adminTheme.onPrimary} />
          )}
          <Text
            style={{
              fontSize: 12,
              fontFamily: 'Manrope-Bold',
              color: adminTheme.onPrimary,
              textTransform: 'uppercase',
              letterSpacing: 1.6,
            }}>
            {isSaving ? 'Kaydediliyor' : 'Kaydet'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  autoCapitalize,
  keyboardType,
  adminTheme,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: 'default' | 'phone-pad' | 'email-address';
  adminTheme: ReturnType<typeof useSuperAdminTheme>;
}) {
  const [focused, setFocused] = React.useState(false);

  return (
    <View style={{ gap: 8 }}>
      <Text
        style={{
          fontSize: 10,
          fontFamily: 'Manrope-Bold',
          color: hexToRgba(adminTheme.onSurfaceVariant, 0.7),
          textTransform: 'uppercase',
          letterSpacing: 2.2,
        }}>
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        placeholderTextColor={hexToRgba(adminTheme.onSurfaceVariant, 0.36)}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        style={[
          {
            minHeight: 48,
            paddingHorizontal: 14,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: focused ? adminTheme.primary : adminTheme.borderSubtle,
            backgroundColor: focused
              ? hexToRgba(adminTheme.primary, 0.04)
              : adminTheme.cardBackgroundMuted,
            color: adminTheme.onSurface,
            fontSize: 14,
            fontFamily: 'Manrope-SemiBold',
          },
          Platform.OS === 'web'
            ? ({
                outlineStyle: 'none',
                transition: 'border-color 180ms ease, background-color 180ms ease',
              } as any)
            : null,
        ]}
      />
    </View>
  );
}
